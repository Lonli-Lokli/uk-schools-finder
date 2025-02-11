import { SchoolBatch } from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';
import { Database } from '@lonli-lokli/supabase/setup-client';

import { identity, importInBatches } from './core';

type EstablishmentTypeInsert =
  Database['public']['Tables']['establishment_types']['Insert'];
type PhaseTypeInsert = Database['public']['Tables']['phase_types']['Insert'];
type EducationPhaseInsert =
  Database['public']['Tables']['education_phases']['Insert'];
type LocationInsert = Database['public']['Tables']['locations']['Insert'];
type TrustInsert = Database['public']['Tables']['trusts']['Insert'];
type CensusInsert = Database['public']['Tables']['school_census']['Insert'];
type SchoolInspectionInsert =
  Database['public']['Tables']['school_inspections']['Insert'];
type SchoolInsert = Database['public']['Tables']['establishments']['Insert'];

export async function uploadSchools(
  batch: SchoolBatch,
  { db, onProgress }: SupabaseImportParams
): Promise<ImportResult> {
  try {
    let processedCount = 0;
    const totalCount =
      batch.main.length +
      batch.types.length +
      batch.phases.length +
      batch.locations.length +
      batch.trusts.length +
      batch.census.length +
      batch.inspections.length;

    console.log('Starting import with:', {
      establishments: batch.main.length,
      types: batch.types.length,
      phases: batch.phases.length,
      locations: batch.locations.length,
      trusts: batch.trusts.length,
      census: batch.census.length,
      inspections: batch.inspections.length,
      total: totalCount,
    });

    onProgress?.({
      current: 0,
      total: totalCount,
      details: `Starting import of ${totalCount} total records: ${batch.main.length} schools, ${batch.types.length} types, ${batch.phases.length} phases, ${batch.locations.length} locations, ${batch.trusts.length} trusts, ${batch.census.length} census, ${batch.inspections.length} inspections`,
    });

    // First, clean up existing data
    const { error: cleanupError } = await db.rpc('school_cleanup_import');
    if (cleanupError) throw cleanupError;

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: 'Cleaning up existing data...',
    });

    // 1. Import reference data first
    await importInBatches(
      batch.types.map<EstablishmentTypeInsert>((t) => ({
        id: t.id,
        name: t.data.name,
        group_name: t.data.group,
        further_education_type: t.data.furtherEducationType,
      })),
      'school_import_establishment_types',
      'types',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} establishment types...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.types.length} establishment types...`,
    });

    await importInBatches(
      batch.phases.map<PhaseTypeInsert>((p) => ({
        id: p.id,
        name: p.data.name,
        statutory_low_age: p.data.statutoryAges.low,
        statutory_high_age: p.data.statutoryAges.high,
      })),
      'school_import_phase_types',
      'phases',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} phase types...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.phases.length} phase types...`,
    });

    await importInBatches(
      batch.locations.map<LocationInsert>((l) => {
        return {
          id: l.id,
          street: l.data.street,
          locality: l.data.locality,
          town: l.data.town,
          county: l.data.county,
          postcode: l.data.postcode,
          latitude: l.data.coordinates?.latitude,
          longitude: l.data.coordinates?.longitude,
          easting: l.data.coordinates?.easting,
          northing: l.data.coordinates?.northing,
          // coordinates: l.data.coordinates, // DO NOT GENERATE
          geohash: l.data.coordinates.geohash,
          gor: l.data.administrative.gor,
          gss_la_code: l.data.administrative.gssLaCode,
          msoa_code: l.data.administrative.msoaCode,
          msoa_name: l.data.administrative.msoaName,
          lsoa_code: l.data.administrative.lsoaCode,
          lsoa_name: l.data.administrative.lsoaName,
          ward: l.data.administrative.ward,
          district: l.data.administrative.district,
          urban_rural: l.data.administrative.urbanRural,
          la_code: l.data.administrative.laCode,
          la_name: l.data.administrative.laName,
          uprn: l.data.coordinates.uprn,
        };
      }),
      'school_import_locations',
      'locations',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} locations...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.locations.length} locations...`,
    });

    await importInBatches(
      batch.phases.map<EducationPhaseInsert>((l) => ({
        id: l.id,
        name: l.data.name,
        statutory_age_low: l.data.statutoryAges.low,
        statutory_age_high: l.data.statutoryAges.high,
      })),
      'school_import_education_phases',
      'phases',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} education phases...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.phases.length} education phases...`,
    });

    await importInBatches(
      batch.trusts.map((t) =>
        identity<TrustInsert>({
          id: t.id,
          name: t.data.name,
          sponsor_flag: t.data.sponsorFlag,
          federation_flag: t.data.federationFlag,
          sponsors: t.data.sponsors,
          federations: t.data.federations,
        })
      ),
      'school_import_trusts',
      'trusts',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} trusts...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.trusts.length} trusts...`,
    });

    // 2. Import schools (main establishments)
    await importInBatches(
      batch.main.map<SchoolInsert>((s) => {
        return identity<SchoolInsert>({
          id: s.id,
          urn: s.data.urn,
          name: s.data.name,
          type_id: s.data.typeId,
          phase_id: s.data.phaseId,
          location_id: s.data.locationId,
          trust_id: s.data.trustId,
          status: s.data.status,
          gender: s.data.gender,
          boarders: s.data.boarders,
          nursery_provision: s.data.nurseryProvision,
          official_sixth_form: s.data.officialSixthForm,
          capacity: s.data.capacity,
          head_title: s.data.contact?.headTeacher?.title,
          head_first_name: s.data.contact?.headTeacher?.firstName,
          head_last_name: s.data.contact?.headTeacher?.lastName,
          telephone: s.data.contact?.telephone,
          website: s.data.contact?.website,
          sen_no_stat: s.data.senNoStat,
          props_name: s.data.propsName,
          country: s.data.country,
          site_name: s.data.siteName,
          qab_name: s.data.qabName,
          accreditation_expiry_date: s.data.accreditationExpiryDate,
          last_changed: s.data.lastChanged,
          ch_number: s.data.chNumber,
          close_date: s.data.closeDate,
          close_reason: s.data.closeReason,
          open_date: s.data.openDate,
          open_reason: s.data.openReason,
          special_classes: s.data.specialClasses,
          ukprn: s.data.ukprn,
          fehe_id: s.data.feheId,
          establishment_accredited: s.data.establishmentAccredited,
          qab_report: s.data.qabReport,
          establishment_number: s.data.establishmentNumber,
          head_job_title: s.data.contact?.headTeacher?.jobTitle,
          lea_code: s.data.leaCode,
        });
      }),
      'school_import_schools',
      'schools',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} schools...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.main.length} schools...`,
    });

    // 3. Import dependent data last
    await importInBatches(
      batch.census.map((c) =>
        identity<CensusInsert>({
          id: c.id,
          school_urn: c.data.schoolUrn,
          date: c.data.date,
          pupils: c.data.pupils,
          boys: c.data.boys,
          girls: c.data.girls,
          fsm: c.data.fsm,
        })
      ),
      'school_import_census',
      'census',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} census records...`,
        });
      }
    );

    await importInBatches(
      batch.inspections.map((i) =>
        identity<SchoolInspectionInsert>({
          id: i.id,
          school_urn: i.data.schoolUrn,
          date: i.data.date,
          bso_inspectorate: i.data.bsoInspectorate,
          inspectorate_name: i.data.inspectorateName,
          report: i.data.report,
          next_visit: i.data.nextVisit,
        })
      ),
      'school_import_inspections',
      'inspections',
      db,
      (count) => {
        processedCount += count;
        onProgress?.({
          current: processedCount,
          total: totalCount,
          details: `Imported ${count} inspection records...`,
        });
      }
    );

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.inspections.length} inspection records...`,
    });

    return {
      success: true,
      count: processedCount,
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
