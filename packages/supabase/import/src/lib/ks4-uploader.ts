import { KS4ResultsBatch } from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult, Database } from '@lonli-lokli/shapes';
import {  importInBatches } from './core';
import { identity } from '@lonli-lokli/core';

type KS4ResultMainInsert =
  Database['public']['Tables']['ks4_results_main']['Insert'];
type KS4ResultDemographicsInsert =
  Database['public']['Tables']['ks4_results_demographics']['Insert'];
type KS4ResultDetailsInsert =
  Database['public']['Tables']['ks4_results_details']['Insert'];

export async function uploadKS4Results(
  batch: KS4ResultsBatch,
  { db, onProgress, year }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    let processedCount = 0;
    const totalCount =
      batch.main.length + batch.demographics.length + batch.details.length;

    console.log('Starting KS4 results import with:', {
      main: batch.main.length,
      demographics: batch.demographics.length,
      details: batch.details.length,
      total: totalCount,
    });

    await db.rpc('school_cleanup_ks4', {
      year_to_clean: year,
    });

    onProgress?.({
      current: 0,
      total: totalCount,
      details: `Starting import of ${totalCount} KS4 records: ${batch.main.length} main, ${batch.demographics.length} demographics, ${batch.details.length} details`,
    });

    // Import main results
    await importInBatches(
      batch.main.map<KS4ResultMainInsert>((r) =>
        identity<KS4ResultMainInsert>({
          id: r.id,
          urn: r.data.urn,
          year: year,
          attainment8_score: r.data.attainment8Score,
          progress8_score: r.data.progress8Score,
          progress8_lower: r.data.progress8Lower,
          progress8_upper: r.data.progress8Upper,
          basics94: r.data.basics94,
          basics95: r.data.basics95,
          ebacc_aps: r.data.ebaccAps,
          total_pupils: r.data.totalPupils,
          disadvantaged_pupils: r.data.disadvantagedPupils,
          attainment8_score_disadvantaged: r.data.attainment8ScoreDisadvantaged,
          progress8_score_disadvantaged: r.data.progress8ScoreDisadvantaged,
          attainment8_score_boys: r.data.attainment8ScoreBoys,
          attainment8_score_girls: r.data.attainment8ScoreGirls,
          progress8_score_boys: r.data.progress8ScoreBoys,
          progress8_score_girls: r.data.progress8ScoreGirls,
          low_prior_attainers: r.data.lowPriorAttainers,
          middle_prior_attainers: r.data.middlePriorAttainers,
          high_prior_attainers: r.data.highPriorAttainers,
          ebacc_entry: r.data.ebaccEntry,
          ebacc_achievement_rate94: r.data.ebaccAchievementRate94,
          ebacc_achievement_rate95: r.data.ebaccAchievementRate95,
          last_updated: new Date().toISOString(),
        })
      ),
      'school_import_ks4_results_main',
      'ks4_results',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} KS4 main results...`,
        });
      }
    );

    // Import demographics
    await importInBatches(
      batch.demographics.map((d) =>
        identity<KS4ResultDemographicsInsert>({
          id: d.id,
          urn: d.data.urn,
          year: year,
          pupils_total: d.data.pupils.total,
          pupils_exam_cohort: d.data.pupils.examCohort,
          pupils_boys: d.data.pupils.boys,
          pupils_girls: d.data.pupils.girls,
          characteristics_eal: d.data.characteristics.eal,
          characteristics_sen: d.data.characteristics.sen,
          characteristics_disadvantaged: d.data.characteristics.disadvantaged,
          last_updated: new Date().toISOString(),
        })
      ),
      'school_import_ks4_demographics',
      'demographics',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} KS4 demographics...`,
        });
      }
    );

    // Import details
    await importInBatches(
      batch.details.map((d) =>
        identity<KS4ResultDetailsInsert>({
          id: d.id,
          urn: d.data.urn,
          year: d.data.year,
          // Attainment 8
          attainment8_english: d.data.attainment8.english,
          attainment8_maths: d.data.attainment8.maths,
          attainment8_ebacc: d.data.attainment8.ebacc,
          attainment8_open: d.data.attainment8.open,
          // Low prior
          attainment8_low_prior_overall: d.data.attainment8.lowPrior.overall,
          attainment8_low_prior_english: d.data.attainment8.lowPrior.english,
          attainment8_low_prior_maths: d.data.attainment8.lowPrior.maths,
          attainment8_low_prior_ebacc: d.data.attainment8.lowPrior.ebacc,
          attainment8_low_prior_open: d.data.attainment8.lowPrior.open,
          // Middle prior
          attainment8_middle_prior_overall:
            d.data.attainment8.middlePrior.overall,
          attainment8_middle_prior_english:
            d.data.attainment8.middlePrior.english,
          attainment8_middle_prior_maths: d.data.attainment8.middlePrior.maths,
          attainment8_middle_prior_ebacc: d.data.attainment8.middlePrior.ebacc,
          attainment8_middle_prior_open: d.data.attainment8.middlePrior.open,
          // High prior
          attainment8_high_prior_overall: d.data.attainment8.highPrior.overall,
          attainment8_high_prior_english: d.data.attainment8.highPrior.english,
          attainment8_high_prior_maths: d.data.attainment8.highPrior.maths,
          attainment8_high_prior_ebacc: d.data.attainment8.highPrior.ebacc,
          attainment8_high_prior_open: d.data.attainment8.highPrior.open,
          // Progress 8 subjects
          progress8_english_score: d.data.progress8.english.score,
          progress8_english_lower: d.data.progress8.english.lower,
          progress8_english_upper: d.data.progress8.english.upper,
          progress8_maths_score: d.data.progress8.maths.score,
          progress8_maths_lower: d.data.progress8.maths.lower,
          progress8_maths_upper: d.data.progress8.maths.upper,
          progress8_ebacc_score: d.data.progress8.ebacc.score,
          progress8_ebacc_lower: d.data.progress8.ebacc.lower,
          progress8_ebacc_upper: d.data.progress8.ebacc.upper,
          progress8_open_score: d.data.progress8.open.score,
          progress8_open_lower: d.data.progress8.open.lower,
          progress8_open_upper: d.data.progress8.open.upper,
          // EBacc subjects
          ebacc_english_entry: d.data.ebacc.subjects.english.entry,
          ebacc_english_achieved94: d.data.ebacc.subjects.english.achieved94,
          ebacc_english_achieved95: d.data.ebacc.subjects.english.achieved95,
          ebacc_maths_entry: d.data.ebacc.subjects.maths.entry,
          ebacc_maths_achieved94: d.data.ebacc.subjects.maths.achieved94,
          ebacc_maths_achieved95: d.data.ebacc.subjects.maths.achieved95,
          ebacc_science_entry: d.data.ebacc.subjects.science.entry,
          ebacc_science_achieved94: d.data.ebacc.subjects.science.achieved94,
          ebacc_science_achieved95: d.data.ebacc.subjects.science.achieved95,
          ebacc_humanities_entry: d.data.ebacc.subjects.humanities.entry,
          ebacc_humanities_achieved94:
            d.data.ebacc.subjects.humanities.achieved94,
          ebacc_humanities_achieved95:
            d.data.ebacc.subjects.humanities.achieved95,
          ebacc_languages_entry: d.data.ebacc.subjects.languages.entry,
          ebacc_languages_achieved94:
            d.data.ebacc.subjects.languages.achieved94,
          ebacc_languages_achieved95:
            d.data.ebacc.subjects.languages.achieved95,
          // Groups
          groups_disadvantaged_attainment8:
            d.data.groups.disadvantaged.attainment8,
          groups_disadvantaged_progress8_score:
            d.data.groups.disadvantaged.progress8.score,
          groups_disadvantaged_progress8_lower:
            d.data.groups.disadvantaged.progress8.lower,
          groups_disadvantaged_progress8_upper:
            d.data.groups.disadvantaged.progress8.upper,
          groups_not_disadvantaged_attainment8:
            d.data.groups.notDisadvantaged.attainment8,
          groups_not_disadvantaged_progress8_score:
            d.data.groups.notDisadvantaged.progress8.score,
          groups_not_disadvantaged_progress8_lower:
            d.data.groups.notDisadvantaged.progress8.lower,
          groups_not_disadvantaged_progress8_upper:
            d.data.groups.notDisadvantaged.progress8.upper,
          groups_eal_attainment8: d.data.groups.eal.attainment8,
          groups_eal_progress8_score: d.data.groups.eal.progress8.score,
          groups_eal_progress8_lower: d.data.groups.eal.progress8.lower,
          groups_eal_progress8_upper: d.data.groups.eal.progress8.upper,
          groups_boys_attainment8: d.data.groups.gender.boys.attainment8,
          groups_boys_progress8_score:
            d.data.groups.gender.boys.progress8.score,
          groups_boys_progress8_lower:
            d.data.groups.gender.boys.progress8.lower,
          groups_boys_progress8_upper:
            d.data.groups.gender.boys.progress8.upper,
          groups_girls_attainment8: d.data.groups.gender.girls.attainment8,
          groups_girls_progress8_score:
            d.data.groups.gender.girls.progress8.score,
          groups_girls_progress8_lower:
            d.data.groups.gender.girls.progress8.lower,
          groups_girls_progress8_upper:
            d.data.groups.gender.girls.progress8.upper,
          // Progress 8 Original
          progress8_original_score: d.data.progress8Original.score,
          progress8_original_lower: d.data.progress8Original.lower,
          progress8_original_upper: d.data.progress8Original.upper,
          // Attainment 8 Open
          attainment8_open_gcse: d.data.attainment8Open.gcse,
          attainment8_open_non_gcse: d.data.attainment8Open.nonGcse,
          last_updated: new Date(d.data.lastUpdated).toISOString(),
        })
      ),
      'school_import_ks4_details',
      'details',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} KS4 details...`,
        });
      }
    );

    return {
      success: true,
      count: processedCount,
    };
  } catch (error) {
    console.error('KS4 import error:', error);

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
