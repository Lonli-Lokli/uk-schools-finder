import { ImportFile } from '../import-file';
import { ks4DestinationsModel } from './model';

export function KS4DestinationsImport() {
  return (
    <ImportFile 
      title="Import KS4 Destinations"
      model={ks4DestinationsModel}
      yearRequired
    />
  );
} 