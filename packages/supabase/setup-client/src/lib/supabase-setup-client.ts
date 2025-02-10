import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

const initializeClientSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      import.meta.env['VITE_PUBLIC_SUPABASE_URL'],
      import.meta.env['VITE_PUBLIC_SUPABASE_KEY']
    );
  }

  return {
    supabase: supabaseInstance,
  };
};

export { initializeClientSupabase };
