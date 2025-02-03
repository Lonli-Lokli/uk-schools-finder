import { doc, writeBatch } from 'firebase/firestore';
import {
  ImportParams,
  ImportResult,
  BATCH_SIZE,
  parseAndValidateCSV,
} from './shapes';
import { KS4DestinationsSchema } from './schemas/ks4-destinations.schema';
import type { KS4DestinationsRow } from './schemas/ks4-destinations.schema';

function detectHistoricalYears(row: KS4DestinationsRow): string[] {
  // Look for fields matching the pattern COHORT_XX where XX is the year
  return Object.keys(row)
    .filter((key) => key.startsWith('COHORT_') && key.length === 8) // COHORT_XX
    .map((key) => key.slice(-2)); // Extract the year part
}

// Helper function to ensure no undefined values
function cleanValue<T>(value: T): T | null {
  return value === undefined ? null : value;
}

export async function importKS4Destinations(
  params: ImportParams
): Promise<ImportResult> {
  const { csvData, year, db, onProgress } = params;

  try {
    onProgress({ details: `Parsing file...` });

    const { valid: rows, errors } =
      await parseAndValidateCSV<KS4DestinationsRow>(
        csvData,
        KS4DestinationsSchema as any,
        (row) => ['1', '2'].includes(row.RECTYPE?.toString() ?? '')
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
      const currentBatch = writeBatch(db);
      const batchRows = validRows.slice(i, i + BATCH_SIZE);
      const currentBatchNumber = Math.floor(i / BATCH_SIZE) + 1;

      for (const row of batchRows) {
        const docId = `${row.URN}_${year}`;

        // Main collection - with null checks
        currentBatch.set(doc(db, 'school-ks4-destinations', docId), {
          urn: row.URN,
          year: year,
          sustained: cleanValue(row.OVERALL_DESTPER),
          education: cleanValue(row.EDUCATIONPER),
          employment: cleanValue(row.EMPLOYMENTPER),
          apprenticeships: cleanValue(row.APPRENPER),
          furtherEducation: cleanValue(row.FEPER),
          sixthForm: cleanValue(row.SCH_6THPER),
          sixthFormCollege: cleanValue(row.SIXTH_COLPER),
          disadvantagedSustained: cleanValue(row.OVERALL_DESTPER_DIS),
          nonDisadvantagedSustained: cleanValue(row.OVERALL_DESTPER_NONDIS),
          cohortSize: cleanValue(row.COHORT),
          lastUpdated: new Date().toISOString(),
        });

        // Details collection - with null checks
        currentBatch.set(doc(db, 'school-ks4-destinations-details', docId), {
          urn: row.URN,
          year: year,
          numbers: {
            cohort: cleanValue(row.COHORT),
            sustained: cleanValue(row.OVERALL_DEST),
            education: cleanValue(row.EDUCATION),
            employment: cleanValue(row.EMPLOYMENT),
            apprenticeships: cleanValue(row.APPREN),
            furtherEducation: cleanValue(row.FE),
            schoolSixthForm: cleanValue(row.SCH_6TH),
            sixthFormCollege: cleanValue(row.SIXTH_COL),
            otherEducation: cleanValue(row.OTHER_EDU),
            notSustained: cleanValue(row.NOT_SUSTAINED),
            unknown: cleanValue(row.UNKNOWN),
          },
          disadvantaged: {
            cohort: cleanValue(row.COHORT_DIS),
            sustained: {
              number: cleanValue(row.OVERALL_DEST_DIS),
              percentage: cleanValue(row.OVERALL_DESTPER_DIS),
            },
            education: {
              number: cleanValue(row.EDUCATION_DIS),
              percentage: cleanValue(row.EDUCATIONPER_DIS),
            },
            employment: {
              number: cleanValue(row.EMPLOYMENT_DIS),
              percentage: cleanValue(row.EMPLOYMENTPER_DIS),
            },
            apprenticeships: {
              number: cleanValue(row.APPREN_DIS),
              percentage: cleanValue(row.APPRENPER_DIS),
            },
            furtherEducation: {
              number: cleanValue(row.FE_DIS),
              percentage: cleanValue(row.FEPER_DIS),
            },
            schoolSixthForm: {
              number: cleanValue(row.SCH_6TH_DIS),
              percentage: cleanValue(row.SCH_6THPER_DIS),
            },
            sixthFormCollege: {
              number: cleanValue(row.SIXTH_COL_DIS),
              percentage: cleanValue(row.SIXTH_COLPER_DIS),
            },
            otherEducation: {
              number: cleanValue(row.OTHER_EDU_DIS),
              percentage: cleanValue(row.OTHER_EDUPER_DIS),
            },
            notSustained: {
              number: cleanValue(row.NOT_SUSTAINED_DIS),
              percentage: cleanValue(row.NOT_SUSTAINEDPER_DIS),
            },
            unknown: {
              number: cleanValue(row.UNKNOWN_DIS),
              percentage: cleanValue(row.UNKNOWNPER_DIS),
            },
          },
          nonDisadvantaged: {
            cohort: cleanValue(row.COHORT_NONDIS),
            sustained: {
              number: cleanValue(row.OVERALL_DEST_NONDIS),
              percentage: cleanValue(row.OVERALL_DESTPER_NONDIS),
            },
            education: {
              number: cleanValue(row.EDUCATION_NONDIS),
              percentage: cleanValue(row.EDUCATIONPER_NONDIS),
            },
            employment: {
              number: cleanValue(row.EMPLOYMENT_NONDIS),
              percentage: cleanValue(row.EMPLOYMENTPER_NONDIS),
            },
            apprenticeships: {
              number: cleanValue(row.APPREN_NONDIS),
              percentage: cleanValue(row.APPRENPER_NONDIS),
            },
            furtherEducation: {
              number: cleanValue(row.FE_NONDIS),
              percentage: cleanValue(row.FEPER_NONDIS),
            },
            schoolSixthForm: {
              number: cleanValue(row.SCH_6TH_NONDIS),
              percentage: cleanValue(row.SCH_6THPER_NONDIS),
            },
            sixthFormCollege: {
              number: cleanValue(row.SIXTH_COL_NONDIS),
              percentage: cleanValue(row.SIXTH_COLPER_NONDIS),
            },
            otherEducation: {
              number: cleanValue(row.OTHER_EDU_NONDIS),
              percentage: cleanValue(row.OTHER_EDUPER_NONDIS),
            },
            notSustained: {
              number: cleanValue(row.NOT_SUSTAINED_NONDIS),
              percentage: cleanValue(row.NOT_SUSTAINEDPER_NONDIS),
            },
            unknown: {
              number: cleanValue(row.UNKNOWN_NONDIS),
              percentage: cleanValue(row.UNKNOWNPER_NONDIS),
            },
          },
          lastUpdated: new Date().toISOString(),
        });

        // Historical data - with null checks
        const historicalYears = detectHistoricalYears(row);

        for (const yearSuffix of historicalYears) {
          const historicalYear = Number(yearSuffix);
          const historicalAcademicYear = `${historicalYear - 1}/${yearSuffix}`;

          currentBatch.set(
            doc(
              db,
              'school-ks4-destinations-history',
              `${row.URN}_${historicalAcademicYear}`
            ),
            {
              urn: row.URN,
              year: historicalAcademicYear,
              cohort: cleanValue(
                row[`COHORT_${yearSuffix}` as keyof KS4DestinationsRow]
              ),
              sustained: cleanValue(
                row[`OVERALL_DESTPER_${yearSuffix}` as keyof KS4DestinationsRow]
              ),
              disadvantaged: {
                cohort: cleanValue(
                  row[`COHORT_DIS_${yearSuffix}` as keyof KS4DestinationsRow]
                ),
                sustained: cleanValue(
                  row[
                    `OVERALL_DESTPER_DIS_${yearSuffix}` as keyof KS4DestinationsRow
                  ]
                ),
              },
              nonDisadvantaged: {
                cohort: cleanValue(
                  row[`COHORT_NONDIS_${yearSuffix}` as keyof KS4DestinationsRow]
                ),
                sustained: cleanValue(
                  row[
                    `OVERALL_DESTPER_NONDIS_${yearSuffix}` as keyof KS4DestinationsRow
                  ]
                ),
              },
              lastUpdated: new Date().toISOString(),
            }
          );
        }

        processedCount++;
      }

      await currentBatch.commit();

      // Report progress
      onProgress?.({
        current: currentBatchNumber,
        total: totalBatches,
        details: `Processed ${processedCount} of ${validRows.length} records`,
      });
    }

    console.log(`Successfully imported ${processedCount} KS4 destinations`);
    return {
      success: true,
      count: processedCount,
      errors: [],
    };
  } catch (error) {
    console.error('KS4 destinations import error:', error);
    return {
      success: false,
      count: 0,
      errors: [(error as Error).message],
    };
  }
}
