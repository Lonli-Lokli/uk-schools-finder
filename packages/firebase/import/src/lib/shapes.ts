import { csv2json } from 'csv42';
import { Firestore } from 'firebase/firestore';
import { z, ZodError } from 'zod';

export interface ImportResult {
  success: boolean;
  count: number;
  errors?: string[];
}
export interface ImportParams {
  db: Firestore;
  csvData: string;
  year: string;
}

export const BATCH_SIZE = 500; // Firestore batch limit is 500

export function parseAndValidateCSV<T>(
  content: string,
  schema: z.ZodSchema<T>
) {
  return new Promise<{
    valid: T[];
    errors: { row: number; error: ZodError }[];
  }>((resolve) => {
    const valid: T[] = [];
    const errors: { row: number; error: ZodError }[] = [];

    const result = csv2json(content);
    result.forEach((row, index) => {
      try {
        const validatedRow = schema.parse(row);
        valid.push(validatedRow);
      } catch (error) {
        errors.push({ row: index + 1, error: error as ZodError });
      }
    });

    resolve({ valid: valid, errors });
  });
}
