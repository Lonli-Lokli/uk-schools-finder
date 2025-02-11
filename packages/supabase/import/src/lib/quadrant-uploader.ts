import { QuadrantBatch } from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';
import { identity, importInBatches } from './core';
import type { Database } from './database.types';

type BoundingBoxInsert =
  Database['public']['Tables']['bounding_boxes']['Insert'];
type QuadrantInsert = Database['public']['Tables']['quadrants']['Insert'];
type QuadrantSchoolInsert =
  Database['public']['Tables']['quadrant_schools']['Insert'];

export async function uploadQuadrants(
  batch: QuadrantBatch,
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const totalCount =
      batch.main.length * 2 +
      batch.main
        .flatMap((item) => item.data.schools.length)
        .reduce((a, b) => a + b, 0);

         // First, clean up existing data
    await db.rpc('school_cleanup_quadrants');

    let processedCount = 0;
    await importInBatches(
      batch.main.map((item) =>
        identity<BoundingBoxInsert>({
          id: item.id,
          ne_lat: item.data.bounds.ne.lat,
          ne_lng: item.data.bounds.ne.lng,
          ne_geohash: item.data.bounds.ne.geohash,
          sw_lat: item.data.bounds.sw.lat,
          sw_lng: item.data.bounds.sw.lng,
          sw_geohash: item.data.bounds.sw.geohash,
        })
      ),
      'school_import_bounding_boxes',
      'boxes',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Importing ${count} bounding boxes`,
        });
      }
    );

    await importInBatches(
      batch.main.map((item) =>
        identity<QuadrantInsert>({
          id: item.id,
          bounds_id: item.id,
          school_count: item.data.schools.length,
        })
      ),
      'school_import_quadrants',
      'quads',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Importing ${count} quadrants`,
        });
      }
    );

    await importInBatches(
      batch.main.flatMap((item) =>
        item.data.schools.map((school) =>
          identity<QuadrantSchoolInsert>({
            quadrant_id: item.id,
            urn: school.urn,
            name: school.name,
            lat: school.location.lat,
            lng: school.location.lng,
            geohash: school.location.geohash,
          })
        )
      ),
      'school_import_quadrant_schools',
      'schools',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Importing ${count} quadrant schools`,
        });
      }
    );

    onProgress?.({
      current: totalCount,
      total: totalCount,
      details: `Successfully imported ${totalCount} quadrants with their schools`,
    });

    return {
      success: true,
      count: totalCount,
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
