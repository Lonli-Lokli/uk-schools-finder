CREATE OR REPLACE FUNCTION public.school_cleanup_quadrants() 
RETURNS void AS $$
BEGIN
  TRUNCATE TABLE quadrant_schools;
  TRUNCATE TABLE quadrants;
  TRUNCATE TABLE bounding_boxes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to import bounding boxes
CREATE OR REPLACE FUNCTION public.school_import_bounding_boxes(boxes jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO bounding_boxes (
    id, ne_lat, ne_lng, ne_geohash, sw_lat, sw_lng, sw_geohash
  )
  SELECT * FROM jsonb_to_recordset(boxes) AS x(
    id text, ne_lat numeric, ne_lng numeric, ne_geohash text,
    sw_lat numeric, sw_lng numeric, sw_geohash text
  )
  ON CONFLICT (id) DO UPDATE SET
    ne_lat = EXCLUDED.ne_lat,
    ne_lng = EXCLUDED.ne_lng,
    ne_geohash = EXCLUDED.ne_geohash,
    sw_lat = EXCLUDED.sw_lat,
    sw_lng = EXCLUDED.sw_lng,
    sw_geohash = EXCLUDED.sw_geohash,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- Function to import quadrants
CREATE OR REPLACE FUNCTION public.school_import_quadrants(quads jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO quadrants (
    id, bounds_id, level, school_count
  )
  SELECT * FROM jsonb_to_recordset(quads) AS x(
    id text, bounds_id text, level integer, school_count integer
  )
  ON CONFLICT (id) DO UPDATE SET
    bounds_id = EXCLUDED.bounds_id,
    level = EXCLUDED.level,
    school_count = EXCLUDED.school_count,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to import quadrant schools
CREATE OR REPLACE FUNCTION public.school_import_quadrant_schools(schools jsonb)
RETURNS jsonb AS $$
BEGIN
  -- Don't truncate, just insert/update
  INSERT INTO quadrant_schools (
    quadrant_id, urn, name, lat, lng, geohash
  )
  SELECT * FROM jsonb_to_recordset(schools) AS x(
    quadrant_id text, urn text, name text,
    lat numeric, lng numeric, geohash text
  )
  ON CONFLICT (quadrant_id, urn) DO UPDATE SET
    name = EXCLUDED.name,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    geohash = EXCLUDED.geohash,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;