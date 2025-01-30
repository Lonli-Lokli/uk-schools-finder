import { ImportFile } from '../import-file';
import { ks5HEDestinationsModel } from './model';

export function KS5HEDestinationsImport() {
  return (
    <ImportFile 
      title="Import KS5 HE Destinations Data"
      model={ks5HEDestinationsModel}
      yearRequired
    />
  );
} 