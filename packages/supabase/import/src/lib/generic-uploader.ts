import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';
import {
  KS4ResultsBatch,
  KS4DestinationsBatch,
  KS5DestinationsBatch,
  KS5HEDestinationsBatch,
  SchoolBatch,
  RegionBatch,
  QuadrantBatch,
} from '@lonli-lokli/data-transformers';
import { PostgrestError } from '@supabase/supabase-js';

type BatchTypes = {
  'ks4-results': KS4ResultsBatch;
  'ks4-destinations': KS4DestinationsBatch;
  'ks5-destinations': KS5DestinationsBatch;
  'ks5-he-destinations': KS5HEDestinationsBatch;
  schools: SchoolBatch;
  regions: RegionBatch;
  quadrants: QuadrantBatch;
};

type TableMappings = {
  [K in keyof BatchTypes]: {
    [P in keyof BatchTypes[K]]: string;
  };
};

type BatchRecord<T> = {
  id: string;
  data: T;
};

type Batch = {
  [key: string]: Array<BatchRecord<any>>;
};

const TABLE_MAPPINGS: TableMappings = {
  'ks4-results': {
    main: 'ks4_results',
    demographics: 'ks4_results_demographics',
    details: 'ks4_results_details',
  },
  'ks4-destinations': {
    main: 'ks4_destinations',
    details: 'ks4_destinations_details',
  },
  'ks5-destinations': {
    main: 'ks5_destinations',
    stats: 'ks5_destinations_stats',
  },
  'ks5-he-destinations': {
    main: 'ks5_he_destinations',
  },
  schools: {
    main: 'schools',
    types: 'establishment_types',
    phases: 'education_phases',
    locations: 'locations',
    trusts: 'trusts',
    census: 'school_census',
    inspections: 'school_inspections',
  },
  regions: {
    main: 'regions',
  },
  quadrants: {
    main: 'quadrants',
  },
} as const;

export async function uploadBatch<T extends keyof BatchTypes>(
  type: T,
  batch: BatchTypes[T],
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const tables = TABLE_MAPPINGS[type];
    const imports = (Object.keys(tables) as Array<keyof BatchTypes[T]>)
      .filter((key) => key in batch)
      .map((key) => ({
        table_name: tables[key],
        records: (
          batch[key] as Array<{ id: string; data: Record<string, unknown> }>
        ).map((item) => ({
          id: item.id,
          ...item.data,
        })),
      }));

    const { error } = await db.rpc('import_batch', { imports });

    if (error) throw error;

    const totalCount = imports.reduce(
      (sum, { records }) => sum + records.length,
      0
    );

    onProgress?.({
      current: 1,
      total: 1,
      details: `Uploaded ${totalCount} records for ${type}`,
    });

    return {
      success: true,
      count: totalCount,
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error:
        error instanceof PostgrestError
          ? `Database error: ${error.message}${
              error.details ? ` (${error.details})` : ''
            }${error.hint ? `\nHint: ${error.hint}` : ''}`
          : error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
}
