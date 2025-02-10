import {
  SupabaseImportParams,
  ImportResult,
  BatchRecord,
} from '@lonli-lokli/shapes';
import { BatchTypes, TABLE_CONFIGS, TABLE_MAPPINGS, TableName } from './types';

// Debug the types
export async function uploadBatch<T extends keyof BatchTypes>(
  type: T,
  batch: BatchTypes[T],
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const tables = TABLE_MAPPINGS[type];
    const tableEntries = Object.entries(tables) as [
      keyof BatchTypes[T],
      TableName
    ][];

    const imports = tableEntries
      .filter(([key]) => key in batch)
      .map(([key, tableName]) => ({
        table_name: tableName,
        config: TABLE_CONFIGS[tableName],
        records: batch[key] as Array<BatchRecord<unknown>>,
      }))
      .sort((a, b) => a.config.importOrder - b.config.importOrder);

    const CHUNK_SIZE = 1000;
    const importId = crypto.randomUUID();

    let totalProcessed = 0;

    const totalCount = imports.reduce(
      (sum, { records }) => sum + records.length,
      0
    );

    // Stage records in chunks
    for (const { table_name, config, records } of imports) {
      for (let i = 0; i < records.length; i += CHUNK_SIZE) {
        const chunk = records.slice(i, i + CHUNK_SIZE);

        console.log(`Staging ${table_name} with params:`, {
          import_id: importId,
          table_name,
          records: chunk,
          relations: config.relations,
        });

        const { data, error: stageError } = await db.rpc(
          'school_stage_import_chunk',
          {
            import_id: importId,
            table_name,
            records: chunk,
            relations: config.relations,
          }
        );

        if (stageError) {
          console.error(`Failed staging ${table_name} with params:`, {
            import_id: importId,
            table_name,
            records: chunk,
            relations: config.relations,
          });
          throw new Error(
            `Failed staging ${table_name}: ${stageError.message} (${stageError.code})`
          );
        }

        console.log(`Staged ${table_name} result:`, data);

        totalProcessed += chunk.length;
        onProgress?.({
          current: totalProcessed,
          total: totalCount,
          details: `Staged ${totalProcessed} of ${totalCount} records...`,
        });
      }
    }

    console.log('Starting import execution...');
    const { data: importResult, error: importError } = await db.rpc(
      'school_execute_staged_import',
      { import_id: importId }
    );

    if (importError) {
      console.error('Import execution failed:', importError);
      const errorMessage =
        typeof importError === 'object' && importError !== null
          ? `Import execution failed: ${importError.code}: ${importError.message}`
          : String(importError);

      return {
        success: false,
        count: totalProcessed,
        error: errorMessage,
      };
    }

    onProgress?.({
      current: totalCount,
      total: totalCount,
      details: `Successfully imported ${importResult.total_records} records`,
    });

    return {
      success: true,
      count: importResult.total_records,
    };
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          'message' in error
        ? `Database error ${error.code}: ${error.message}`
        : String(error);

    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
}
