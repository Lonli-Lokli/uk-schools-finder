import { z } from 'zod';

const numberOrNull = z
  .string()
  .or(z.number())
  .transform((val) => {
    if (val === '' || val === 'NA' || val === 'SUPP') return null;
    return Number(val);
  })
  .nullable();

const stringOrNumber = z
  .string()
  .or(z.number())
  .or(z.null())
  .transform((val) => (val !== null ? val.toString() : val));

/**
 * Schema for KS5 destinations CSV file
 * Data is organized in sections:
 * - TOT_* - Total figures for all students
 * - L3_* - Level 3 qualification students
 * - L2_* - Level 2 qualification students
 * - LALLOTH_* - All other qualification levels
 *
 * Each section has three subsections:
 * - No suffix - All students
 * - *_DIS - Disadvantaged students
 * - *_NONDIS - Non-disadvantaged students
 */
export const KS5DestinationsSchema = z.object({
  // School identification
  RECTYPE: stringOrNumber, // Record type identifier
  LEA: stringOrNumber, // Local Education Authority code
  ESTAB: stringOrNumber, // Establishment number
  URN: stringOrNumber, // Unique Reference Number
  SCHNAME: z.string().or(z.null()), // School name
  NFTYPE: stringOrNumber, // School type
  FEEDER: stringOrNumber, // Feeder school indicator
  ICLOSE: stringOrNumber, // School closure indicator

  // Total cohort fields (TOT_*)
  TOT_COHORT: numberOrNull,
  TOT_OVERALL: numberOrNull,
  TOT_APPREN: numberOrNull,
  TOT_EDUCATION: numberOrNull,
  TOT_FE: numberOrNull,
  TOT_HE: numberOrNull,
  TOT_OTHER_EDU: numberOrNull,
  TOT_EMPLOYMENT: numberOrNull,
  TOT_NOT_SUSTAINED: numberOrNull,
  TOT_NOT_CAPTURED: numberOrNull,
  TOT_OVERALLPER: numberOrNull,
  TOT_APPRENPER: numberOrNull,
  TOT_EDUCATIONPER: numberOrNull,
  TOT_FEPER: numberOrNull,
  TOT_HEPER: numberOrNull,
  TOT_OTHER_EDUPER: numberOrNull,
  TOT_EMPLOYMENTPER: numberOrNull,
  TOT_NOT_SUSTAINEDPER: numberOrNull,
  TOT_NOT_CAPTUREDPER: numberOrNull,

  // Level 3 fields (L3_*)
  L3_COHORT: numberOrNull,
  L3_OVERALL: numberOrNull,
  L3_APPREN: numberOrNull,
  L3_EDUCATION: numberOrNull,
  L3_FE: numberOrNull,
  L3_HE: numberOrNull,
  L3_OTHER_EDU: numberOrNull,
  L3_EMPLOYMENT: numberOrNull,
  L3_NOT_SUSTAINED: numberOrNull,
  L3_NOT_CAPTURED: numberOrNull,
  L3_OVERALLPER: numberOrNull,
  L3_APPRENPER: numberOrNull,
  L3_EDUCATIONPER: numberOrNull,
  L3_FEPER: numberOrNull,
  L3_HEPER: numberOrNull,
  L3_OTHER_EDUPER: numberOrNull,
  L3_EMPLOYMENTPER: numberOrNull,
  L3_NOT_SUSTAINEDPER: numberOrNull,
  L3_NOT_CAPTUREDPER: numberOrNull,

  // Level 3 disadvantaged
  L3_COHORT_DIS: numberOrNull,
  L3_OVERALL_DIS: numberOrNull,
  L3_APPREN_DIS: numberOrNull,
  L3_EDUCATION_DIS: numberOrNull,
  L3_FE_DIS: numberOrNull,
  L3_HE_DIS: numberOrNull,
  L3_OTHER_EDU_DIS: numberOrNull,
  L3_EMPLOYMENT_DIS: numberOrNull,
  L3_NOT_SUSTAINED_DIS: numberOrNull,
  L3_NOT_CAPTURED_DIS: numberOrNull,
  L3_OVERALLPER_DIS: numberOrNull,
  L3_APPRENPER_DIS: numberOrNull,
  L3_EDUCATIONPER_DIS: numberOrNull,
  L3_FEPER_DIS: numberOrNull,
  L3_HEPER_DIS: numberOrNull,
  L3_OTHER_EDUPER_DIS: numberOrNull,
  L3_EMPLOYMENTPER_DIS: numberOrNull,
  L3_NOT_SUSTAINEDPER_DIS: numberOrNull,
  L3_NOT_CAPTUREDPER_DIS: numberOrNull,

  // Level 3 non-disadvantaged
  L3_COHORT_NONDIS: numberOrNull,
  L3_OVERALL_NONDIS: numberOrNull,
  L3_APPREN_NONDIS: numberOrNull,
  L3_EDUCATION_NONDIS: numberOrNull,
  L3_FE_NONDIS: numberOrNull,
  L3_HE_NONDIS: numberOrNull,
  L3_OTHER_EDU_NONDIS: numberOrNull,
  L3_EMPLOYMENT_NONDIS: numberOrNull,
  L3_NOT_SUSTAINED_NONDIS: numberOrNull,
  L3_NOT_CAPTURED_NONDIS: numberOrNull,
  L3_OVERALLPER_NONDIS: numberOrNull,
  L3_APPRENPER_NONDIS: numberOrNull,
  L3_EDUCATIONPER_NONDIS: numberOrNull,
  L3_FEPER_NONDIS: numberOrNull,
  L3_HEPER_NONDIS: numberOrNull,
  L3_OTHER_EDUPER_NONDIS: numberOrNull,
  L3_EMPLOYMENTPER_NONDIS: numberOrNull,
  L3_NOT_SUSTAINEDPER_NONDIS: numberOrNull,
  L3_NOT_CAPTUREDPER_NONDIS: numberOrNull,

  // Level 2 fields (L2_*)
  L2_COHORT: numberOrNull,
  L2_OVERALL: numberOrNull,
  L2_APPREN: numberOrNull,
  L2_EDUCATION: numberOrNull,
  L2_FE: numberOrNull,
  L2_HE: numberOrNull,
  L2_OTHER_EDU: numberOrNull,
  L2_EMPLOYMENT: numberOrNull,
  L2_NOT_SUSTAINED: numberOrNull,
  L2_NOT_CAPTURED: numberOrNull,
  L2_OVERALLPER: numberOrNull,
  L2_APPRENPER: numberOrNull,
  L2_EDUCATIONPER: numberOrNull,
  L2_FEPER: numberOrNull,
  L2_HEPER: numberOrNull,
  L2_OTHER_EDUPER: numberOrNull,
  L2_EMPLOYMENTPER: numberOrNull,
  L2_NOT_SUSTAINEDPER: numberOrNull,
  L2_NOT_CAPTUREDPER: numberOrNull,

  // Other levels fields (LALLOTH_*)
  LALLOTH_COHORT: numberOrNull,
  LALLOTH_OVERALL: numberOrNull,
  LALLOTH_APPREN: numberOrNull,
  LALLOTH_EDUCATION: numberOrNull,
  LALLOTH_FE: numberOrNull,
  LALLOTH_HE: numberOrNull,
  LALLOTH_OTHER_EDU: numberOrNull,
  LALLOTH_EMPLOYMENT: numberOrNull,
  LALLOTH_NOT_SUSTAINED: numberOrNull,
  LALLOTH_NOT_CAPTURED: numberOrNull,
  LALLOTH_OVERALLPER: numberOrNull,
  LALLOTH_APPRENPER: numberOrNull,
  LALLOTH_EDUCATIONPER: numberOrNull,
  LALLOTH_FEPER: numberOrNull,
  LALLOTH_HEPER: numberOrNull,
  LALLOTH_OTHER_EDUPER: numberOrNull,
  LALLOTH_EMPLOYMENTPER: numberOrNull,
  LALLOTH_NOT_SUSTAINEDPER: numberOrNull,
  LALLOTH_NOT_CAPTUREDPER: numberOrNull,
});

export type KS5DestinationsRow = z.infer<typeof KS5DestinationsSchema>;
