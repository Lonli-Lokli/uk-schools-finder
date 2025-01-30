import { z } from 'zod';

// Helper function for number parsing
const numberParser = (val: string) => {
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

// Helper function for integer parsing
const intParser = (val: string) => {
  if (val === 'SUPP') return null;
  const num = parseInt(val);
  return isNaN(num) ? null : num;
};

// Helper function for percentage parsing
const percentageParser = (val: string) => {
  if (val === 'SUPP') return null;
  const num = parseFloat(val.replace('%', ''));
  return isNaN(num) ? null : num;
};

const stringOrNumber = z
  .string()
  .or(z.number())
  .or(z.null())
  .transform((val) => (val !== null ? val.toString() : val));

// Helper function to create a dynamic record of historical fields
function createHistoricalFieldSchema() {
  return z.record(z.string(), z.string().transform(val => {
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
  }));
}

export const KS4DestinationsSchema = z.object({
  // School identifiers
  RECTYPE: stringOrNumber,      // Record type (1 = School, 2 = Special School)
  LEA: stringOrNumber,          // Local Education Authority code
  ESTAB: stringOrNumber,        // Establishment number
  URN: stringOrNumber,          // Unique Reference Number
  ICLOSE: z.string(),       // Indicates if school is closed (0 = Open)
  SCHNAME: z.string(),      // School name
  NFTYPE: z.string(),       // School type (e.g., ACC = Academy)

  // Overall cohort numbers and destinations
  COHORT: z.string().transform(intParser),           // Total number of pupils in cohort
  OVERALL_DEST: z.string().transform(intParser),     // Number in sustained destination
  APPREN: z.string().transform(intParser),           // Number in apprenticeships
  EMPLOYMENT: z.string().transform(intParser),       // Number in employment
  EDUCATION: z.string().transform(intParser),        // Number in education
  FE: z.string().transform(intParser),              // Number in further education
  SCH_6TH: z.string().transform(intParser),         // Number in school sixth form
  SIXTH_COL: z.string().transform(intParser),       // Number in sixth form college
  OTHER_EDU: z.string().transform(intParser),       // Number in other education
  NOT_SUSTAINED: z.string().transform(intParser),    // Number not in sustained destination
  UNKNOWN: z.string().transform(intParser),          // Number with unknown destination

  // Overall percentages
  OVERALL_DESTPER: z.string().transform(percentageParser),    // % in sustained destination
  APPRENPER: z.string().transform(percentageParser),          // % in apprenticeships
  EMPLOYMENTPER: z.string().transform(percentageParser),      // % in employment
  EDUCATIONPER: z.string().transform(percentageParser),       // % in education
  FEPER: z.string().transform(percentageParser),             // % in further education
  SCH_6THPER: z.string().transform(percentageParser),        // % in school sixth form
  SIXTH_COLPER: z.string().transform(percentageParser),      // % in sixth form college
  OTHER_EDUPER: z.string().transform(percentageParser),      // % in other education
  NOT_SUSTAINEDPER: z.string().transform(percentageParser),   // % not in sustained destination
  UNKNOWNPER: z.string().transform(percentageParser),         // % with unknown destination

  // Disadvantaged pupils numbers
  COHORT_DIS: z.string().transform(intParser),               // Number of disadvantaged pupils
  OVERALL_DEST_DIS: z.string().transform(intParser),         // Number of disadvantaged in sustained destination
  APPREN_DIS: z.string().transform(intParser),               // Number of disadvantaged in apprenticeships
  EMPLOYMENT_DIS: z.string().transform(intParser),           // Number of disadvantaged in employment
  EDUCATION_DIS: z.string().transform(intParser),            // Number of disadvantaged in education
  FE_DIS: z.string().transform(intParser),                  // Number of disadvantaged in further education
  SCH_6TH_DIS: z.string().transform(intParser),             // Number of disadvantaged in school sixth form
  SIXTH_COL_DIS: z.string().transform(intParser),           // Number of disadvantaged in sixth form college
  OTHER_EDU_DIS: z.string().transform(intParser),           // Number of disadvantaged in other education
  NOT_SUSTAINED_DIS: z.string().transform(intParser),        // Number of disadvantaged not in sustained destination
  UNKNOWN_DIS: z.string().transform(intParser),              // Number of disadvantaged with unknown destination

  // Disadvantaged pupils percentages
  OVERALL_DESTPER_DIS: z.string().transform(percentageParser),    // % of disadvantaged in sustained destination
  APPRENPER_DIS: z.string().transform(percentageParser),          // % of disadvantaged in apprenticeships
  EMPLOYMENTPER_DIS: z.string().transform(percentageParser),      // % of disadvantaged in employment
  EDUCATIONPER_DIS: z.string().transform(percentageParser),       // % of disadvantaged in education
  FEPER_DIS: z.string().transform(percentageParser),             // % of disadvantaged in further education
  SCH_6THPER_DIS: z.string().transform(percentageParser),        // % of disadvantaged in school sixth form
  SIXTH_COLPER_DIS: z.string().transform(percentageParser),      // % of disadvantaged in sixth form college
  OTHER_EDUPER_DIS: z.string().transform(percentageParser),      // % of disadvantaged in other education
  NOT_SUSTAINEDPER_DIS: z.string().transform(percentageParser),   // % of disadvantaged not in sustained destination
  UNKNOWNPER_DIS: z.string().transform(percentageParser),         // % of disadvantaged with unknown destination

  // Non-disadvantaged pupils numbers
  COHORT_NONDIS: z.string().transform(intParser),                // Number of non-disadvantaged pupils
  OVERALL_DEST_NONDIS: z.string().transform(intParser),          // Number of non-disadvantaged in sustained destination
  APPREN_NONDIS: z.string().transform(intParser),                // Number of non-disadvantaged in apprenticeships
  EMPLOYMENT_NONDIS: z.string().transform(intParser),            // Number of non-disadvantaged in employment
  EDUCATION_NONDIS: z.string().transform(intParser),             // Number of non-disadvantaged in education
  FE_NONDIS: z.string().transform(intParser),                   // Number of non-disadvantaged in further education
  SCH_6TH_NONDIS: z.string().transform(intParser),              // Number of non-disadvantaged in school sixth form
  SIXTH_COL_NONDIS: z.string().transform(intParser),            // Number of non-disadvantaged in sixth form college
  OTHER_EDU_NONDIS: z.string().transform(intParser),            // Number of non-disadvantaged in other education
  NOT_SUSTAINED_NONDIS: z.string().transform(intParser),         // Number of non-disadvantaged not in sustained destination
  UNKNOWN_NONDIS: z.string().transform(intParser),               // Number of non-disadvantaged with unknown destination

  // Non-disadvantaged pupils percentages
  OVERALL_DESTPER_NONDIS: z.string().transform(percentageParser),    // % of non-disadvantaged in sustained destination
  APPRENPER_NONDIS: z.string().transform(percentageParser),          // % of non-disadvantaged in apprenticeships
  EMPLOYMENTPER_NONDIS: z.string().transform(percentageParser),      // % of non-disadvantaged in employment
  EDUCATIONPER_NONDIS: z.string().transform(percentageParser),       // % of non-disadvantaged in education
  FEPER_NONDIS: z.string().transform(percentageParser),             // % of non-disadvantaged in further education
  SCH_6THPER_NONDIS: z.string().transform(percentageParser),        // % of non-disadvantaged in school sixth form
  SIXTH_COLPER_NONDIS: z.string().transform(percentageParser),      // % of non-disadvantaged in sixth form college
  OTHER_EDUPER_NONDIS: z.string().transform(percentageParser),      // % of non-disadvantaged in other education
  NOT_SUSTAINEDPER_NONDIS: z.string().transform(percentageParser),   // % of non-disadvantaged not in sustained destination
  UNKNOWNPER_NONDIS: z.string().transform(percentageParser),         // % of non-disadvantaged with unknown destination

  // Historical data - 2022
  COHORT_22: z.string().transform(intParser),                        // Total cohort size in 2022
  OVERALL_DESTPER_22: z.string().transform(percentageParser),        // % in sustained destination in 2022
  COHORT_DIS_22: z.string().transform(intParser),                    // Disadvantaged cohort size in 2022
  OVERALL_DESTPER_DIS_22: z.string().transform(percentageParser),    // % of disadvantaged in sustained destination in 2022
  COHORT_NONDIS_22: z.string().transform(intParser),                 // Non-disadvantaged cohort size in 2022
  OVERALL_DESTPER_NONDIS_22: z.string().transform(percentageParser), // % of non-disadvantaged in sustained destination in 2022

  // Historical data - 2021
  COHORT_21: z.string().transform(intParser),                        // Total cohort size in 2021
  OVERALL_DESTPER_21: z.string().transform(percentageParser),        // % in sustained destination in 2021
  COHORT_DIS_21: z.string().transform(intParser),                    // Disadvantaged cohort size in 2021
  OVERALL_DESTPER_DIS_21: z.string().transform(percentageParser),    // % of disadvantaged in sustained destination in 2021
  COHORT_NONDIS_21: z.string().transform(intParser),                 // Non-disadvantaged cohort size in 2021
  OVERALL_DESTPER_NONDIS_21: z.string().transform(percentageParser), // % of non-disadvantaged in sustained destination in 2021
}).and(
  // Add dynamic historical fields
  createHistoricalFieldSchema()
);

export type KS4DestinationsRow = z.infer<typeof KS4DestinationsSchema>; 