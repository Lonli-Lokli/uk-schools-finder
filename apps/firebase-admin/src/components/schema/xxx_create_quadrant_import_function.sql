CREATE OR REPLACE FUNCTION public.school_import_quadrants(
  bounding_boxes jsonb,
  quadrants jsonb,
  quadrant_schools jsonb
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Insert bounding boxes
  INSERT INTO school_bounding_boxes (
    id, ne_lat, ne_lng, ne_geohash, sw_lat, sw_lng, sw_geohash
  )
  SELECT * FROM jsonb_to_recordset(bounding_boxes) AS x(
    id text, ne_lat numeric, ne_lng numeric, ne_geohash text,
    sw_lat numeric, sw_lng numeric, sw_geohash text
  )
  ON CONFLICT (id) DO UPDATE SET
    ne_lat = EXCLUDED.ne_lat,
    ne_lng = EXCLUDED.ne_lng,
    ne_geohash = EXCLUDED.ne_geohash,
    sw_lat = EXCLUDED.sw_lat,
    sw_lng = EXCLUDED.sw_lng,
    sw_geohash = EXCLUDED.sw_geohash;

  -- Insert quadrants
  INSERT INTO school_quadrants (id, bounds_id, school_count)
  SELECT * FROM jsonb_to_recordset(quadrants) AS x(
    id text, bounds_id text, school_count integer
  )
  ON CONFLICT (id) DO UPDATE SET
    bounds_id = EXCLUDED.bounds_id,
    school_count = EXCLUDED.school_count;

  -- Insert quadrant schools
  INSERT INTO school_quadrant_schools (
    quadrant_id, urn, name, lat, lng, geohash
  )
  SELECT * FROM jsonb_to_recordset(quadrant_schools) AS x(
    quadrant_id text, urn text, name text,
    lat numeric, lng numeric, geohash text
  )
  ON CONFLICT (quadrant_id, urn) DO UPDATE SET
    name = EXCLUDED.name,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    geohash = EXCLUDED.geohash;

  result := jsonb_build_object(
    'success', true,
    'message', 'Successfully imported quadrants'
  );
  
  RETURN result;

EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 