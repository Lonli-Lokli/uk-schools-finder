import { KS5DestinationsBatch } from '@lonli-lokli/data-transformers';
import {
  SupabaseImportParams,
  ImportResult,
  DestinationStatsDm,
} from '@lonli-lokli/shapes';
import { importInBatches, identity } from './core';
import { Database } from '@lonli-lokli/supabase/setup-client';

type KS5DestinationsMainInsert =
  Database['public']['Tables']['ks5_destinations']['Insert'];
type KS5DestinationsStatsInsert =
  Database['public']['Tables']['ks5_destinations_stats']['Insert'];
type DestinationCategory = Database['public']['Enums']['destination_category'];
type StudentGroup = Database['public']['Enums']['student_group'];

export async function uploadKS5Destinations(
  batch: KS5DestinationsBatch,
  { db, onProgress, year }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    let totalProcessed = 0;

    const { error: cleanupError } = await db.rpc(
      'school_cleanup_ks5_destinations',
      { year_to_clean: year }
    );

    if (cleanupError) {
      throw new Error(
        `Failed to cleanup year ${year}: ${cleanupError.message}`
      );
    }

    const normalizedRecords = batch.main.reduce<KS5DestinationsMainInsert[]>(
      (acc, d) => {
        const baseRecord = {
          urn: d.data.urn,
          year: year,
          last_updated: d.data.lastUpdated,
        };

        // Helper function to create a record for each category/group combination
        const createRecord = (
          category: DestinationCategory,
          group: StudentGroup,
          data: DestinationStatsDm
        ): KS5DestinationsMainInsert =>
          identity<KS5DestinationsMainInsert>({
            id: `${d.id}_${category}_${group}`,
            ...baseRecord,
            category,
            student_group: group,
            cohort_size: data.cohortSize,
            destinations_overall: data.destinations.overall,
            destinations_education_total: data.destinations.education.total,
            destinations_education_further:
              data.destinations.education.furtherEducation,
            destinations_education_higher:
              data.destinations.education.higherEducation,
            destinations_education_other: data.destinations.education.other,
            destinations_employment_total: data.destinations.employment.total,
            destinations_employment_apprenticeships:
              data.destinations.employment.apprenticeships,
            destinations_other_not_sustained:
              data.destinations.other.notSustained,
            destinations_other_not_captured:
              data.destinations.other.notCaptured,
            percentages_overall: data.percentages.overall,
            percentages_education_total: data.percentages.education.total,
            percentages_education_further:
              data.percentages.education.furtherEducation,
            percentages_education_higher:
              data.percentages.education.higherEducation,
            percentages_education_other: data.percentages.education.other,
            percentages_employment_total: data.percentages.employment.total,
            percentages_employment_apprenticeships:
              data.percentages.employment.apprenticeships,
            percentages_other_not_sustained:
              data.percentages.other.notSustained,
            percentages_other_not_captured: data.percentages.other.notCaptured,
          });

        // Add records for each category and group

        return [
          ...acc,
          // Total category
          createRecord('total', 'all', d.data.total.all),
          createRecord('total', 'disadvantaged', d.data.total.disadvantaged),
          createRecord(
            'total',
            'non_disadvantaged',
            d.data.total.nonDisadvantaged
          ),
          // Level 3 category
          createRecord('level3', 'all', d.data.level3.all),
          createRecord('level3', 'disadvantaged', d.data.level3.disadvantaged),
          createRecord(
            'level3',
            'non_disadvantaged',
            d.data.level3.nonDisadvantaged
          ),
          // Level 2 category
          createRecord('level2', 'all', d.data.level2.all),
          createRecord('level2', 'disadvantaged', d.data.level2.disadvantaged),
          createRecord(
            'level2',
            'non_disadvantaged',
            d.data.level2.nonDisadvantaged
          ),
          // Other Levels category
          createRecord('other_levels', 'all', d.data.otherLevels.all),
          createRecord(
            'other_levels',
            'disadvantaged',
            d.data.otherLevels.disadvantaged
          ),
          createRecord(
            'other_levels',
            'non_disadvantaged',
            d.data.otherLevels.nonDisadvantaged
          ),
        ];
      },
      []
    );

    const statRecords = batch.stats.flatMap<KS5DestinationsStatsInsert>((s) =>
      s.data.destinations.map((d) =>
        identity<KS5DestinationsStatsInsert>({
          id: s.id,
          year: d.year,
          higher_education: d.higherEducation,
          further_education: d.furtherEducation,
          employment: d.employment,
          last_updated: d.lastUpdated,
        })
      )
    );

    const total = normalizedRecords.length + statRecords.length;

    // Upload main data
    if (batch.main.length > 0) {
      await importInBatches(
        normalizedRecords,
        'school_import_ks5_destinations',
        'destinations',
        db,
        (count) => {
          totalProcessed += count;
          onProgress?.({
            current: totalProcessed,
            total,
            details: `Imported ${count} KS5 destinations records`,
          });
        }
      );
    }

    // Upload stats data
    if (batch.stats.length > 0) {
      await importInBatches(
        statRecords,
        'school_import_ks5_destinations_stats',
        'stats',
        db,
        (count) => {
          totalProcessed += count;
          onProgress?.({
            current: totalProcessed,
            total,
            details: `Imported ${count} KS5 destinations stats records`,
          });
        }
      );
    }

    return {
      success: true,
      count: totalProcessed,
    };
  } catch (error) {
    console.error('Import error:', error);
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
