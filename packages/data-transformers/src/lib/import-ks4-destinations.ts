import {
  KS4DestinationsDm,
  KS4DestinationsDetailsDm,
} from '@lonli-lokli/shapes';
import { KS4DestinationsRow } from '@lonli-lokli/data-parsers';
import { cleanValue } from './helpers';

export interface KS4DestinationsBatch {
  main: Array<{
    id: string;
    data: KS4DestinationsDm;
  }>;

  details: Array<{
    id: string;
    data: KS4DestinationsDetailsDm;
  }>;
}

export function transformKS4Destinations(
  rows: KS4DestinationsRow[],
  year: string
): KS4DestinationsBatch {
  const batch: KS4DestinationsBatch = {
    main: [],
    details: [],
  };

  for (const row of rows) {
    if (!row.URN || row.RECTYPE !== '1') continue;

    const docId = `${row.URN}_${year}`;

    // Main collection
    batch.main.push({
      id: docId,
      data: {
        urn: row.URN,
        year,
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
      },
    });

    // Details collection
    batch.details.push({
      id: docId,
      data: {
        urn: row.URN,
        year,
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
      },
    });
  }

  return batch;
}
