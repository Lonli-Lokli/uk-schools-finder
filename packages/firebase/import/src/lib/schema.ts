import { z, ZodNumber, ZodOptional } from 'zod';
import { csv2json } from 'csv42';

// Helper for optional string fields with default empty string
const numericString = <T extends ZodNumber | ZodOptional<ZodNumber>>(
  schema: T
) =>
  z.preprocess((a) => {
    if (typeof a === 'string') {
      return a === '' ? 0 : parseInt(a, 10);
    } else if (typeof a === 'number') {
      return a;
    } else return undefined;
  }, schema) as z.ZodEffects<z.ZodTypeAny, number, number>;

const optionalString = () =>
  z.coerce
    .string()
    .optional()
    .nullable()
    .default('')
    .transform((value) => value ?? '');

const optionalNumber = numericString(z.number().optional());

export const SchoolRowSchema = z.object({
  // Required fields
  URN: z.number(),
  EstablishmentName: z.string(),

  // Address fields
  Street: optionalString(),
  Locality: optionalString(),
  Town: optionalString(),
  'County (name)': optionalString(),
  Postcode: optionalString(),

  // Administrative fields
  'LA (code)': optionalNumber,
  'LA (name)': optionalString(),
  GSSLACode: optionalString(),
  'MSOA (code)': optionalString(),
  'MSOA (name)': optionalString(),
  'LSOA (code)': optionalString(),
  'LSOA (name)': optionalString(),
  'AdministrativeWard (name)': optionalString(),
  'DistrictAdministrative (name)': optionalString(),
  'ParliamentaryConstituency (name)': optionalString(),

  // Coordinates
  Easting: optionalNumber,
  Northing: optionalNumber,
  UPRN: optionalNumber,

  // Classification
  'UrbanRural (name)': optionalString(),
  'GOR (name)': optionalString(),

  // Establishment fields
  'TypeOfEstablishment (name)': optionalString(),
  'EstablishmentTypeGroup (name)': optionalString(),
  'FurtherEducationType (name)': optionalString(),
  'PhaseOfEducation (name)': optionalString(),
  StatutoryLowAge: optionalNumber,
  StatutoryHighAge: optionalNumber,

  // Trust fields
  'Trusts (name)': optionalString(),
  'TrustSchoolFlag (name)': optionalString(),
  LastChangedDate: z.string().nullable(),

  // School status
  'EstablishmentStatus (name)': optionalString(),
  OpenDate: z.string().nullable(),
  CloseDate: z.string().nullable(),
  'ReasonEstablishmentOpened (name)': optionalString(),

  // Leadership
  'HeadTitle (name)': optionalString(),
  HeadFirstName: optionalString(),
  HeadLastName: optionalString(),
  HeadPreferredJobTitle: optionalString(),

  // Contact
  TelephoneNum: optionalString(),
  SchoolWebsite: optionalString(),

  // Characteristics
  'Gender (name)': optionalString(),
  'ReligiousCharacter (name)': optionalString(),
  'ReligiousEthos (name)': optionalString(),
  'Diocese (name)': optionalString(),
  'AdmissionsPolicy (name)': optionalString(),

  // Additional fields
  UKPRN: optionalString(),
  FEHEIdentifier: optionalString(),
  CHNumber: optionalString(),

  // SEN (Special Educational Needs) fields
  SENStat: optionalString(),
  'TypeOfResourcedProvision (name)': optionalString(),
  SenUnitOnRoll: optionalNumber,
  SenUnitCapacity: optionalNumber,
  ResourcedProvisionOnRoll: optionalString(), // Sometimes comes as string
  ResourcedProvisionCapacity: optionalString(), // Sometimes comes as string

  // PRU (Pupil Referral Unit) fields
  PlacesPRU: optionalNumber, // Sometimes comes as string
  'EBD (name)': optionalString(),
  'SENPRU (name)': optionalString(),

  // Other provision fields
  'TeenMoth (name)': optionalString(),
  TeenMothPlaces: optionalNumber,
  'CCF (name)': optionalString(),
  'FTProv (name)': optionalString(),
  'EdByOther (name)': optionalString(),
  'Section41Approved (name)': optionalString(),

  // SEN Types
  'SEN1 (name)': optionalString(),
  'SEN2 (name)': optionalString(),
  'SEN3 (name)': optionalString(),
  'SEN4 (name)': optionalString(),
  'SEN5 (name)': optionalString(),
  'SEN6 (name)': optionalString(),
  'SEN7 (name)': optionalString(),
  'SEN8 (name)': optionalString(),
  'SEN9 (name)': optionalString(),
  'SEN10 (name)': optionalString(),
  'SEN11 (name)': optionalString(),
  'SEN12 (name)': optionalString(),
  'SEN13 (name)': optionalString(),

  // Base fields for SEN types
  SEN1: optionalString(),
  SEN2: optionalString(),
  SEN3: optionalString(),
  SEN4: optionalString(),
  SEN5: optionalString(),
  SEN6: optionalString(),
  SEN7: optionalString(),
  SEN8: optionalString(),
  SEN9: optionalString(),
  SEN10: optionalString(),
  SEN11: optionalString(),
  SEN12: optionalString(),
  SEN13: optionalString(),

  // Missing establishment fields
  EstablishmentNumber: optionalNumber,
  'ReasonEstablishmentClosed (name)': optionalString(),
  'Boarders (name)': optionalString(),
  'NurseryProvision (name)': optionalString(),
  'OfficialSixthForm (name)': optionalString(),
  SchoolCapacity: optionalNumber,
  'SpecialClasses (name)': optionalString(),
  
  // Missing census fields
  CensusDate: optionalString(),
  NumberOfPupils: optionalNumber,
  NumberOfBoys: optionalNumber,
  NumberOfGirls: optionalNumber,
  PercentageFSM: optionalNumber,
  FSM: optionalNumber,

  // Missing sponsor/federation fields
  'SchoolSponsorFlag (name)': optionalString(),
  'SchoolSponsors (name)': optionalString(),
  'FederationFlag (name)': optionalString(),
  'Federations (name)': optionalString(),

  // Missing address field
  Address3: optionalString(),

  // Missing inspection fields
  'BSOInspectorateName (name)': optionalString(),
  InspectorateReport: optionalString(),
  DateOfLastInspectionVisit: optionalString(),
  NextInspectionVisit: optionalString(),
  'InspectorateName (name)': optionalString(),

  // Missing additional fields
  SENNoStat: optionalString(),
  PropsName: optionalString(),
  'Country (name)': optionalString(),
  SiteName: optionalString(),
  'QABName (name)': optionalString(),
  'EstablishmentAccredited (name)': optionalString(),
  QABReport: optionalString(),
  AccreditationExpiryDate: optionalString(),
});

export function parseAndValidateCSV(  content: string
) {
  return new Promise<{ valid: SchoolRow[]; errors: any[] }>((resolve) => {
    const valid: SchoolRow[] = [];
    const errors: any[] = [];

    const result = csv2json(content);
    result.forEach((row, index) => {
      try {
        const validatedRow = SchoolRowSchema.parse(row);
        valid.push(validatedRow);
      } catch (error) {
        errors.push({ row: index + 1, error });
      }
    });

    resolve({ valid: valid.slice(0, 1000), errors });
  });
}

export type SchoolRow = z.infer<typeof SchoolRowSchema>;
