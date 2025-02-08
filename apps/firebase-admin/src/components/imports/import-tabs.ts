import {
  ks4DestinationsParser,
  ks4ResultsParser,
  ks5DestinationsParser,
  ks5HEDestinationsParser,
  regionsParser,
  schoolsParser,
} from '@lonli-lokli/data-parsers';
import {
  transformKS4Destinations,
  transformKS4Results,
  transformKS5Destinations,
  transformKS5HEDestinations,
  transformQuadrants,
  transformRegions,
  transformSchools,
} from '@lonli-lokli/data-transformers';
import {
  uploadKS4Destinations as firebaseUploadKS4Destinations,
  uploadKS4Results as firebaseUploadKS4Results,
  uploadKS5Destinations as firebaseUploadKS5Destinations,
  uploadKS5HEDestinations as firebaseUploadKS5HEDestinations,
  uploadQuadrants as firebaseUploadQuadrants,
  uploadRegions as firebaseUploadRegions,
  uploadSchools as firebaseUploadSchools,
} from '@lonli-lokli/firebase/import';
import {
  uploadSchools as supabaseUploadSchools,
  uploadKS4Destinations as supabaseUploadKS4Destinations,
  uploadKS4Results as supabaseUploadKS4Results,
  uploadKS5Destinations as supabaseUploadKS5Destinations,
  uploadKS5HEDestinations as supabaseUploadKS5HEDestinations,
  uploadRegions as supabaseUploadRegions,
  uploadQuadrants as supabaseUploadQuadrants,
} from '@lonli-lokli/supabase/import';
import { createImportModel } from './model-factory';

export const importTabs = [
  {
    key: 'ks4-results',
    label: 'KS4 Results',
    yearRequired: true,
    model: createImportModel('ks4-results', {
      parse: ks4ResultsParser,
      transform: transformKS4Results,
      upload: {
        firebase: firebaseUploadKS4Results,
        supabase: supabaseUploadKS4Results,
      },
    }),
    fileName: 'england_ks4provisional.csv',
    description: 'Import KS4 (GCSE) student results data.',
  },
  {
    key: 'ks4-destinations',
    label: 'KS4 Destinations',
    yearRequired: true,
    model: createImportModel('ks4-destinations', {
      parse: ks4DestinationsParser,
      transform: transformKS4Destinations,
      upload: {
        firebase: firebaseUploadKS4Destinations,
        supabase: supabaseUploadKS4Destinations,
      },
    }),
    fileName: 'england_ks4-pupdest.csv',
    description: 'Import KS4 (GCSE) student destinations data.',
  },

  {
    key: 'ks5-destinations',
    label: 'KS5 Destinations',
    yearRequired: true,
    model: createImportModel('ks5-destinations', {
      parse: ks5DestinationsParser,
      transform: transformKS5Destinations,
      upload: {
        firebase: firebaseUploadKS5Destinations,
        supabase: supabaseUploadKS5Destinations,
      },
    }),
    fileName: 'england_ks5-studest.csv',
    description: 'Import KS5 (A-Level) student destinations data.',
  },

  {
    key: 'ks5he-destinations',
    label: 'KS5 HE Destinations',
    yearRequired: true,
    model: createImportModel('ks5he-destinations', {
      parse: ks5HEDestinationsParser,
      transform: transformKS5HEDestinations,
      upload: {
        firebase: firebaseUploadKS5HEDestinations,
        supabase: supabaseUploadKS5HEDestinations,
      },
    }),
    fileName: 'england_ks5-studest-he.csv',
    description: 'Import KS5 (A-Level) student destinations data.',
  },

  {
    key: 'regions',
    label: 'Regions',
    yearRequired: true,
    model: createImportModel('regions', {
      parse: regionsParser,
      transform: transformRegions,
      upload: {
        firebase: firebaseUploadRegions,
        supabase: supabaseUploadRegions,
      },
    }),
    fileName: 'la_and_region_codes_meta.csv',
    description: 'Import regions data.',
  },
  {
    key: 'schools',
    label: 'Schools',
    yearRequired: false,
    model: createImportModel('schools', {
      parse: schoolsParser,
      transform: transformSchools,
      upload: {
        firebase: firebaseUploadSchools,
        supabase: supabaseUploadSchools,
      },
    }),
    fileName: 'school-data.csv',
    description:
      'Import basic school information including URN, name, and location.',
  },
  {
    key: 'quadrants',
    label: 'Quadrants',
    yearRequired: false,
    model: createImportModel('quadrants', {
      parse: schoolsParser,
      transform: transformQuadrants,
      upload: {
        firebase: firebaseUploadQuadrants,
        supabase: supabaseUploadQuadrants,
      },
    }),
    fileName: 'school-data.csv',
    description: 'Import quadrants data.',
  },
];
