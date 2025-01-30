import { createImportModel } from '../model-factory';
import { importKS5Destinations } from '@lonli-lokli/firebase/import';

export const ks5DestinationsModel = createImportModel('ks5-destinations', importKS5Destinations);