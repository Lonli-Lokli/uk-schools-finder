import { csv2json } from 'csv42';
import proj4 from 'proj4';
import { Firestore } from 'firebase/firestore';
import { z, ZodError } from 'zod';

export interface ImportResult {
  success: boolean;
  count: number;
  error?: string;
}
export interface ImportParams {
  db: Firestore;
  csvData: string;
  year: string;
  onProgress: (progress: {
    current?: number;
    total?: number;
    details: string;
  }) => void;
}

// Firestore batch limit is 500, but we might have large documents
export const BATCH_SIZE = 100;

export async function parseAndValidateCSV<T>(
  content: string,
  schema: z.ZodSchema<T>,
  shouldProcessRow?: (
    row: Partial<T>,
    index: number,
    allRows: Partial<T>[]
  ) => boolean
) {
  const valid: T[] = [];
  const errors: { row: number; error: ZodError }[] = [];

  const result = csv2json<Partial<T>>(content);
  for (let i = 0; i < result.length; i++) {
    const row = result[i];
    try {
      if (!shouldProcessRow || shouldProcessRow(row, i, result)) {
        const validatedRow = await schema.parseAsync(row);
        valid.push(validatedRow);
      }
    } catch (error) {
      errors.push({ row: i + 1, error: error as ZodError });
    }
  }

  return { valid: valid, errors };
}


// Define the OSGB36 (EPSG:27700) and WGS84 (EPSG:4326) projections
proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'
);
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');


export function convertToLatLong(easting: number | null, northing: number | null) {
  try {
    if (!easting || !northing) {
      return { latitude: 0, longitude: 0 };
    }

    // Convert from OSGB36 to WGS84
    const [longitude, latitude] = proj4('EPSG:27700', 'EPSG:4326', [
      easting,
      northing,
    ]);

    return {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
    };
  } catch (error) {
    console.error('Error converting coordinates:', error);
    return { latitude: 0, longitude: 0 };
  }
}