import { createImportModel } from '../model-factory';
import { importKS4Results } from '@lonli-lokli/firebase/import';

export const ks4ResultsModel = createImportModel('ks4-results', importKS4Results);