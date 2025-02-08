import { uploadBatch } from './generic-uploader';
import {
  KS4ResultsBatch,
  KS4DestinationsBatch,
  KS5DestinationsBatch,
  KS5HEDestinationsBatch,
  SchoolBatch,
  RegionBatch,
  QuadrantBatch,
} from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';

export const uploadKS4Results = (
  batch: KS4ResultsBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('ks4-results', batch, params);

export const uploadKS4Destinations = (
  batch: KS4DestinationsBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('ks4-destinations', batch, params);

export const uploadKS5Destinations = (
  batch: KS5DestinationsBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('ks5-destinations', batch, params);

export const uploadKS5HEDestinations = (
  batch: KS5HEDestinationsBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('ks5-he-destinations', batch, params);

export const uploadSchools = (
  batch: SchoolBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('schools', batch, params);

export const uploadRegions = (
  batch: RegionBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('regions', batch, params);

export const uploadQuadrants = (
  batch: QuadrantBatch,
  params: SupabaseImportParams
): Promise<ImportResult> => uploadBatch('quadrants', batch, params);
