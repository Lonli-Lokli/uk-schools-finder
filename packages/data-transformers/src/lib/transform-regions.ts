import { RegionRow } from '@lonli-lokli/data-parsers';
import { RegionDm } from '@lonli-lokli/shapes';

export interface RegionBatch {
  main: Array<{
    id: string;
    data: RegionDm;
  }>;
}
export function transformRegions(rows: RegionRow[]): RegionBatch {
  const regions = new Map<string, RegionDm>();

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

  return {
    main: Array.from(regions.entries()).map(([id, data]) => ({
      id,
      data,
    })),
  };
}
