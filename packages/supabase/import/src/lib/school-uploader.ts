import { SchoolBatch } from '@lonli-lokli/data-transformers';
import { SupabaseImportParams, ImportResult } from '@lonli-lokli/shapes';
import type { Database } from './database.types';

import { identity } from './core';

type EstablishmentTypeInsert =
  Database['public']['Tables']['establishment_types']['Insert'];
type PhaseTypeInsert = Database['public']['Tables']['phase_types']['Insert'];
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

    // First, clean up existing data
    const { error: cleanupError } = await db.rpc('school_cleanup_import');
    if (cleanupError) throw cleanupError;

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: 'Cleaning up existing data...',
    });

    // Import establishment types
    const { error: typesError } = await db.rpc(
      'school_import_establishment_types',
      {
        types: batch.types.map<EstablishmentTypeInsert>((t) => ({
          id: t.id,
          name: t.data.name,
          group_name: t.data.group,
          further_education_type: t.data.furtherEducationType,
        })),
      }
    );
    if (typesError) {
      console.error('Types error:', typesError);
      throw typesError;
    }
    processedCount += batch.types.length;
    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.types.length} establishment types...`,
    });

    // Import phase types
    const { error: phasesError } = await db.rpc('school_import_phase_types', {
      phases: batch.phases.map((p) =>
        identity<PhaseTypeInsert>({
          id: p.id,
          name: p.data.name,
          statutory_low_age: p.data.statutoryAges.low,
          statutory_high_age: p.data.statutoryAges.high,
        })
      ),
    });
    if (phasesError) throw phasesError;
    processedCount += batch.phases.length;

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.phases.length} phase types...`,
    });

    // Import locations
    const { error: locationsError } = await db.rpc('school_import_locations', {
      locations: batch.locations.map((l) =>
        identity<LocationInsert>({
          id: l.id,
          street: l.data.street,
          locality: l.data.locality,
          town: l.data.town,
          county: l.data.county,
          postcode: l.data.postcode,
          latitude: l.data.coordinates.latitude,
          longitude: l.data.coordinates.longitude,
          address3: l.data.address3,
          easting: l.data.coordinates.easting,
          northing: l.data.coordinates.northing,
          constituency: l.data.administrative.constituency,
          coordinates: l.data.coordinates,
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
        })
      ),
    });
    if (locationsError) throw locationsError;
    processedCount += batch.locations.length;

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.locations.length} locations...`,
    });

    // Import trusts
    const { error: trustsError } = await db.rpc('school_import_trusts', {
      trusts: batch.trusts.map((t) =>
        identity<TrustInsert>({
          id: t.id,
          name: t.data.name,
          sponsor_flag: t.data.sponsorFlag,
          federation_flag: t.data.federationFlag,
          sponsors: t.data.sponsors,
          federations: t.data.federations,
        })
      ),
    });
    if (trustsError) throw trustsError;
    processedCount += batch.trusts.length;

    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.trusts.length} trusts...`,
    });

    // Import census data
    const { error: censusError } = await db.rpc('school_import_census', {
      census: batch.census.map((c) =>
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
    });
    if (censusError) throw censusError;
    processedCount += batch.census.length;
    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.census.length} census records...`,
    });

    // Import inspections
    const { error: inspectionsError } = await db.rpc(
      'school_import_inspections',
      {
        inspections: batch.inspections.map((i) =>
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
      }
    );
    if (inspectionsError) throw inspectionsError;
    processedCount += batch.inspections.length;
    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.inspections.length} inspection records...`,
    });

    // Import all schools at once
    const { error: schoolsError } = await db.rpc('school_import_schools', {
      schools: batch.main.map((item) => identity<SchoolInsert>({
        id: item.id,
        urn: item.data.urn,
        name: item.data.name,
        type_id: item.data.typeId,
        phase_id: item.data.phaseId,
        location_id: item.data.locationId,
        trust_id: item.data.trustId,
        status: item.data.status,
        gender: item.data.gender,
        boarders: item.data.boarders,
        nursery_provision: item.data.nurseryProvision,
        official_sixth_form: item.data.officialSixthForm,
        capacity: item.data.capacity,
        head_title: item.data.contact?.headTeacher?.title,
        head_first_name: item.data.contact?.headTeacher?.firstName,
        head_last_name: item.data.contact?.headTeacher?.lastName,
        telephone: item.data.contact?.telephone,
        website: item.data.contact?.website,
        sen_no_stat: item.data.senNoStat,
        props_name: item.data.propsName,
        country: item.data.country,
        site_name: item.data.siteName,
        qab_name: item.data.qabName,
        accreditation_expiry_date: item.data.accreditationExpiryDate,
        last_changed: item.data.lastChanged,
        ch_number: item.data.chNumber,
        close_date: item.data.closeDate,
        close_reason: item.data.closeReason,
        open_date: item.data.openDate,
        open_reason: item.data.openReason,
        special_classes: item.data.specialClasses,
        ukprn: item.data.ukprn,
        fehe_id: item.data.feheId,
        establishment_accredited: item.data.establishmentAccredited,
        qab_report: item.data.qabReport,
        establishment_number: item.data.establishmentNumber,
        head_job_title: item.data.contact?.headTeacher?.jobTitle,
        lea_code: item.data.leaCode     
        
  
      })),
    });

    if (schoolsError) {
      await db.rpc('school_cleanup_import');
      throw schoolsError;
    }

    processedCount += batch.main.length;
    onProgress?.({
      current: processedCount,
      total: totalCount,
      details: `Imported ${batch.main.length} schools...`,
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
        : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Unknown error occurred';

    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
}
