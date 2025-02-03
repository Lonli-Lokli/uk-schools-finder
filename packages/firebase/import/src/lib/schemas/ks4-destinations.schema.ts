import { z } from 'zod';
import { stringOrNumber } from './helpers';
import { mustBeNumber, mustBePercentage } from './helpers';

export const KS4DestinationsSchema = z.object({
  // School identifiers
  RECTYPE: stringOrNumber(), // Record type (1 = School, 2 = Special School)
  LEA: stringOrNumber(), // Local Education Authority code
  ESTAB: stringOrNumber(), // Establishment number
  URN: stringOrNumber(), // Unique Reference Number
  ICLOSE: stringOrNumber(), // Indicates if school is closed (0 = Open)
  SCHNAME: stringOrNumber(), // School name
  NFTYPE: stringOrNumber(), // School type (e.g., ACC = Academy)

  // Overall cohort numbers and destinations
  COHORT: mustBeNumber(), // Total number of pupils in cohort
  OVERALL_DEST: mustBeNumber(), // Number in sustained destination
  APPREN: mustBeNumber(), // Number in apprenticeships
  EMPLOYMENT: mustBeNumber(), // Number in employment
  EDUCATION: mustBeNumber(), // Number in education
  FE: mustBeNumber(), // Number in further education
  SCH_6TH: mustBeNumber(), // Number in school sixth form
  SIXTH_COL: mustBeNumber(), // Number in sixth form college
  OTHER_EDU: mustBeNumber(), // Number in other education
  NOT_SUSTAINED: mustBeNumber(), // Number not in sustained destination
  UNKNOWN: mustBeNumber(), // Number with unknown destination

  // Overall percentages
  OVERALL_DESTPER: mustBePercentage(), // % in sustained destination
  APPRENPER: mustBePercentage(), // % in apprenticeships
  EMPLOYMENTPER: mustBePercentage(), // % in employment
  EDUCATIONPER: mustBePercentage(), // % in education
  FEPER: mustBePercentage(), // % in further education
  SCH_6THPER: mustBePercentage(), // % in school sixth form
  SIXTH_COLPER: mustBePercentage(), // % in sixth form college
  OTHER_EDUPER: mustBePercentage(), // % in other education
  NOT_SUSTAINEDPER: mustBePercentage(), // % not in sustained destination
  UNKNOWNPER: mustBePercentage(), // % with unknown destination

  // Disadvantaged pupils numbers
  COHORT_DIS: mustBeNumber(), // Number of disadvantaged pupils
  OVERALL_DEST_DIS: mustBeNumber(), // Number of disadvantaged in sustained destination
  APPREN_DIS: mustBeNumber(), // Number of disadvantaged in apprenticeships
  EMPLOYMENT_DIS: mustBeNumber(), // Number of disadvantaged in employment
  EDUCATION_DIS: mustBeNumber(), // Number of disadvantaged in education
  FE_DIS: mustBeNumber(), // Number of disadvantaged in further education
  SCH_6TH_DIS: mustBeNumber(), // Number of disadvantaged in school sixth form
  SIXTH_COL_DIS: mustBeNumber(), // Number of disadvantaged in sixth form college
  OTHER_EDU_DIS: mustBeNumber(), // Number of disadvantaged in other education
  NOT_SUSTAINED_DIS: mustBeNumber(), // Number of disadvantaged not in sustained destination
  UNKNOWN_DIS: mustBeNumber(), // Number of disadvantaged with unknown destination

  // Disadvantaged pupils percentages
  OVERALL_DESTPER_DIS: mustBePercentage(), // % of disadvantaged in sustained destination
  APPRENPER_DIS: mustBePercentage(), // % of disadvantaged in apprenticeships
  EMPLOYMENTPER_DIS: mustBePercentage(), // % of disadvantaged in employment
  EDUCATIONPER_DIS: mustBePercentage(), // % of disadvantaged in education
  FEPER_DIS: mustBePercentage(), // % of disadvantaged in further education
  SCH_6THPER_DIS: mustBePercentage(), // % of disadvantaged in school sixth form
  SIXTH_COLPER_DIS: mustBePercentage(), // % of disadvantaged in sixth form college
  OTHER_EDUPER_DIS: mustBePercentage(), // % of disadvantaged in other education
  NOT_SUSTAINEDPER_DIS: mustBePercentage(), // % of disadvantaged not in sustained destination
  UNKNOWNPER_DIS: mustBePercentage(), // % of disadvantaged with unknown destination

  // Non-disadvantaged pupils numbers
  COHORT_NONDIS: mustBeNumber(), // Number of non-disadvantaged pupils
  OVERALL_DEST_NONDIS: mustBeNumber(), // Number of non-disadvantaged in sustained destination
  APPREN_NONDIS: mustBeNumber(), // Number of non-disadvantaged in apprenticeships
  EMPLOYMENT_NONDIS: mustBeNumber(), // Number of non-disadvantaged in employment
  EDUCATION_NONDIS: mustBeNumber(), // Number of non-disadvantaged in education
  FE_NONDIS: mustBeNumber(), // Number of non-disadvantaged in further education
  SCH_6TH_NONDIS: mustBeNumber(), // Number of non-disadvantaged in school sixth form
  SIXTH_COL_NONDIS: mustBeNumber(), // Number of non-disadvantaged in sixth form college
  OTHER_EDU_NONDIS: mustBeNumber(), // Number of non-disadvantaged in other education
  NOT_SUSTAINED_NONDIS: mustBeNumber(), // Number of non-disadvantaged not in sustained destination
  UNKNOWN_NONDIS: mustBeNumber(), // Number of non-disadvantaged with unknown destination

  // Non-disadvantaged pupils percentages
  OVERALL_DESTPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in sustained destination
  APPRENPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in apprenticeships
  EMPLOYMENTPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in employment
  EDUCATIONPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in education
  FEPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in further education
  SCH_6THPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in school sixth form
  SIXTH_COLPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in sixth form college
  OTHER_EDUPER_NONDIS: mustBePercentage(), // % of non-disadvantaged in other education
  NOT_SUSTAINEDPER_NONDIS: mustBePercentage(), // % of non-disadvantaged not in sustained destination
  UNKNOWNPER_NONDIS: mustBePercentage(), // % of non-disadvantaged with unknown destination
});

export type KS4DestinationsRow = z.infer<typeof KS4DestinationsSchema>;
