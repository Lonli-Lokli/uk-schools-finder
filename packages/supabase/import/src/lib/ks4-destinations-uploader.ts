import { KS4DestinationsBatch } from '@lonli-lokli/data-transformers';
import { identity, importInBatches } from './core';
import { ImportResult, SupabaseImportParams } from '@lonli-lokli/shapes';
import { Database } from '@lonli-lokli/supabase/setup-client';

type KS4DestinationsInsert =
  Database['public']['Tables']['ks4_destinations_main']['Insert'];
type KS4DestinationDetailsInsert =
  Database['public']['Tables']['ks4_destinations_details']['Insert'];

export async function uploadKS4Destinations(
  batch: KS4DestinationsBatch,
  { db, onProgress, year }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    const totalCount = batch.main.length + batch.details.length;
    let processedCount = 0;

    // Clean up existing data for this year
    await db.rpc('school_cleanup_ks4_destinations', {
      year_to_clean: year,
    });

    // Import main destinations data
    await importInBatches(
      batch.main.map((m) =>
        identity<KS4DestinationsInsert>({
          id: m.id,
          year: year,
          urn: m.data.urn,
          apprenticeships: m.data.apprenticeships,
          cohort_size: m.data.cohortSize,
          disadvantaged_sustained: m.data.disadvantagedSustained,
          education: m.data.education,
          employment: m.data.employment,
          further_education: m.data.furtherEducation,
          last_updated: m.data.lastUpdated,
          non_disadvantaged_sustained: m.data.nonDisadvantagedSustained,
          sixth_form_college: m.data.sixthFormCollege,
          sustained: m.data.sustained,
          sixth_form: m.data.sixthForm,
        })
      ),
      'school_import_ks4_destinations_main',
      'destinations',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Importing ${count} KS4 destinations...`,
        });
      }
    );

    // Import details data
    await importInBatches(
      batch.details.map((d) =>
        identity<KS4DestinationDetailsInsert>({
          id: d.id,
          year: year,
          urn: d.data.urn,
          apprenticeships_number: d.data.numbers.apprenticeships,
          cohort_number: d.data.numbers.cohort,
          disadvantaged_apprenticeships_number:
            d.data.disadvantaged.apprenticeships.number,
          disadvantaged_education_number: d.data.disadvantaged.education.number,
          disadvantaged_employment_number:
            d.data.disadvantaged.employment.number,
          disadvantaged_sustained_number: d.data.disadvantaged.sustained.number,
          last_updated: d.data.lastUpdated,
          disadvantaged_apprenticeships_percentage:
            d.data.disadvantaged.apprenticeships.percentage,
          disadvantaged_education_percentage:
            d.data.disadvantaged.education.percentage,
          disadvantaged_employment_percentage:
            d.data.disadvantaged.employment.percentage,
          disadvantaged_sustained_percentage:
            d.data.disadvantaged.sustained.percentage,
          non_disadvantaged_apprenticeships_number:
            d.data.nonDisadvantaged.apprenticeships.number,
          non_disadvantaged_education_number:
            d.data.nonDisadvantaged.education.number,
          non_disadvantaged_employment_number:
            d.data.nonDisadvantaged.employment.number,
          non_disadvantaged_sustained_number:
            d.data.nonDisadvantaged.sustained.number,
          disadvantaged_cohort: d.data.disadvantaged.cohort,
          non_disadvantaged_cohort: d.data.nonDisadvantaged.cohort,
          disadvantaged_other_education_number:
            d.data.disadvantaged.otherEducation.number,
          non_disadvantaged_other_education_number:
            d.data.nonDisadvantaged.otherEducation.number,
          disadvantaged_not_sustained_number:
            d.data.disadvantaged.notSustained.number,
          non_disadvantaged_not_sustained_number:
            d.data.nonDisadvantaged.notSustained.number,
          disadvantaged_further_education_number:
            d.data.disadvantaged.furtherEducation.number,
          non_disadvantaged_further_education_number:
            d.data.nonDisadvantaged.furtherEducation.number,
          disadvantaged_further_education_percentage:
            d.data.disadvantaged.furtherEducation.percentage,
          non_disadvantaged_further_education_percentage:
            d.data.nonDisadvantaged.furtherEducation.percentage,
          disadvantaged_school_sixth_form_number:
            d.data.disadvantaged.schoolSixthForm.number,
          non_disadvantaged_school_sixth_form_number:
            d.data.nonDisadvantaged.schoolSixthForm.number,
          disadvantaged_school_sixth_form_percentage:
            d.data.disadvantaged.schoolSixthForm.percentage,
          non_disadvantaged_school_sixth_form_percentage:
            d.data.nonDisadvantaged.schoolSixthForm.percentage,
          disadvantaged_not_sustained_percentage:
            d.data.disadvantaged.notSustained.percentage,
          non_disadvantaged_not_sustained_percentage:
            d.data.nonDisadvantaged.notSustained.percentage,
          disadvantaged_unknown_number: d.data.disadvantaged.unknown.number,
          non_disadvantaged_unknown_number:
            d.data.nonDisadvantaged.unknown.number,
          disadvantaged_unknown_percentage:
            d.data.disadvantaged.unknown.percentage,
          non_disadvantaged_unknown_percentage:
            d.data.nonDisadvantaged.unknown.percentage,
          disadvantaged_other_education_percentage:
            d.data.disadvantaged.otherEducation.percentage,
          non_disadvantaged_other_education_percentage:
            d.data.nonDisadvantaged.otherEducation.percentage,
          non_disadvantaged_sustained_percentage:
            d.data.nonDisadvantaged.sustained.percentage,
          non_disadvantaged_education_percentage:
            d.data.nonDisadvantaged.education.percentage,
          disadvantaged_sixth_form_college_number:
            d.data.disadvantaged.sixthFormCollege.number,
          non_disadvantaged_sixth_form_college_number:
            d.data.nonDisadvantaged.sixthFormCollege.number,
          disadvantaged_sixth_form_college_percentage:
            d.data.disadvantaged.sixthFormCollege.percentage,
          non_disadvantaged_sixth_form_college_percentage:
            d.data.nonDisadvantaged.sixthFormCollege.percentage,
          education_number: d.data.numbers.education,
          employment_number: d.data.numbers.employment,
          sustained_number: d.data.numbers.sustained,
          sixth_form_college_number: d.data.numbers.sixthFormCollege,
          other_education_number: d.data.numbers.otherEducation,
          not_sustained_number: d.data.numbers.notSustained,
          unknown_number: d.data.numbers.unknown,
          further_education_number: d.data.numbers.furtherEducation,
          school_sixth_form_number: d.data.numbers.schoolSixthForm,
          non_disadvantaged_apprenticeships_percentage:
            d.data.nonDisadvantaged.apprenticeships.percentage,
          non_disadvantaged_employment_percentage:
            d.data.nonDisadvantaged.employment.percentage,
        })
      ),
      'school_import_ks4_destinations_details',
      'details',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Importing ${count} KS4 destination details...`,
        });
      }
    );

    return {
      success: true,
      count: processedCount,
    };
  } catch (error) {
    console.error('KS4 destinations import error:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null
        ? [
            'message' in error ? error.message : null,
            'details' in error && error.details
              ? `Details: ${error.details}`
              : null,
            'hint' in error && error.hint ? `Hint: ${error.hint}` : null,
            'code' in error && error.code ? `Code: ${error.code}` : null,
          ]
            .filter(Boolean)
            .join('\n')
        : 'Unknown error';

    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
}
