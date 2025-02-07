import { createStore, createEvent } from 'effector';


export const importTabs = [
    {
      key: 'ks4-results',
      label: 'KS4 Results',
      yearRequired: true,
      model: createImportModel('ks4-results', importKS4Results),
      fileName: 'england_ks4provisional.csv',
      description: 'Import KS4 (GCSE) student results data.',
    },
    {
      key: 'ks4-destinations',
      label: 'KS4 Destinations',
      yearRequired: true,
      model: createImportModel('ks4-destinations', importKS4Destinations),
      fileName: 'england_ks4-pupdest.csv',
      description: 'Import KS4 (GCSE) student destinations data.',
    },
  
    {
      key: 'ks5-destinations',
      label: 'KS5 Destinations',
      yearRequired: true,
      model: createImportModel('ks5-destinations', importKS5Destinations),
      fileName: 'england_ks5-studest.csv',
      description: 'Import KS5 (A-Level) student destinations data.',
    },
  
    {
      key: 'ks5he-destinations',
      label: 'KS5 HE Destinations',
      yearRequired: true,
      model: createImportModel('ks5he-destinations', importKS5HEDestinations),
      fileName: 'england_ks5-studest-he.csv',
      description: 'Import KS5 (A-Level) student destinations data.',
    },
  
    {
      key: 'regions',
      label: 'Regions',
      yearRequired: true,
      model: createImportModel('regions', importRegions),
      fileName: 'england_regions.csv',
      description: 'Import regions data.',
    },
    {
      key: 'schools',
      label: 'Schools',
      yearRequired: false,
      model: createImportModel('schools', importSchools),
      fileName: 'school-data.csv',
      description:
        'Import basic school information including URN, name, and location.',
    },
    {
      key: 'quadrants',
      label: 'Quadrants',
      yearRequired: false,
      model: createImportModel('quadrants', importQuadrants),
      fileName: 'school-data.csv',
      description: 'Import quadrants data.',
    },
  ];
  
export type DataSource = 'firebase' | 'supabase';

export const setDataSource = createEvent<DataSource>();

export const $dataSource = createStore<DataSource>('supabase')
  .on(setDataSource, (_, source) => source);