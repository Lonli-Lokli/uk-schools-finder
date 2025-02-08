import { initializeClientFirebase } from '@lonli-lokli/firebase/setup-client';
import {
  FirebaseImportParams,
  ImportResult,
  SupabaseImportParams,
} from '@lonli-lokli/shapes';
import { createStore, createEffect, createEvent, sample } from 'effector';
import { createAction } from 'effector-action';
import { ParseResult } from '@lonli-lokli/data-parsers';
import { $dataSource } from './model';
import { initializeClientSupabase } from '@lonli-lokli/supabase/setup-client';

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

export interface ImportProcessor<TRow, TBatch> {
  parse: (csvData: string) => Promise<ParseResult<TRow>>;
  transform: (rows: TRow[], year?: string) => TBatch;
  upload: {
    firebase: (
      batch: TBatch,
      params: FirebaseImportParams
    ) => Promise<ImportResult>;
    supabase: (
      batch: TBatch,
      params: SupabaseImportParams
    ) => Promise<ImportResult>;
  };
}

const { db } = initializeClientFirebase();
const { supabase } = initializeClientSupabase();

export interface Progress {
  current?: number;
  total?: number;
  details?: string;
}

export function createImportModel<TRow, TBatch>(
  name: string,
  processor: ImportProcessor<TRow, TBatch>
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
      storage: 'firebase' | 'supabase';
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
    source: $dataSource,
    fn: (dataSource, { file, year }) => ({
      file,
      year,
      storage: dataSource,
    }),
    target: processFileFx,
  });

  processFileFx.use(async ({ file, year, storage }) => {
    const scopedProgressUpdated = progressUpdated;
    scopedProgressUpdated({
      details: 'File loading...',
    });
    const csvData = await file.text();
    scopedProgressUpdated({
      details: 'Parsing data started...',
    });
    const rows = await processor.parse(csvData);
    if (rows.type === 'error') {
      throw new Error(rows.message);
    }

    scopedProgressUpdated({
      details: 'Transforming data started...',
    });

    const batch = await processor.transform(rows.rows, year);

    scopedProgressUpdated({
      details: 'Uploading data started...',
    });

    switch (storage) {
      case 'firebase':
        return processor.upload.firebase(batch, {
          type: 'firebase',
          db: db,
          year: year,
          onProgress: (progress: Progress) => scopedProgressUpdated(progress),
        });
      case 'supabase':
        return processor.upload.supabase(batch, {
          type: 'supabase',
          db: supabase,
          year: year,
          onProgress: (progress: Progress) => scopedProgressUpdated(progress),
        });
      default:
        throw new Error('Unknown storage type: ' + storage);
    }
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
