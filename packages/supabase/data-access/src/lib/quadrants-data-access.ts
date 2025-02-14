import {
  QuadrantDm,
  QuadrantSchoolDm,
  SchoolFilters,
} from '@lonli-lokli/shapes';
import { initializeClientSupabase } from '@lonli-lokli/supabase/setup-client';
import { identity } from 'packages/core/src/lib/core';

interface MapBounds {
  ne: { lat: number; lng: number };
  sw: { lat: number; lng: number };
}

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

export async function getQuadrantForBounds({
  bounds,
  filters = {},
}: {
  filters: SchoolFilters;
  bounds: MapBounds;
}) {
  const { data: quadrant, error } = await supabase
    .from('quadrants')
    .select(QUADRANT_QUERY)
    // Find quadrants that fully contain the viewport
    .lte('bounds.ne_lat', bounds.ne.lat)
    .gte('bounds.sw_lat', bounds.sw.lat)
    .lte('bounds.ne_lng', bounds.ne.lng)
    .gte('bounds.sw_lng', bounds.sw.lng)
    .order('level', { ascending: false }) // Get smallest quadrant (highest level) first
    .limit(1)
    .single();

  if (error || !quadrant) {
    return getDefaultQuadrant();
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
        capacity: school.establishment.capacity ?? 0,
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

async function getDefaultQuadrant(): Promise<QuadrantDm> {
  const { data: quadrant, error } = await supabase
    .from('quadrants')
    .select(QUADRANT_QUERY)
    .eq('level', 0)
    .single();

  if (error || !quadrant) {
    throw new Error('Failed to load default quadrant');
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
        capacity: school.establishment.capacity ?? 0,
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

const QUADRANT_QUERY = `
  id,
  level,
  geohash,
  school_count,
  bounds:bounding_boxes!inner(
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
` as const;
