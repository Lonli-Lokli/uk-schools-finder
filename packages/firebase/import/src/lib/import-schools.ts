import { doc, writeBatch } from 'firebase/firestore';
import { BATCH_SIZE } from './helpers';

import { SchoolBatch } from '@lonli-lokli/data-transformers';
import { FirebaseImportParams } from '@lonli-lokli/shapes';

export async function uploadSchools(
  batch: SchoolBatch,
  { db, onProgress }: FirebaseImportParams
) {
  // Upload main schools collection
  const totalMainBatches = Math.ceil(batch.main.length / BATCH_SIZE);
  for (let i = 0; i < batch.main.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.main.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'schools', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalMainBatches,
      details: `Uploading schools: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalMainBatches}`,
    });
  }

  // Upload establishment types
  const totalTypesBatches = Math.ceil(batch.types.length / BATCH_SIZE);
  for (let i = 0; i < batch.types.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.types.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'establishment-types', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalTypesBatches,
      details: `Uploading establishment types: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalTypesBatches}`,
    });
  }

  // Upload education phases
  const totalPhasesBatches = Math.ceil(batch.phases.length / BATCH_SIZE);
  for (let i = 0; i < batch.phases.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.phases.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'education-phases', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalPhasesBatches,
      details: `Uploading education phases: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalPhasesBatches}`,
    });
  }

  // Upload locations
  const totalLocationsBatches = Math.ceil(batch.locations.length / BATCH_SIZE);
  for (let i = 0; i < batch.locations.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.locations.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'locations', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalLocationsBatches,
      details: `Uploading locations: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalLocationsBatches}`,
    });
  }

  // Upload trusts
  const totalTrustsBatches = Math.ceil(batch.trusts.length / BATCH_SIZE);
  for (let i = 0; i < batch.trusts.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.trusts.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'trusts', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalTrustsBatches,
      details: `Uploading trusts: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalTrustsBatches}`,
    });
  }

  // Upload census data
  const totalCensusBatches = Math.ceil(batch.census.length / BATCH_SIZE);
  for (let i = 0; i < batch.census.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.census.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'school-census', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalCensusBatches,
      details: `Uploading census data: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalCensusBatches}`,
    });
  }

  // Upload inspections
  const totalInspectionsBatches = Math.ceil(
    batch.inspections.length / BATCH_SIZE
  );
  for (let i = 0; i < batch.inspections.length; i += BATCH_SIZE) {
    const currentBatch = writeBatch(db);
    const items = batch.inspections.slice(i, i + BATCH_SIZE);

    for (const item of items) {
      const docRef = doc(db, 'school-inspections', item.id);
      currentBatch.set(docRef, item.data);
    }

    await currentBatch.commit();
    onProgress?.({
      current: Math.floor(i / BATCH_SIZE) + 1,
      total: totalInspectionsBatches,
      details: `Uploading inspections: batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${totalInspectionsBatches}`,
    });
  }
}
