import { uploadBatch } from './generic-uploader';
import {
  KS4DestinationsBatch,
  KS5DestinationsBatch,
  KS5HEDestinationsBatch,
} from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';

export { uploadKS4Results } from './ks4-uploader';

export { uploadKS4Destinations } from './ks4-destinations-uploader';
export const uploadKS5Destinations = (
  batch: KS5DestinationsBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('ks5-destinations', batch, params);

export const uploadKS5HEDestinations = (
  batch: KS5HEDestinationsBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('ks5-he-destinations', batch, params);

export { uploadSchools } from './school-uploader';

export { uploadRegions } from './region-uploader';

export { uploadQuadrants } from './quadrant-uploader';
