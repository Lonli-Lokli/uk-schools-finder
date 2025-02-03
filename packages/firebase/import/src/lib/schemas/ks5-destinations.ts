import { z } from 'zod';
import {
  mustBeNumber,
  mustBePercentage,
  optionalString,
  stringOrNumber,
} from './helpers';
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
  // School identification fields
  RECTYPE: stringOrNumber(), // Record type identifier for the data row
  LEA: stringOrNumber(), // Local Education Authority code
  ESTAB: stringOrNumber(), // School establishment number within LEA
  URN: stringOrNumber(), // Unique Reference Number for the school
  SCHNAME: optionalString(), // Name of the school
  NFTYPE: optionalString(), // Type of school (e.g., Academy, Community School)
  FEEDER: stringOrNumber(), // Indicates if this is a feeder school
  ICLOSE: stringOrNumber(), // Indicates if the school has closed

  // Total cohort statistics (all students)
  TOT_COHORT: mustBeNumber(), // Total number of students in cohort
  TOT_OVERALL: mustBeNumber(), // Total number of students with any sustained destination
  TOT_APPREN: mustBeNumber(), // Number of students in apprenticeships
  TOT_EDUCATION: mustBeNumber(), // Number of students in any education
  TOT_FE: mustBeNumber(), // Number of students in further education
  TOT_HE: mustBeNumber(), // Number of students in higher education
  TOT_OTHER_EDU: mustBeNumber(), // Number of students in other educational institutions
  TOT_EMPLOYMENT: mustBeNumber(), // Number of students in employment
  TOT_NOT_SUSTAINED: mustBeNumber(), // Number of students without sustained destination
  TOT_NOT_CAPTURED: mustBeNumber(), // Number of students with unknown destinations
  TOT_OVERALLPER: mustBePercentage(), // Percentage of students with any sustained destination
  TOT_APPRENPER: mustBePercentage(), // Percentage of students in apprenticeships
  TOT_EDUCATIONPER: mustBePercentage(), // Percentage of students in any education
  TOT_FEPER: mustBePercentage(), // Percentage of students in further education

  TOT_HEPER: mustBePercentage(), // Percentage of students in higher education
  TOT_OTHER_EDUPER: mustBePercentage(), // Percentage of students in other educational institutions
  TOT_EMPLOYMENTPER: mustBePercentage(), // Percentage of students in employment
  TOT_NOT_SUSTAINEDPER: mustBePercentage(), // Percentage of students without sustained destination
  TOT_NOT_CAPTUREDPER: mustBePercentage(), // Percentage of students with unknown destinations

  // Level 3 qualification students
  L3_COHORT: mustBeNumber(), // Number of Level 3 students in cohort
  L3_OVERALL: mustBeNumber(), // Number of Level 3 students with any sustained destination
  L3_APPREN: mustBeNumber(), // Number of Level 3 students in apprenticeships
  L3_EDUCATION: mustBeNumber(), // Number of Level 3 students in any education
  L3_FE: mustBeNumber(), // Number of Level 3 students in further education
  L3_HE: mustBeNumber(), // Number of Level 3 students in higher education
  L3_OTHER_EDU: mustBeNumber(), // Number of Level 3 students in other educational institutions
  L3_EMPLOYMENT: mustBeNumber(), // Number of Level 3 students in employment
  L3_NOT_SUSTAINED: mustBeNumber(), // Number of Level 3 students without sustained destination
  L3_NOT_CAPTURED: mustBeNumber(), // Number of Level 3 students with unknown destinations
  L3_OVERALLPER: mustBePercentage(), // Percentage of Level 3 students with any sustained destination
  L3_APPRENPER: mustBePercentage(), // Percentage of Level 3 students in apprenticeships
  L3_EDUCATIONPER: mustBePercentage(), // Percentage of Level 3 students in any education
  L3_FEPER: mustBePercentage(), // Percentage of Level 3 students in further education
  L3_HEPER: mustBePercentage(), // Percentage of Level 3 students in higher education
  L3_OTHER_EDUPER: mustBePercentage(), // Percentage of Level 3 students in other educational institutions
  L3_EMPLOYMENTPER: mustBePercentage(), // Percentage of Level 3 students in employment
  L3_NOT_SUSTAINEDPER: mustBePercentage(), // Percentage of Level 3 students without sustained destination
  L3_NOT_CAPTUREDPER: mustBePercentage(), // Percentage of Level 3 students with unknown destinations

  // Level 3 disadvantaged students
  L3_COHORT_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in cohort
  L3_OVERALL_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students with any sustained destination
  L3_APPREN_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in apprenticeships
  L3_EDUCATION_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in any education
  L3_FE_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in further education
  L3_HE_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in higher education
  L3_OTHER_EDU_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in other educational institutions
  L3_EMPLOYMENT_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students in employment
  L3_NOT_SUSTAINED_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students without sustained destination
  L3_NOT_CAPTURED_DIS: mustBeNumber(), // Number of disadvantaged Level 3 students with unknown destinations
  L3_OVERALLPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students with any sustained destination
  L3_APPRENPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students in apprenticeships
  L3_EDUCATIONPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students in any education
  L3_FEPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students in further education
  L3_HEPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students in higher education
  L3_OTHER_EDUPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students in other educational institutions
  L3_EMPLOYMENTPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students in employment
  L3_NOT_SUSTAINEDPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students without sustained destination
  L3_NOT_CAPTUREDPER_DIS: mustBePercentage(), // Percentage of disadvantaged Level 3 students with unknown destinations

  // Level 3 non-disadvantaged students
  L3_COHORT_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in cohort
  L3_OVERALL_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students with any sustained destination
  L3_APPREN_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in apprenticeships
  L3_EDUCATION_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in any education
  L3_FE_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in further education
  L3_HE_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in higher education
  L3_OTHER_EDU_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in other educational institutions
  L3_EMPLOYMENT_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students in employment
  L3_NOT_SUSTAINED_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students without sustained destination
  L3_NOT_CAPTURED_NONDIS: mustBeNumber(), // Number of non-disadvantaged Level 3 students with unknown destinations
  L3_OVERALLPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students with any sustained destination
  L3_APPRENPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students in apprenticeships
  L3_EDUCATIONPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students in any education
  L3_FEPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students in further education
  L3_HEPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students in higher education
  L3_OTHER_EDUPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students in other educational institutions
  L3_EMPLOYMENTPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students in employment
  L3_NOT_SUSTAINEDPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students without sustained destination
  L3_NOT_CAPTUREDPER_NONDIS: mustBePercentage(), // Percentage of non-disadvantaged Level 3 students with unknown destinations

  // Level 2 students
  L2_COHORT: mustBeNumber(), // Number of Level 2 students in cohort
  L2_OVERALL: mustBeNumber(), // Number of Level 2 students with any sustained destination
  L2_APPREN: mustBeNumber(), // Number of Level 2 students in apprenticeships
  L2_EDUCATION: mustBeNumber(), // Number of Level 2 students in any education
  L2_FE: mustBeNumber(), // Number of Level 2 students in further education
  L2_HE: mustBeNumber(), // Number of Level 2 students in higher education
  L2_OTHER_EDU: mustBeNumber(), // Number of Level 2 students in other educational institutions
  L2_EMPLOYMENT: mustBeNumber(), // Number of Level 2 students in employment
  L2_NOT_SUSTAINED: mustBeNumber(), // Number of Level 2 students without sustained destination
  L2_NOT_CAPTURED: mustBeNumber(), // Number of Level 2 students with unknown destinations
  L2_OVERALLPER: mustBePercentage(), // Percentage of Level 2 students with any sustained destination
  L2_APPRENPER: mustBePercentage(), // Percentage of Level 2 students in apprenticeships
  L2_EDUCATIONPER: mustBePercentage(), // Percentage of Level 2 students in any education
  L2_FEPER: mustBePercentage(), // Percentage of Level 2 students in further education
  L2_HEPER: mustBePercentage(), // Percentage of Level 2 students in higher education
  L2_OTHER_EDUPER: mustBePercentage(), // Percentage of Level 2 students in other educational institutions
  L2_EMPLOYMENTPER: mustBePercentage(), // Percentage of Level 2 students in employment
  L2_NOT_SUSTAINEDPER: mustBePercentage(), // Percentage of Level 2 students without sustained destination
  L2_NOT_CAPTUREDPER: mustBePercentage(), // Percentage of Level 2 students with unknown destinations

  // Other qualification levels
  LALLOTH_COHORT: mustBeNumber(), // Number of other qualification level students in cohort
  LALLOTH_OVERALL: mustBeNumber(), // Number of other qualification level students with any sustained destination
  LALLOTH_APPREN: mustBeNumber(), // Number of other qualification level students in apprenticeships
  LALLOTH_EDUCATION: mustBeNumber(), // Number of other qualification level students in any education
  LALLOTH_FE: mustBeNumber(), // Number of other qualification level students in further education
  LALLOTH_HE: mustBeNumber(), // Number of other qualification level students in higher education
  LALLOTH_OTHER_EDU: mustBeNumber(), // Number of other qualification level students in other educational institutions
  LALLOTH_EMPLOYMENT: mustBeNumber(), // Number of other qualification level students in employment
  LALLOTH_NOT_SUSTAINED: mustBeNumber(), // Number of other qualification level students without sustained destination
  LALLOTH_NOT_CAPTURED: mustBeNumber(), // Number of other qualification level students with unknown destinations
  LALLOTH_OVERALLPER: mustBePercentage(), // Percentage of other qualification level students with any sustained destination
  LALLOTH_APPRENPER: mustBePercentage(), // Percentage of other qualification level students in apprenticeships
  LALLOTH_EDUCATIONPER: mustBePercentage(), // Percentage of other qualification level students in any education
  LALLOTH_FEPER: mustBePercentage(), // Percentage of other qualification level students in further education
  LALLOTH_HEPER: mustBePercentage(), // Percentage of other qualification level students in higher education
  LALLOTH_OTHER_EDUPER: mustBePercentage(), // Percentage of other qualification level students in other educational institutions
  LALLOTH_EMPLOYMENTPER: mustBePercentage(), // Percentage of other qualification level students in employment
  LALLOTH_NOT_SUSTAINEDPER: mustBePercentage(), // Percentage of other qualification level students without sustained destination
  LALLOTH_NOT_CAPTUREDPER: mustBePercentage(), // Percentage of other qualification level students with unknown destinations
});

export type KS5DestinationsRow = z.infer<typeof KS5DestinationsSchema>;
