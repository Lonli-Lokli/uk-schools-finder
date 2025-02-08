import { BoundingBoxDm, QuadrantSchoolDm } from '@lonli-lokli/shapes';
import { geohashForLocation } from 'geofire-common';

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

export function generateQuadrantId(
  bounds: BoundingBoxDm,
  level: number
): string {
  return `${level}_${bounds.sw.geohash}_${bounds.ne.geohash}`;
}
