import { writeBatch, doc } from 'firebase/firestore';

import { KS4DestinationsBatch } from '@lonli-lokli/data-transformers';
import { BATCH_SIZE } from './helpers';
import { FirebaseImportParams } from '@lonli-lokli/shapes';


export async function uploadKS4Destinations(
  batch: KS4DestinationsBatch,
  options: FirebaseImportParams
) {
  const { db, onProgress } = options;

  // Upload main collection
  const totalMainBatches = Math.ceil(batch.main.length / BATCH_SIZE);
  for (let i = 0; i < batch.main.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.main.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'ks4-destinations', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalMainBatches,  
      details: `Uploading main collection: ${i + BATCH_SIZE} of ${batch.main.length}`
    });
  }

  // Upload details collection
  const totalDetailsBatches = Math.ceil(batch.details.length / BATCH_SIZE);
  for (let i = 0; i < batch.details.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.details.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'ks4-destinations-details', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalDetailsBatches,
      details: `Uploading details collection: ${i + BATCH_SIZE} of ${batch.details.length}`
    });
  }
}
