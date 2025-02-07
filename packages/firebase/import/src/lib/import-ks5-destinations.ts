import { doc, writeBatch, arrayUnion } from 'firebase/firestore';

import { BATCH_SIZE } from './helpers';
import { KS5DestinationsBatch } from '@lonli-lokli/data-transformers';
import { FirebaseImportParams } from '@lonli-lokli/shapes';

export async function uploadKS5Destinations(
  batch: KS5DestinationsBatch,
  { db, onProgress }: FirebaseImportParams
) {
  // Upload main collection
  const totalMainBatches = Math.ceil(batch.main.length / BATCH_SIZE);
  for (let i = 0; i < batch.main.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.main.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'school-destinations', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalMainBatches,
      details: `Uploading KS5 destinations main: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalMainBatches}`,
    });
  }

  // Upload stats collection with array merging
  const totalStatsBatches = Math.ceil(batch.stats.length / BATCH_SIZE);
  for (let i = 0; i < batch.stats.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.stats.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'school-destinations-stats', item.id);
      currentBatch.set(
        docRef,
        {
          id: item.id,
          destinations: arrayUnion(item.data),
        },
        { merge: true }
      );
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalStatsBatches,
      details: `Uploading KS5 destinations stats: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalStatsBatches}`,
    });
  }
}
