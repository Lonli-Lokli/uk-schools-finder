import { KS5HEDestinationsBatch } from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult, Database } from '@lonli-lokli/shapes';
import { importInBatches } from './core';
import { identity } from '@lonli-lokli/core';

type KS5HEDestinationsInsert =
  Database['public']['Tables']['ks5_he_destinations']['Insert'];

export async function uploadKS5HEDestinations(
  batch: KS5HEDestinationsBatch,
  { db, onProgress, year }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    let totalProcessed = 0;
    const total = batch.main.length;

    const { error: cleanupError } = await db.rpc(
      'school_cleanup_ks5_he_destinations',
      { year_to_clean: year }
    );

    if (cleanupError) {
      throw new Error(
        `Failed to cleanup year ${year}: ${cleanupError.message}`
      );
    }

    // Upload main data
    if (batch.main.length > 0) {
      const records = batch.main.map((d) => identity<KS5HEDestinationsInsert>({
        id: d.id,
        school_urn: d.data.schoolUrn,
        year: year,
        oxbridge_percentage: d.data.universities.oxbridge.percentage,
        russell_percentage: d.data.universities.russell.percentage,
        top_third_percentage: d.data.universities.topThird.percentage,
        higher_technical_percentage: d.data.universities.higherTechnical.percentage,
        disadvantaged_oxbridge_percentage:
          d.data.disadvantaged.oxbridge.percentage,
        disadvantaged_russell_percentage:
          d.data.disadvantaged.russell.percentage,
        disadvantaged_top_third_percentage:
          d.data.disadvantaged.topThird.percentage,
        disadvantaged_higher_technical_percentage:
          d.data.disadvantaged.higherTechnical.percentage,
        last_updated: d.data.lastUpdated,
      }));

      await importInBatches(
        records,
        'school_import_ks5_he_destinations',
        'destinations',
        db,
        (count) => {
          totalProcessed += count;
          onProgress?.({
            current: totalProcessed,
            total,
            details: `Imported ${count} KS5 HE destinations records`,
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
