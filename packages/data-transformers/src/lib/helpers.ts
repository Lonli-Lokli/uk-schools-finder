import proj4 from 'proj4';

// Helper function to ensure no undefined values
export function cleanValue<T>(value: T): T | null {
  return value === undefined ? null : value;
}

// Define the OSGB36 (EPSG:27700) and WGS84 (EPSG:4326) projections
proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'
);
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

export function convertToLatLong(
  easting: number | null,
  northing: number | null
) {
  try {
    if (!easting || !northing) {
      return { latitude: 0, longitude: 0 };
    }

    // Convert from OSGB36 to WGS84
    const [longitude, latitude] = proj4('EPSG:27700', 'EPSG:4326', [
      easting,
      northing,
    ]);

    return {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
    };
  } catch (error) {
    console.error('Error converting coordinates:', error);
    return { latitude: 0, longitude: 0 };
  }
}
