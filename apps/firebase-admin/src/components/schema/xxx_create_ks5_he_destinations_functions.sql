-- Cleanup function
CREATE OR REPLACE FUNCTION public.school_cleanup_ks5_he_destinations(year_to_clean text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM ks5_he_destinations WHERE year = year_to_clean;
END;
$$;

-- Import function
CREATE OR REPLACE FUNCTION public.school_import_ks5_he_destinations(destinations jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO ks5_he_destinations (
        id,
        school_urn,
        year,
        oxbridge_percentage,
        russell_percentage,
        top_third_percentage,
        higher_technical_percentage,
        disadvantaged_oxbridge_percentage,
        disadvantaged_russell_percentage,
        disadvantaged_top_third_percentage,
        disadvantaged_higher_technical_percentage,
        last_updated
    )
    SELECT 
        d.id,
        d.school_urn,
        d.year,
        d.oxbridge_percentage,
        d.russell_percentage,
        d.top_third_percentage,
        d.higher_technical_percentage,
        d.disadvantaged_oxbridge_percentage,
        d.disadvantaged_russell_percentage,
        d.disadvantaged_top_third_percentage,
        d.disadvantaged_higher_technical_percentage,
        d.last_updated
    FROM jsonb_to_recordset(destinations) AS d(
        id text,
        school_urn text,
        year text,
        oxbridge_percentage numeric,
        russell_percentage numeric,
        top_third_percentage numeric,
        higher_technical_percentage numeric,
        disadvantaged_oxbridge_percentage numeric,
        disadvantaged_russell_percentage numeric,
        disadvantaged_top_third_percentage numeric,
        disadvantaged_higher_technical_percentage numeric,
        last_updated timestamptz
    )
    ON CONFLICT (id) DO UPDATE SET
        school_urn = EXCLUDED.school_urn,
        year = EXCLUDED.year,
        oxbridge_percentage = EXCLUDED.oxbridge_percentage,
        russell_percentage = EXCLUDED.russell_percentage,
        top_third_percentage = EXCLUDED.top_third_percentage,
        higher_technical_percentage = EXCLUDED.higher_technical_percentage,
        disadvantaged_oxbridge_percentage = EXCLUDED.disadvantaged_oxbridge_percentage,
        disadvantaged_russell_percentage = EXCLUDED.disadvantaged_russell_percentage,
        disadvantaged_top_third_percentage = EXCLUDED.disadvantaged_top_third_percentage,
        disadvantaged_higher_technical_percentage = EXCLUDED.disadvantaged_higher_technical_percentage,
        last_updated = EXCLUDED.last_updated,
        updated_at = NOW();

    RETURN jsonb_build_object('success', true);
END;
$$;