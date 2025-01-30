import { createImportModel } from '../model-factory';
import { importRegions } from '@lonli-lokli/firebase/import';

export const regionsModel = createImportModel('regions', importRegions);