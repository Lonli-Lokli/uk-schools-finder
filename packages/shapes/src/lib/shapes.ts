export interface SchoolDm {
  urn: string;
  name: string | null;
  establishmentNumber: number | null;
  ukprn: string | null;
  feheId: string | null;
  chNumber: string | null;

  // References
  type: EstablishmentTypeDm | null;
  phase: EducationPhaseDm | null;
  location: LocationDm | null;
  trust: TrustDm | null;

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

export interface EstablishmentTypeDm {
  name: string;
  group: string;
  furtherEducationType: string;
}

export interface EducationPhaseDm {
  name: string;
  statutoryAges: {
    low: number | null;
    high: number | null;
  };
}

export interface LocationDm {
  street: string | null;
  locality: string | null;
  address3: string | null;
  town: string | null;
  county: string | null;
  postcode: string | null;
  coordinates: {
    easting: number | null;
    northing: number | null;
    uprn: number | null;
    latitude: number | null;
    longitude: number | null;
    geohash: string | null;
  };
  administrative: {
    laCode: number | null;
    laName: string | null;
    gssLaCode: string | null;
    msoaCode: string | null;
    msoaName: string | null;
    lsoaCode: string | null;
    lsoaName: string | null;
    ward: string | null;
    district: string | null;
    constituency: string | null;
    urbanRural: string | null;
    gor: string | null;
  };
}

export interface TrustDm {
  name: string;
  sponsorFlag: string | null;
  sponsors: string | null;
  federationFlag: string | null;
  federations: string | null;
}

export interface SchoolCensusDm {
  schoolUrn: string;
  date: string;
  pupils: number;
  boys: number;
  girls: number;
  fsmPercentage: number;
  fsm: number;
}

export interface SchoolInspectionDm {
  schoolUrn: string;
  date: string;
  bsoInspectorate: string;
  report: string;
  nextVisit: string;
  inspectorateName: string;
}

export interface BoundingBoxDm {
  ne: { lat: number; lng: number; geohash: string };
  sw: { lat: number; lng: number; geohash: string };
}

export interface QuadrantDm {
  id: string;
  level: number;
  bounds: BoundingBoxDm;
  schoolCount: number;
  schools: QuadrantSchoolDm[];
}

export interface QuadrantSchoolDm {
  urn: string;
  name: string | null;
  type: string | null;
  capacity: number;
  location: {
    lat: number;
    lng: number;
    geohash: string;
  };
}

export interface BatchRecord<T> {
  id: string;
  data: T;
}

// Generic batch type - ensures all properties are arrays of records
export type Batch<T> = {
  [K in keyof T]: Array<BatchRecord<T[K]>>;
};
