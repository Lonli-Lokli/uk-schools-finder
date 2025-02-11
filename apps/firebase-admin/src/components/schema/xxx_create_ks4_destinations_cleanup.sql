CREATE OR REPLACE FUNCTION public.school_cleanup_ks4_destinations(year_to_clean text)
RETURNS void AS $$
BEGIN
  DELETE FROM ks4_destinations_details WHERE year = year_to_clean;
  DELETE FROM ks4_destinations_main WHERE year = year_to_clean;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;