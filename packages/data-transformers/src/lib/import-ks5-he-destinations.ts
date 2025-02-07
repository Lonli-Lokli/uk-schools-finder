import { KS5HEDestinationsRow } from '@lonli-lokli/data-parsers';
import { KS5HEDestinationsDm } from '@lonli-lokli/shapes';
import { cleanValue } from './helpers';

export interface KS5HEDestinationsBatch {
  main: Array<{
    id: string;
    data: KS5HEDestinationsDm;
  }>;
}

export function transformKS5HEDestinations(
  rows: KS5HEDestinationsRow[],
  year?: string
): KS5HEDestinationsBatch {
  if (!year) throw new Error('Year is required');

  const batch: KS5HEDestinationsBatch = {
    main: [],
  };

  for (const row of rows) {
    if (!row.URN || row.RECTYPE !== '1') continue;

    const docId = `${row.URN}_${year}`;

    batch.main.push({
      id: docId,
      data: {
        schoolUrn: row.URN,
        year,
        universities: {
          oxbridge: {
            percentage: cleanValue<number | null>(row.ALL_OXBRIDGEPER),
          },
          russell: {
            percentage: cleanValue<number | null>(row.ALL_RUSSELLPER),
          },
          topThird: {
            percentage: cleanValue<number | null>(row.ALL_TOP3RDPER),
          },
          higherTechnical: {
            percentage: cleanValue<number | null>(row.ALL_HTECHPER),
          },
        },
        disadvantaged: {
          oxbridge: {
            percentage: cleanValue<number | null>(row.DIS_OXBRIDGE),
          },
          russell: {
            percentage: cleanValue<number | null>(row.DIS_RUSSELL),
          },
          topThird: {
            percentage: cleanValue<number | null>(row.DIS_TOP3RD),
          },
          higherTechnical: {
            percentage: cleanValue<number | null>(row.DIS_HTECH),
          },
        },
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  return batch;
}
