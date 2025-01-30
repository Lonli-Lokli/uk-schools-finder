import { ImportFile } from '../import-file';
import { regionsModel } from './model';

export function RegionsImport() {
  return (
    <ImportFile 
      title="Import Regions Data"
      model={regionsModel}
    />
  );
} 