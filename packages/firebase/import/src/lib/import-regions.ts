import { doc, writeBatch } from 'firebase/firestore';
import { ImportResult, BATCH_SIZE, parseAndValidateCSV, ImportParams } from './shapes';
import { RegionRowSchema, RegionRow } from './schemas/regions';
interface RegionDoc {
  name: string;
  subRegions: {
    [leaCode: string]: {
      name: string;
    };
  };
}

export async function importRegions(
  params: ImportParams
): Promise<ImportResult> {
  const { db, csvData } = params;

  try {
    const { valid: rows, errors } = await parseAndValidateCSV<RegionRow>(
      csvData,
      RegionRowSchema as any
    );

    if (errors.length > 0) {
      return {
        success: false,
        count: 0,
        errors: errors.map((e) => e.message),
      };
    }

    // First pass: organize data by region
    const regions = new Map<string, RegionDoc>();
    for (const row of rows) {
      const regionId = row.REGION.toString();
      if (!regions.has(regionId)) {
        regions.set(regionId, {
          name: row['REGION NAME'],
          subRegions: {},
        });
      }

      const region = regions.get(regionId)!;
      region.subRegions[row.LEA] = {
        name: row['LA Name'],
      };
    }

    // Convert to array for batch processing
    const regionEntries = Array.from(regions.entries());
    const totalBatches = Math.ceil(regionEntries.length / BATCH_SIZE);

    let processedCount = 0;
    for (let i = 0; i < regionEntries.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchEntries = regionEntries.slice(i, i + BATCH_SIZE);

      for (const [regionId, regionData] of batchEntries) {
        const regionRef = doc(db, 'regions', regionId);
        batch.set(regionRef, regionData);
      }

      await batch.commit();
      processedCount += batchEntries.length;
      console.log(
        `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${totalBatches}`
      );
    }

    return {
      success: true,
      count: processedCount,
      errors: [],
    };
  } catch (error) {
    console.error('Region import error:', error);
    return {
      success: false,
      count: 0,
      errors: [(error as Error).message],
    };
  }
}
