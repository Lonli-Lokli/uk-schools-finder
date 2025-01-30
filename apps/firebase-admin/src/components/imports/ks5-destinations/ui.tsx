import { ImportFile } from '../import-file';
import { ks5DestinationsModel } from './model';

export function KS5DestinationsImport() {
  return (
    <ImportFile 
      title="Import KS5 Destinations Data"
      model={ks5DestinationsModel}
      yearRequired
    />
  );
} 