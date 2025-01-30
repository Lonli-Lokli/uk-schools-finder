import { ImportFile } from '../import-file';
import { ks4ResultsModel } from './model';

export function KS4ResultsImport() {
  return (
    <ImportFile 
      title="Import KS4 Results"
      model={ks4ResultsModel}
      yearRequired
    />
  );
} 