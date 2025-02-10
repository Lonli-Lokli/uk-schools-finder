import { QuadrantBatch } from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';

export async function uploadQuadrants(
  batch: QuadrantBatch,
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const boundingBoxes = batch.main.map(item => ({
      id: item.id,
      ne_lat: item.data.bounds.ne.lat,
      ne_lng: item.data.bounds.ne.lng,
      ne_geohash: item.data.bounds.ne.geohash,
      sw_lat: item.data.bounds.sw.lat,
      sw_lng: item.data.bounds.sw.lng,
      sw_geohash: item.data.bounds.sw.geohash
    }));

    const quadrants = batch.main.map(item => ({
      id: item.id,
      bounds_id: item.id,
      school_count: item.data.schools.length
    }));

    const quadrantSchools = batch.main.flatMap(item => 
      item.data.schools.map(school => ({
        quadrant_id: item.id,
        urn: school.urn,
        name: school.name,
        lat: school.location.lat,
        lng: school.location.lng,
        geohash: school.location.geohash
      }))
    );

    const { data, error } = await db.rpc('school_import_quadrants', {
      bounding_boxes: boundingBoxes,
      quadrants: quadrants,
      quadrant_schools: quadrantSchools
    });

    if (error) {
      const details = [
        error.message,
        error.details && `Details: ${error.details}`,
        error.hint && `Hint: ${error.hint}`,
        `Code: ${error.code}`
      ].filter(Boolean).join('\n');

      return {
        success: false,
        count: 0,
        error: details,
      };
    }

    const totalCount = batch.main.length;
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
      error instanceof Error ? error.message : String(error);
    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
} 