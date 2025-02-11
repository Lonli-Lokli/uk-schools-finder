-- Cleanup function
CREATE OR REPLACE FUNCTION public.school_cleanup_ks5_destinations(year_to_clean text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM ks5_destinations WHERE year = year_to_clean;
    DELETE FROM ks5_destinations_stats WHERE year = year_to_clean;
END;
$$;

-- Import function for main data
CREATE OR REPLACE FUNCTION public.school_import_ks5_destinations(destinations jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO ks5_destinations (
        id,
        urn,
        year,
        category,
        student_group,
        cohort_size,
        destinations_overall,
        destinations_education_total,
        destinations_education_further,
        destinations_education_higher,
        destinations_education_other,
        destinations_employment_total,
        destinations_employment_apprenticeships,
        destinations_other_not_sustained,
        destinations_other_not_captured,
        percentages_overall,
        percentages_education_total,
        percentages_education_further,
        percentages_education_higher,
        percentages_education_other,
        percentages_employment_total,
        percentages_employment_apprenticeships,
        percentages_other_not_sustained,
        percentages_other_not_captured,
        last_updated
    )
    SELECT 
        d.id,
        d.urn,
        d.year,
        d.category::destination_category,
        d.student_group::student_group,
        d.cohort_size,
        d.destinations_overall,
        d.destinations_education_total,
        d.destinations_education_further,
        d.destinations_education_higher,
        d.destinations_education_other,
        d.destinations_employment_total,
        d.destinations_employment_apprenticeships,
        d.destinations_other_not_sustained,
        d.destinations_other_not_captured,
        d.percentages_overall,
        d.percentages_education_total,
        d.percentages_education_further,
        d.percentages_education_higher,
        d.percentages_education_other,
        d.percentages_employment_total,
        d.percentages_employment_apprenticeships,
        d.percentages_other_not_sustained,
        d.percentages_other_not_captured,
        d.last_updated
    FROM jsonb_to_recordset(destinations) AS d(
        id text,
        urn text,
        year text,
        category text,
        student_group text,
        cohort_size integer,
        destinations_overall numeric,
        destinations_education_total numeric,
        destinations_education_further numeric,
        destinations_education_higher numeric,
        destinations_education_other numeric,
        destinations_employment_total numeric,
        destinations_employment_apprenticeships numeric,
        destinations_other_not_sustained numeric,
        destinations_other_not_captured numeric,
        percentages_overall numeric,
        percentages_education_total numeric,
        percentages_education_further numeric,
        percentages_education_higher numeric,
        percentages_education_other numeric,
        percentages_employment_total numeric,
        percentages_employment_apprenticeships numeric,
        percentages_other_not_sustained numeric,
        percentages_other_not_captured numeric,
        last_updated timestamptz
    )
    ON CONFLICT (urn, year, category, student_group) DO UPDATE SET
        cohort_size = EXCLUDED.cohort_size,
        destinations_overall = EXCLUDED.destinations_overall,
        destinations_education_total = EXCLUDED.destinations_education_total,
        destinations_education_further = EXCLUDED.destinations_education_further,
        destinations_education_higher = EXCLUDED.destinations_education_higher,
        destinations_education_other = EXCLUDED.destinations_education_other,
        destinations_employment_total = EXCLUDED.destinations_employment_total,
        destinations_employment_apprenticeships = EXCLUDED.destinations_employment_apprenticeships,
        destinations_other_not_sustained = EXCLUDED.destinations_other_not_sustained,
        destinations_other_not_captured = EXCLUDED.destinations_other_not_captured,
        percentages_overall = EXCLUDED.percentages_overall,
        percentages_education_total = EXCLUDED.percentages_education_total,
        percentages_education_further = EXCLUDED.percentages_education_further,
        percentages_education_higher = EXCLUDED.percentages_education_higher,
        percentages_education_other = EXCLUDED.percentages_education_other,
        percentages_employment_total = EXCLUDED.percentages_employment_total,
        percentages_employment_apprenticeships = EXCLUDED.percentages_employment_apprenticeships,
        percentages_other_not_sustained = EXCLUDED.percentages_other_not_sustained,
        percentages_other_not_captured = EXCLUDED.percentages_other_not_captured,
        last_updated = EXCLUDED.last_updated,
        updated_at = NOW();

    RETURN jsonb_build_object('success', true);
END;
$$;

-- Stats import function corrected to match KS5DestinationsStatsDm
CREATE OR REPLACE FUNCTION public.school_import_ks5_destinations_stats(stats jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO ks5_destinations_stats (
        id,
        year,
        higher_education,
        further_education,
        employment,
        last_updated
    )
    SELECT 
        s.id,
        s.year,
        s.higher_education,
        s.further_education,
        s.employment,
        NOW()
    FROM jsonb_to_recordset(stats) AS s(
        id text,
        year text,
        higher_education numeric,
        further_education numeric,
        employment numeric
    )
    ON CONFLICT (id) DO UPDATE SET
        year = EXCLUDED.year,
        higher_education = EXCLUDED.higher_education,
        further_education = EXCLUDED.further_education,
        employment = EXCLUDED.employment,
        last_updated = EXCLUDED.last_updated,
        updated_at = NOW();

    RETURN jsonb_build_object('success', true);
END;
$$;