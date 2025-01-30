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
} from './shapes';

export async function importKS5Destinations(
  params: ImportParams
): Promise<ImportResult> {
  const { db, csvData, year } = params;
  try {
    const { valid: rows, errors } =
      await parseAndValidateCSV<KS5DestinationsRow>(
        csvData,
        KS5DestinationsSchema as any
      );

    if (errors.length > 0) {
      return {
        success: false,
        count: 0,
        errors: errors.map((e) => `Row ${e.row}: ${e.error.message}`),
      };
    }

    let processedCount = 0;
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchRows = rows.slice(i, i + BATCH_SIZE);

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
    console.error('KS5 destinations import error:', error);
    return {
      success: false,
      count: 0,
      errors: [(error as Error).message],
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
  cohortSize: row[`${prefix}_COHORT` as keyof KS5DestinationsRow],
  destinations: {
    overall: row[`${prefix}_OVERALL` as keyof KS5DestinationsRow],
    education: {
      total: row[`${prefix}_EDUCATION` as keyof KS5DestinationsRow],
      furtherEducation: row[`${prefix}_FE` as keyof KS5DestinationsRow],
      higherEducation: row[`${prefix}_HE` as keyof KS5DestinationsRow],
      other: row[`${prefix}_OTHER_EDU` as keyof KS5DestinationsRow],
    },
    employment: {
      total: row[`${prefix}_EMPLOYMENT` as keyof KS5DestinationsRow],
      apprenticeships: row[`${prefix}_APPREN` as keyof KS5DestinationsRow],
    },
    other: {
      notSustained: row[`${prefix}_NOT_SUSTAINED` as keyof KS5DestinationsRow],
      notCaptured: row[`${prefix}_NOT_CAPTURED` as keyof KS5DestinationsRow],
    },
  },
  percentages: {
    overall: row[`${prefix}_OVERALLPER` as keyof KS5DestinationsRow],
    education: {
      total: row[`${prefix}_EDUCATIONPER` as keyof KS5DestinationsRow],
      furtherEducation: row[`${prefix}_FEPER` as keyof KS5DestinationsRow],
      higherEducation: row[`${prefix}_HEPER` as keyof KS5DestinationsRow],
      other: row[`${prefix}_OTHER_EDUPER` as keyof KS5DestinationsRow],
    },
    employment: {
      total: row[`${prefix}_EMPLOYMENTPER` as keyof KS5DestinationsRow],
      apprenticeships: row[`${prefix}_APPRENPER` as keyof KS5DestinationsRow],
    },
    other: {
      notSustained:
        row[`${prefix}_NOT_SUSTAINEDPER` as keyof KS5DestinationsRow],
      notCaptured: row[`${prefix}_NOT_CAPTUREDPER` as keyof KS5DestinationsRow],
    },
  },
});
