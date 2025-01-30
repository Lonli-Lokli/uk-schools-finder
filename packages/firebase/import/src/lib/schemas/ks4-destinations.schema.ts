import { z } from 'zod';

// Helper function for number parsing
const optionalString = () =>
  z.coerce
    .string()
    .optional()
    .nullable()
    .default('')
    .transform((value) => value ?? '');

const stringOrNumber = z
  .string()
  .or(z.number())
  .or(z.null())
  .transform((val) => (val !== null ? val.toString() : val));

const stringAsNumber = () =>  z.string()
.or(z.number())
.or(z.null())
.transform(intParser);

// Helper function for integer parsing
const intParser = (val: string | number | null) => {
  if (val === 'SUPP' || val === null) return null;
  if (typeof val === 'number') return val;
  const num = parseInt(val);
  return isNaN(num) ? null : num;
};

// Helper function for percentage parsing
const percentageParser = (val: string) => {
  if (val === 'SUPP') return null;
  const num = parseFloat(val.replace('%', ''));
  return isNaN(num) ? null : num;
};

// Helper function to create a dynamic record of historical fields
function createHistoricalFieldSchema() {
  return z.record(
    z.string(),
    z.string().transform((val) => {
      // Handle both percentage and number fields
      if (val === 'SUPP') return null;

      // If it ends with %, it's a percentage field
      if (val.endsWith('%')) {
        const num = parseFloat(val.replace('%', ''));
        return isNaN(num) ? null : num;
      }

      // Otherwise, treat as integer
      const num = parseInt(val);
      return isNaN(num) ? null : num;
    })
  );
}

export const KS4DestinationsSchema = z
  .object({
    // School identifiers
    RECTYPE: stringOrNumber, // Record type (1 = School, 2 = Special School)
    LEA: stringOrNumber, // Local Education Authority code
    ESTAB: stringOrNumber, // Establishment number
    URN: stringOrNumber, // Unique Reference Number
    ICLOSE: optionalString(), // Indicates if school is closed (0 = Open)
    SCHNAME: optionalString(), // School name
    NFTYPE: optionalString(), // School type (e.g., ACC = Academy)

    // Overall cohort numbers and destinations
    COHORT: stringOrNumber, // Total number of pupils in cohort
    OVERALL_DEST: stringAsNumber(), // Number in sustained destination
    APPREN: stringAsNumber(), // Number in apprenticeships
    EMPLOYMENT: stringAsNumber(), // Number in employment
    EDUCATION: stringAsNumber(), // Number in education
    FE: stringAsNumber(), // Number in further education
    SCH_6TH: stringAsNumber(), // Number in school sixth form
    SIXTH_COL: stringAsNumber(), // Number in sixth form college
    OTHER_EDU: stringAsNumber(), // Number in other education
    NOT_SUSTAINED: stringAsNumber(), // Number not in sustained destination
    UNKNOWN: stringAsNumber(), // Number with unknown destination

    // Overall percentages
    OVERALL_DESTPER: z.string().transform(percentageParser), // % in sustained destination
    APPRENPER: z.string().transform(percentageParser), // % in apprenticeships
    EMPLOYMENTPER: z.string().transform(percentageParser), // % in employment
    EDUCATIONPER: z.string().transform(percentageParser), // % in education
    FEPER: z.string().transform(percentageParser), // % in further education
    SCH_6THPER: z.string().transform(percentageParser), // % in school sixth form
    SIXTH_COLPER: z.string().transform(percentageParser), // % in sixth form college
    OTHER_EDUPER: z.string().transform(percentageParser), // % in other education
    NOT_SUSTAINEDPER: z.string().transform(percentageParser), // % not in sustained destination
    UNKNOWNPER: z.string().transform(percentageParser), // % with unknown destination

    // Disadvantaged pupils numbers
    COHORT_DIS: stringAsNumber(), // Number of disadvantaged pupils
    OVERALL_DEST_DIS: stringAsNumber(), // Number of disadvantaged in sustained destination
    APPREN_DIS: stringAsNumber(), // Number of disadvantaged in apprenticeships
    EMPLOYMENT_DIS: stringAsNumber(), // Number of disadvantaged in employment
    EDUCATION_DIS: stringAsNumber(), // Number of disadvantaged in education
    FE_DIS: stringAsNumber(), // Number of disadvantaged in further education
    SCH_6TH_DIS: stringAsNumber(), // Number of disadvantaged in school sixth form
    SIXTH_COL_DIS: stringAsNumber(), // Number of disadvantaged in sixth form college
    OTHER_EDU_DIS: stringAsNumber(), // Number of disadvantaged in other education
    NOT_SUSTAINED_DIS: stringAsNumber(), // Number of disadvantaged not in sustained destination
    UNKNOWN_DIS: stringAsNumber(), // Number of disadvantaged with unknown destination

    // Disadvantaged pupils percentages
    OVERALL_DESTPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in sustained destination
    APPRENPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in apprenticeships
    EMPLOYMENTPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in employment
    EDUCATIONPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in education
    FEPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in further education
    SCH_6THPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in school sixth form
    SIXTH_COLPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in sixth form college
    OTHER_EDUPER_DIS: z.string().transform(percentageParser), // % of disadvantaged in other education
    NOT_SUSTAINEDPER_DIS: z.string().transform(percentageParser), // % of disadvantaged not in sustained destination
    UNKNOWNPER_DIS: z.string().transform(percentageParser), // % of disadvantaged with unknown destination

    // Non-disadvantaged pupils numbers
    COHORT_NONDIS: stringAsNumber(), // Number of non-disadvantaged pupils
    OVERALL_DEST_NONDIS: stringAsNumber(), // Number of non-disadvantaged in sustained destination
    APPREN_NONDIS: stringAsNumber(), // Number of non-disadvantaged in apprenticeships
    EMPLOYMENT_NONDIS: stringAsNumber(), // Number of non-disadvantaged in employment
    EDUCATION_NONDIS: stringAsNumber(), // Number of non-disadvantaged in education
    FE_NONDIS: stringAsNumber(), // Number of non-disadvantaged in further education
    SCH_6TH_NONDIS: stringAsNumber(), // Number of non-disadvantaged in school sixth form
    SIXTH_COL_NONDIS: stringAsNumber(), // Number of non-disadvantaged in sixth form college
    OTHER_EDU_NONDIS: stringAsNumber(), // Number of non-disadvantaged in other education
    NOT_SUSTAINED_NONDIS: stringAsNumber(), // Number of non-disadvantaged not in sustained destination
    UNKNOWN_NONDIS: stringAsNumber(), // Number of non-disadvantaged with unknown destination

    // Non-disadvantaged pupils percentages
    OVERALL_DESTPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in sustained destination
    APPRENPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in apprenticeships
    EMPLOYMENTPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in employment
    EDUCATIONPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in education
    FEPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in further education
    SCH_6THPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in school sixth form
    SIXTH_COLPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in sixth form college
    OTHER_EDUPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged in other education
    NOT_SUSTAINEDPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged not in sustained destination
    UNKNOWNPER_NONDIS: z.string().transform(percentageParser), // % of non-disadvantaged with unknown destination
     })
  ;

export type KS4DestinationsRow = z.infer<typeof KS4DestinationsSchema>;
