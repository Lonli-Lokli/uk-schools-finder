import { doc, writeBatch, arrayUnion } from 'firebase/firestore';
import {
  KS5DestinationsSchema,
  KS5DestinationsRow,
} from './schemas/ks5-destinations';
import {
  BATCH_SIZE,
  ImportParams,
  ImportResult,
  parseAndValidateCSV,
} from './helpers';

// Helper function to ensure no undefined values
function cleanValue<T>(value: T): T | null {
  return value === undefined ? null : value;
}

export async function importKS5Destinations(
  params: ImportParams
): Promise<ImportResult> {
  const { db, csvData, year, onProgress } = params;
  try {
    onProgress?.({
      details: `Parsing file...`,
    });
    const { valid: rows, errors } =
      await parseAndValidateCSV<KS5DestinationsRow>(
        csvData,
        KS5DestinationsSchema as any,
        (row) => ['1', '3'].includes(row.RECTYPE?.toString() ?? '')
      );

    if (errors.length > 0) {
      return {
        success: false,
        count: 0,
        error: `Failures: ${errors.length}. First error happens on row ${errors[0].row}: ${errors[0].error.message}`,
      };
    }

    const validRows = rows.filter((row) => row.URN && row.RECTYPE === '1');
    const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);
    let processedCount = 0;

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchRows = validRows.slice(i, i + BATCH_SIZE);
      const currentBatch = Math.floor(i / BATCH_SIZE) + 1;

      for (const row of batchRows) {
        if (!row.URN || row.RECTYPE !== '1') continue; // Skip non-school records

        const destinationId = `${row.URN}_${year}`;
        const destinationRef = doc(db, 'school-destinations', destinationId);

        batch.set(destinationRef, {
          urn: row.URN,
          year,
          total: {
            all: createDestinationStats(row, 'TOT'),
            disadvantaged: createDestinationStats(row, 'TOT_DIS'),
            nonDisadvantaged: createDestinationStats(row, 'TOT_NONDIS'),
          },
          level3: {
            all: createDestinationStats(row, 'L3'),
            disadvantaged: createDestinationStats(row, 'L3_DIS'),
            nonDisadvantaged: createDestinationStats(row, 'L3_NONDIS'),
          },
          level2: {
            all: createDestinationStats(row, 'L2'),
            disadvantaged: createDestinationStats(row, 'L2_DIS'),
            nonDisadvantaged: createDestinationStats(row, 'L2_NONDIS'),
          },
          otherLevels: {
            all: createDestinationStats(row, 'LALLOTH'),
            disadvantaged: createDestinationStats(row, 'LALLOTH_DIS'),
            nonDisadvantaged: createDestinationStats(row, 'LALLOTH_NONDIS'),
          },
        });

        // Update stats document
        const statsRef = doc(db, 'school-destination-stats', row.URN);
        const newDestination = {
          year,
          higherEducation: row.TOT_HEPER,
          furtherEducation: row.TOT_FEPER,
          employment: row.TOT_EMPLOYMENTPER,
        };

        batch.set(
          statsRef,
          {
            id: row.URN,
            destinations: arrayUnion(newDestination),
          },
          { merge: true }
        );
      }

      await batch.commit();
      processedCount += batchRows.length;

      // Report progress
      onProgress?.({
        current: currentBatch,
        total: totalBatches,
        details: `Processed ${processedCount} of ${validRows.length} records`,
      });
    }

    return {
      success: true,
      count: processedCount,
    };
  } catch (error) {
    console.error('KS5 destinations import error:', error);
    return {
      success: false,
      count: 0,
      error: (error as Error).message,
    };
  }
}

const createDestinationStats = (
  row: KS5DestinationsRow,
  prefix:
    | 'TOT'
    | 'TOT_DIS'
    | 'TOT_NONDIS'
    | 'L3'
    | 'L3_DIS'
    | 'L3_NONDIS'
    | 'L2'
    | 'L2_DIS'
    | 'L2_NONDIS'
    | 'LALLOTH'
    | 'LALLOTH_DIS'
    | 'LALLOTH_NONDIS'
) => ({
  cohortSize: cleanValue(row[`${prefix}_COHORT` as keyof KS5DestinationsRow]),
  destinations: {
    overall: cleanValue(row[`${prefix}_OVERALL` as keyof KS5DestinationsRow]),
    education: {
      total: cleanValue(row[`${prefix}_EDUCATION` as keyof KS5DestinationsRow]),
      furtherEducation: cleanValue(
        row[`${prefix}_FE` as keyof KS5DestinationsRow]
      ),
      higherEducation: cleanValue(
        row[`${prefix}_HE` as keyof KS5DestinationsRow]
      ),
      other: cleanValue(row[`${prefix}_OTHER_EDU` as keyof KS5DestinationsRow]),
    },
    employment: {
      total: cleanValue(
        row[`${prefix}_EMPLOYMENT` as keyof KS5DestinationsRow]
      ),
      apprenticeships: cleanValue(
        row[`${prefix}_APPREN` as keyof KS5DestinationsRow]
      ),
    },
    other: {
      notSustained: cleanValue(
        row[`${prefix}_NOT_SUSTAINED` as keyof KS5DestinationsRow]
      ),
      notCaptured: cleanValue(
        row[`${prefix}_NOT_CAPTURED` as keyof KS5DestinationsRow]
      ),
    },
  },
  percentages: {
    overall: cleanValue(
      row[`${prefix}_OVERALLPER` as keyof KS5DestinationsRow]
    ),
    education: {
      total: cleanValue(
        row[`${prefix}_EDUCATIONPER` as keyof KS5DestinationsRow]
      ),
      furtherEducation: cleanValue(
        row[`${prefix}_FEPER` as keyof KS5DestinationsRow]
      ),
      higherEducation: cleanValue(
        row[`${prefix}_HEPER` as keyof KS5DestinationsRow]
      ),
      other: cleanValue(
        row[`${prefix}_OTHER_EDUPER` as keyof KS5DestinationsRow]
      ),
    },
    employment: {
      total: cleanValue(
        row[`${prefix}_EMPLOYMENTPER` as keyof KS5DestinationsRow]
      ),
      apprenticeships: cleanValue(
        row[`${prefix}_APPRENPER` as keyof KS5DestinationsRow]
      ),
    },
    other: {
      notSustained: cleanValue(
        row[`${prefix}_NOT_SUSTAINEDPER` as keyof KS5DestinationsRow]
      ),
      notCaptured: cleanValue(
        row[`${prefix}_NOT_CAPTUREDPER` as keyof KS5DestinationsRow]
      ),
    },
  },
});
