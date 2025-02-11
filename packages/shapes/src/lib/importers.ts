import { Firestore } from 'firebase/firestore';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@lonli-lokli/supabase/setup-client';

export interface ImportResult {
  success: boolean;
  count: number;
  error?: string;
}

type BaseImportParams = {
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
  db: SupabaseClient<Database>;
};

export type ImportParams = FirebaseImportParams | SupabaseImportParams;
