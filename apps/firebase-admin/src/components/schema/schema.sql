-- Enable PostGIS if not enabled
CREATE EXTENSION IF NOT EXISTS postgis;
alter database postgres set statement_timeout TO '120s';

------------------------------------------
-- Core School/Establishment Tables
------------------------------------------

CREATE TABLE establishment_types (
    id text PRIMARY KEY,
    name text NOT NULL,
    group_name text NOT NULL,
    further_education_type text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE phase_types (
    id text PRIMARY KEY,
    name text NOT NULL,
    statutory_low_age integer,
    statutory_high_age integer,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE trusts (
    id text PRIMARY KEY,
    name text NOT NULL,
    sponsor_flag text,
    sponsors text,
    federation_flag text,
    federations text,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE local_authorities (
    code text PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE locations (
    id text PRIMARY KEY,
    -- Street address
    street text,
    locality text,
    address3 text,
    town text,
    county text,
    postcode text,
    
    -- Coordinates
    easting numeric,
    northing numeric,
    uprn numeric,
    latitude numeric,
    longitude numeric,
    geohash text,
    
    -- Administrative data
    la_code integer,
    la_name text,
    gss_la_code text,
    msoa_code text,
    msoa_name text,
    lsoa_code text,
    lsoa_name text,
    ward text,
    district text,
    constituency text,
    urban_rural text,
    gor text,
    
    -- Derived spatial column
    coordinates geography(Point, 4326) GENERATED ALWAYS AS (
        CASE 
            WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
            THEN ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography 
            ELSE NULL 
        END
    ) STORED,
    
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT locations_postcode_format_check 
        CHECK (postcode ~ '^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$'),
    CONSTRAINT locations_coordinates_check 
        CHECK (
            (latitude IS NULL OR (latitude >= 49 AND latitude <= 61)) AND
            (longitude IS NULL OR (longitude >= -8 AND longitude <= 2))
        ),
    CONSTRAINT locations_gss_la_code_format_check 
        CHECK (gss_la_code ~ '^E\d{8}$')
);

CREATE TABLE establishments (
    id text PRIMARY KEY,
    urn text NOT NULL UNIQUE,
    name text,
    establishment_number integer,
    ukprn text,
    fehe_id text,
    ch_number text,

    -- References
    type_id text REFERENCES establishment_types(id),
    phase_id text REFERENCES phase_types(id),
    location_id text REFERENCES locations(id),
    trust_id text REFERENCES trusts(id),
    lea_code text REFERENCES local_authorities(code),

    -- Status
    status text,
    open_date text,
    close_date text,
    open_reason text,
    close_reason text,

    -- Characteristics
    gender text,
    boarders text,
    nursery_provision text,
    official_sixth_form text,
    capacity integer,
    special_classes text,

    -- Contact info
    website text,
    telephone text,
    head_title text,
    head_first_name text,
    head_last_name text,
    head_job_title text,

    -- Additional fields
    sen_no_stat text,
    props_name text,
    country text,
    site_name text,
    qab_name text,
    establishment_accredited text,
    qab_report text,
    accreditation_expiry_date text,
    last_changed text,

    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    CONSTRAINT establishments_urn_format_check 
        CHECK (urn ~ '^\d{1,6}$'),
    CONSTRAINT establishments_gender_check 
        CHECK (gender IN ('mixed', 'boys', 'girls', NULL)),
    CONSTRAINT establishments_timestamps_check 
        CHECK (updated_at >= created_at)
);

------------------------------------------
-- Census and Inspection Tables
------------------------------------------

CREATE TABLE school_census (
    id text PRIMARY KEY,
    school_urn text NOT NULL REFERENCES establishments(urn),
    date text NOT NULL,
    pupils integer,
    boys integer,
    girls integer,
    fsm_percentage numeric,
    fsm integer,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT school_census_percentage_check 
        CHECK (fsm_percentage >= 0 AND fsm_percentage <= 100)
);

CREATE TABLE school_inspections (
    id text PRIMARY KEY,
    school_urn text NOT NULL REFERENCES establishments(urn),
    date text NOT NULL,
    bso_inspectorate text,
    report text,
    next_visit text,
    inspectorate_name text,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

------------------------------------------
-- Geographic/Spatial Tables
------------------------------------------

CREATE TABLE bounding_boxes (
    id text PRIMARY KEY,
    ne_lat numeric NOT NULL,
    ne_lng numeric NOT NULL,
    ne_geohash text,
    sw_lat numeric NOT NULL,
    sw_lng numeric NOT NULL,
    sw_geohash text,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT bounding_boxes_coordinates_check 
        CHECK (
            ne_lat > sw_lat AND
            ne_lat BETWEEN 49 AND 61 AND
            sw_lat BETWEEN 49 AND 61 AND
            ne_lng BETWEEN -8 AND 2 AND
            sw_lng BETWEEN -8 AND 2
        )
);

CREATE TABLE quadrants (
    id text PRIMARY KEY,
    bounds_id text NOT NULL REFERENCES bounding_boxes(id),
    school_count integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT quadrants_school_count_check 
        CHECK (school_count >= 0)
);

CREATE TABLE quadrant_schools (
    quadrant_id text NOT NULL REFERENCES quadrants(id),
    urn text NOT NULL REFERENCES establishments(urn),
    name text NOT NULL,
    lat numeric NOT NULL,
    lng numeric NOT NULL,
    geohash text,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (quadrant_id, urn),
    
    CONSTRAINT quadrant_schools_coordinates_check 
        CHECK (
            lat BETWEEN 49 AND 61 AND
            lng BETWEEN -8 AND 2
        )
);

------------------------------------------
-- KS4 Results and Destinations Tables
------------------------------------------

CREATE TABLE ks4_results_main (
    id text PRIMARY KEY,
    urn text NOT NULL REFERENCES establishments(urn),
    year text NOT NULL,
    -- Core metrics
    attainment8_score numeric,
    progress8_score numeric,
    progress8_lower numeric,
    progress8_upper numeric,
    -- English and Maths
    basics94 numeric,
    basics95 numeric,
    ebacc_aps numeric,
    -- Student numbers
    total_pupils integer,
    disadvantaged_pupils integer,
    -- Disadvantaged gaps
    attainment8_score_disadvantaged numeric,
    progress8_score_disadvantaged numeric,
    -- Gender gaps
    attainment8_score_boys numeric,
    attainment8_score_girls numeric,
    progress8_score_boys numeric,
    progress8_score_girls numeric,
    -- Prior attainment
    low_prior_attainers numeric,
    middle_prior_attainers numeric,
    high_prior_attainers numeric,
    -- EBacc entries
    ebacc_entry numeric,
    ebacc_achievement_rate94 numeric,
    ebacc_achievement_rate95 numeric,
    last_updated timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT ks4_results_main_year_check CHECK (year ~ '^\d{4}$'),
    CONSTRAINT ks4_results_main_percentage_check CHECK (
        (basics94 IS NULL OR (basics94 >= 0 AND basics94 <= 100)) AND
        (basics95 IS NULL OR (basics95 >= 0 AND basics95 <= 100)) AND
        (ebacc_entry IS NULL OR (ebacc_entry >= 0 AND ebacc_entry <= 100))
    )
);

CREATE TABLE ks4_destinations (
    id text PRIMARY KEY,
    urn text NOT NULL REFERENCES establishments(urn),
    year text NOT NULL,
    sustained numeric,
    education numeric,
    employment numeric,
    apprenticeships numeric,
    further_education numeric,
    sixth_form numeric,
    sixth_form_college numeric,
    disadvantaged_sustained numeric,
    non_disadvantaged_sustained numeric,
    cohort_size integer,
    last_updated timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT ks4_destinations_year_check CHECK (year ~ '^\d{4}$'),
    CONSTRAINT ks4_destinations_percentage_check CHECK (
        (sustained IS NULL OR (sustained >= 0 AND sustained <= 100)) AND
        (education IS NULL OR (education >= 0 AND education <= 100)) AND
        (employment IS NULL OR (employment >= 0 AND employment <= 100))
    )
);

------------------------------------------
-- KS5 Results and Destinations Tables
------------------------------------------

CREATE TABLE ks5_destinations (
    id text PRIMARY KEY,
    urn text NOT NULL REFERENCES establishments(urn),
    year text NOT NULL,
    
    -- Total - All Students
    total_all_cohort_size integer,
    total_all_destinations_overall numeric,
    total_all_destinations_education_total numeric,
    total_all_destinations_education_further numeric,
    total_all_destinations_education_higher numeric,
    total_all_destinations_education_other numeric,
    total_all_destinations_employment_total numeric,
    total_all_destinations_employment_apprenticeships numeric,
    total_all_destinations_other_not_sustained numeric,
    total_all_destinations_other_not_captured numeric,
    total_all_percentages_overall numeric,
    total_all_percentages_education_total numeric,
    total_all_percentages_education_further numeric,
    total_all_percentages_education_higher numeric,
    total_all_percentages_education_other numeric,
    total_all_percentages_employment_total numeric,
    total_all_percentages_employment_apprenticeships numeric,
    total_all_percentages_other_not_sustained numeric,
    total_all_percentages_other_not_captured numeric,

    -- Total - Disadvantaged
    total_disadvantaged_cohort_size integer,
    total_disadvantaged_destinations_overall numeric,
    total_disadvantaged_destinations_education_total numeric,
    total_disadvantaged_destinations_education_further numeric,
    total_disadvantaged_destinations_education_higher numeric,
    total_disadvantaged_destinations_education_other numeric,
    total_disadvantaged_destinations_employment_total numeric,
    total_disadvantaged_destinations_employment_apprenticeships numeric,
    total_disadvantaged_destinations_other_not_sustained numeric,
    total_disadvantaged_destinations_other_not_captured numeric,
    total_disadvantaged_percentages_overall numeric,
    total_disadvantaged_percentages_education_total numeric,
    total_disadvantaged_percentages_education_further numeric,
    total_disadvantaged_percentages_education_higher numeric,
    total_disadvantaged_percentages_education_other numeric,
    total_disadvantaged_percentages_employment_total numeric,
    total_disadvantaged_percentages_employment_apprenticeships numeric,
    total_disadvantaged_percentages_other_not_sustained numeric,
    total_disadvantaged_percentages_other_not_captured numeric,

    -- Total - Non-Disadvantaged
    total_non_disadvantaged_cohort_size integer,
    total_non_disadvantaged_destinations_overall numeric,
    total_non_disadvantaged_destinations_education_total numeric,
    total_non_disadvantaged_destinations_education_further numeric,
    total_non_disadvantaged_destinations_education_higher numeric,
    total_non_disadvantaged_destinations_education_other numeric,
    total_non_disadvantaged_destinations_employment_total numeric,
    total_non_disadvantaged_destinations_employment_apprenticeships numeric,
    total_non_disadvantaged_destinations_other_not_sustained numeric,
    total_non_disadvantaged_destinations_other_not_captured numeric,
    total_non_disadvantaged_percentages_overall numeric,
    total_non_disadvantaged_percentages_education_total numeric,
    total_non_disadvantaged_percentages_education_further numeric,
    total_non_disadvantaged_percentages_education_higher numeric,
    total_non_disadvantaged_percentages_education_other numeric,
    total_non_disadvantaged_percentages_employment_total numeric,
    total_non_disadvantaged_percentages_employment_apprenticeships numeric,
    total_non_disadvantaged_percentages_other_not_sustained numeric,
    total_non_disadvantaged_percentages_other_not_captured numeric,

    -- Level 3 - All Students
    level3_all_cohort_size integer,
    level3_all_destinations_overall numeric,
    level3_all_destinations_education_total numeric,
    level3_all_destinations_education_further numeric,
    level3_all_destinations_education_higher numeric,
    level3_all_destinations_education_other numeric,
    level3_all_destinations_employment_total numeric,
    level3_all_destinations_employment_apprenticeships numeric,
    level3_all_destinations_other_not_sustained numeric,
    level3_all_destinations_other_not_captured numeric,
    level3_all_percentages_overall numeric,
    level3_all_percentages_education_total numeric,
    level3_all_percentages_education_further numeric,
    level3_all_percentages_education_higher numeric,
    level3_all_percentages_education_other numeric,
    level3_all_percentages_employment_total numeric,
    level3_all_percentages_employment_apprenticeships numeric,
    level3_all_percentages_other_not_sustained numeric,
    level3_all_percentages_other_not_captured numeric,

    -- Level 3 - Disadvantaged
    level3_disadvantaged_cohort_size integer,
    level3_disadvantaged_destinations_overall numeric,
    level3_disadvantaged_destinations_education_total numeric,
    level3_disadvantaged_destinations_education_further numeric,
    level3_disadvantaged_destinations_education_higher numeric,
    level3_disadvantaged_destinations_education_other numeric,
    level3_disadvantaged_destinations_employment_total numeric,
    level3_disadvantaged_destinations_employment_apprenticeships numeric,
    level3_disadvantaged_destinations_other_not_sustained numeric,
    level3_disadvantaged_destinations_other_not_captured numeric,
    level3_disadvantaged_percentages_overall numeric,
    level3_disadvantaged_percentages_education_total numeric,
    level3_disadvantaged_percentages_education_further numeric,
    level3_disadvantaged_percentages_education_higher numeric,
    level3_disadvantaged_percentages_education_other numeric,
    level3_disadvantaged_percentages_employment_total numeric,
    level3_disadvantaged_percentages_employment_apprenticeships numeric,
    level3_disadvantaged_percentages_other_not_sustained numeric,
    level3_disadvantaged_percentages_other_not_captured numeric,

    -- Level 3 - Non-Disadvantaged
    level3_non_disadvantaged_cohort_size integer,
    level3_non_disadvantaged_destinations_overall numeric,
    level3_non_disadvantaged_destinations_education_total numeric,
    level3_non_disadvantaged_destinations_education_further numeric,
    level3_non_disadvantaged_destinations_education_higher numeric,
    level3_non_disadvantaged_destinations_education_other numeric,
    level3_non_disadvantaged_destinations_employment_total numeric,
    level3_non_disadvantaged_destinations_employment_apprenticeships numeric,
    level3_non_disadvantaged_destinations_other_not_sustained numeric,
    level3_non_disadvantaged_destinations_other_not_captured numeric,
    level3_non_disadvantaged_percentages_overall numeric,
    level3_non_disadvantaged_percentages_education_total numeric,
    level3_non_disadvantaged_percentages_education_further numeric,
    level3_non_disadvantaged_percentages_education_higher numeric,
    level3_non_disadvantaged_percentages_education_other numeric,
    level3_non_disadvantaged_percentages_employment_total numeric,
    level3_non_disadvantaged_percentages_employment_apprenticeships numeric,
    level3_non_disadvantaged_percentages_other_not_sustained numeric,
    level3_non_disadvantaged_percentages_other_not_captured numeric,

    -- Level 2 - All Students (same structure as Level 3)
    level2_all_cohort_size integer,
    level2_all_destinations_overall numeric,
    level2_all_destinations_education_total numeric,
    level2_all_destinations_education_further numeric,
    level2_all_destinations_education_higher numeric,
    level2_all_destinations_education_other numeric,
    level2_all_destinations_employment_total numeric,
    level2_all_destinations_employment_apprenticeships numeric,
    level2_all_destinations_other_not_sustained numeric,
    level2_all_destinations_other_not_captured numeric,
    level2_all_percentages_overall numeric,
    level2_all_percentages_education_total numeric,
    level2_all_percentages_education_further numeric,
    level2_all_percentages_education_higher numeric,
    level2_all_percentages_education_other numeric,
    level2_all_percentages_employment_total numeric,
    level2_all_percentages_employment_apprenticeships numeric,
    level2_all_percentages_other_not_sustained numeric,
    level2_all_percentages_other_not_captured numeric,

    -- Level 2 - Disadvantaged
    level2_disadvantaged_cohort_size integer,
    level2_disadvantaged_destinations_overall numeric,
    level2_disadvantaged_destinations_education_total numeric,
    level2_disadvantaged_destinations_education_further numeric,
    level2_disadvantaged_destinations_education_higher numeric,
    level2_disadvantaged_destinations_education_other numeric,
    level2_disadvantaged_destinations_employment_total numeric,
    level2_disadvantaged_destinations_employment_apprenticeships numeric,
    level2_disadvantaged_destinations_other_not_sustained numeric,
    level2_disadvantaged_destinations_other_not_captured numeric,
    level2_disadvantaged_percentages_overall numeric,
    level2_disadvantaged_percentages_education_total numeric,
    level2_disadvantaged_percentages_education_further numeric,
    level2_disadvantaged_percentages_education_higher numeric,
    level2_disadvantaged_percentages_education_other numeric,
    level2_disadvantaged_percentages_employment_total numeric,
    level2_disadvantaged_percentages_employment_apprenticeships numeric,
    level2_disadvantaged_percentages_other_not_sustained numeric,
    level2_disadvantaged_percentages_other_not_captured numeric,

    -- Level 2 - Non-Disadvantaged
    level2_non_disadvantaged_cohort_size integer,
    level2_non_disadvantaged_destinations_overall numeric,
    level2_non_disadvantaged_destinations_education_total numeric,
    level2_non_disadvantaged_destinations_education_further numeric,
    level2_non_disadvantaged_destinations_education_higher numeric,
    level2_non_disadvantaged_destinations_education_other numeric,
    level2_non_disadvantaged_destinations_employment_total numeric,
    level2_non_disadvantaged_destinations_employment_apprenticeships numeric,
    level2_non_disadvantaged_destinations_other_not_sustained numeric,
    level2_non_disadvantaged_destinations_other_not_captured numeric,
    level2_non_disadvantaged_percentages_overall numeric,
    level2_non_disadvantaged_percentages_education_total numeric,
    level2_non_disadvantaged_percentages_education_further numeric,
    level2_non_disadvantaged_percentages_education_higher numeric,
    level2_non_disadvantaged_percentages_education_other numeric,
    level2_non_disadvantaged_percentages_employment_total numeric,
    level2_non_disadvantaged_percentages_employment_apprenticeships numeric,
    level2_non_disadvantaged_percentages_other_not_sustained numeric,
    level2_non_disadvantaged_percentages_other_not_captured numeric,

    -- Other Levels - All Students (same structure as Level 3)
    other_levels_all_cohort_size integer,
    other_levels_all_destinations_overall numeric,
    other_levels_all_destinations_education_total numeric,
    other_levels_all_destinations_education_further numeric,
    other_levels_all_destinations_education_higher numeric,
    other_levels_all_destinations_education_other numeric,
    other_levels_all_destinations_employment_total numeric,
    other_levels_all_destinations_employment_apprenticeships numeric,
    other_levels_all_destinations_other_not_sustained numeric,
    other_levels_all_destinations_other_not_captured numeric,
    other_levels_all_percentages_overall numeric,
    other_levels_all_percentages_education_total numeric,
    other_levels_all_percentages_education_further numeric,
    other_levels_all_percentages_education_higher numeric,
    other_levels_all_percentages_education_other numeric,
    other_levels_all_percentages_employment_total numeric,
    other_levels_all_percentages_employment_apprenticeships numeric,
    other_levels_all_percentages_other_not_sustained numeric,
    other_levels_all_percentages_other_not_captured numeric,

    -- Other Levels - Disadvantaged
    other_levels_disadvantaged_cohort_size integer,
    other_levels_disadvantaged_destinations_overall numeric,
    other_levels_disadvantaged_destinations_education_total numeric,
    other_levels_disadvantaged_destinations_education_further numeric,
    other_levels_disadvantaged_destinations_education_higher numeric,
    other_levels_disadvantaged_destinations_education_other numeric,
    other_levels_disadvantaged_destinations_employment_total numeric,
    other_levels_disadvantaged_destinations_employment_apprenticeships numeric,
    other_levels_disadvantaged_destinations_other_not_sustained numeric,
    other_levels_disadvantaged_destinations_other_not_captured numeric,
    other_levels_disadvantaged_percentages_overall numeric,
    other_levels_disadvantaged_percentages_education_total numeric,
    other_levels_disadvantaged_percentages_education_further numeric,
    other_levels_disadvantaged_percentages_education_higher numeric,
    other_levels_disadvantaged_percentages_education_other numeric,
    other_levels_disadvantaged_percentages_employment_total numeric,
    other_levels_disadvantaged_percentages_employment_apprenticeships numeric,
    other_levels_disadvantaged_percentages_other_not_sustained numeric,
    other_levels_disadvantaged_percentages_other_not_captured numeric,

    -- Other Levels - Non-Disadvantaged
    other_levels_non_disadvantaged_cohort_size integer,
    other_levels_non_disadvantaged_destinations_overall numeric,
    other_levels_non_disadvantaged_destinations_education_total numeric,
    other_levels_non_disadvantaged_destinations_education_further numeric,
    other_levels_non_disadvantaged_destinations_education_higher numeric,
    other_levels_non_disadvantaged_destinations_education_other numeric,
    other_levels_non_disadvantaged_destinations_employment_total numeric,
    other_levels_non_disadvantaged_destinations_employment_apprenticeships numeric,
    other_levels_non_disadvantaged_destinations_other_not_sustained numeric,
    other_levels_non_disadvantaged_destinations_other_not_captured numeric,
    other_levels_non_disadvantaged_percentages_overall numeric,
    other_levels_non_disadvantaged_percentages_education_total numeric,
    other_levels_non_disadvantaged_percentages_education_further numeric,
    other_levels_non_disadvantaged_percentages_education_higher numeric,
    other_levels_non_disadvantaged_percentages_education_other numeric,
    other_levels_non_disadvantaged_percentages_employment_total numeric,
    other_levels_non_disadvantaged_percentages_employment_apprenticeships numeric,
    other_levels_non_disadvantaged_percentages_other_not_sustained numeric,
    other_levels_non_disadvantaged_percentages_other_not_captured numeric,

    last_updated timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT ks5_destinations_year_check CHECK (year ~ '^\d{4}$'),
    CONSTRAINT ks5_destinations_percentage_check CHECK (
        (total_all_percentages_overall IS NULL OR 
         (total_all_percentages_overall >= 0 AND total_all_percentages_overall <= 100))
    )
);

CREATE TABLE ks5_he_destinations (
    id text PRIMARY KEY,
    school_urn text NOT NULL REFERENCES establishments(urn),
    year text NOT NULL,
    -- Universities
    oxbridge_percentage numeric,
    russell_percentage numeric,
    top_third_percentage numeric,
    higher_technical_percentage numeric,
    -- Disadvantaged
    disadvantaged_oxbridge_percentage numeric,
    disadvantaged_russell_percentage numeric,
    disadvantaged_top_third_percentage numeric,
    disadvantaged_higher_technical_percentage numeric,
    last_updated timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    
    CONSTRAINT ks5_he_destinations_year_check CHECK (year ~ '^\d{4}$'),
    CONSTRAINT ks5_he_destinations_percentage_check CHECK (
        (oxbridge_percentage IS NULL OR (oxbridge_percentage >= 0 AND oxbridge_percentage <= 100)) AND
        (russell_percentage IS NULL OR (russell_percentage >= 0 AND russell_percentage <= 100)) AND
        (top_third_percentage IS NULL OR (top_third_percentage >= 0 AND top_third_percentage <= 100))
    )
);

CREATE TABLE regions (
    id text PRIMARY KEY,
    name text NOT NULL,
    sub_regions jsonb NOT NULL, -- Keep as JSONB due to dynamic lea_code keys
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Timestamp constraint
ALTER TABLE regions 
    ADD CONSTRAINT regions_timestamps_check 
    CHECK (updated_at >= created_at);


-- Create tables for quadrants, bounding boxes, and schools
CREATE TABLE IF NOT EXISTS school_bounding_boxes (
    id text PRIMARY KEY,
    ne_lat numeric NOT NULL,
    ne_lng numeric NOT NULL,
    ne_geohash text NOT NULL,
    sw_lat numeric NOT NULL,
    sw_lng numeric NOT NULL,
    sw_geohash text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS school_quadrants (
    id text PRIMARY KEY,
    bounds_id text NOT NULL REFERENCES school_bounding_boxes(id),
    school_count integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS school_quadrant_schools (
    quadrant_id text REFERENCES school_quadrants(id),
    urn text NOT NULL,
    name text NOT NULL,
    lat numeric NOT NULL,
    lng numeric NOT NULL,
    geohash text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (quadrant_id, urn)
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

------------------------------------------
-- Indexes
------------------------------------------

-- Locations
CREATE INDEX locations_postcode_idx ON locations(postcode);
CREATE INDEX locations_coordinates_idx ON locations USING GIST(coordinates);
CREATE INDEX locations_la_code_idx ON locations(la_code);
CREATE INDEX locations_gss_la_code_idx ON locations(gss_la_code);
CREATE INDEX locations_msoa_code_idx ON locations(msoa_code);
CREATE INDEX locations_lsoa_code_idx ON locations(lsoa_code);
CREATE INDEX locations_geohash_idx ON locations(geohash);

-- Establishments
CREATE INDEX establishments_urn_idx ON establishments(urn);
CREATE INDEX establishments_type_id_idx ON establishments(type_id);
CREATE INDEX establishments_phase_id_idx ON establishments(phase_id);
CREATE INDEX establishments_location_id_idx ON establishments(location_id);
CREATE INDEX establishments_trust_id_idx ON establishments(trust_id);
CREATE INDEX establishments_lea_code_idx ON establishments(lea_code);
CREATE INDEX establishments_status_idx ON establishments(status);
CREATE INDEX establishments_name_idx ON establishments USING gin(to_tsvector('english', name));
CREATE INDEX establishments_last_changed_idx ON establishments(last_changed);

-- Census
CREATE INDEX school_census_urn_date_idx ON school_census(school_urn, date);
CREATE INDEX school_census_date_idx ON school_census(date);

-- Inspections
CREATE INDEX school_inspections_urn_date_idx ON school_inspections(school_urn, date);
CREATE INDEX school_inspections_date_idx ON school_inspections(date);

-- Quadrants
CREATE INDEX quadrant_schools_urn_idx ON quadrant_schools(urn);
CREATE INDEX quadrant_schools_geohash_idx ON quadrant_schools(geohash);

-- KS4 Results
CREATE INDEX ks4_results_main_urn_year_idx ON ks4_results_main(urn, year);
CREATE INDEX ks4_results_main_year_idx ON ks4_results_main(year);
CREATE INDEX ks4_results_main_last_updated_idx ON ks4_results_main(last_updated);

-- KS4 Destinations
CREATE INDEX ks4_destinations_urn_year_idx ON ks4_destinations(urn, year);
CREATE INDEX ks4_destinations_year_idx ON ks4_destinations(year);
CREATE INDEX ks4_destinations_last_updated_idx ON ks4_destinations(last_updated);

-- KS5 Destinations
CREATE INDEX ks5_destinations_urn_year_idx ON ks5_destinations(urn, year);
CREATE INDEX ks5_destinations_year_idx ON ks5_destinations(year);
CREATE INDEX ks5_destinations_last_updated_idx ON ks5_destinations(last_updated);

-- KS5 HE Destinations
CREATE INDEX ks5_he_destinations_urn_year_idx ON ks5_he_destinations(school_urn, year);
CREATE INDEX ks5_he_destinations_year_idx ON ks5_he_destinations(year);
CREATE INDEX ks5_he_destinations_last_updated_idx ON ks5_he_destinations(last_updated);

-- Index for JSONB queries on sub_regions
CREATE INDEX regions_sub_regions_idx ON regions USING gin(sub_regions);
CREATE INDEX regions_name_idx ON regions(name);


CREATE TRIGGER update_school_bounding_boxes_updated_at
    BEFORE UPDATE ON school_bounding_boxes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_school_quadrants_updated_at
    BEFORE UPDATE ON school_quadrants
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_school_quadrant_schools_updated_at
    BEFORE UPDATE ON school_quadrant_schools
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
    