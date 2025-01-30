import { createImportModel } from '../model-factory';
import { importKS5HEDestinations } from '@lonli-lokli/firebase/import';

export const ks5HEDestinationsModel = createImportModel(
  'ks5he-destinations',
  importKS5HEDestinations
);
