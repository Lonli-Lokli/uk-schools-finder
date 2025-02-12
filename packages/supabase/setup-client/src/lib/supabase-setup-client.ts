import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@lonli-lokli/shapes';

// required for `next build` command
declare global {
  interface ImportMetaEnv {
    [key: string]: any;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

let supabaseInstance: SupabaseClient<Database> = null!;

const SUPABASE_CONFIG = {
  PUBLIC_SUPABASE_URL:
    typeof import.meta.env !== 'undefined'
      ? import.meta.env['VITE_PUBLIC_SUPABASE_URL']
      : process.env['NEXT_PUBLIC_SUPABASE_URL'],
  PUBLIC_SUPABASE_KEY:
    typeof import.meta.env !== 'undefined'
      ? import.meta.env['VITE_PUBLIC_SUPABASE_KEY']
      : process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
};
const initializeClientSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      SUPABASE_CONFIG.PUBLIC_SUPABASE_URL,
      SUPABASE_CONFIG.PUBLIC_SUPABASE_KEY
    );
  }

  return {
    supabase: supabaseInstance,
  };
};

export { initializeClientSupabase };
