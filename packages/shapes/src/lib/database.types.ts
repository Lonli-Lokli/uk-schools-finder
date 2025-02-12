export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bounding_boxes: {
        Row: {
          created_at: string
          id: string
          ne_geohash: string
          ne_lat: number
          ne_lng: number
          sw_geohash: string
          sw_lat: number
          sw_lng: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          ne_geohash: string
          ne_lat: number
          ne_lng: number
          sw_geohash: string
          sw_lat: number
          sw_lng: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ne_geohash?: string
          ne_lat?: number
          ne_lng?: number
          sw_geohash?: string
          sw_lat?: number
          sw_lng?: number
          updated_at?: string
        }
        Relationships: []
      }
      education_phases: {
        Row: {
          created_at: string
          id: string
          name: string
          statutory_age_high: number
          statutory_age_low: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          statutory_age_high: number
          statutory_age_low: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          statutory_age_high?: number
          statutory_age_low?: number
          updated_at?: string
        }
        Relationships: []
      }
      establishment_types: {
        Row: {
          created_at: string
          further_education_type: string
          group_name: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          further_education_type: string
          group_name: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          further_education_type?: string
          group_name?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      establishments: {
        Row: {
          accreditation_expiry_date: string | null
          boarders: string | null
          capacity: number | null
          ch_number: string | null
          close_date: string | null
          close_reason: string | null
          country: string | null
          created_at: string
          establishment_accredited: string | null
          establishment_number: number | null
          fehe_id: string | null
          gender: string | null
          head_first_name: string | null
          head_job_title: string | null
          head_last_name: string | null
          head_title: string | null
          id: string
          last_changed: string | null
          lea_code: string | null
          location_id: string | null
          name: string | null
          nursery_provision: string | null
          official_sixth_form: string | null
          open_date: string | null
          open_reason: string | null
          phase_id: string | null
          props_name: string | null
          qab_name: string | null
          qab_report: string | null
          sen_no_stat: string | null
          site_name: string | null
          special_classes: string | null
          status: string | null
          telephone: string | null
          trust_id: string | null
          type_id: string | null
          ukprn: string | null
          updated_at: string
          urn: string
          website: string | null
        }
        Insert: {
          accreditation_expiry_date?: string | null
          boarders?: string | null
          capacity?: number | null
          ch_number?: string | null
          close_date?: string | null
          close_reason?: string | null
          country?: string | null
          created_at?: string
          establishment_accredited?: string | null
          establishment_number?: number | null
          fehe_id?: string | null
          gender?: string | null
          head_first_name?: string | null
          head_job_title?: string | null
          head_last_name?: string | null
          head_title?: string | null
          id: string
          last_changed?: string | null
          lea_code?: string | null
          location_id?: string | null
          name?: string | null
          nursery_provision?: string | null
          official_sixth_form?: string | null
          open_date?: string | null
          open_reason?: string | null
          phase_id?: string | null
          props_name?: string | null
          qab_name?: string | null
          qab_report?: string | null
          sen_no_stat?: string | null
          site_name?: string | null
          special_classes?: string | null
          status?: string | null
          telephone?: string | null
          trust_id?: string | null
          type_id?: string | null
          ukprn?: string | null
          updated_at?: string
          urn: string
          website?: string | null
        }
        Update: {
          accreditation_expiry_date?: string | null
          boarders?: string | null
          capacity?: number | null
          ch_number?: string | null
          close_date?: string | null
          close_reason?: string | null
          country?: string | null
          created_at?: string
          establishment_accredited?: string | null
          establishment_number?: number | null
          fehe_id?: string | null
          gender?: string | null
          head_first_name?: string | null
          head_job_title?: string | null
          head_last_name?: string | null
          head_title?: string | null
          id?: string
          last_changed?: string | null
          lea_code?: string | null
          location_id?: string | null
          name?: string | null
          nursery_provision?: string | null
          official_sixth_form?: string | null
          open_date?: string | null
          open_reason?: string | null
          phase_id?: string | null
          props_name?: string | null
          qab_name?: string | null
          qab_report?: string | null
          sen_no_stat?: string | null
          site_name?: string | null
          special_classes?: string | null
          status?: string | null
          telephone?: string | null
          trust_id?: string | null
          type_id?: string | null
          ukprn?: string | null
          updated_at?: string
          urn?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_lea_code_fkey"
            columns: ["lea_code"]
            isOneToOne: false
            referencedRelation: "local_authorities"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "establishments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishments_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phase_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishments_trust_id_fkey"
            columns: ["trust_id"]
            isOneToOne: false
            referencedRelation: "trusts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishments_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "establishment_types"
            referencedColumns: ["id"]
          },
        ]
      }
      import_logs: {
        Row: {
          id: number
          import_id: string | null
          message: string | null
          stage: string | null
          timestamp: string | null
        }
        Insert: {
          id?: number
          import_id?: string | null
          message?: string | null
          stage?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: number
          import_id?: string | null
          message?: string | null
          stage?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      ks4_destinations_details: {
        Row: {
          apprenticeships_number: number | null
          cohort_number: number | null
          created_at: string
          disadvantaged_apprenticeships_number: number | null
          disadvantaged_apprenticeships_percentage: number | null
          disadvantaged_cohort: number | null
          disadvantaged_education_number: number | null
          disadvantaged_education_percentage: number | null
          disadvantaged_employment_number: number | null
          disadvantaged_employment_percentage: number | null
          disadvantaged_further_education_number: number | null
          disadvantaged_further_education_percentage: number | null
          disadvantaged_not_sustained_number: number | null
          disadvantaged_not_sustained_percentage: number | null
          disadvantaged_other_education_number: number | null
          disadvantaged_other_education_percentage: number | null
          disadvantaged_school_sixth_form_number: number | null
          disadvantaged_school_sixth_form_percentage: number | null
          disadvantaged_sixth_form_college_number: number | null
          disadvantaged_sixth_form_college_percentage: number | null
          disadvantaged_sustained_number: number | null
          disadvantaged_sustained_percentage: number | null
          disadvantaged_unknown_number: number | null
          disadvantaged_unknown_percentage: number | null
          education_number: number | null
          employment_number: number | null
          further_education_number: number | null
          id: string
          last_updated: string
          non_disadvantaged_apprenticeships_number: number | null
          non_disadvantaged_apprenticeships_percentage: number | null
          non_disadvantaged_cohort: number | null
          non_disadvantaged_education_number: number | null
          non_disadvantaged_education_percentage: number | null
          non_disadvantaged_employment_number: number | null
          non_disadvantaged_employment_percentage: number | null
          non_disadvantaged_further_education_number: number | null
          non_disadvantaged_further_education_percentage: number | null
          non_disadvantaged_not_sustained_number: number | null
          non_disadvantaged_not_sustained_percentage: number | null
          non_disadvantaged_other_education_number: number | null
          non_disadvantaged_other_education_percentage: number | null
          non_disadvantaged_school_sixth_form_number: number | null
          non_disadvantaged_school_sixth_form_percentage: number | null
          non_disadvantaged_sixth_form_college_number: number | null
          non_disadvantaged_sixth_form_college_percentage: number | null
          non_disadvantaged_sustained_number: number | null
          non_disadvantaged_sustained_percentage: number | null
          non_disadvantaged_unknown_number: number | null
          non_disadvantaged_unknown_percentage: number | null
          not_sustained_number: number | null
          other_education_number: number | null
          school_sixth_form_number: number | null
          sixth_form_college_number: number | null
          sustained_number: number | null
          unknown_number: number | null
          updated_at: string
          urn: string
          year: string
        }
        Insert: {
          apprenticeships_number?: number | null
          cohort_number?: number | null
          created_at?: string
          disadvantaged_apprenticeships_number?: number | null
          disadvantaged_apprenticeships_percentage?: number | null
          disadvantaged_cohort?: number | null
          disadvantaged_education_number?: number | null
          disadvantaged_education_percentage?: number | null
          disadvantaged_employment_number?: number | null
          disadvantaged_employment_percentage?: number | null
          disadvantaged_further_education_number?: number | null
          disadvantaged_further_education_percentage?: number | null
          disadvantaged_not_sustained_number?: number | null
          disadvantaged_not_sustained_percentage?: number | null
          disadvantaged_other_education_number?: number | null
          disadvantaged_other_education_percentage?: number | null
          disadvantaged_school_sixth_form_number?: number | null
          disadvantaged_school_sixth_form_percentage?: number | null
          disadvantaged_sixth_form_college_number?: number | null
          disadvantaged_sixth_form_college_percentage?: number | null
          disadvantaged_sustained_number?: number | null
          disadvantaged_sustained_percentage?: number | null
          disadvantaged_unknown_number?: number | null
          disadvantaged_unknown_percentage?: number | null
          education_number?: number | null
          employment_number?: number | null
          further_education_number?: number | null
          id: string
          last_updated: string
          non_disadvantaged_apprenticeships_number?: number | null
          non_disadvantaged_apprenticeships_percentage?: number | null
          non_disadvantaged_cohort?: number | null
          non_disadvantaged_education_number?: number | null
          non_disadvantaged_education_percentage?: number | null
          non_disadvantaged_employment_number?: number | null
          non_disadvantaged_employment_percentage?: number | null
          non_disadvantaged_further_education_number?: number | null
          non_disadvantaged_further_education_percentage?: number | null
          non_disadvantaged_not_sustained_number?: number | null
          non_disadvantaged_not_sustained_percentage?: number | null
          non_disadvantaged_other_education_number?: number | null
          non_disadvantaged_other_education_percentage?: number | null
          non_disadvantaged_school_sixth_form_number?: number | null
          non_disadvantaged_school_sixth_form_percentage?: number | null
          non_disadvantaged_sixth_form_college_number?: number | null
          non_disadvantaged_sixth_form_college_percentage?: number | null
          non_disadvantaged_sustained_number?: number | null
          non_disadvantaged_sustained_percentage?: number | null
          non_disadvantaged_unknown_number?: number | null
          non_disadvantaged_unknown_percentage?: number | null
          not_sustained_number?: number | null
          other_education_number?: number | null
          school_sixth_form_number?: number | null
          sixth_form_college_number?: number | null
          sustained_number?: number | null
          unknown_number?: number | null
          updated_at?: string
          urn: string
          year: string
        }
        Update: {
          apprenticeships_number?: number | null
          cohort_number?: number | null
          created_at?: string
          disadvantaged_apprenticeships_number?: number | null
          disadvantaged_apprenticeships_percentage?: number | null
          disadvantaged_cohort?: number | null
          disadvantaged_education_number?: number | null
          disadvantaged_education_percentage?: number | null
          disadvantaged_employment_number?: number | null
          disadvantaged_employment_percentage?: number | null
          disadvantaged_further_education_number?: number | null
          disadvantaged_further_education_percentage?: number | null
          disadvantaged_not_sustained_number?: number | null
          disadvantaged_not_sustained_percentage?: number | null
          disadvantaged_other_education_number?: number | null
          disadvantaged_other_education_percentage?: number | null
          disadvantaged_school_sixth_form_number?: number | null
          disadvantaged_school_sixth_form_percentage?: number | null
          disadvantaged_sixth_form_college_number?: number | null
          disadvantaged_sixth_form_college_percentage?: number | null
          disadvantaged_sustained_number?: number | null
          disadvantaged_sustained_percentage?: number | null
          disadvantaged_unknown_number?: number | null
          disadvantaged_unknown_percentage?: number | null
          education_number?: number | null
          employment_number?: number | null
          further_education_number?: number | null
          id?: string
          last_updated?: string
          non_disadvantaged_apprenticeships_number?: number | null
          non_disadvantaged_apprenticeships_percentage?: number | null
          non_disadvantaged_cohort?: number | null
          non_disadvantaged_education_number?: number | null
          non_disadvantaged_education_percentage?: number | null
          non_disadvantaged_employment_number?: number | null
          non_disadvantaged_employment_percentage?: number | null
          non_disadvantaged_further_education_number?: number | null
          non_disadvantaged_further_education_percentage?: number | null
          non_disadvantaged_not_sustained_number?: number | null
          non_disadvantaged_not_sustained_percentage?: number | null
          non_disadvantaged_other_education_number?: number | null
          non_disadvantaged_other_education_percentage?: number | null
          non_disadvantaged_school_sixth_form_number?: number | null
          non_disadvantaged_school_sixth_form_percentage?: number | null
          non_disadvantaged_sixth_form_college_number?: number | null
          non_disadvantaged_sixth_form_college_percentage?: number | null
          non_disadvantaged_sustained_number?: number | null
          non_disadvantaged_sustained_percentage?: number | null
          non_disadvantaged_unknown_number?: number | null
          non_disadvantaged_unknown_percentage?: number | null
          not_sustained_number?: number | null
          other_education_number?: number | null
          school_sixth_form_number?: number | null
          sixth_form_college_number?: number | null
          sustained_number?: number | null
          unknown_number?: number | null
          updated_at?: string
          urn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "ks4_destinations_details_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      ks4_destinations_main: {
        Row: {
          apprenticeships: number | null
          cohort_size: number | null
          created_at: string
          disadvantaged_sustained: number | null
          education: number | null
          employment: number | null
          further_education: number | null
          id: string
          last_updated: string
          non_disadvantaged_sustained: number | null
          sixth_form: number | null
          sixth_form_college: number | null
          sustained: number | null
          updated_at: string
          urn: string
          year: string
        }
        Insert: {
          apprenticeships?: number | null
          cohort_size?: number | null
          created_at?: string
          disadvantaged_sustained?: number | null
          education?: number | null
          employment?: number | null
          further_education?: number | null
          id: string
          last_updated: string
          non_disadvantaged_sustained?: number | null
          sixth_form?: number | null
          sixth_form_college?: number | null
          sustained?: number | null
          updated_at?: string
          urn: string
          year: string
        }
        Update: {
          apprenticeships?: number | null
          cohort_size?: number | null
          created_at?: string
          disadvantaged_sustained?: number | null
          education?: number | null
          employment?: number | null
          further_education?: number | null
          id?: string
          last_updated?: string
          non_disadvantaged_sustained?: number | null
          sixth_form?: number | null
          sixth_form_college?: number | null
          sustained?: number | null
          updated_at?: string
          urn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "ks4_destinations_main_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      ks4_results_demographics: {
        Row: {
          characteristics_disadvantaged: number | null
          characteristics_eal: number | null
          characteristics_sen: number | null
          created_at: string
          id: string
          last_updated: string
          pupils_boys: number | null
          pupils_exam_cohort: number | null
          pupils_girls: number | null
          pupils_total: number | null
          updated_at: string
          urn: string
          year: string
        }
        Insert: {
          characteristics_disadvantaged?: number | null
          characteristics_eal?: number | null
          characteristics_sen?: number | null
          created_at?: string
          id: string
          last_updated: string
          pupils_boys?: number | null
          pupils_exam_cohort?: number | null
          pupils_girls?: number | null
          pupils_total?: number | null
          updated_at?: string
          urn: string
          year: string
        }
        Update: {
          characteristics_disadvantaged?: number | null
          characteristics_eal?: number | null
          characteristics_sen?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          pupils_boys?: number | null
          pupils_exam_cohort?: number | null
          pupils_girls?: number | null
          pupils_total?: number | null
          updated_at?: string
          urn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "ks4_results_demographics_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      ks4_results_details: {
        Row: {
          attainment8_ebacc: number | null
          attainment8_english: number | null
          attainment8_high_prior_ebacc: number | null
          attainment8_high_prior_english: number | null
          attainment8_high_prior_maths: number | null
          attainment8_high_prior_open: number | null
          attainment8_high_prior_overall: number | null
          attainment8_low_prior_ebacc: number | null
          attainment8_low_prior_english: number | null
          attainment8_low_prior_maths: number | null
          attainment8_low_prior_open: number | null
          attainment8_low_prior_overall: number | null
          attainment8_maths: number | null
          attainment8_middle_prior_ebacc: number | null
          attainment8_middle_prior_english: number | null
          attainment8_middle_prior_maths: number | null
          attainment8_middle_prior_open: number | null
          attainment8_middle_prior_overall: number | null
          attainment8_open: number | null
          attainment8_open_gcse: number | null
          attainment8_open_non_gcse: number | null
          created_at: string
          ebacc_english_achieved94: number | null
          ebacc_english_achieved95: number | null
          ebacc_english_entry: number | null
          ebacc_humanities_achieved94: number | null
          ebacc_humanities_achieved95: number | null
          ebacc_humanities_entry: number | null
          ebacc_languages_achieved94: number | null
          ebacc_languages_achieved95: number | null
          ebacc_languages_entry: number | null
          ebacc_maths_achieved94: number | null
          ebacc_maths_achieved95: number | null
          ebacc_maths_entry: number | null
          ebacc_science_achieved94: number | null
          ebacc_science_achieved95: number | null
          ebacc_science_entry: number | null
          groups_boys_attainment8: number | null
          groups_boys_progress8_lower: number | null
          groups_boys_progress8_score: number | null
          groups_boys_progress8_upper: number | null
          groups_disadvantaged_attainment8: number | null
          groups_disadvantaged_progress8_lower: number | null
          groups_disadvantaged_progress8_score: number | null
          groups_disadvantaged_progress8_upper: number | null
          groups_eal_attainment8: number | null
          groups_eal_progress8_lower: number | null
          groups_eal_progress8_score: number | null
          groups_eal_progress8_upper: number | null
          groups_girls_attainment8: number | null
          groups_girls_progress8_lower: number | null
          groups_girls_progress8_score: number | null
          groups_girls_progress8_upper: number | null
          groups_not_disadvantaged_attainment8: number | null
          groups_not_disadvantaged_progress8_lower: number | null
          groups_not_disadvantaged_progress8_score: number | null
          groups_not_disadvantaged_progress8_upper: number | null
          id: string
          last_updated: string
          progress8_ebacc_lower: number | null
          progress8_ebacc_score: number | null
          progress8_ebacc_upper: number | null
          progress8_english_lower: number | null
          progress8_english_score: number | null
          progress8_english_upper: number | null
          progress8_maths_lower: number | null
          progress8_maths_score: number | null
          progress8_maths_upper: number | null
          progress8_open_lower: number | null
          progress8_open_score: number | null
          progress8_open_upper: number | null
          progress8_original_lower: number | null
          progress8_original_score: number | null
          progress8_original_upper: number | null
          updated_at: string
          urn: string
          year: string
        }
        Insert: {
          attainment8_ebacc?: number | null
          attainment8_english?: number | null
          attainment8_high_prior_ebacc?: number | null
          attainment8_high_prior_english?: number | null
          attainment8_high_prior_maths?: number | null
          attainment8_high_prior_open?: number | null
          attainment8_high_prior_overall?: number | null
          attainment8_low_prior_ebacc?: number | null
          attainment8_low_prior_english?: number | null
          attainment8_low_prior_maths?: number | null
          attainment8_low_prior_open?: number | null
          attainment8_low_prior_overall?: number | null
          attainment8_maths?: number | null
          attainment8_middle_prior_ebacc?: number | null
          attainment8_middle_prior_english?: number | null
          attainment8_middle_prior_maths?: number | null
          attainment8_middle_prior_open?: number | null
          attainment8_middle_prior_overall?: number | null
          attainment8_open?: number | null
          attainment8_open_gcse?: number | null
          attainment8_open_non_gcse?: number | null
          created_at?: string
          ebacc_english_achieved94?: number | null
          ebacc_english_achieved95?: number | null
          ebacc_english_entry?: number | null
          ebacc_humanities_achieved94?: number | null
          ebacc_humanities_achieved95?: number | null
          ebacc_humanities_entry?: number | null
          ebacc_languages_achieved94?: number | null
          ebacc_languages_achieved95?: number | null
          ebacc_languages_entry?: number | null
          ebacc_maths_achieved94?: number | null
          ebacc_maths_achieved95?: number | null
          ebacc_maths_entry?: number | null
          ebacc_science_achieved94?: number | null
          ebacc_science_achieved95?: number | null
          ebacc_science_entry?: number | null
          groups_boys_attainment8?: number | null
          groups_boys_progress8_lower?: number | null
          groups_boys_progress8_score?: number | null
          groups_boys_progress8_upper?: number | null
          groups_disadvantaged_attainment8?: number | null
          groups_disadvantaged_progress8_lower?: number | null
          groups_disadvantaged_progress8_score?: number | null
          groups_disadvantaged_progress8_upper?: number | null
          groups_eal_attainment8?: number | null
          groups_eal_progress8_lower?: number | null
          groups_eal_progress8_score?: number | null
          groups_eal_progress8_upper?: number | null
          groups_girls_attainment8?: number | null
          groups_girls_progress8_lower?: number | null
          groups_girls_progress8_score?: number | null
          groups_girls_progress8_upper?: number | null
          groups_not_disadvantaged_attainment8?: number | null
          groups_not_disadvantaged_progress8_lower?: number | null
          groups_not_disadvantaged_progress8_score?: number | null
          groups_not_disadvantaged_progress8_upper?: number | null
          id: string
          last_updated: string
          progress8_ebacc_lower?: number | null
          progress8_ebacc_score?: number | null
          progress8_ebacc_upper?: number | null
          progress8_english_lower?: number | null
          progress8_english_score?: number | null
          progress8_english_upper?: number | null
          progress8_maths_lower?: number | null
          progress8_maths_score?: number | null
          progress8_maths_upper?: number | null
          progress8_open_lower?: number | null
          progress8_open_score?: number | null
          progress8_open_upper?: number | null
          progress8_original_lower?: number | null
          progress8_original_score?: number | null
          progress8_original_upper?: number | null
          updated_at?: string
          urn: string
          year: string
        }
        Update: {
          attainment8_ebacc?: number | null
          attainment8_english?: number | null
          attainment8_high_prior_ebacc?: number | null
          attainment8_high_prior_english?: number | null
          attainment8_high_prior_maths?: number | null
          attainment8_high_prior_open?: number | null
          attainment8_high_prior_overall?: number | null
          attainment8_low_prior_ebacc?: number | null
          attainment8_low_prior_english?: number | null
          attainment8_low_prior_maths?: number | null
          attainment8_low_prior_open?: number | null
          attainment8_low_prior_overall?: number | null
          attainment8_maths?: number | null
          attainment8_middle_prior_ebacc?: number | null
          attainment8_middle_prior_english?: number | null
          attainment8_middle_prior_maths?: number | null
          attainment8_middle_prior_open?: number | null
          attainment8_middle_prior_overall?: number | null
          attainment8_open?: number | null
          attainment8_open_gcse?: number | null
          attainment8_open_non_gcse?: number | null
          created_at?: string
          ebacc_english_achieved94?: number | null
          ebacc_english_achieved95?: number | null
          ebacc_english_entry?: number | null
          ebacc_humanities_achieved94?: number | null
          ebacc_humanities_achieved95?: number | null
          ebacc_humanities_entry?: number | null
          ebacc_languages_achieved94?: number | null
          ebacc_languages_achieved95?: number | null
          ebacc_languages_entry?: number | null
          ebacc_maths_achieved94?: number | null
          ebacc_maths_achieved95?: number | null
          ebacc_maths_entry?: number | null
          ebacc_science_achieved94?: number | null
          ebacc_science_achieved95?: number | null
          ebacc_science_entry?: number | null
          groups_boys_attainment8?: number | null
          groups_boys_progress8_lower?: number | null
          groups_boys_progress8_score?: number | null
          groups_boys_progress8_upper?: number | null
          groups_disadvantaged_attainment8?: number | null
          groups_disadvantaged_progress8_lower?: number | null
          groups_disadvantaged_progress8_score?: number | null
          groups_disadvantaged_progress8_upper?: number | null
          groups_eal_attainment8?: number | null
          groups_eal_progress8_lower?: number | null
          groups_eal_progress8_score?: number | null
          groups_eal_progress8_upper?: number | null
          groups_girls_attainment8?: number | null
          groups_girls_progress8_lower?: number | null
          groups_girls_progress8_score?: number | null
          groups_girls_progress8_upper?: number | null
          groups_not_disadvantaged_attainment8?: number | null
          groups_not_disadvantaged_progress8_lower?: number | null
          groups_not_disadvantaged_progress8_score?: number | null
          groups_not_disadvantaged_progress8_upper?: number | null
          id?: string
          last_updated?: string
          progress8_ebacc_lower?: number | null
          progress8_ebacc_score?: number | null
          progress8_ebacc_upper?: number | null
          progress8_english_lower?: number | null
          progress8_english_score?: number | null
          progress8_english_upper?: number | null
          progress8_maths_lower?: number | null
          progress8_maths_score?: number | null
          progress8_maths_upper?: number | null
          progress8_open_lower?: number | null
          progress8_open_score?: number | null
          progress8_open_upper?: number | null
          progress8_original_lower?: number | null
          progress8_original_score?: number | null
          progress8_original_upper?: number | null
          updated_at?: string
          urn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "ks4_results_details_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      ks4_results_main: {
        Row: {
          attainment8_score: number | null
          attainment8_score_boys: number | null
          attainment8_score_disadvantaged: number | null
          attainment8_score_girls: number | null
          basics94: number | null
          basics95: number | null
          created_at: string
          disadvantaged_pupils: number | null
          ebacc_achievement_rate94: number | null
          ebacc_achievement_rate95: number | null
          ebacc_aps: number | null
          ebacc_entry: number | null
          high_prior_attainers: number | null
          id: string
          last_updated: string
          low_prior_attainers: number | null
          middle_prior_attainers: number | null
          progress8_lower: number | null
          progress8_score: number | null
          progress8_score_boys: number | null
          progress8_score_disadvantaged: number | null
          progress8_score_girls: number | null
          progress8_upper: number | null
          total_pupils: number | null
          updated_at: string
          urn: string
          year: string
        }
        Insert: {
          attainment8_score?: number | null
          attainment8_score_boys?: number | null
          attainment8_score_disadvantaged?: number | null
          attainment8_score_girls?: number | null
          basics94?: number | null
          basics95?: number | null
          created_at?: string
          disadvantaged_pupils?: number | null
          ebacc_achievement_rate94?: number | null
          ebacc_achievement_rate95?: number | null
          ebacc_aps?: number | null
          ebacc_entry?: number | null
          high_prior_attainers?: number | null
          id: string
          last_updated: string
          low_prior_attainers?: number | null
          middle_prior_attainers?: number | null
          progress8_lower?: number | null
          progress8_score?: number | null
          progress8_score_boys?: number | null
          progress8_score_disadvantaged?: number | null
          progress8_score_girls?: number | null
          progress8_upper?: number | null
          total_pupils?: number | null
          updated_at?: string
          urn: string
          year: string
        }
        Update: {
          attainment8_score?: number | null
          attainment8_score_boys?: number | null
          attainment8_score_disadvantaged?: number | null
          attainment8_score_girls?: number | null
          basics94?: number | null
          basics95?: number | null
          created_at?: string
          disadvantaged_pupils?: number | null
          ebacc_achievement_rate94?: number | null
          ebacc_achievement_rate95?: number | null
          ebacc_aps?: number | null
          ebacc_entry?: number | null
          high_prior_attainers?: number | null
          id?: string
          last_updated?: string
          low_prior_attainers?: number | null
          middle_prior_attainers?: number | null
          progress8_lower?: number | null
          progress8_score?: number | null
          progress8_score_boys?: number | null
          progress8_score_disadvantaged?: number | null
          progress8_score_girls?: number | null
          progress8_upper?: number | null
          total_pupils?: number | null
          updated_at?: string
          urn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "ks4_results_main_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      ks5_destinations: {
        Row: {
          category: Database["public"]["Enums"]["destination_category"]
          cohort_size: number | null
          created_at: string
          destinations_education_further: number | null
          destinations_education_higher: number | null
          destinations_education_other: number | null
          destinations_education_total: number | null
          destinations_employment_apprenticeships: number | null
          destinations_employment_total: number | null
          destinations_other_not_captured: number | null
          destinations_other_not_sustained: number | null
          destinations_overall: number | null
          id: string
          last_updated: string
          percentages_education_further: number | null
          percentages_education_higher: number | null
          percentages_education_other: number | null
          percentages_education_total: number | null
          percentages_employment_apprenticeships: number | null
          percentages_employment_total: number | null
          percentages_other_not_captured: number | null
          percentages_other_not_sustained: number | null
          percentages_overall: number | null
          student_group: Database["public"]["Enums"]["student_group"]
          updated_at: string
          urn: string
          year: string
        }
        Insert: {
          category: Database["public"]["Enums"]["destination_category"]
          cohort_size?: number | null
          created_at?: string
          destinations_education_further?: number | null
          destinations_education_higher?: number | null
          destinations_education_other?: number | null
          destinations_education_total?: number | null
          destinations_employment_apprenticeships?: number | null
          destinations_employment_total?: number | null
          destinations_other_not_captured?: number | null
          destinations_other_not_sustained?: number | null
          destinations_overall?: number | null
          id: string
          last_updated: string
          percentages_education_further?: number | null
          percentages_education_higher?: number | null
          percentages_education_other?: number | null
          percentages_education_total?: number | null
          percentages_employment_apprenticeships?: number | null
          percentages_employment_total?: number | null
          percentages_other_not_captured?: number | null
          percentages_other_not_sustained?: number | null
          percentages_overall?: number | null
          student_group: Database["public"]["Enums"]["student_group"]
          updated_at?: string
          urn: string
          year: string
        }
        Update: {
          category?: Database["public"]["Enums"]["destination_category"]
          cohort_size?: number | null
          created_at?: string
          destinations_education_further?: number | null
          destinations_education_higher?: number | null
          destinations_education_other?: number | null
          destinations_education_total?: number | null
          destinations_employment_apprenticeships?: number | null
          destinations_employment_total?: number | null
          destinations_other_not_captured?: number | null
          destinations_other_not_sustained?: number | null
          destinations_overall?: number | null
          id?: string
          last_updated?: string
          percentages_education_further?: number | null
          percentages_education_higher?: number | null
          percentages_education_other?: number | null
          percentages_education_total?: number | null
          percentages_employment_apprenticeships?: number | null
          percentages_employment_total?: number | null
          percentages_other_not_captured?: number | null
          percentages_other_not_sustained?: number | null
          percentages_overall?: number | null
          student_group?: Database["public"]["Enums"]["student_group"]
          updated_at?: string
          urn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "ks5_destinations_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      ks5_destinations_stats: {
        Row: {
          created_at: string
          employment: number | null
          further_education: number | null
          higher_education: number | null
          id: string
          last_updated: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          employment?: number | null
          further_education?: number | null
          higher_education?: number | null
          id: string
          last_updated: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          employment?: number | null
          further_education?: number | null
          higher_education?: number | null
          id?: string
          last_updated?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      ks5_he_destinations: {
        Row: {
          created_at: string
          disadvantaged_higher_technical_percentage: number | null
          disadvantaged_oxbridge_percentage: number | null
          disadvantaged_russell_percentage: number | null
          disadvantaged_top_third_percentage: number | null
          higher_technical_percentage: number | null
          id: string
          last_updated: string
          oxbridge_percentage: number | null
          russell_percentage: number | null
          school_urn: string
          top_third_percentage: number | null
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          disadvantaged_higher_technical_percentage?: number | null
          disadvantaged_oxbridge_percentage?: number | null
          disadvantaged_russell_percentage?: number | null
          disadvantaged_top_third_percentage?: number | null
          higher_technical_percentage?: number | null
          id: string
          last_updated: string
          oxbridge_percentage?: number | null
          russell_percentage?: number | null
          school_urn: string
          top_third_percentage?: number | null
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          disadvantaged_higher_technical_percentage?: number | null
          disadvantaged_oxbridge_percentage?: number | null
          disadvantaged_russell_percentage?: number | null
          disadvantaged_top_third_percentage?: number | null
          higher_technical_percentage?: number | null
          id?: string
          last_updated?: string
          oxbridge_percentage?: number | null
          russell_percentage?: number | null
          school_urn?: string
          top_third_percentage?: number | null
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      local_authorities: {
        Row: {
          code: string
          created_at: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address3: string | null
          constituency: string | null
          coordinates: unknown | null
          county: string | null
          created_at: string
          district: string | null
          easting: number | null
          geohash: string | null
          gor: string | null
          gss_la_code: string | null
          id: string
          la_code: number | null
          la_name: string | null
          latitude: number | null
          locality: string | null
          longitude: number | null
          lsoa_code: string | null
          lsoa_name: string | null
          msoa_code: string | null
          msoa_name: string | null
          northing: number | null
          postcode: string | null
          street: string | null
          town: string | null
          updated_at: string
          uprn: number | null
          urban_rural: string | null
          ward: string | null
        }
        Insert: {
          address3?: string | null
          constituency?: string | null
          coordinates?: unknown | null
          county?: string | null
          created_at?: string
          district?: string | null
          easting?: number | null
          geohash?: string | null
          gor?: string | null
          gss_la_code?: string | null
          id: string
          la_code?: number | null
          la_name?: string | null
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          lsoa_code?: string | null
          lsoa_name?: string | null
          msoa_code?: string | null
          msoa_name?: string | null
          northing?: number | null
          postcode?: string | null
          street?: string | null
          town?: string | null
          updated_at?: string
          uprn?: number | null
          urban_rural?: string | null
          ward?: string | null
        }
        Update: {
          address3?: string | null
          constituency?: string | null
          coordinates?: unknown | null
          county?: string | null
          created_at?: string
          district?: string | null
          easting?: number | null
          geohash?: string | null
          gor?: string | null
          gss_la_code?: string | null
          id?: string
          la_code?: number | null
          la_name?: string | null
          latitude?: number | null
          locality?: string | null
          longitude?: number | null
          lsoa_code?: string | null
          lsoa_name?: string | null
          msoa_code?: string | null
          msoa_name?: string | null
          northing?: number | null
          postcode?: string | null
          street?: string | null
          town?: string | null
          updated_at?: string
          uprn?: number | null
          urban_rural?: string | null
          ward?: string | null
        }
        Relationships: []
      }
      phase_types: {
        Row: {
          created_at: string
          id: string
          name: string
          statutory_high_age: number | null
          statutory_low_age: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          statutory_high_age?: number | null
          statutory_low_age?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          statutory_high_age?: number | null
          statutory_low_age?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      quadrant_schools: {
        Row: {
          created_at: string
          geohash: string
          id: string
          lat: number
          lng: number
          name: string
          quadrant_id: string
          updated_at: string
          urn: string
        }
        Insert: {
          created_at?: string
          geohash: string
          id?: string
          lat: number
          lng: number
          name: string
          quadrant_id: string
          updated_at?: string
          urn: string
        }
        Update: {
          created_at?: string
          geohash?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          quadrant_id?: string
          updated_at?: string
          urn?: string
        }
        Relationships: [
          {
            foreignKeyName: "quadrant_schools_quadrant_id_fkey"
            columns: ["quadrant_id"]
            isOneToOne: false
            referencedRelation: "quadrants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quadrant_schools_urn_fkey"
            columns: ["urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      quadrants: {
        Row: {
          bounds_id: string
          created_at: string
          geohash: string
          id: string
          level: number
          school_count: number
          updated_at: string
        }
        Insert: {
          bounds_id: string
          created_at?: string
          geohash?: string
          id: string
          level?: number
          school_count: number
          updated_at?: string
        }
        Update: {
          bounds_id?: string
          created_at?: string
          geohash?: string
          id?: string
          level?: number
          school_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quadrants_bounds_id_fkey"
            columns: ["bounds_id"]
            isOneToOne: false
            referencedRelation: "bounding_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string
          id: string
          name: string
          sub_regions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          sub_regions: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sub_regions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      school_census: {
        Row: {
          boys: number | null
          created_at: string
          date: string
          fsm: number | null
          fsm_percentage: number | null
          girls: number | null
          id: string
          pupils: number | null
          school_urn: string
          updated_at: string
        }
        Insert: {
          boys?: number | null
          created_at?: string
          date: string
          fsm?: number | null
          fsm_percentage?: number | null
          girls?: number | null
          id: string
          pupils?: number | null
          school_urn: string
          updated_at?: string
        }
        Update: {
          boys?: number | null
          created_at?: string
          date?: string
          fsm?: number | null
          fsm_percentage?: number | null
          girls?: number | null
          id?: string
          pupils?: number | null
          school_urn?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_census_school_urn_fkey"
            columns: ["school_urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      school_inspections: {
        Row: {
          bso_inspectorate: string | null
          created_at: string
          date: string
          id: string
          inspectorate_name: string | null
          next_visit: string | null
          report: string | null
          school_urn: string
          updated_at: string
        }
        Insert: {
          bso_inspectorate?: string | null
          created_at?: string
          date: string
          id: string
          inspectorate_name?: string | null
          next_visit?: string | null
          report?: string | null
          school_urn: string
          updated_at?: string
        }
        Update: {
          bso_inspectorate?: string | null
          created_at?: string
          date?: string
          id?: string
          inspectorate_name?: string | null
          next_visit?: string | null
          report?: string | null
          school_urn?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_inspections_school_urn_fkey"
            columns: ["school_urn"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["urn"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      trusts: {
        Row: {
          created_at: string
          federation_flag: string | null
          federations: string | null
          id: string
          name: string
          sponsor_flag: string | null
          sponsors: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          federation_flag?: string | null
          federations?: string | null
          id: string
          name: string
          sponsor_flag?: string | null
          sponsors?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          federation_flag?: string | null
          federations?: string | null
          id?: string
          name?: string
          sponsor_flag?: string | null
          sponsors?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: {
          oldname: string
          newname: string
          version: string
        }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: {
          tbl: unknown
          col: string
        }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: {
          tbl: unknown
          att_name: string
          geom: unknown
          mode?: string
        }
        Returns: number
      }
      _st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      _st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_intersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      _st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      _st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: {
          geom: unknown
        }
        Returns: number
      }
      _st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      addauth: {
        Args: {
          "": string
        }
        Returns: boolean
      }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
      box:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box3d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3dtobox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      bytea:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      check_ks4_destinations_structure: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      create_import_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      drop_import_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      gbt_bit_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geography_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geography_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geometry_above: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geometry_below: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_cmp: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_contained_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_eq: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_ge: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_gt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_hash: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      geometry_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_le: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_left: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_lt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_overabove: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overleft: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overright: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_right: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geometry_sortsupport: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geometry_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometrytype:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: {
          "": number
        }
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gidx_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      import_batch: {
        Args: {
          imports: Json
        }
        Returns: Json
      }
      json: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      jsonb: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      point: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      polygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      populate_geometry_columns:
        | {
            Args: {
              tbl_oid: unknown
              use_typmod?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              use_typmod?: boolean
            }
            Returns: string
          }
      postgis_addbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_type: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: string
      }
      postgis_dropbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_type: {
        Args: {
          "": number
        }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      school_cleanup_import: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      school_cleanup_ks4: {
        Args: {
          year_to_clean: string
        }
        Returns: undefined
      }
      school_cleanup_ks4_destinations: {
        Args: {
          year_to_clean: string
        }
        Returns: undefined
      }
      school_cleanup_ks5_destinations: {
        Args: {
          year_to_clean: string
        }
        Returns: undefined
      }
      school_cleanup_ks5_he_destinations: {
        Args: {
          year_to_clean: string
        }
        Returns: undefined
      }
      school_cleanup_quadrants: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      school_create_import_staging: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      school_execute_staged_import: {
        Args: {
          import_id: string
        }
        Returns: Json
      }
      school_import_bounding_boxes: {
        Args: {
          boxes: Json
        }
        Returns: Json
      }
      school_import_census: {
        Args: {
          census: Json
        }
        Returns: Json
      }
      school_import_education_phases: {
        Args: {
          phases: Json
        }
        Returns: Json
      }
      school_import_establishment_types: {
        Args: {
          types: Json
        }
        Returns: Json
      }
      school_import_inspections: {
        Args: {
          inspections: Json
        }
        Returns: Json
      }
      school_import_ks4_demographics: {
        Args: {
          demographics: Json
        }
        Returns: Json
      }
      school_import_ks4_destinations_details: {
        Args: {
          details: Json
        }
        Returns: Json
      }
      school_import_ks4_destinations_main: {
        Args: {
          destinations: Json
        }
        Returns: Json
      }
      school_import_ks4_details: {
        Args: {
          details: Json
        }
        Returns: Json
      }
      school_import_ks4_results_main: {
        Args: {
          ks4_results: Json
        }
        Returns: Json
      }
      school_import_ks5_destinations: {
        Args: {
          destinations: Json
        }
        Returns: Json
      }
      school_import_ks5_destinations_stats: {
        Args: {
          stats: Json
        }
        Returns: Json
      }
      school_import_ks5_he_destinations: {
        Args: {
          destinations: Json
        }
        Returns: Json
      }
      school_import_locations: {
        Args: {
          locations: Json
        }
        Returns: Json
      }
      school_import_phase_types: {
        Args: {
          phases: Json
        }
        Returns: Json
      }
      school_import_quadrant_schools: {
        Args: {
          schools: Json
        }
        Returns: Json
      }
      school_import_quadrants:
        | {
            Args: {
              bounding_boxes: Json
              quadrants: Json
              quadrant_schools: Json
            }
            Returns: Json
          }
        | {
            Args: {
              quads: Json
            }
            Returns: Json
          }
      school_import_schools:
        | {
            Args: {
              schools: Json
            }
            Returns: Json
          }
        | {
            Args: {
              schools: Json
              establishment_types: Json
              phase_types: Json
            }
            Returns: Json
          }
      school_import_trusts: {
        Args: {
          trusts: Json
        }
        Returns: Json
      }
      school_stage_import_chunk: {
        Args: {
          import_id: string
          table_name: string
          records: Json
          relations: Json
        }
        Returns: Json
      }
      spheroid_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      spheroid_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3ddistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_3dlength: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dlongestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dperimeter: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dshortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_addpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_angle:
        | {
            Args: {
              line1: unknown
              line2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              pt1: unknown
              pt2: unknown
              pt3: unknown
              pt4?: unknown
            }
            Returns: number
          }
      st_area:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_area2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_asbinary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asencodedpolyline: {
        Args: {
          geom: unknown
          nprecision?: number
        }
        Returns: string
      }
      st_asewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_asewkt:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asgeojson:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
            Returns: string
          }
      st_asgml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
      st_ashexewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_askml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
      st_aslatlontext: {
        Args: {
          geom: unknown
          tmpl?: string
        }
        Returns: string
      }
      st_asmarc21: {
        Args: {
          geom: unknown
          format?: string
        }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
      st_astext:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: {
          geom: unknown
          maxdecimaldigits?: number
          options?: number
        }
        Returns: string
      }
      st_azimuth:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_boundary: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: {
          geom: unknown
          fits?: boolean
        }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: {
              geom: unknown
              radius: number
              options?: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              radius: number
              quadsegs: number
            }
            Returns: unknown
          }
      st_buildarea: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_centroid:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      st_cleangeometry: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: {
          geom: unknown
          box: unknown
        }
        Returns: unknown
      }
      st_closestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: {
          "": unknown[]
        }
        Returns: unknown[]
      }
      st_collect:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
      st_collectionextract: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_convexhull: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_coorddim: {
        Args: {
          geometry: unknown
        }
        Returns: number
      }
      st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_curvetoline: {
        Args: {
          geom: unknown
          tol?: number
          toltype?: number
          flags?: number
        }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: {
          g1: unknown
          tolerance?: number
          flags?: number
        }
        Returns: unknown
      }
      st_difference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_dimension: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_disjoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_distance:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_distancesphere:
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              radius: number
            }
            Returns: number
          }
      st_distancespheroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_dump: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_envelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_expand:
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
            }
            Returns: unknown
          }
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
              dz?: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              dx: number
              dy: number
              dz?: number
              dm?: number
            }
            Returns: unknown
          }
      st_exteriorring: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force3d: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force3dm: {
        Args: {
          geom: unknown
          mvalue?: number
        }
        Returns: unknown
      }
      st_force3dz: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force4d: {
        Args: {
          geom: unknown
          zvalue?: number
          mvalue?: number
        }
        Returns: unknown
      }
      st_forcecollection: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcecurve: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcerhr: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcesfs: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_generatepoints:
        | {
            Args: {
              area: unknown
              npoints: number
            }
            Returns: unknown
          }
        | {
            Args: {
              area: unknown
              npoints: number
              seed: number
            }
            Returns: unknown
          }
      st_geogfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geohash:
        | {
            Args: {
              geog: unknown
              maxchars?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxchars?: number
            }
            Returns: string
          }
      st_geomcollfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometrytype: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromgeojson:
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
      st_geomfromgml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: {
          marc21xml: string
        }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_gmltosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_hasarc: {
        Args: {
          geometry: unknown
        }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_hexagon: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: {
          line: unknown
          point: unknown
        }
        Returns: number
      }
      st_intersection: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_intersects:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_isclosed: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_iscollection: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isempty: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isring: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_issimple: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvalid: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: {
          geom: unknown
          flags?: number
        }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_length:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_length2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_letters: {
        Args: {
          letters: string
          font?: Json
        }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: {
          txtin: string
          nprecision?: number
        }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_linemerge: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linetocurve: {
        Args: {
          geometry: unknown
        }
        Returns: unknown
      }
      st_locatealong: {
        Args: {
          geometry: unknown
          measure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: {
          geometry: unknown
          fromelevation: number
          toelevation: number
        }
        Returns: unknown
      }
      st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_m: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_makebox2d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_makeline:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
      st_makepolygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_makevalid:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              params: string
            }
            Returns: unknown
          }
      st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: {
          inputgeom: unknown
          segs_per_quarter?: number
        }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multi: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_ndims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_node: {
        Args: {
          g: unknown
        }
        Returns: unknown
      }
      st_normalize: {
        Args: {
          geom: unknown
        }
        Returns: unknown
      }
      st_npoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_nrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numgeometries: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorring: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpatches: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_offsetcurve: {
        Args: {
          line: unknown
          distance: number
          params?: string
        }
        Returns: unknown
      }
      st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_perimeter:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_perimeter2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_pointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_points: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonize: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      st_project: {
        Args: {
          geog: unknown
          distance: number
          azimuth: number
        }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: {
          geom: unknown
          gridsize: number
        }
        Returns: unknown
      }
      st_relate: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: {
          geom: unknown
          tolerance?: number
        }
        Returns: unknown
      }
      st_reverse: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_segmentize: {
        Args: {
          geog: unknown
          max_segment_length: number
        }
        Returns: unknown
      }
      st_setsrid:
        | {
            Args: {
              geog: unknown
              srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              srid: number
            }
            Returns: unknown
          }
      st_sharedpaths: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_shortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: {
          geom: unknown
          vertex_fraction: number
          is_outer?: boolean
        }
        Returns: unknown
      }
      st_split: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_square: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_squaregrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | {
            Args: {
              geog: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom: unknown
            }
            Returns: number
          }
      st_startpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_subdivide: {
        Args: {
          geom: unknown
          maxvertices?: number
          gridsize?: number
        }
        Returns: unknown[]
      }
      st_summary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_swapordinates: {
        Args: {
          geom: unknown
          ords: unknown
        }
        Returns: unknown
      }
      st_symdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_transform:
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_proj: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              to_proj: string
            }
            Returns: unknown
          }
      st_triangulatepolygon: {
        Args: {
          g1: unknown
        }
        Returns: unknown
      }
      st_union:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              gridsize: number
            }
            Returns: unknown
          }
      st_voronoilines: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: {
          wkb: string
        }
        Returns: unknown
      }
      st_wkttosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_wrapx: {
        Args: {
          geom: unknown
          wrap: number
          move: number
        }
        Returns: unknown
      }
      st_x: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_y: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_z: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmflag: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      unlockrows: {
        Args: {
          "": string
        }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      destination_category: "total" | "level3" | "level2" | "other_levels"
      student_group: "all" | "disadvantaged" | "non_disadvantaged"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
