import { Firestore } from 'firebase/firestore';
import { SupabaseClient } from '@supabase/supabase-js';

export interface ImportResult {
  success: boolean;
  count: number;
  error?: string;
}

type BaseImportParams = {
  csvData: string;
  year: string;
  onProgress: (progress: {
    current?: number;
    total?: number;
    details: string;
  }) => void;
};
export type FirebaseImportParams = BaseImportParams & {
  type: 'firebase';
  db: Firestore;
};

export type SupabaseImportParams = BaseImportParams & {
  type: 'supabase';
  db: SupabaseClient;
};

export type ImportParams = FirebaseImportParams | SupabaseImportParams;
