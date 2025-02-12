import { RegionBatch } from '@lonli-lokli/data-transformers';
import {
  SupabaseImportParams,
  ImportResult,
  Database,
} from '@lonli-lokli/shapes';
import { identity } from '@lonli-lokli/core';

type RegionInsert = Database['public']['Tables']['regions']['Insert'];

export async function uploadRegions(
  batch: RegionBatch,
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const records = batch.main.map(item => identity<RegionInsert>({
      id: item.id,
      name: item.data.name,
      sub_regions: item.data.subRegions,
    }));

    const { error } = await db
      .from('regions')
      .upsert(records)
      .select();

    if (error) {
      console.error('Failed to upload regions:', error);
      return {
        success: false,
        count: 0,
        error: `Database error ${error.code}: ${error.message}`,
      };
    }

    onProgress?.({
      current: records.length,
      total: records.length,
      details: `Successfully imported ${records.length} regions`,
    });

    return {
      success: true,
      count: records.length,
    };
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null
        ? [
            'message' in error ? error.message : null,
            'details' in error && error.details
              ? `Details: ${error.details}`
              : null,
            'hint' in error && error.hint ? `Hint: ${error.hint}` : null,
            'code' in error && error.code ? `Code: ${error.code}` : null,
          ]
            .filter(Boolean)
            .join('\n')
        : 'Unknown error';
    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
}
