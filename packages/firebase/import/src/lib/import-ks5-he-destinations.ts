import { doc, writeBatch } from 'firebase/firestore';
import { KS5HEDestinationsRow } from './schemas/ks5-he-destinations';
import { KS5HEDestinationsSchema } from './schemas/ks5-he-destinations';
import { ImportParams, parseAndValidateCSV } from './shapes';

interface ImportResult {
  success: boolean;
  count: number;
  errors?: string[];
}

const BATCH_SIZE = 500;

export async function importKS5HEDestinations(
  params: ImportParams
): Promise<ImportResult> {
  const { db, csvData, year, onProgress } = params;
  try {
    onProgress?.({
      details: `Parsing file...`,
    });
    const { valid: parsedRows, errors } =
      await parseAndValidateCSV<KS5HEDestinationsRow>(
        csvData,
        KS5HEDestinationsSchema as any
      );

    if (errors.length > 0) {
      return {
        success: false,
        count: 0,
        error: `Failures: ${errors.length}. First error happens on row ${errors[0].row}: ${errors[0].error.message}`,
      };
    }

    let processedCount = 0;
    // Skip non-school records
    const rows = parsedRows.filter((row) => row.URN && row.RECTYPE === '1');
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchRows = rows.slice(i, i + BATCH_SIZE);
      const currentBatchNumber = Math.floor(i / BATCH_SIZE) + 1;

      for (const row of batchRows) {
        const destinationId = `${row.URN}_${year}`;
        const destinationRef = doc(db, 'school-he-destinations', destinationId);

        batch.set(destinationRef, {
          schoolUrn: row.URN,
          year,
          universities: {
            oxbridge: {
              percentage: Number(row.DIS_OXBRIDGE) || 0,
            },
            russell: {
              percentage: Number(row.DIS_RUSSELL) || 0,
            },
            topThird: {
              percentage: Number(row.DIS_TOP3RD) || 0,
            },
            higherTechnical: {
              percentage: Number(row.DIS_HTECH) || 0,
            },
          },
          disadvantaged: {
            oxbridge: {
              percentage: Number(row.DIS_OXBRIDGE) || 0,
            },
            russell: {
              percentage: Number(row.DIS_RUSSELL) || 0,
            },
            topThird: {
              percentage: Number(row.DIS_TOP3RD) || 0,
            },
            higherTechnical: {
              percentage: Number(row.DIS_HTECH) || 0,
            },
          },
          lastUpdated: new Date().toISOString(),
        });
      }

      await batch.commit();
      processedCount += batchRows.length;

      // Report progress
      onProgress?.({
        current: currentBatchNumber,
        total: totalBatches,
        details: `Processed ${processedCount} of ${rows.length} records`,
      });
    }

    return {
      success: true,
      count: processedCount,
      errors: [],
    };
  } catch (error) {
    console.error('KS5 HE destinations import error:', error);
    return {
      success: false,
      count: 0,
      errors: [(error as Error).message],
    };
  }
}
