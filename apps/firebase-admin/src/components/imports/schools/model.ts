import { createImportModel } from '../model-factory';
import { importSchools } from '@lonli-lokli/firebase/import';

export const schoolsModel = createImportModel('schools', importSchools);