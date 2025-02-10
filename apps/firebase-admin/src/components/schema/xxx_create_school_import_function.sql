CREATE OR REPLACE FUNCTION public.school_import_schools(
  schools jsonb,
  establishment_types jsonb,
  phase_types jsonb,
  locations jsonb,
  trusts jsonb,
  census jsonb,
  inspections jsonb
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Insert establishment types
  INSERT INTO establishment_types (id, name) 
  SELECT * FROM jsonb_to_recordset(establishment_types) AS x(id text, name text)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

  -- Insert phase types
  INSERT INTO phase_types (id, name, statutory_low_age, statutory_high_age)
  SELECT * FROM jsonb_to_recordset(phase_types) AS x(id text, name text, statutory_low_age integer, statutory_high_age integer)
  ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    statutory_low_age = EXCLUDED.statutory_low_age,
    statutory_high_age = EXCLUDED.statutory_high_age;

  -- Insert locations
  INSERT INTO locations (id, street, locality, town, county, postcode, coordinates, administrative)
  SELECT * FROM jsonb_to_recordset(locations) AS x(
    id text, street text, locality text, town text, county text, postcode text,
    coordinates jsonb, administrative jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    street = EXCLUDED.street,
    locality = EXCLUDED.locality,
    town = EXCLUDED.town,
    county = EXCLUDED.county,
    postcode = EXCLUDED.postcode,
    coordinates = EXCLUDED.coordinates,
    administrative = EXCLUDED.administrative;

  -- Insert trusts
  INSERT INTO trusts (id, name, sponsor_flag, sponsors, federation_flag, federations)
  SELECT * FROM jsonb_to_recordset(trusts) AS x(
    id text, name text, sponsor_flag text, sponsors text, federation_flag text, federations text
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    sponsor_flag = EXCLUDED.sponsor_flag,
    sponsors = EXCLUDED.sponsors,
    federation_flag = EXCLUDED.federation_flag,
    federations = EXCLUDED.federations;

  -- Insert schools
 INSERT INTO establishments (
    id, urn, name, type_id, phase_id, location_id, trust_id,
    status, gender, boarders, nursery_provision, official_sixth_form,
    capacity, head_title, head_first_name, head_last_name,
    telephone, website, sen_no_stat, props_name, country, site_name, qab_name
  )
  SELECT * FROM jsonb_to_recordset(schools) AS x(
    id text, urn text, name text, type_id text, phase_id text, location_id text, trust_id text,
    status text, gender text, boarders text, nursery_provision text, official_sixth_form text,
    capacity integer, head_title text, head_first_name text, head_last_name text,
    telephone text, website text, sen_no_stat integer, props_name text, country text, 
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

  -- Insert census data
  INSERT INTO school_census (id, school_urn, date, pupils, boys, girls, fsm_percentage, fsm)
  SELECT * FROM jsonb_to_recordset(census) AS x(
    id text, school_urn text, date text, pupils integer, boys integer, girls integer,
    fsm_percentage numeric, fsm integer
  )
  ON CONFLICT (id) DO UPDATE SET
    pupils = EXCLUDED.pupils,
    boys = EXCLUDED.boys,
    girls = EXCLUDED.girls,
    fsm_percentage = EXCLUDED.fsm_percentage,
    fsm = EXCLUDED.fsm;

  -- Insert inspection data
  INSERT INTO school_inspections (
    id, school_urn, date, bso_inspectorate, report, next_visit, inspectorate_name
  )
  SELECT * FROM jsonb_to_recordset(inspections) AS x(
    id text, school_urn text, date text, bso_inspectorate text,
    report text, next_visit text, inspectorate_name text
  )
  ON CONFLICT (id) DO UPDATE SET
    bso_inspectorate = EXCLUDED.bso_inspectorate,
    report = EXCLUDED.report,
    next_visit = EXCLUDED.next_visit,
    inspectorate_name = EXCLUDED.inspectorate_name;

  result := jsonb_build_object(
    'success', true,
    'message', 'Successfully imported all school data'
  );
  
  RETURN result;

EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;