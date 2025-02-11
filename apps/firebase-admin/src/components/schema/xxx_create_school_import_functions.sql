-- Establishment Types Import
CREATE OR REPLACE FUNCTION public.school_import_establishment_types(types jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO establishment_types (id, name, group_name, further_education_type)
  SELECT 
    x.id,
    x.name,
    x.group_name,           -- matches Insert type exactly
    x.further_education_type
  FROM jsonb_to_recordset(types) AS x(
    id text, 
    name text,
    group_name text,        -- matches Insert type exactly
    further_education_type text
  )
  WHERE x.id IS NOT NULL;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase Types Import
CREATE OR REPLACE FUNCTION public.school_import_phase_types(phases jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO phase_types (id, name, statutory_low_age, statutory_high_age)
  SELECT * FROM jsonb_to_recordset(phases) AS x(
    id text, name text, statutory_low_age integer, statutory_high_age integer
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    statutory_low_age = EXCLUDED.statutory_low_age,
    statutory_high_age = EXCLUDED.statutory_high_age;
    
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Locations Import
CREATE OR REPLACE FUNCTION public.school_import_locations(locations jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO locations (id, street, locality, town, county, postcode)
  SELECT * FROM jsonb_to_recordset(locations) AS x(
    id text, street text, locality text, town text, county text, postcode text
  )
  ON CONFLICT (id) DO UPDATE SET
    street = EXCLUDED.street,
    locality = EXCLUDED.locality,
    town = EXCLUDED.town,
    county = EXCLUDED.county,
    postcode = EXCLUDED.postcode;
    
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trusts Import
CREATE OR REPLACE FUNCTION public.school_import_trusts(trusts jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO trusts (id, name)
  SELECT * FROM jsonb_to_recordset(trusts) AS x(id text, name text)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Census Import
CREATE OR REPLACE FUNCTION public.school_import_census(census jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO school_census (
    id, school_urn, date, pupils, boys, girls, fsm_percentage, fsm
  )
  SELECT * FROM jsonb_to_recordset(census) AS x(
    id text, school_urn text, date text, pupils integer, boys integer,
    girls integer, fsm_percentage numeric, fsm integer
  )
  ON CONFLICT (id) DO UPDATE SET
    pupils = EXCLUDED.pupils,
    boys = EXCLUDED.boys,
    girls = EXCLUDED.girls,
    fsm_percentage = EXCLUDED.fsm_percentage,
    fsm = EXCLUDED.fsm;
    
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inspections Import
CREATE OR REPLACE FUNCTION public.school_import_inspections(inspections jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO school_inspections (
    id, school_urn, date, bso_inspectorate, inspectorate_name, 
    report, next_visit
  )
  SELECT * FROM jsonb_to_recordset(inspections) AS x(
    id text, school_urn text, date text, bso_inspectorate text,
    inspectorate_name text, report text, next_visit text
  )
  ON CONFLICT (id) DO UPDATE SET
    date = EXCLUDED.date,
    bso_inspectorate = EXCLUDED.bso_inspectorate,
    inspectorate_name = EXCLUDED.inspectorate_name,
    report = EXCLUDED.report,
    next_visit = EXCLUDED.next_visit;
    
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schools Import
CREATE OR REPLACE FUNCTION public.school_import_schools(schools jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO establishments (
    id, urn, name, type_id, phase_id, location_id, trust_id,
    status, gender, boarders, nursery_provision, official_sixth_form,
    capacity, head_title, head_first_name, head_last_name,
    telephone, website, sen_no_stat, props_name, country, site_name, qab_name
  )
  SELECT * FROM jsonb_to_recordset(schools) AS x(
    id text, urn text, name text, type_id text, phase_id text,
    location_id text, trust_id text, status text, gender text,
    boarders text, nursery_provision text, official_sixth_form text,
    capacity integer, head_title text, head_first_name text,
    head_last_name text, telephone text, website text,
    sen_no_stat text, props_name text, country text,
    site_name text, qab_name text
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type_id = EXCLUDED.type_id,
    phase_id = EXCLUDED.phase_id,
    location_id = EXCLUDED.location_id,
    trust_id = EXCLUDED.trust_id,
    status = EXCLUDED.status,
    gender = EXCLUDED.gender,
    boarders = EXCLUDED.boarders,
    nursery_provision = EXCLUDED.nursery_provision,
    official_sixth_form = EXCLUDED.official_sixth_form,
    capacity = EXCLUDED.capacity,
    head_title = EXCLUDED.head_title,
    head_first_name = EXCLUDED.head_first_name,
    head_last_name = EXCLUDED.head_last_name,
    telephone = EXCLUDED.telephone,
    website = EXCLUDED.website,
    sen_no_stat = EXCLUDED.sen_no_stat,
    props_name = EXCLUDED.props_name,
    country = EXCLUDED.country,
    site_name = EXCLUDED.site_name,
    qab_name = EXCLUDED.qab_name;
    
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.school_import_education_phases(phases jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO education_phases (
    id,
    name,
    statutory_age_low,
    statutory_age_high
  )
  SELECT * FROM jsonb_to_recordset(phases) AS x(
    id text,
    name text,
    statutory_age_low integer,
    statutory_age_high integer
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    statutory_age_low = EXCLUDED.statutory_age_low,
    statutory_age_high = EXCLUDED.statutory_age_high,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;