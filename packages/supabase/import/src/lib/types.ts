import {
  KS4ResultsBatch,
  KS4DestinationsBatch,
  KS5DestinationsBatch,
  KS5HEDestinationsBatch,
  SchoolBatch,
  RegionBatch,
  QuadrantBatch,
} from '@lonli-lokli/data-transformers';
import { BatchRecord } from '@lonli-lokli/shapes';

// 1. Define valid columns for each table first
type ValidColumns = {
  [K in TableName]: K extends 'schools' 
    ? 'region_id' | 'trust_id' | 'location_id' | 'establishment_type_id' | 'education_phase_id'
    : K extends 'trusts' 
      ? 'group_id'
      : K extends 'ks4_results' | 'ks4_results_demographics' | 'ks4_results_details' | 'school_census' | 'school_inspections'
        ? 'school_id'
        : never;
};

// 2. Use it in TableRelation
interface TableRelation<T extends TableName> {
  column: ValidColumns[T];
  jsonField: string;
  references: {
    table: TableName;
    column: 'id';
  };
}

// 3. Then use in TableConfig
interface TableConfig<T extends TableName> {
  name: T;
  relations: TableRelation<T>[];
  importOrder: number;
}

// Type guard to ensure table name is valid
export function isValidTableName(name: string): name is TableName {
  return name in TABLE_CONFIGS;
}


// This should match our TableName type
export type TableName = 
  | 'schools'
  | 'regions'
  | 'trusts'
  | 'trust_groups'
  | 'establishment_types'
  | 'locations'
  | 'education_phases'
  | 'ks4_results'
  | 'ks4_results_demographics'
  | 'ks4_results_details'
  | 'ks4_destinations'
  | 'ks4_destinations_details'
  | 'ks5_destinations'
  | 'ks5_destinations_stats'
  | 'ks5_he_destinations'
  | 'school_census'
  | 'school_inspections'
  | 'quadrants';

type TableMappings = {
  [K in keyof BatchTypes]: {
    [P in keyof BatchTypes[K]]: TableName;
  };
};

type ValidateBatch<T> = {
  [K in keyof T]: Array<
    BatchRecord<T[K] extends Array<{ data: infer D }> ? D : never>
  >;
};

export type BatchTypes = {
  'ks4-results': ValidateBatch<KS4ResultsBatch>;
  'ks4-destinations': ValidateBatch<KS4DestinationsBatch>;
  'ks5-destinations': ValidateBatch<KS5DestinationsBatch>;
  'ks5-he-destinations': ValidateBatch<KS5HEDestinationsBatch>;
  schools: ValidateBatch<SchoolBatch>;
  regions: ValidateBatch<RegionBatch>;
  quadrants: ValidateBatch<QuadrantBatch>;
};

export const TABLE_MAPPINGS: TableMappings = {
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

export const TABLE_CONFIGS: { [K in TableName]: TableConfig<K> } = {
  schools: {
    name: 'schools',
    relations: [
      {
        column: 'region_id',
        jsonField: 'region_id',
        references: { table: 'regions', column: 'id' },
      },
      {
        column: 'trust_id',
        jsonField: 'trust_id',
        references: { table: 'trusts', column: 'id' },
      },
      {
        column: 'location_id',
        jsonField: 'location_id',
        references: { table: 'locations', column: 'id' },
      },
      {
        column: 'establishment_type_id',
        jsonField: 'establishment_type_id',
        references: { table: 'establishment_types', column: 'id' },
      },
      {
        column: 'education_phase_id',
        jsonField: 'education_phase_id',
        references: { table: 'education_phases', column: 'id' },
      },
    ],
    importOrder: 100,
  },
  regions: {
    name: 'regions',
    relations: [], // no foreign keys
    importOrder: 1,
  },
  trusts: {
    name: 'trusts',
    relations: [
      {
        column: 'group_id',
        jsonField: 'group_id',
        references: { table: 'trust_groups', column: 'id' },
      },
    ],
    importOrder: 10,
  },
  trust_groups: {
    name: 'trust_groups',
    relations: [],
    importOrder: 1,
  },
  establishment_types: {
    name: 'establishment_types',
    relations: [],
    importOrder: 1,
  },
  locations: {
    name: 'locations',
    relations: [],
    importOrder: 1,
  },
  education_phases: {
    name: 'education_phases',
    relations: [],
    importOrder: 1,
  },
  ks4_results: {
    name: 'ks4_results',
    relations: [
      {
        column: 'school_id',
        jsonField: 'school_id',
        references: { table: 'schools', column: 'id' },
      },
    ],
    importOrder: 200,
  },
  ks4_results_demographics: {
    name: 'ks4_results_demographics',
    relations: [],
    importOrder: 1,
  },
  ks4_results_details: {
    name: 'ks4_results_details',
    relations: [],
    importOrder: 1,
  },
  ks4_destinations: {
    name: 'ks4_destinations',
    relations: [],
    importOrder: 1,
  },
  ks4_destinations_details: {
    name: 'ks4_destinations_details',
    relations: [],
    importOrder: 1,
  },
  ks5_destinations: {
    name: 'ks5_destinations',
    relations: [],
    importOrder: 1,
  },
  ks5_destinations_stats: {
    name: 'ks5_destinations_stats',
    relations: [],
    importOrder: 1,
  },
  ks5_he_destinations: {
    name: 'ks5_he_destinations',
    relations: [],
    importOrder: 1,
  },
  school_census: {
    name: 'school_census',
    relations: [
      {
        column: 'school_id',
        jsonField: 'school_id',
        references: { table: 'schools', column: 'id' },
      },
    ],
    importOrder: 200,
  },
  school_inspections: {
    name: 'school_inspections',
    relations: [
      {
        column: 'school_id',
        jsonField: 'school_id',
        references: { table: 'schools', column: 'id' }
      }
    ],
    importOrder: 200
  },
  quadrants: {
    name: 'quadrants',
    relations: [],
    importOrder: 1
  }
};
