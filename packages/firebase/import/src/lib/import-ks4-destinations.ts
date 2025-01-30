import { z } from 'zod';
import { doc, Firestore, writeBatch } from 'firebase/firestore';
import { ImportParams, ImportResult, BATCH_SIZE, parseAndValidateCSV } from './shapes';
import { KS4DestinationsSchema } from './schemas/ks4-destinations.schema';
import type { KS4DestinationsRow } from './schemas/ks4-destinations.schema';

export const KS4_DESTINATIONS_HELPER = {
  title: 'KS4 Destinations',
  description: 'Import KS4 (GCSE) student destinations data',
  fileName: 'england_ks4-pupdest.csv'
};

function detectHistoricalYears(row: KS4DestinationsRow): string[] {
  // Look for fields matching the pattern COHORT_XX where XX is the year
  return Object.keys(row)
    .filter(key => key.startsWith('COHORT_') && key.length === 8) // COHORT_XX
    .map(key => key.slice(-2)); // Extract the year part
}

export async function importKS4Destinations(
  params: ImportParams & { db: Firestore }
): Promise<ImportResult> {
  const { csvData, year, db } = params;
  const academicYear = `${Number(year)-1}/${year.slice(-2)}`;

  try {
    const { valid: rows, errors } = await parseAndValidateCSV<KS4DestinationsRow>(
      csvData,
      KS4DestinationsSchema as any
    );

    if (errors.length > 0) {
      return { 
        success: false, 
        count: 0, 
        errors: errors.map((e) => `Row ${e.row}: ${e.error.message}`) 
      };
    }

    const validRows = rows.filter(row => row.URN && row.RECTYPE === '1');
    let imported = 0;
    let currentBatch = writeBatch(db);
    let batchCount = 0;

    for (const row of validRows) {
      const docId = `${row.URN}_${academicYear}`;
      
      // Main collection - most important metrics
      currentBatch.set(
        doc(db, 'school-ks4-destinations', docId),
        {
          urn: row.URN,
          year: academicYear,
          // Overall sustained destinations
          sustained: row.OVERALL_DESTPER,  // Key headline figure
          // Main destination types
          education: row.EDUCATIONPER,
          employment: row.EMPLOYMENTPER,
          apprenticeships: row.APPRENPER,
          // Education breakdown
          furtherEducation: row.FEPER,
          sixthForm: row.SCH_6THPER,
          sixthFormCollege: row.SIXTH_COLPER,
          // Disadvantaged comparison
          disadvantagedSustained: row.OVERALL_DESTPER_DIS,
          nonDisadvantagedSustained: row.OVERALL_DESTPER_NONDIS,
          cohortSize: row.COHORT,  // Context for the percentages
          lastUpdated: new Date().toISOString(),
        }
      );

      // Details collection - detailed breakdowns
      currentBatch.set(
        doc(db, 'school-ks4-destinations-details', docId),
        {
          urn: row.URN,
          year: academicYear,
          // Raw numbers
          numbers: {
            cohort: row.COHORT,
            sustained: row.OVERALL_DEST,
            education: row.EDUCATION,
            employment: row.EMPLOYMENT,
            apprenticeships: row.APPREN,
            furtherEducation: row.FE,
            schoolSixthForm: row.SCH_6TH,
            sixthFormCollege: row.SIXTH_COL,
            otherEducation: row.OTHER_EDU,
            notSustained: row.NOT_SUSTAINED,
            unknown: row.UNKNOWN,
          },
          // Detailed breakdowns by group
          disadvantaged: {
            cohort: row.COHORT_DIS,
            sustained: {
              number: row.OVERALL_DEST_DIS,
              percentage: row.OVERALL_DESTPER_DIS,
            },
            education: {
              number: row.EDUCATION_DIS,
              percentage: row.EDUCATIONPER_DIS,
            },
            employment: {
              number: row.EMPLOYMENT_DIS,
              percentage: row.EMPLOYMENTPER_DIS,
            },
            apprenticeships: {
              number: row.APPREN_DIS,
              percentage: row.APPRENPER_DIS,
            },
            furtherEducation: {
              number: row.FE_DIS,
              percentage: row.FEPER_DIS,
            },
            schoolSixthForm: {
              number: row.SCH_6TH_DIS,
              percentage: row.SCH_6THPER_DIS,
            },
            sixthFormCollege: {
              number: row.SIXTH_COL_DIS,
              percentage: row.SIXTH_COLPER_DIS,
            },
            otherEducation: {
              number: row.OTHER_EDU_DIS,
              percentage: row.OTHER_EDUPER_DIS,
            },
            notSustained: {
              number: row.NOT_SUSTAINED_DIS,
              percentage: row.NOT_SUSTAINEDPER_DIS,
            },
            unknown: {
              number: row.UNKNOWN_DIS,
              percentage: row.UNKNOWNPER_DIS,
            },
          },
          nonDisadvantaged: {
            cohort: row.COHORT_NONDIS,
            sustained: {
              number: row.OVERALL_DEST_NONDIS,
              percentage: row.OVERALL_DESTPER_NONDIS,
            },
            education: {
              number: row.EDUCATION_NONDIS,
              percentage: row.EDUCATIONPER_NONDIS,
            },
            employment: {
              number: row.EMPLOYMENT_NONDIS,
              percentage: row.EMPLOYMENTPER_NONDIS,
            },
            apprenticeships: {
              number: row.APPREN_NONDIS,
              percentage: row.APPRENPER_NONDIS,
            },
            furtherEducation: {
              number: row.FE_NONDIS,
              percentage: row.FEPER_NONDIS,
            },
            schoolSixthForm: {
              number: row.SCH_6TH_NONDIS,
              percentage: row.SCH_6THPER_NONDIS,
            },
            sixthFormCollege: {
              number: row.SIXTH_COL_NONDIS,
              percentage: row.SIXTH_COLPER_NONDIS,
            },
            otherEducation: {
              number: row.OTHER_EDU_NONDIS,
              percentage: row.OTHER_EDUPER_NONDIS,
            },
            notSustained: {
              number: row.NOT_SUSTAINED_NONDIS,
              percentage: row.NOT_SUSTAINEDPER_NONDIS,
            },
            unknown: {
              number: row.UNKNOWN_NONDIS,
              percentage: row.UNKNOWNPER_NONDIS,
            },
          },
          lastUpdated: new Date().toISOString(),
        }
      );

      // Detect and process historical years from the data
      const historicalYears = detectHistoricalYears(row);
      
      for (const yearSuffix of historicalYears) {
        const historicalYear = Number(yearSuffix);
        const historicalAcademicYear = `${historicalYear-1}/${yearSuffix}`;
        
        currentBatch.set(
          doc(db, 'school-ks4-destinations-history', `${row.URN}_${historicalAcademicYear}`),
          {
            urn: row.URN,
            year: historicalAcademicYear,
            cohort: row[`COHORT_${yearSuffix}` as keyof KS4DestinationsRow],
            sustained: row[`OVERALL_DESTPER_${yearSuffix}` as keyof KS4DestinationsRow],
            disadvantaged: {
              cohort: row[`COHORT_DIS_${yearSuffix}` as keyof KS4DestinationsRow],
              sustained: row[`OVERALL_DESTPER_DIS_${yearSuffix}` as keyof KS4DestinationsRow],
            },
            nonDisadvantaged: {
              cohort: row[`COHORT_NONDIS_${yearSuffix}` as keyof KS4DestinationsRow],
              sustained: row[`OVERALL_DESTPER_NONDIS_${yearSuffix}` as keyof KS4DestinationsRow],
            },
            lastUpdated: new Date().toISOString(),
          }
        );
      }

      batchCount++;
      imported++;

      if (batchCount === BATCH_SIZE) {
        await currentBatch.commit();
        currentBatch = writeBatch(db);
        batchCount = 0;
      }
    }

    // Commit any remaining documents
    if (batchCount > 0) {
      await currentBatch.commit();
    }

    console.log(`Successfully imported ${imported} KS4 destinations`);
    return {
      success: true,
      count: imported,
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