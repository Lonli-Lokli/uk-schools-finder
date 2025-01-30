import { ImportFile } from '../import-file';
import { schoolsModel } from './model';

export function SchoolsImport() {
  return (
    <ImportFile 
      title="Import Schools Data"
      model={schoolsModel}
    />
  );
} 