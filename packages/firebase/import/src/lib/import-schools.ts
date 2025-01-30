import { doc, Firestore, writeBatch } from 'firebase/firestore';
import { parse, format, isValid } from 'date-fns';
import { geohashForLocation } from 'geofire-common';
import proj4 from 'proj4';
import {
  ImportResult,
  BATCH_SIZE,
  parseAndValidateCSV,
  ImportParams,
} from './shapes';
import { SchoolRow, SchoolRowSchema } from './schemas/schools';

// Define the OSGB36 (EPSG:27700) and WGS84 (EPSG:4326) projections
proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'
);
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

export async function importSchools(
  params: ImportParams
): Promise<ImportResult> {
  const { db, csvData } = params;
  try {
    const { valid: validRows, errors } = await parseAndValidateCSV<SchoolRow>(
      csvData,
      SchoolRowSchema as any
    );

    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return {
        success: false,
        count: 0,
        errors: errors.map(e => `Row ${e.row}: ${e.error.message}`),
      };
    }

    const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);
    console.log(
      `Starting import of ${validRows.length} rows in ${totalBatches} batches...`
    );

    const processedTypes = new Set<string>();
    const processedPhases = new Set<string>();
    const processedLocations = new Set<string>();
    const processedTrusts = new Set<string>();

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      console.log(`Processing batch ${batchNumber}/${totalBatches}...`);

      const batch = writeBatch(db);
      const batchRows = validRows.slice(i, i + BATCH_SIZE);

      for (const row of batchRows) {
        const urn = `${row.URN}`;
        const typeId = normalizeTypeId(row['TypeOfEstablishment (name)']);
        const phaseId = normalizePhaseId(row['PhaseOfEducation (name)']);
        const locationId = `${row.UPRN || row.Postcode}`;
        const trustId = normalizeTrustId(row['Trusts (name)']);

        // Create establishment type document
        if (!processedTypes.has(typeId)) {
          const typeRef = doc(db, 'establishment-types', typeId);
          batch.set(typeRef, {
            name: row['TypeOfEstablishment (name)'],
            group: row['EstablishmentTypeGroup (name)'],
            furtherEducationType: row['FurtherEducationType (name)'],
          });
          processedTypes.add(typeId);
        }

        // Create education phase document
        if (!processedPhases.has(phaseId)) {
          const phaseRef = doc(db, 'education-phases', phaseId);
          batch.set(phaseRef, {
            name: row['PhaseOfEducation (name)'],
            statutoryAges: {
              low: row.StatutoryLowAge,
              high: row.StatutoryHighAge,
            },
          });
          processedPhases.add(phaseId);
        }

        // Create location document
        if (locationId && !processedLocations.has(locationId)) {
          const locationRef = doc(db, 'locations', locationId);
          batch.set(locationRef, {
            street: row.Street,
            locality: row.Locality,
            address3: row.Address3,
            town: row.Town,
            county: row['County (name)'],
            postcode: row.Postcode,
            coordinates: {
              easting: row.Easting,
              northing: row.Northing,
              uprn: row.UPRN,
              ...(row.Easting && row.Northing
                ? (() => {
                    const { latitude, longitude } = convertToLatLong(
                      row.Easting,
                      row.Northing
                    );
                    return {
                      latitude,
                      longitude,
                      geohash: geohashForLocation([latitude, longitude], 9),
                    };
                  })()
                : {}),
            },
            administrative: {
              laCode: row['LA (code)'],
              laName: row['LA (name)'],
              gssLaCode: row.GSSLACode,
              msoaCode: row['MSOA (code)'],
              msoaName: row['MSOA (name)'],
              lsoaCode: row['LSOA (code)'],
              lsoaName: row['LSOA (name)'],
              ward: row['AdministrativeWard (name)'],
              district: row['DistrictAdministrative (name)'],
              constituency: row['ParliamentaryConstituency (name)'],
              urbanRural: row['UrbanRural (name)'],
              gor: row['GOR (name)'],
            },
          });
          processedLocations.add(locationId);
        }

        // Create trust document
        if (trustId && !processedTrusts.has(trustId)) {
          const trustRef = doc(db, 'trusts', trustId);
          batch.set(trustRef, {
            name: row['Trusts (name)'],
            sponsorFlag: row['SchoolSponsorFlag (name)'],
            sponsors: row['SchoolSponsors (name)'],
            federationFlag: row['FederationFlag (name)'],
            federations: row['Federations (name)'],
          });
          processedTrusts.add(trustId);
        }

        // Create census document
        if (row.CensusDate) {
          const censusId = createCensusId(urn, row.CensusDate);
          const censusRef = doc(db, 'school-census', censusId);
          batch.set(censusRef, {
            schoolUrn: urn,
            date: row.CensusDate,
            pupils: row.NumberOfPupils,
            boys: row.NumberOfBoys,
            girls: row.NumberOfGirls,
            fsmPercentage: row.PercentageFSM,
            fsm: row.FSM,
          });
        }

        // Create inspection document
        if (row.DateOfLastInspectionVisit) {
          const inspectionId = createInspectionId(
            urn,
            row.DateOfLastInspectionVisit
          );
          const inspectionRef = doc(db, 'school-inspections', inspectionId);
          batch.set(inspectionRef, {
            schoolUrn: urn,
            date: row.DateOfLastInspectionVisit,
            bsoInspectorate: row['BSOInspectorateName (name)'],
            report: row.InspectorateReport,
            nextVisit: row.NextInspectionVisit,
            inspectorateName: row['InspectorateName (name)'],
          });
        }

        // Create main school document
        const schoolRef = doc(db, 'schools', urn);
        const schoolData = {
          // Basic info
          urn: urn,
          name: row.EstablishmentName || null,
          establishmentNumber: row.EstablishmentNumber || null,
          ukprn: row.UKPRN || null,
          feheId: row.FEHEIdentifier || null,
          chNumber: row.CHNumber || null,

          // References
          typeId: typeId || null,
          phaseId: phaseId || null,
          locationId: locationId || null,
          trustId: trustId || null,
          leaCode: row['LA (code)'] ? row['LA (code)'].toString() : null,

          // Status
          status: row['EstablishmentStatus (name)'] || null,
          openDate: formatDate(row.OpenDate),
          closeDate: formatDate(row.CloseDate),
          openReason: row['ReasonEstablishmentOpened (name)'] || null,
          closeReason: row['ReasonEstablishmentClosed (name)'] || null,

          // Characteristics
          gender: row['Gender (name)'] || null,
          boarders: row['Boarders (name)'] || null,
          nurseryProvision: row['NurseryProvision (name)'] || null,
          officialSixthForm: row['OfficialSixthForm (name)'] || null,
          capacity: row.SchoolCapacity || null,
          specialClasses: row['SpecialClasses (name)'] || null,

          // Contact info
          contact: {
            telephone: row.TelephoneNum || null,
            website: row.SchoolWebsite || null,
            headTeacher: row.HeadLastName ? {
              title: row['HeadTitle (name)'] || null,
              firstName: row.HeadFirstName || null,
              lastName: row.HeadLastName || null,
              jobTitle: row.HeadPreferredJobTitle || null,
            } : null,
          },

          // Additional fields
          senNoStat: row.SENNoStat || null,
          propsName: row.PropsName || null,
          country: row['Country (name)'] || null,
          siteName: row.SiteName || null,
          qabName: row['QABName (name)'] || null,
          establishmentAccredited: row['EstablishmentAccredited (name)'] || null,
          qabReport: row.QABReport || null,
          accreditationExpiryDate: row.AccreditationExpiryDate || null,

          lastChanged: formatDate(row.LastChangedDate),
        };

        // Remove any undefined values
        Object.keys(schoolData).forEach(key => {
          if (schoolData[key as keyof typeof schoolData] === undefined) {
            delete schoolData[key as keyof typeof schoolData];
          }
        });

        batch.set(schoolRef, schoolData);
      }

      await batch.commit();
      console.log(
        `Completed batch ${batchNumber}/${totalBatches} (${batchRows.length} records)`
      );
    }

    console.log(
      `Import completed successfully. Processed ${validRows.length} records.`
    );
    console.log(`Created ${processedTypes.size} establishment types`);
    console.log(`Created ${processedPhases.size} education phases`);
    console.log(`Created ${processedLocations.size} locations`);
    console.log(`Created ${processedTrusts.size} trusts`);

    return {
      success: true,
      count: validRows.length,
      errors: [],
    };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      count: 0,
      errors: [(error as Error).message],
    };
  }
}

// Helper function to normalize trust ID
function normalizeTrustId(name: string | undefined): string | null {
  if (!name) return null;
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

const formatDate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  try {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedDate)) return null;
    return format(parsedDate, 'yyyy-MM-dd');
  } catch {
    return null;
  }
};

const normalizeTypeId = (type: string): string =>
  `type_${type.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

const normalizePhaseId = (phase: string): string =>
  `phase_${phase.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

function convertToLatLong(easting: number, northing: number) {
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

// Helper functions for generating consistent IDs
function createCensusId(urn: string, date: string): string {
  return `${urn}_${date.replace(/[^0-9]/g, '')}`;
}

function createInspectionId(urn: string, date: string): string {
  return `${urn}_${date.replace(/[^0-9]/g, '')}`;
}
