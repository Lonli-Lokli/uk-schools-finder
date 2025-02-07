import {
  EstablishmentTypeDm,
  SchoolInspectionDm,
  EducationPhaseDm,
  TrustDm,
  SchoolDm,
  SchoolCensusDm,
  LocationDm,
} from '@lonli-lokli/shapes';
import { SchoolRow } from '@lonli-lokli/data-parsers';
import { convertToLatLong } from './helpers';
import { geohashForLocation } from 'geofire-common';
import { format, isValid, parse } from 'date-fns';

export interface SchoolBatch {
  main: Array<{
    id: string;
    data: SchoolDm;
  }>;
  types: Array<{
    id: string;
    data: EstablishmentTypeDm;
  }>;
  phases: Array<{
    id: string;
    data: EducationPhaseDm;
  }>;
  locations: Array<{
    id: string;
    data: LocationDm;
  }>;

  trusts: Array<{
    id: string;
    data: TrustDm;
  }>;
  census: Array<{
    id: string;
    data: SchoolCensusDm;
  }>;
  inspections: Array<{
    id: string;
    data: SchoolInspectionDm;
  }>;
}

export function transformSchools(rows: SchoolRow[]): SchoolBatch {
  const batch: SchoolBatch = {
    main: [],
    types: [],
    phases: [],
    locations: [],
    trusts: [],
    census: [],
    inspections: [],
  };

  const processedTypes = new Set<string>();
  const processedPhases = new Set<string>();
  const processedLocations = new Set<string>();
  const processedTrusts = new Set<string>();

  for (const row of rows) {
    const urn = row.URN.toString();
    const typeId = normalizeTypeId(row['TypeOfEstablishment (name)']);
    const phaseId = normalizePhaseId(row['PhaseOfEducation (name)']);
    const locationId = `${row.UPRN || row.Postcode}`;
    const trustId = normalizeTrustId(row['Trusts (name)']);

    // Add establishment type
    if (!processedTypes.has(typeId)) {
      batch.types.push({
        id: typeId,
        data: {
          name: row['TypeOfEstablishment (name)'],
          group: row['EstablishmentTypeGroup (name)'],
          furtherEducationType: row['FurtherEducationType (name)'],
        },
      });
      processedTypes.add(typeId);
    }

    // Add education phase
    if (!processedPhases.has(phaseId)) {
      batch.phases.push({
        id: phaseId,
        data: {
          name: row['PhaseOfEducation (name)'],
          statutoryAges: {
            low: row.StatutoryLowAge,
            high: row.StatutoryHighAge,
          },
        },
      });
      processedPhases.add(phaseId);
    }

    // Add location
    if (locationId && !processedLocations.has(locationId)) {
      const { latitude, longitude } = convertToLatLong(
        row.Easting,
        row.Northing
      );
      batch.locations.push({
        id: locationId,
        data: {
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
            latitude,
            longitude,
            geohash:
              latitude && longitude
                ? geohashForLocation([latitude, longitude], 9)
                : null,
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
        },
      });
      processedLocations.add(locationId);
    }

    // Add trust
    if (trustId && !processedTrusts.has(trustId)) {
      batch.trusts.push({
        id: trustId,
        data: {
          name: row['Trusts (name)'],
          sponsorFlag: row['SchoolSponsorFlag (name)'],
          sponsors: row['SchoolSponsors (name)'],
          federationFlag: row['FederationFlag (name)'],
          federations: row['Federations (name)'],
        },
      });
      processedTrusts.add(trustId);
    }

    // Add census
    if (row.CensusDate) {
      batch.census.push({
        id: createCensusId(urn, row.CensusDate),
        data: {
          schoolUrn: urn,
          date: row.CensusDate,
          pupils: row.NumberOfPupils,
          boys: row.NumberOfBoys,
          girls: row.NumberOfGirls,
          fsmPercentage: row.PercentageFSM,
          fsm: row.FSM,
        },
      });
    }

    // Add inspection
    if (row.DateOfLastInspectionVisit) {
      batch.inspections.push({
        id: createInspectionId(urn, row.DateOfLastInspectionVisit),
        data: {
          schoolUrn: urn,
          date: row.DateOfLastInspectionVisit,
          bsoInspectorate: row['BSOInspectorateName (name)'],
          report: row.InspectorateReport,
          nextVisit: row.NextInspectionVisit,
          inspectorateName: row['InspectorateName (name)'],
        },
      });
    }

    // Add main school document
    batch.main.push({
      id: urn,
      data: {
        urn,
        name: row.EstablishmentName,
        establishmentNumber: row.EstablishmentNumber,
        ukprn: row.UKPRN,
        feheId: row.FEHEIdentifier,
        chNumber: row.CHNumber,
        typeId,
        phaseId,
        locationId,
        trustId,
        leaCode: row['LA (code)']?.toString(),
        status: row['EstablishmentStatus (name)'],
        openDate: formatDate(row.OpenDate),
        closeDate: formatDate(row.CloseDate),
        openReason: row['ReasonEstablishmentOpened (name)'],
        closeReason: row['ReasonEstablishmentClosed (name)'],
        gender: row['Gender (name)'],
        boarders: row['Boarders (name)'],
        nurseryProvision: row['NurseryProvision (name)'],
        officialSixthForm: row['OfficialSixthForm (name)'],
        capacity: row.SchoolCapacity,
        specialClasses: row['SpecialClasses (name)'],
        contact: {
          telephone: row.TelephoneNum,
          website: row.SchoolWebsite,
          headTeacher: row.HeadLastName
            ? {
                title: row['HeadTitle (name)'],
                firstName: row.HeadFirstName,
                lastName: row.HeadLastName,
                jobTitle: row.HeadPreferredJobTitle,
              }
            : null,
        },
        senNoStat: row.SENNoStat,
        propsName: row.PropsName,
        country: row['Country (name)'],
        siteName: row.SiteName,
        qabName: row['QABName (name)'],
        establishmentAccredited: row['EstablishmentAccredited (name)'],
        qabReport: row.QABReport,
        accreditationExpiryDate: row.AccreditationExpiryDate,
        lastChanged: formatDate(row.LastChangedDate),
      },
    });
  }

  return batch;
}

// Helper functions
function normalizeTypeId(type: string): string {
  return `type_${type.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
}

function normalizePhaseId(phase: string): string {
  return `phase_${phase.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
}

function normalizeTrustId(name: string | undefined): string | null {
  if (!name) return null;
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function createCensusId(urn: string, date: string): string {
  return `${urn}_${date.replace(/[^0-9]/g, '')}`;
}

function createInspectionId(urn: string, date: string): string {
  return `${urn}_${date.replace(/[^0-9]/g, '')}`;
}

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedDate)) return null;
    return format(parsedDate, 'yyyy-MM-dd');
  } catch {
    return null;
  }
}
