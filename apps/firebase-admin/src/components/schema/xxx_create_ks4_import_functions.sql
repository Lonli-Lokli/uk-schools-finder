CREATE OR REPLACE FUNCTION public.school_import_ks4_results_main(ks4_results jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO ks4_results_main (
    id, urn, year,
    attainment8_score, progress8_score, progress8_lower, progress8_upper,
    basics94, basics95, ebacc_aps,
    total_pupils, disadvantaged_pupils,
    attainment8_score_disadvantaged, progress8_score_disadvantaged,
    attainment8_score_boys, attainment8_score_girls,
    progress8_score_boys, progress8_score_girls,
    low_prior_attainers, middle_prior_attainers, high_prior_attainers,
    ebacc_entry, ebacc_achievement_rate94, ebacc_achievement_rate95,
    last_updated, created_at, updated_at
  )
  SELECT * FROM jsonb_to_recordset(ks4_results) AS x(
    id text, urn text, year text,
    attainment8_score numeric, progress8_score numeric, progress8_lower numeric, progress8_upper numeric,
    basics94 numeric, basics95 numeric, ebacc_aps numeric,
    total_pupils integer, disadvantaged_pupils numeric,
    attainment8_score_disadvantaged numeric, progress8_score_disadvantaged numeric,
    attainment8_score_boys numeric, attainment8_score_girls numeric,
    progress8_score_boys numeric, progress8_score_girls numeric,
    low_prior_attainers numeric, middle_prior_attainers numeric, high_prior_attainers numeric,
    ebacc_entry numeric, ebacc_achievement_rate94 numeric, ebacc_achievement_rate95 numeric,
    last_updated timestamptz, created_at timestamptz, updated_at timestamptz
  )
  ON CONFLICT (id) DO UPDATE SET
    year = EXCLUDED.year,
    attainment8_score = EXCLUDED.attainment8_score,
    progress8_score = EXCLUDED.progress8_score,
    progress8_lower = EXCLUDED.progress8_lower,
    progress8_upper = EXCLUDED.progress8_upper,
    basics94 = EXCLUDED.basics94,
    basics95 = EXCLUDED.basics95,
    ebacc_aps = EXCLUDED.ebacc_aps,
    total_pupils = EXCLUDED.total_pupils,
    disadvantaged_pupils = EXCLUDED.disadvantaged_pupils,
    attainment8_score_disadvantaged = EXCLUDED.attainment8_score_disadvantaged,
    progress8_score_disadvantaged = EXCLUDED.progress8_score_disadvantaged,
    attainment8_score_boys = EXCLUDED.attainment8_score_boys,
    attainment8_score_girls = EXCLUDED.attainment8_score_girls,
    progress8_score_boys = EXCLUDED.progress8_score_boys,
    progress8_score_girls = EXCLUDED.progress8_score_girls,
    low_prior_attainers = EXCLUDED.low_prior_attainers,
    middle_prior_attainers = EXCLUDED.middle_prior_attainers,
    high_prior_attainers = EXCLUDED.high_prior_attainers,
    ebacc_entry = EXCLUDED.ebacc_entry,
    ebacc_achievement_rate94 = EXCLUDED.ebacc_achievement_rate94,
    ebacc_achievement_rate95 = EXCLUDED.ebacc_achievement_rate95,
    last_updated = EXCLUDED.last_updated,
    updated_at = EXCLUDED.updated_at;
    
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Demographics import function
CREATE OR REPLACE FUNCTION public.school_import_ks4_demographics(demographics jsonb)
RETURNS jsonb AS $$
DECLARE
    r record;
BEGIN
    FOR r IN SELECT * FROM jsonb_array_elements(demographics)
    LOOP
        BEGIN
            INSERT INTO public.ks4_results_demographics (
                id, urn, year,
                pupils_total, pupils_exam_cohort, pupils_boys, pupils_girls,
                characteristics_eal, characteristics_sen, characteristics_disadvantaged,
                last_updated,
                created_at,
                updated_at
            )
            SELECT 
                x.*,
                NOW() as created_at,
                NOW() as updated_at
            FROM jsonb_to_recordset(jsonb_build_array(r.value)) AS x(
                id text, urn text, year text,
                pupils_total numeric, pupils_exam_cohort numeric, pupils_boys numeric, pupils_girls numeric,
                characteristics_eal numeric, characteristics_sen numeric, characteristics_disadvantaged numeric,
                last_updated timestamptz
            )
            ON CONFLICT (id) DO UPDATE SET
                year = EXCLUDED.year,
                pupils_total = EXCLUDED.pupils_total,
                pupils_exam_cohort = EXCLUDED.pupils_exam_cohort,
                pupils_boys = EXCLUDED.pupils_boys,
                pupils_girls = EXCLUDED.pupils_girls,
                characteristics_eal = EXCLUDED.characteristics_eal,
                characteristics_sen = EXCLUDED.characteristics_sen,
                characteristics_disadvantaged = EXCLUDED.characteristics_disadvantaged,
                last_updated = EXCLUDED.last_updated,
                updated_at = NOW();
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Error processing demographics row: % with data: %', SQLERRM, r.value;
        END;
    END LOOP;

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Details import function
CREATE OR REPLACE FUNCTION public.school_import_ks4_details(details jsonb)
RETURNS jsonb AS $$
BEGIN
  INSERT INTO ks4_results_details (
    id, urn, year,
    -- Attainment 8
    attainment8_english, attainment8_maths, attainment8_ebacc, attainment8_open,
    -- Low prior
    attainment8_low_prior_overall, attainment8_low_prior_english,
    attainment8_low_prior_maths, attainment8_low_prior_ebacc, attainment8_low_prior_open,
    -- Middle prior
    attainment8_middle_prior_overall, attainment8_middle_prior_english,
    attainment8_middle_prior_maths, attainment8_middle_prior_ebacc, attainment8_middle_prior_open,
    -- High prior
    attainment8_high_prior_overall, attainment8_high_prior_english,
    attainment8_high_prior_maths, attainment8_high_prior_ebacc, attainment8_high_prior_open,
    -- Progress 8 subjects
    progress8_english_score, progress8_english_lower, progress8_english_upper,
    progress8_maths_score, progress8_maths_lower, progress8_maths_upper,
    progress8_ebacc_score, progress8_ebacc_lower, progress8_ebacc_upper,
    progress8_open_score, progress8_open_lower, progress8_open_upper,
    -- EBacc subjects
    ebacc_english_entry, ebacc_english_achieved94, ebacc_english_achieved95,
    ebacc_maths_entry, ebacc_maths_achieved94, ebacc_maths_achieved95,
    ebacc_science_entry, ebacc_science_achieved94, ebacc_science_achieved95,
    ebacc_humanities_entry, ebacc_humanities_achieved94, ebacc_humanities_achieved95,
    ebacc_languages_entry, ebacc_languages_achieved94, ebacc_languages_achieved95,
    -- Groups
    groups_disadvantaged_attainment8, groups_disadvantaged_progress8_score,
    groups_disadvantaged_progress8_lower, groups_disadvantaged_progress8_upper,
    groups_not_disadvantaged_attainment8, groups_not_disadvantaged_progress8_score,
    groups_not_disadvantaged_progress8_lower, groups_not_disadvantaged_progress8_upper,
    groups_eal_attainment8, groups_eal_progress8_score,
    groups_eal_progress8_lower, groups_eal_progress8_upper,
    groups_boys_attainment8, groups_boys_progress8_score,
    groups_boys_progress8_lower, groups_boys_progress8_upper,
    groups_girls_attainment8, groups_girls_progress8_score,
    groups_girls_progress8_lower, groups_girls_progress8_upper,
    -- Progress 8 Original
    progress8_original_score, progress8_original_lower, progress8_original_upper,
    -- Attainment 8 Open
    attainment8_open_gcse, attainment8_open_non_gcse,
    last_updated
  )
  SELECT * FROM jsonb_to_recordset(details) AS x(
    id text, urn text, year text,
    attainment8_english numeric, attainment8_maths numeric, attainment8_ebacc numeric, attainment8_open numeric,
    attainment8_low_prior_overall numeric, attainment8_low_prior_english numeric,
    attainment8_low_prior_maths numeric, attainment8_low_prior_ebacc numeric, attainment8_low_prior_open numeric,
    attainment8_middle_prior_overall numeric, attainment8_middle_prior_english numeric,
    attainment8_middle_prior_maths numeric, attainment8_middle_prior_ebacc numeric, attainment8_middle_prior_open numeric,
    attainment8_high_prior_overall numeric, attainment8_high_prior_english numeric,
    attainment8_high_prior_maths numeric, attainment8_high_prior_ebacc numeric, attainment8_high_prior_open numeric,
    progress8_english_score numeric, progress8_english_lower numeric, progress8_english_upper numeric,
    progress8_maths_score numeric, progress8_maths_lower numeric, progress8_maths_upper numeric,
    progress8_ebacc_score numeric, progress8_ebacc_lower numeric, progress8_ebacc_upper numeric,
    progress8_open_score numeric, progress8_open_lower numeric, progress8_open_upper numeric,
    ebacc_english_entry numeric, ebacc_english_achieved94 numeric, ebacc_english_achieved95 numeric,
    ebacc_maths_entry numeric, ebacc_maths_achieved94 numeric, ebacc_maths_achieved95 numeric,
    ebacc_science_entry numeric, ebacc_science_achieved94 numeric, ebacc_science_achieved95 numeric,
    ebacc_humanities_entry numeric, ebacc_humanities_achieved94 numeric, ebacc_humanities_achieved95 numeric,
    ebacc_languages_entry numeric, ebacc_languages_achieved94 numeric, ebacc_languages_achieved95 numeric,
    groups_disadvantaged_attainment8 numeric, groups_disadvantaged_progress8_score numeric,
    groups_disadvantaged_progress8_lower numeric, groups_disadvantaged_progress8_upper numeric,
    groups_not_disadvantaged_attainment8 numeric, groups_not_disadvantaged_progress8_score numeric,
    groups_not_disadvantaged_progress8_lower numeric, groups_not_disadvantaged_progress8_upper numeric,
    groups_eal_attainment8 numeric, groups_eal_progress8_score numeric,
    groups_eal_progress8_lower numeric, groups_eal_progress8_upper numeric,
    groups_boys_attainment8 numeric, groups_boys_progress8_score numeric,
    groups_boys_progress8_lower numeric, groups_boys_progress8_upper numeric,
    groups_girls_attainment8 numeric, groups_girls_progress8_score numeric,
    groups_girls_progress8_lower numeric, groups_girls_progress8_upper numeric,
    progress8_original_score numeric, progress8_original_lower numeric, progress8_original_upper numeric,
    attainment8_open_gcse numeric, attainment8_open_non_gcse numeric,
    last_updated timestamptz
  )
  ON CONFLICT (id) DO UPDATE SET
    year = EXCLUDED.year,
    attainment8_english = EXCLUDED.attainment8_english,
    attainment8_maths = EXCLUDED.attainment8_maths,
    attainment8_ebacc = EXCLUDED.attainment8_ebacc,
    attainment8_open = EXCLUDED.attainment8_open,
    attainment8_low_prior_overall = EXCLUDED.attainment8_low_prior_overall,
    attainment8_low_prior_english = EXCLUDED.attainment8_low_prior_english,
    attainment8_low_prior_maths = EXCLUDED.attainment8_low_prior_maths,
    attainment8_low_prior_ebacc = EXCLUDED.attainment8_low_prior_ebacc,
    attainment8_low_prior_open = EXCLUDED.attainment8_low_prior_open,
    attainment8_middle_prior_overall = EXCLUDED.attainment8_middle_prior_overall,
    attainment8_middle_prior_english = EXCLUDED.attainment8_middle_prior_english,
    attainment8_middle_prior_maths = EXCLUDED.attainment8_middle_prior_maths,
    attainment8_middle_prior_ebacc = EXCLUDED.attainment8_middle_prior_ebacc,
    attainment8_middle_prior_open = EXCLUDED.attainment8_middle_prior_open,
    attainment8_high_prior_overall = EXCLUDED.attainment8_high_prior_overall,
    attainment8_high_prior_english = EXCLUDED.attainment8_high_prior_english,
    attainment8_high_prior_maths = EXCLUDED.attainment8_high_prior_maths,
    attainment8_high_prior_ebacc = EXCLUDED.attainment8_high_prior_ebacc,
    attainment8_high_prior_open = EXCLUDED.attainment8_high_prior_open,
    progress8_english_score = EXCLUDED.progress8_english_score,
    progress8_english_lower = EXCLUDED.progress8_english_lower,
    progress8_english_upper = EXCLUDED.progress8_english_upper,
    progress8_maths_score = EXCLUDED.progress8_maths_score,
    progress8_maths_lower = EXCLUDED.progress8_maths_lower,
    progress8_maths_upper = EXCLUDED.progress8_maths_upper,
    progress8_ebacc_score = EXCLUDED.progress8_ebacc_score,
    progress8_ebacc_lower = EXCLUDED.progress8_ebacc_lower,
    progress8_ebacc_upper = EXCLUDED.progress8_ebacc_upper,
    progress8_open_score = EXCLUDED.progress8_open_score,
    progress8_open_lower = EXCLUDED.progress8_open_lower,
    progress8_open_upper = EXCLUDED.progress8_open_upper,
    ebacc_english_entry = EXCLUDED.ebacc_english_entry,
    ebacc_english_achieved94 = EXCLUDED.ebacc_english_achieved94,
    ebacc_english_achieved95 = EXCLUDED.ebacc_english_achieved95,
    ebacc_maths_entry = EXCLUDED.ebacc_maths_entry,
    ebacc_maths_achieved94 = EXCLUDED.ebacc_maths_achieved94,
    ebacc_maths_achieved95 = EXCLUDED.ebacc_maths_achieved95,
    ebacc_science_entry = EXCLUDED.ebacc_science_entry,
    ebacc_science_achieved94 = EXCLUDED.ebacc_science_achieved94,
    ebacc_science_achieved95 = EXCLUDED.ebacc_science_achieved95,
    ebacc_humanities_entry = EXCLUDED.ebacc_humanities_entry,
    ebacc_humanities_achieved94 = EXCLUDED.ebacc_humanities_achieved94,
    ebacc_humanities_achieved95 = EXCLUDED.ebacc_humanities_achieved95,
    ebacc_languages_entry = EXCLUDED.ebacc_languages_entry,
    ebacc_languages_achieved94 = EXCLUDED.ebacc_languages_achieved94,
    ebacc_languages_achieved95 = EXCLUDED.ebacc_languages_achieved95,
    groups_disadvantaged_attainment8 = EXCLUDED.groups_disadvantaged_attainment8,
    groups_disadvantaged_progress8_score = EXCLUDED.groups_disadvantaged_progress8_score,
    groups_disadvantaged_progress8_lower = EXCLUDED.groups_disadvantaged_progress8_lower,
    groups_disadvantaged_progress8_upper = EXCLUDED.groups_disadvantaged_progress8_upper,
    groups_not_disadvantaged_attainment8 = EXCLUDED.groups_not_disadvantaged_attainment8,
    groups_not_disadvantaged_progress8_score = EXCLUDED.groups_not_disadvantaged_progress8_score,
    groups_not_disadvantaged_progress8_lower = EXCLUDED.groups_not_disadvantaged_progress8_lower,
    groups_not_disadvantaged_progress8_upper = EXCLUDED.groups_not_disadvantaged_progress8_upper,
    groups_eal_attainment8 = EXCLUDED.groups_eal_attainment8,
    groups_eal_progress8_score = EXCLUDED.groups_eal_progress8_score,
    groups_eal_progress8_lower = EXCLUDED.groups_eal_progress8_lower,
    groups_eal_progress8_upper = EXCLUDED.groups_eal_progress8_upper,
    groups_boys_attainment8 = EXCLUDED.groups_boys_attainment8,
    groups_boys_progress8_score = EXCLUDED.groups_boys_progress8_score,
    groups_boys_progress8_lower = EXCLUDED.groups_boys_progress8_lower,
    groups_boys_progress8_upper = EXCLUDED.groups_boys_progress8_upper,
    groups_girls_attainment8 = EXCLUDED.groups_girls_attainment8,
    groups_girls_progress8_score = EXCLUDED.groups_girls_progress8_score,
    groups_girls_progress8_lower = EXCLUDED.groups_girls_progress8_lower,
    groups_girls_progress8_upper = EXCLUDED.groups_girls_progress8_upper,
    progress8_original_score = EXCLUDED.progress8_original_score,
    progress8_original_lower = EXCLUDED.progress8_original_lower,
    progress8_original_upper = EXCLUDED.progress8_original_upper,
    attainment8_open_gcse = EXCLUDED.attainment8_open_gcse,
    attainment8_open_non_gcse = EXCLUDED.attainment8_open_non_gcse,
    last_updated = EXCLUDED.last_updated,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;