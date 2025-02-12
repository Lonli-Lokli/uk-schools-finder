import { geohashForLocation } from 'geofire-common';

import { convertToLatLong } from './helpers';

import {
  BoundingBoxDm,
  QuadrantDm,
  QuadrantSchoolDm,
} from '@lonli-lokli/shapes';
import { SchoolRow } from '@lonli-lokli/data-parsers';

export interface QuadrantBatch {
  main: Array<{
    id: string;
    data: QuadrantDm;
  }>;
}

export function transformQuadrants(rows: SchoolRow[]): QuadrantBatch {
  const schools: QuadrantSchoolDm[] = rows.map((row) => {
    const { latitude, longitude } = convertToLatLong(row.Easting, row.Northing);
    return {
      urn: row.URN.toString(),
      name: row.EstablishmentName,
      location: {
        lat: latitude,
        lng: longitude,
        geohash: geohashForLocation([latitude, longitude], 9),
      },
    };
  });

  const bounds = calculateBounds(schools);
  const quadrants = generateQuadrants(schools, bounds);

  return {
    main: quadrants.map((quadrant) => ({
      id: quadrant.id,
      data: {
        id: quadrant.id,
        level: quadrant.level,
        bounds: quadrant.bounds,
        schoolCount: quadrant.schools.length,
        schools: quadrant.schools,
      },
    })),
  };
}

function generateQuadrants(
  schools: QuadrantSchoolDm[],
  englandBounds: BoundingBoxDm,
  maxLevel = 8
): QuadrantDm[] {
  function processLevel(
    bounds: BoundingBoxDm,
    schools: QuadrantSchoolDm[],
    level: number,
    quadrants: QuadrantDm[] = []
  ): QuadrantDm[] {
    const quadrantSchools = assignSchoolsToQuadrant(schools, bounds);

    if (quadrantSchools.length > 0) {
      quadrants.push({
        id: generateQuadrantId(bounds, level),
        bounds,
        level,
        schoolCount: quadrantSchools.length,
        schools: quadrantSchools,
      });

      if (level < maxLevel && quadrantSchools.length > 50) {
        return splitQuadrant(bounds).reduce(
          (acc, subBounds) =>
            processLevel(subBounds, quadrantSchools, level + 1, acc),
          quadrants
        );
      }
    }

    return quadrants;
  }

  return processLevel(englandBounds, schools, 0);
}

export function assignSchoolsToQuadrant(
  schools: QuadrantSchoolDm[],
  bounds: BoundingBoxDm
): QuadrantSchoolDm[] {
  return schools.filter(
    (school) =>
      school.location.lat <= bounds.ne.lat &&
      school.location.lat >= bounds.sw.lat &&
      school.location.lng <= bounds.ne.lng &&
      school.location.lng >= bounds.sw.lng
  );
}

function calculateBounds(schools: QuadrantSchoolDm[]): BoundingBoxDm {
  // Initialize with first school's coordinates
  let minLat = schools[0].location.lat ?? 0;
  let maxLat = schools[0].location.lat ?? 0;
  let minLng = schools[0].location.lng ?? 0;
  let maxLng = schools[0].location.lng ?? 0;

  // Find min/max coordinates
  schools.forEach((school) => {
    if (
      school.location.lat !== null &&
      school.location.lng !== null &&
      school.location.lat > 0 &&
      school.location.lng > 0
    ) {
      minLat = Math.min(minLat, school.location.lat);
      maxLat = Math.max(maxLat, school.location.lat);
      minLng = Math.min(minLng, school.location.lng);
      maxLng = Math.max(maxLng, school.location.lng);
    }
  });

  // Add some padding (e.g., 1% of the range)
  const latPadding = (maxLat - minLat) * 0.01;
  const lngPadding = (maxLng - minLng) * 0.01;

  return {
    ne: {
      lat: maxLat + latPadding,
      lng: maxLng + lngPadding,
      geohash: geohashForLocation(
        [maxLat + latPadding, maxLng + lngPadding],
        9
      ),
    },
    sw: {
      lat: minLat - latPadding,
      lng: minLng - lngPadding,
      geohash: geohashForLocation(
        [minLat - latPadding, minLng - lngPadding],
        9
      ),
    },
  };
}

export function generateQuadrantId(
  bounds: BoundingBoxDm,
  level: number
): string {
  return `${level}_${bounds.sw.geohash}_${bounds.ne.geohash}`;
}

export function splitQuadrant(bounds: BoundingBoxDm): BoundingBoxDm[] {
  const centerLat = (bounds.ne.lat + bounds.sw.lat) / 2;
  const centerLng = (bounds.ne.lng + bounds.sw.lng) / 2;
  const centerGeohash = geohashForLocation([centerLat, centerLng], 9);

  return [
    // NW
    {
      ne: {
        lat: bounds.ne.lat,
        lng: centerLng,
        geohash: geohashForLocation([bounds.ne.lat, centerLng], 9),
      },
      sw: {
        lat: centerLat,
        lng: bounds.sw.lng,
        geohash: geohashForLocation([centerLat, bounds.sw.lng], 9),
      },
    },
    // NE
    {
      ne: bounds.ne,
      sw: {
        lat: centerLat,
        lng: centerLng,
        geohash: centerGeohash,
      },
    },
    // SW
    {
      ne: {
        lat: centerLat,
        lng: centerLng,
        geohash: centerGeohash,
      },
      sw: bounds.sw,
    },
    // SE
    {
      ne: {
        lat: centerLat,
        lng: bounds.ne.lng,
        geohash: geohashForLocation([centerLat, bounds.ne.lng], 9),
      },
      sw: {
        lat: bounds.sw.lat,
        lng: centerLng,
        geohash: geohashForLocation([bounds.sw.lat, centerLng], 9),
      },
    },
  ];
}

