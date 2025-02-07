import { doc, writeBatch } from 'firebase/firestore';
import { QuadrantBatch } from '@lonli-lokli/data-transformers';
import { FirebaseImportParams, ImportResult } from '@lonli-lokli/shapes';
import { BATCH_SIZE } from './helpers';

export async function uploadQuadrants(
  batch: QuadrantBatch,
  { db, onProgress }: FirebaseImportParams
): Promise<ImportResult> {
  try {
    // Upload main collection
    const totalMainBatches = Math.ceil(batch.main.length / BATCH_SIZE);
    for (let i = 0; i < batch.main.length; i += BATCH_SIZE) {
      const currentBatch = writeBatch(db);
      const items = batch.main.slice(i, i + BATCH_SIZE);

      for (const item of items) {
        const docRef = doc(db, 'quadrants', item.id);
        currentBatch.set(docRef, {
          bounds: item.data.bounds,
          schoolCount: item.data.schools.length,
          schools: item.data.schools.map((s) => ({
            urn: s.urn,
            name: s.name,
            location: s.location,
          })),
        });
      }

      await currentBatch.commit();
      onProgress?.({
        current: Math.floor(i / BATCH_SIZE) + 1,
        total: totalMainBatches,
        details: `Uploading quadrants: batch ${
          Math.floor(i / BATCH_SIZE) + 1
        }/${totalMainBatches}`,
      });
    }

    return {
      success: true,
      count: batch.main.length,
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
