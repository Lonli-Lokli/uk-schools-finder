import { csv2json } from 'csv42';
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
  for (let i = 0; i < result.length; i++) {
    const row = result[i];
    try {
      if (!shouldProcessRow || shouldProcessRow(row, i, result)) {
        const validatedRow = await schema.parseAsync(row);
        valid.push(validatedRow);
      }
    } catch (error) {
      errors.push({ row: i + 1, error: error as ZodError });
    }
  }

  return { valid: valid, errors };

  errors: {
    row: number;
    error: ZodError;
  }
  [];
}
