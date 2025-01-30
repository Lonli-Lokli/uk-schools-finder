import { createImportModel } from '../model-factory';
import { importKS4Destinations } from '@lonli-lokli/firebase/import';

export const ks4DestinationsModel = createImportModel(
  'ks4-destinations',
  importKS4Destinations
);
