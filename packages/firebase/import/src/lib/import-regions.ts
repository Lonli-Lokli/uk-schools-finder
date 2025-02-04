import { doc, writeBatch } from 'firebase/firestore';
import {
  ImportResult,
  BATCH_SIZE,
  parseAndValidateCSV,
  ImportParams,
} from './helpers';
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
  const { db, csvData, onProgress } = params;

  try {
    onProgress({ details: `Parsing file...` });
    const { valid: rows, errors } = await parseAndValidateCSV<RegionRow>(
      csvData,
      RegionRowSchema as any
    );

    if (errors.length > 0) {
      return {
        success: false,
        count: 0,
        error: `Failures: ${errors.length}. First error happens on row ${errors[0].row}: ${errors[0].error.message}`,
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
      const currentBatchNumber = Math.floor(i / BATCH_SIZE) + 1;

      for (const [regionId, regionData] of batchEntries) {
        const regionRef = doc(db, 'regions', regionId);
        batch.set(regionRef, regionData);
      }

      await batch.commit();
      processedCount += batchEntries.length;

      // Report progress
      onProgress?.({
        current: currentBatchNumber,
        total: totalBatches,
        details: `Processed ${processedCount} of ${regionEntries.length} regions`,
      });
    }

    return {
      success: true,
      count: processedCount,
    };
  } catch (error) {
    console.error('Region import error:', error);
    return {
      success: false,
      count: 0,
      error: (error as Error).message,
    };
  }
}
