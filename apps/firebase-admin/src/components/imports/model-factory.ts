import { ImportParams, ImportResult } from '@lonli-lokli/firebase/import';
import { createStore, createEffect, createEvent, sample } from 'effector';
import { createAction } from 'effector-action';
import { initializeClientFirebase } from '../../server/init';

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

const { db } = initializeClientFirebase();

export function createImportModel(
  name: string,
  processFunction: (importArgs: ImportParams) => Promise<ImportResult>
) {
  // Events
  const fileSelected = createEvent<File | null>();
  const resetState = createEvent();
  const uploadStarted = createEvent<{ file: File; year: string }>();

  // Stores
  const $file = createStore<File | null>(null);
  const $isProcessing = createStore(false);
  const $message = createStore<Message | null>(null);

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
        : `[${name}] File processed with errors (${(result.errors ?? []).join(
            ', '
          )}).`,
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
    const csvData = await file.text();
    return await processFunction({
      csvData: csvData,
      year: year,
      db: db,
    });
  });

  return {
    // Events
    fileSelected,
    resetState,
    uploadStarted,
    // Stores
    $file,
    $isProcessing,
    $message,
  };
}

export type ImportModel = ReturnType<typeof createImportModel>;
