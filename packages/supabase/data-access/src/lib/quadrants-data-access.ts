import { identity } from '@lonli-lokli/core';
import {
  QuadrantDm,
  QuadrantSchoolDm,
  SchoolFilters,
} from '@lonli-lokli/shapes';
import { initializeClientSupabase } from '@lonli-lokli/supabase/setup-client';

const { supabase } = initializeClientSupabase();

// export async function getQuadrants({
//   filters = {},
// }: {
//   filters: SchoolFilters;
// }) {
//   const { data: defaultQuadrant, error } = await supabase
//     .from('quadrants')
//     .select('id, level, geohash, schools(id, name, lat, lng)')
//     .eq('level', 0)
//     .single();

//   if (error || !defaultQuadrant) {
//     throw new Error('Failed to load default quadrant');
//   }

//   return defaultQuadrant;
// }

export async function getQuadrantByGeohash({
  filters = {},
}: {
  filters: SchoolFilters;
}) {
  const { data: quadrant, error } = await supabase
    .from('quadrants')
    .select(`
      id,
      level,
      geohash,
      school_count,
      bounds:bounding_boxes!bounds_id(
        ne_lat,
        ne_lng,
        ne_geohash,
        sw_lat,
        sw_lng,
        sw_geohash
      ),
      quadrant_schools!inner(
        lat,
        lng,
        geohash,
        establishment:establishments!urn(
          urn,
          name,
          type:establishment_types!type_id(
            name
          ),
          capacity
        )
      )
    `)
    .eq('level', 0)
    .single();

  if (error || !quadrant) {
    throw new Error(
      'Failed to load default quadrant : ' + (error?.message ?? 'Unknown error')
    );
  }

  return {
    id: quadrant.id,
    level: quadrant.level,
    bounds: {
      ne: {
        lat: quadrant.bounds.ne_lat,
        lng: quadrant.bounds.ne_lng,
        geohash: quadrant.bounds.ne_geohash,
      },
      sw: {
        lat: quadrant.bounds.sw_lat,
        lng: quadrant.bounds.sw_lng,
        geohash: quadrant.bounds.sw_geohash,
      },
    },
    schoolCount: quadrant.school_count,
    schools: quadrant.quadrant_schools.map((school) =>
      identity<QuadrantSchoolDm>({
        name: school.establishment.name,
        capacity: school.establishment.capacity ?? 0, // TODO: remove
        type: school.establishment.type?.name ?? null,
        urn: school.establishment.urn,
        location: {
          lat: school.lat,
          lng: school.lng,
          geohash: school.geohash,
        },
      })
    ),
  };
}
