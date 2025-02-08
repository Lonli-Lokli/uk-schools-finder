import { createClient } from '@supabase/supabase-js';

const initializeClientSupabase = () => {
  const supabase = createClient(
    import.meta.env['VITE_PUBLIC_SUPABASE_URL'],
    import.meta.env['VITE_PUBLIC_SUPABASE_KEY']
  );

  return {
    supabase,
  };
};

export { initializeClientSupabase };
