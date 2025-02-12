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
  geohash,
}: {
  geohash: string;
}): Promise<QuadrantDm> {
  const { data: defaultQuadrant, error } = await supabase
    .from('quadrants')
    .select(
      `
      id,
      level,
      geohash,
      bounds:bounding_boxes!bounds_id(
        id, 
        ne_lat, 
        ne_lng,
        ne_geohash,
        sw_lat,
        sw_lng,
        sw_geohash
      ),
      school_count,
      quadrant_schools(
        id,
        urn,
        name,
        lat,
        lng,
        geohash
      )
    `
    )
    .eq('level', 0)
    .single();

  if (error || !defaultQuadrant) {
    throw new Error(
      'Failed to load default quadrant : ' + (error?.message ?? 'Unknown error')
    );
  }

  return {
    id: defaultQuadrant.id,
    level: defaultQuadrant.level,
    bounds: {
      ne: {
        lat: defaultQuadrant.bounds.ne_lat,
        lng: defaultQuadrant.bounds.ne_lng,
        geohash: defaultQuadrant.bounds.ne_geohash,
      },
      sw: {
        lat: defaultQuadrant.bounds.sw_lat,
        lng: defaultQuadrant.bounds.sw_lng,
        geohash: defaultQuadrant.bounds.sw_geohash,
      },
    },
    schoolCount: defaultQuadrant.school_count,
    schools: defaultQuadrant.quadrant_schools.map((school) =>
      identity<QuadrantSchoolDm>({
        ...school,
        location: {
          lat: school.lat,
          lng: school.lng,
          geohash: school.geohash,
        },
      })
    ),
  };
}
