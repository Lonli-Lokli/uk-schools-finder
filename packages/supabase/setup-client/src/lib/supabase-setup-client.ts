import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

let supabaseInstance: SupabaseClient<Database> = null!;

const initializeClientSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      import.meta.env['VITE_PUBLIC_SUPABASE_URL'],
      import.meta.env['VITE_PUBLIC_SUPABASE_KEY']
    );
  }

  return {
    supabase: supabaseInstance,
  };
};

export { initializeClientSupabase };
