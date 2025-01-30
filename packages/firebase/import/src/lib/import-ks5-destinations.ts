import { doc, Firestore, writeBatch } from 'firebase/firestore';
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
        errors: errors.map((e) => e.message),
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
          schoolUrn: row.URN,
          year,
          cohort: {
            total: Number(row.TOT_COHORT) || 0,
            disadvantaged: Number(row.TOT_COHORT_DIS) || 0,
            nonDisadvantaged: Number(row.TOT_COHORT_NONDIS) || 0,
          },
          destinations: {
            education: {
              total: Number(row.TOT_EDUCATION) || 0,
              percentage: Number(row.TOT_EDUCATIONPER) || 0,
              he: {
                total: Number(row.TOT_HE) || 0,
                percentage: Number(row.TOT_HEPER) || 0,
              },
              fe: {
                total: Number(row.TOT_FE) || 0,
                percentage: Number(row.TOT_FEPER) || 0,
              },
              other: {
                total: Number(row.TOT_OTHER_EDU) || 0,
                percentage: Number(row.TOT_OTHER_EDUPER) || 0,
              },
            },
            employment: {
              total: Number(row.TOT_EMPLOYMENT) || 0,
              percentage: Number(row.TOT_EMPLOYMENTPER) || 0,
              apprenticeships: {
                total: Number(row.TOT_APPREN) || 0,
                percentage: Number(row.TOT_APPRENPER) || 0,
              },
            },
            notSustained: {
              total: Number(row.TOT_NOT_SUSTAINED) || 0,
              percentage: Number(row.TOT_NOT_SUSTAINEDPER) || 0,
            },
            notCaptured: {
              total: Number(row.TOT_NOT_CAPTURED) || 0,
              percentage: Number(row.TOT_NOT_CAPTUREDPER) || 0,
            },
          },
        });
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
