import { ImportParams, ImportResult } from '@lonli-lokli/firebase/import';
import { createStore, createEffect, createEvent, sample, scopeBind } from 'effector';
import { createAction } from 'effector-action';
import { initializeClientFirebase } from '../../server/init';

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

const { db } = initializeClientFirebase();

export interface Progress {
  current?: number;
  total?: number;
  details?: string;
}

export function createImportModel(
  name: string,
  processFunction: (importArgs: ImportParams) => Promise<ImportResult>
) {
  // Events
  const fileSelected = createEvent<File | null>();
  const resetState = createEvent();
  const uploadStarted = createEvent<{ file: File; year: string }>();
  const progressUpdated = createEvent<Progress>();

  // Stores
  const $file = createStore<File | null>(null);
  const $isProcessing = createStore(false);
  const $message = createStore<Message | null>(null);
  const $progress = createStore<Progress | null>(null);

  // Effects
  const processFileFx = createEffect<
    {
      file: File;
      year: string;
    },
    ImportResult,
    Error
  >();

  sample({
    clock: processFileFx.pending,
    target: $isProcessing,
  });

  sample({
    clock: processFileFx.doneData,
    fn: (result) => ({
      text: result.success
        ? `[${name}] File processed successfully. ${result.count} rows processed.`
        : `[${name}] File processed with error (${result.error})`,
      type: result.success ? ('success' as const) : ('error' as const),
    }),
    target: $message,

  });

  sample({
    clock: processFileFx.fail,
    fn: ({ error }) => ({
      text: `[${name}] ${error.message}`,
      type: 'error' as const,
    }),
    target: $message,
  });

  createAction({
    clock: resetState,
    target: { $message, $isProcessing, $file },
    fn: (target) => {
      target.$message.reinit();
      target.$isProcessing.reinit();
      target.$file.reinit();
    },
  });

  sample({
    clock: fileSelected,
    target: $file,
  });

  sample({
    clock: uploadStarted,
    target: processFileFx,
  });

  processFileFx.use(async ({ file, year }) => {
    const scopedProgressUpdated = progressUpdated;
    const csvData = await file.text();    
    return await processFunction({
      csvData: csvData,
      year: year,
      db: db,
      onProgress: (progress) => scopedProgressUpdated(progress),
    });

  });

  $progress
    .on(progressUpdated, (_, progress) => progress)
    .reset(processFileFx.done)
    .reset(processFileFx.fail)
    .reset(fileSelected);

  $message
    .on(processFileFx.done, (_, { result }) => ({
      text: `Successfully processed ${result.count} records`,
      type: 'success' as const,
    }))
    .on(processFileFx.fail, (_, { error }) => ({
      text: error.message,
      type: 'error' as const,
    }))
    .reset(fileSelected);

  return {
    // Events
    fileSelected,
    resetState,
    uploadStarted,
    progressUpdated,
    // Stores
    $file,
    $isProcessing,
    $message,
    $progress,
  };
}

export type ImportModel = ReturnType<typeof createImportModel>;
