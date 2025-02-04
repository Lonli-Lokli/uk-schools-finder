import {
  School,
  Location,
  EstablishmentType,
  EducationPhase,
  Trust,
  SchoolCensus,
  SchoolInspection,
} from '@lonli-lokli/firebase/import';

export type SchoolDm = School & {
  id: string;
  location: LocationDm;
  establishmentType: EstablishmentTypeDm;
  educationPhase: EducationPhaseDm;
  trust: TrustDm;
  schoolCensus: SchoolCensusDm;
  schoolInspection: SchoolInspectionDm;
};

export type LocationDm = Location;
export type EstablishmentTypeDm = EstablishmentType;
export type TrustDm = Trust;
export type SchoolCensusDm = SchoolCensus;
export type EducationPhaseDm = EducationPhase;
export type SchoolInspectionDm = SchoolInspection;
