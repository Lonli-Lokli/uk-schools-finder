export interface School {
  urn: string;
  name: string | null;
  establishmentNumber: number | null;
  ukprn: string | null;
  feheId: string | null;
  chNumber: string | null;

  // References
  typeId: string | null;
  phaseId: string | null;
  locationId: string | null;
  trustId: string | null;
  leaCode: string | null;

  // Status
  status: string | null;
  openDate: string | null;
  closeDate: string | null;
  openReason: string | null;
  closeReason: string | null;

  // Characteristics
  gender: string | null;
  boarders: string | null;
  nurseryProvision: string | null;
  officialSixthForm: string | null;
  capacity: number | null;
  specialClasses: string | null;

  // Contact info
  contact: {
    telephone: string | null;
    website: string | null;
    headTeacher: {
      title: string | null;
      firstName: string | null;
      lastName: string | null;
      jobTitle: string | null;
    } | null;
  };

  // Additional fields
  senNoStat: string | null;
  propsName: string | null;
  country: string | null;
  siteName: string | null;
  qabName: string | null;
  establishmentAccredited: string | null;
  qabReport: string | null;
  accreditationExpiryDate: string | null;
  lastChanged: string | null;
}

export interface EstablishmentType {
  name: string;
  group: string;
  furtherEducationType: string;
}

export interface EducationPhase {
  name: string;
  statutoryAges: {
    low: number;
    high: number;
  };
}

export interface Location {
  street: string;
  locality: string;
  address3: string;
  town: string;
  county: string;
  postcode: string;
  coordinates: {
    easting: number;
    northing: number;
    uprn: number | null;
    latitude: number | null;
    longitude: number | null;
    geohash: string | null;
  };
  administrative: {
    laCode: number;
    laName: string;
    gssLaCode: string;
    msoaCode: string;
    msoaName: string;
    lsoaCode: string;
    lsoaName: string;
    ward: string;
    district: string;
    constituency: string;
    urbanRural: string;
    gor: string;
  };
}

export interface Trust {
  name: string;
  sponsorFlag: string;
  sponsors: string;
  federationFlag: string;
  federations: string;
}

export interface SchoolCensus {
  schoolUrn: string;
  date: string;
  pupils: number;
  boys: number;
  girls: number;
  fsmPercentage: number;
  fsm: number;
}

export interface SchoolInspection {
  schoolUrn: string;
  date: string;
  bsoInspectorate: string;
  report: string;
  nextVisit: string;
  inspectorateName: string;
} 

export interface BoundingBox {
  ne: { lat: number; lng: number; geohash: string };
  sw: { lat: number; lng: number; geohash: string };
}


export interface Quadrant {
  id: string;
  bounds: BoundingBox;
  schools: QuadrantSchool[];
}

export interface QuadrantSchool {
  urn: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    geohash: string;
  };
}
