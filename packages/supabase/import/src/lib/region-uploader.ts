import { RegionBatch } from '@lonli-lokli/data-transformers';
import {
  SupabaseImportParams,
  ImportResult,
  RegionDm,
} from '@lonli-lokli/shapes';

export async function uploadRegions(
  batch: RegionBatch,
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const records = batch.main.map(item => ({
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
      error instanceof Error ? error.message : String(error);
    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
}
