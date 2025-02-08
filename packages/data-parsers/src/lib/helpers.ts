import { csv2json } from 'csv42';
import { ZodAccelerator, ZodAcceleratorParser } from '@duplojs/zod-accelerator';
import { Firestore } from 'firebase/firestore';
import { z, ZodError } from 'zod';

export interface ImportResult {
  success: boolean;
  count: number;
  error?: string;
}
export interface ImportParams {
  db: Firestore;
  csvData: string;
  year: string;
  onProgress: (progress: {
    current?: number;
    total?: number;
    details: string;
  }) => void;
}

// Firestore batch limit is 500, but we might have large documents
export const BATCH_SIZE = 100;

const acceleratorCache = new WeakMap<z.ZodSchema<any>, ZodAcceleratorParser>();

function getAccelerator<T>(schema: z.ZodSchema<T>): ZodAcceleratorParser {
  let accelerator = acceleratorCache.get(schema);
  if (!accelerator) {
    accelerator = ZodAccelerator.build(schema);
    acceleratorCache.set(schema, accelerator);
  }
  return accelerator;
}

export async function parseAndValidateCSV<T>(
  content: string,
  schema: z.ZodSchema<T>,
  shouldProcessRow?: (
    row: Partial<T>,
    index: number,
    allRows: Partial<T>[]
  ) => boolean
) {
  const valid: T[] = [];
  const errors: { row: number; error: ZodError }[] = [];
  const result = csv2json<Partial<T>>(content);

  type ValidationResult =
    | { success: true; row: T }
    | { success: false; error: ZodError; rowIndex: number }
    | { success: false; skip: true };

  const accelerator = getAccelerator(schema);

  const validations = result.map((row, index) => {
    if (!shouldProcessRow || shouldProcessRow(row, index, result)) {
      return accelerator
        .parseAsync(row)
        .then((validRow) => ({ success: true as const, row: validRow }))
        .catch((error) => ({
          success: false as const,
          error,
          rowIndex: index,
        }));
    }
    return Promise.resolve({ success: false as const, skip: true as const });
  });

  const results = (await Promise.all(validations)) as ValidationResult[];

  results.forEach((result, index) => {
    if (result.success) {
      valid.push(result.row);
    } else if ('error' in result) {
      errors.push({ row: index + 1, error: result.error });
    }
  });

  return { valid, errors };
}
