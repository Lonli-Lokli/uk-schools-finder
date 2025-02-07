import { doc, writeBatch } from 'firebase/firestore';

import { KS4ResultsBatch } from '@lonli-lokli/data-transformers';
import { FirebaseImportParams } from '@lonli-lokli/shapes';
import { BATCH_SIZE } from './helpers';

export async function uploadKS4Results(
  batch: KS4ResultsBatch,
  { db, onProgress }: FirebaseImportParams
) {
  // Upload main collection
  const totalMainBatches = Math.ceil(batch.main.length / BATCH_SIZE);
  for (let i = 0; i < batch.main.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.main.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'school-ks4-results', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalMainBatches,
      details: `Uploading KS4 results main: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalMainBatches}`,
    });
  }

  // Upload demographics collection
  const totalDemographicsBatches = Math.ceil(batch.demographics.length / BATCH_SIZE);
  for (let i = 0; i < batch.demographics.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.demographics.slice(i, i + BATCH_SIZE);
    
    for (const item of items) {
      const docRef = doc(db, 'school-ks4-results-demographics', item.id);
      currentBatch.set(docRef, item.data);
    }
    
    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalDemographicsBatches,
      details: `Uploading KS4 results demographics: batch ${Math.floor(i / BATCH_SIZE) + 1}/${totalDemographicsBatches}`,
    });
  }

  // Upload details collection
  const totalDetailsBatches = Math.ceil(batch.details.length / BATCH_SIZE);
  for (let i = 0; i < batch.details.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.details.slice(i, i + BATCH_SIZE);
    
    for (const item of items) {
      const docRef = doc(db, 'school-ks4-results-details', item.id);
      currentBatch.set(docRef, item.data);
    }
    
    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalDetailsBatches,
      details: `Uploading KS4 results details: batch ${Math.floor(i / BATCH_SIZE) + 1}/${totalDetailsBatches}`,
    });
  }
}
