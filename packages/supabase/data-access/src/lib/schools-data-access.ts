import {
  FieldFilter,
  SchoolDm,
  SchoolFilters,
  SortField,
} from '@lonli-lokli/shapes';
import { initializeClientSupabase } from '@lonli-lokli/supabase/setup-client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

const DEFAULT_PAGE_SIZE = 20;

const { supabase } = initializeClientSupabase();

interface GetSchoolsResult {
  schools: SchoolDm[];
  total: number;
  pageSize: number;
}

export async function getSchools({
  page = 1,
  sortFields = [],
  filters = {}
}: {
  page: number;
  sortFields: SortField[];
  filters: SchoolFilters;
}): Promise<GetSchoolsResult> {
  // Start building the query
  let query = supabase.from('establishments').select(
    `
      urn,
      name,
      establishment_number,
      type:establishment_types!type_id(
        group_name,
        name,
        further_education_type
      ),
      phase:phase_types!phase_id(
        name,
        statutory_low_age,
        statutory_high_age
      ),
      trust:trusts!trust_id(
        id,
        name,
        sponsor_flag,
        sponsors,
        federation_flag,
        federations
    ),
      gender,
      boarders,
      nursery_provision,
      official_sixth_form,
      number_of_pupils:capacity,
      special_classes,
      last_updated:last_changed,
      location:locations!location_id(
        lat:latitude,
        lng:longitude,
        geohash,
        town,
        street,
        address3,
        uprn,
        postcode,
        locality,
        county,
        easting,
        northing,
        latitude,
        longitude,
        geohash,
        la_code,
        la_name,
        gss_la_code,
        msoa_code,
        msoa_name,
        lsoa_code,
        lsoa_name,
        ward,
        district,
        constituency,
        urban_rural,
        gor
      ),
      ukprn,
      fehe_id,
      ch_number,
      status,
      open_date,
      close_date,
      open_reason,
      close_reason,
      website,
      telephone,
      head_title,
      head_first_name,
      head_last_name,
      head_job_title,
      sen_no_stat,
      props_name,
      country,
      site_name,
      qab_name,
      establishment_accredited,
      qab_report,
      accreditation_expiry_date,
      last_changed
    `,
    { count: 'exact' }
  );

  // Apply filters to database query
  Object.entries(filters).reduce(
    (acc, [field, value]) => updateQuery(acc, field, value),
    query
  );

  // Apply sorting to database query
  sortFields.forEach(({ field, order }) => {
    query = query.order(field, { ascending: order === 'ascend' });
  });

  // Apply pagination to database query
  const from = (page - 1) * DEFAULT_PAGE_SIZE;
  const to = from + DEFAULT_PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data: schools, count, error } = await query;

  if (error) throw error;

  return {
    schools: schools.map((school) => ({
      urn: school.urn,
      name: school.name,
      establishmentNumber: school.establishment_number,
      ukprn: school.ukprn,
      feheId: school.fehe_id,
      chNumber: school.ch_number,
      type: school.type
        ? {
            name: school.type.name,
            group: school.type.group_name,
            furtherEducationType: school.type.further_education_type,
          }
        : null,
      phase: school.phase
        ? {
            name: school.phase.name,
            statutoryAges: {
              low: school.phase.statutory_low_age,
              high: school.phase.statutory_high_age,
            },
          }
        : null,
      location: school.location
        ? {
            lat: school.location.latitude,
            lng: school.location.longitude,
            geohash: school.location.geohash,
            street: school.location.street,
            town: school.location.town,
            postcode: school.location.postcode,
            locality: school.location.locality,
            county: school.location.county,
            coordinates: {
              easting: school.location.easting,
              northing: school.location.northing,
              latitude: school.location.latitude,
              longitude: school.location.longitude,
              geohash: school.location.geohash,
              uprn: school.location.uprn,
            },
            address3: school.location.address3,
            administrative: {
              laCode: school.location.la_code,
              laName: school.location.la_name,
              gssLaCode: school.location.gss_la_code,
              msoaCode: school.location.msoa_code,
              msoaName: school.location.msoa_name,
              lsoaCode: school.location.lsoa_code,
              lsoaName: school.location.lsoa_name,
              ward: school.location.ward,
              district: school.location.district,
              constituency: school.location.constituency,
              urbanRural: school.location.urban_rural,
              gor: school.location.gor,
            },
          }
        : null,
      trust: school.trust
        ? {
            name: school.trust.name,
            sponsorFlag: school.trust.sponsor_flag,
            sponsors: school.trust.sponsors,
            federationFlag: school.trust.federation_flag,
            federations: school.trust.federations,
          }
        : null,
      contact: {
        headTeacher: {
          firstName: school.head_first_name,
          lastName: school.head_last_name,
          jobTitle: school.head_job_title,
          title: school.head_title,
        },
        website: school.website,
        telephone: school.telephone,
      },

      status: school.status,
      openDate: school.open_date,
      closeDate: school.close_date,
      openReason: school.open_reason,
      closeReason: school.close_reason,
      gender: school.gender,
      boarders: school.boarders,
      nurseryProvision: school.nursery_provision,
      officialSixthForm: school.official_sixth_form,
      capacity: school.number_of_pupils,
      specialClasses: school.special_classes,
      website: school.website,
      telephone: school.telephone,
      headTitle: school.head_title,
      headFirstName: school.head_first_name,
      headLastName: school.head_last_name,
      headJobTitle: school.head_job_title,
      senNoStat: school.sen_no_stat,
      propsName: school.props_name,
      country: school.country,
      siteName: school.site_name,
      qabName: school.qab_name,
      establishmentAccredited: school.establishment_accredited,
      qabReport: school.qab_report,
      accreditationExpiryDate: school.accreditation_expiry_date,
      lastChanged: school.last_changed,
    })),
    total: count ?? 0,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

function updateQuery(
  query: PostgrestFilterBuilder<any, any, any[], 'schools', any>,
  field: string,
  { value, operator }: FieldFilter
) {
  switch (operator) {
    case 'eq':
      return query.eq(field, value);
    case 'in':
      return Array.isArray(value) ? query.in(field, value) : query;
    case 'like':
      return query.ilike(field, `%${value}%`);
    case 'gt':
      return query.gt(field, value);
      break;
    case 'lt':
      return query.lt(field, value);
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
