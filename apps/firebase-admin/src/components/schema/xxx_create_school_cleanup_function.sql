CREATE OR REPLACE FUNCTION public.school_cleanup_import() 
RETURNS void AS $$
BEGIN
  TRUNCATE TABLE 
    school_inspections,
    school_census,
    establishments,
    trusts,
    locations,
    phase_types,
    establishment_types,
    education_phases
  CASCADE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;