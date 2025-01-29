import { createStore, createEvent, createEffect } from 'effector';
import { uploadSchoolsData } from '@lonli-lokli/firebase/import';
import { initializeClientFirebase } from '../../server/init';

// Types
type Message = {
  type: 'success' | 'error';
  text: string;
} | null;

const { db } = initializeClientFirebase();

// Events
export const fileSelected = createEvent<File | null>();
export const resetState = createEvent();

// Effects
export const processFileFx = createEffect(async (file: File) => {
  try {
    const text = await file.text();
    await uploadSchoolsData(db, text);
    return 'File processed successfully';
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to process file'
    );
  }
});

// Stores
export const $file = createStore<File | null>(null)
  .on(fileSelected, (_, file) => file)
  .reset(resetState)
  .reset(processFileFx.done);

export const $isProcessing = createStore(false)
  .on(processFileFx, () => true)
  .on(processFileFx.finally, () => false);

export const $message = createStore<Message>(null)
  .on(processFileFx.done, (_, { result }) => ({
    type: 'success',
    text: result,
  }))
  .on(processFileFx.fail, (_, { error }) => ({
    type: 'error',
    text: error.message,
  }))
  .reset(fileSelected)
  .reset(resetState);
