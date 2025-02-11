import { DestinationStatsDm, KS5DestinationsStatsDm } from '@lonli-lokli/shapes';
import { KS5DestinationsDm } from '@lonli-lokli/shapes';
import { cleanValue } from './helpers';
import { KS5DestinationsRow } from '@lonli-lokli/data-parsers';

export interface KS5DestinationsBatch {
  main: Array<{
    id: string;
    data: KS5DestinationsDm;
  }>;
  stats: Array<{
    id: string;
    data: KS5DestinationsStatsDm;
  }>;
}

type StatsPrefix = 'TOT' | 'L3' | 'L2' | 'LALLOTH';
type DisadvantageType = '' | '_DIS' | '_NONDIS';

const createDestinationStats = (row: KS5DestinationsRow, basePrefix: StatsPrefix, disadvantageType: DisadvantageType): DestinationStatsDm => {
  return {
    cohortSize: cleanValue<number | null>(row[`${basePrefix}_COHORT${disadvantageType}`]),
    destinations: {
      overall: cleanValue<number | null>(row[`${basePrefix}_OVERALL${disadvantageType}`]),
      education: {
        total: cleanValue<number | null>(row[`${basePrefix}_EDUCATION${disadvantageType}`]),
        furtherEducation: cleanValue<number | null>(row[`${basePrefix}_FE${disadvantageType}`]),
        higherEducation: cleanValue<number | null>(row[`${basePrefix}_HE${disadvantageType}`]),
        other: cleanValue<number | null>(row[`${basePrefix}_OTHER_EDU${disadvantageType}`]),
      },
      employment: {
        total: cleanValue<number | null>(row[`${basePrefix}_EMPLOYMENT${disadvantageType}`]),
        apprenticeships: cleanValue<number | null>(row[`${basePrefix}_APPREN${disadvantageType}`]),
      },
      other: {
        notSustained: cleanValue<number | null>(row[`${basePrefix}_NOT_SUSTAINED${disadvantageType}`]),
        notCaptured: cleanValue<number | null>(row[`${basePrefix}_NOT_CAPTURED${disadvantageType}`]),
      },
    },
    percentages: {
      overall: cleanValue<number | null>(row[`${basePrefix}_OVERALLPER${disadvantageType}`]),
      education: {
        total: cleanValue<number | null>(row[`${basePrefix}_EDUCATIONPER${disadvantageType}`]),
        furtherEducation: cleanValue<number | null>(row[`${basePrefix}_FEPER${disadvantageType}`]),
        higherEducation: cleanValue<number | null>(row[`${basePrefix}_HEPER${disadvantageType}`]),
        other: cleanValue<number | null>(row[`${basePrefix}_OTHER_EDUPER${disadvantageType}`]),
      },
      employment: {
        total: cleanValue<number | null>(row[`${basePrefix}_EMPLOYMENTPER${disadvantageType}`]),
        apprenticeships: cleanValue<number | null>(row[`${basePrefix}_APPRENPER${disadvantageType}`]),
      },
      other: {
        notSustained: cleanValue<number | null>(row[`${basePrefix}_NOT_SUSTAINEDPER${disadvantageType}`]),
        notCaptured: cleanValue<number | null>(row[`${basePrefix}_NOT_CAPTUREDPER${disadvantageType}`]),
      },
    },
  };
};

export function transformKS5Destinations(rows: KS5DestinationsRow[], year?: string): KS5DestinationsBatch {
  if (!year) throw new Error('Year is required');
  const batch: KS5DestinationsBatch = {
    main: [],
    stats: []

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
        total: {
          all: createDestinationStats(row, 'TOT', ''),
          disadvantaged: createDestinationStats(row, 'TOT', '_DIS'),
          nonDisadvantaged: createDestinationStats(row, 'TOT', '_NONDIS'),
        },
        level3: {
          all: createDestinationStats(row, 'L3', ''),
          disadvantaged: createDestinationStats(row, 'L3', '_DIS'),
          nonDisadvantaged: createDestinationStats(row, 'L3', '_NONDIS'),
        },
        level2: {
          all: createDestinationStats(row, 'L2', ''),
          disadvantaged: createDestinationStats(row, 'L2', '_DIS'),
          nonDisadvantaged: createDestinationStats(row, 'L2', '_NONDIS'),
        },
        otherLevels: {
          all: createDestinationStats(row, 'LALLOTH', ''),
          disadvantaged: createDestinationStats(row, 'LALLOTH', '_DIS'),
          nonDisadvantaged: createDestinationStats(row, 'LALLOTH', '_NONDIS'),
        },
        lastUpdated: new Date().toISOString(),
      }
    });

    // Stats collection
    batch.stats.push({
      id: row.URN,
      data: {
        id: row.URN,
        destinations: [{
          year,
          higherEducation: cleanValue(row.TOT_HEPER),
          furtherEducation: cleanValue(row.TOT_FEPER),
          employment: cleanValue(row.TOT_EMPLOYMENTPER),
          lastUpdated: new Date().toISOString(),
        }]
      }
    });
  }

  return batch;
}
