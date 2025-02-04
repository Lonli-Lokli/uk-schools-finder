import { doc, writeBatch } from 'firebase/firestore';
import { geohashForLocation } from 'geofire-common';

import {
  ImportResult,
  BATCH_SIZE,
  parseAndValidateCSV,
  ImportParams,
  convertToLatLong,
} from './helpers';
import { SchoolRow, SchoolRowSchema } from './schemas/schools';

import {
  splitQuadrant,
  assignSchoolsToQuadrant,
  generateQuadrantId,
} from './schemas/quadrants';
import { Quadrant } from './shapes';
import { QuadrantSchool } from './shapes';
import { BoundingBox } from './shapes';

interface QuadrantStats {
  totalQuadrants: number;
  totalSchools: number;
  byLevel: Record<
    number,
    {
      quadrants: number;
      schools: number;
      minSchools: number;
      maxSchools: number;
    }
  >;
}

export async function importQuadrants(
  params: ImportParams
): Promise<ImportResult> {
  const { db, csvData, onProgress } = params;

  try {
    onProgress({ details: 'Parsing file...' });
    const { valid: rows, errors } = await parseAndValidateCSV<SchoolRow>(
      csvData,
      SchoolRowSchema as any
    );

    if (errors.length > 0) {
      return {
        success: false,
        count: 0,
        error: `Failures: ${errors.length}. First error happens on row ${errors[0].row}: ${errors[0].error.message}`,
      };
    }

    // Convert rows to schools with coordinates
    const schools = rows.map((row) => {
      const { latitude, longitude } = convertToLatLong(
        row.Easting,
        row.Northing
      );
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

    // Calculate bounds and generate quadrants
    const bounds = calculateBounds(schools);
    const quadrants = generateQuadrants(schools, bounds);

    // Batch write to Firestore
    const totalBatches = Math.ceil(quadrants.length / BATCH_SIZE);
    let processedCount = 0;

    for (let i = 0; i < quadrants.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchQuadrants = quadrants.slice(i, i + BATCH_SIZE);
      const currentBatchNumber = Math.floor(i / BATCH_SIZE) + 1;

      for (const quadrant of batchQuadrants) {
        const quadrantRef = doc(db, 'quadrants', quadrant.id);
        batch.set(quadrantRef, {
          bounds: quadrant.bounds,
          schoolCount: quadrant.schools.length,
          schools: quadrant.schools.map((s) => ({
            urn: s.urn,
            name: s.name,
            location: s.location,
          })),
        });
      }

      await batch.commit();
      processedCount += batchQuadrants.length;

      // Report progress with level statistics
      const levelStats = generateQuadrantStats(
        quadrants.slice(0, i + BATCH_SIZE)
      );
      const levelSummary = Object.entries(levelStats.byLevel)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(
          ([level, data]) =>
            `Level ${level}: ${data.quadrants} quadrants, ${data.schools} schools`
        )
        .join(', ');

      onProgress?.({
        current: currentBatchNumber,
        total: totalBatches,
        details: `Processed ${processedCount} of ${quadrants.length} quadrants\n${levelSummary}`,
      });
    }

    return {
      success: true,
      count: processedCount,
    };
  } catch (error) {
    console.error('Quadrant import error:', error);
    return {
      success: false,
      count: 0,
      error: (error as Error).message,
    };
  }
}

function generateQuadrants(
  schools: QuadrantSchool[],
  englandBounds: BoundingBox,
  maxLevel = 8
): Quadrant[] {
  function processLevel(
    bounds: BoundingBox,
    schools: QuadrantSchool[],
    level: number,
    quadrants: Quadrant[] = []
  ): Quadrant[] {
    const quadrantSchools = assignSchoolsToQuadrant(schools, bounds);

    if (quadrantSchools.length > 0) {
      quadrants.push({
        id: generateQuadrantId(bounds, level),
        bounds,
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

function calculateBounds(schools: QuadrantSchool[]): BoundingBox {
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

function generateQuadrantStats(quadrants: Quadrant[]): QuadrantStats {
  const stats = quadrants.reduce(
    (acc, quadrant) => {
      const level = parseInt(quadrant.id.split('_')[0]);
      const schoolCount = quadrant.schools.length;

      if (!acc.byLevel[level]) {
        acc.byLevel[level] = {
          quadrants: 0,
          schools: 0,
          minSchools: schoolCount,
          maxSchools: schoolCount,
        };
      }

      acc.byLevel[level].quadrants++;
      acc.byLevel[level].schools += schoolCount;
      acc.byLevel[level].minSchools = Math.min(
        acc.byLevel[level].minSchools,
        schoolCount
      );
      acc.byLevel[level].maxSchools = Math.max(
        acc.byLevel[level].maxSchools,
        schoolCount
      );

      acc.totalQuadrants++;
      acc.totalSchools = Math.max(acc.totalSchools, schoolCount);

      return acc;
    },
    {
      totalQuadrants: 0,
      totalSchools: 0,
      byLevel: {},
    } as QuadrantStats
  );

  return stats;
}
