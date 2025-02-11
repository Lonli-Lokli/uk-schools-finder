CREATE OR REPLACE FUNCTION public.school_cleanup_ks4(year_to_clean text) 
RETURNS void AS $$
BEGIN
  -- Clean up KS4 tables for specific year
  DELETE FROM ks4_results_main WHERE year = year_to_clean;
  DELETE FROM ks4_results_demographics WHERE year = year_to_clean;
  DELETE FROM ks4_results_details WHERE year = year_to_clean;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;