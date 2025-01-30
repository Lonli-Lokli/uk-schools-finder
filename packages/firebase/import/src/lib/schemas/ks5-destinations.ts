import { z } from 'zod';

const numberOrNull = z.string().or(z.number())
  .transform(val => val === '' ? null : Number(val))
  .nullable();

export const KS5DestinationsSchema = z.object({
  URN: z.string().or(z.number()).transform(val => val.toString()),
  RECTYPE: z.string().or(z.number()).transform(val => val.toString()),
  
  // Cohort sizes
  TOT_COHORT: numberOrNull,
  TOT_COHORT_DIS: numberOrNull,
  TOT_COHORT_NONDIS: numberOrNull,

  // Education destinations
  TOT_EDUCATION: numberOrNull,
  TOT_EDUCATIONPER: numberOrNull,
  TOT_HE: numberOrNull,
  TOT_HEPER: numberOrNull,
  TOT_FE: numberOrNull,
  TOT_FEPER: numberOrNull,
  TOT_OTHER_EDU: numberOrNull,
  TOT_OTHER_EDUPER: numberOrNull,

  // Employment destinations
  TOT_EMPLOYMENT: numberOrNull,
  TOT_EMPLOYMENTPER: numberOrNull,
  TOT_APPREN: numberOrNull,
  TOT_APPRENPER: numberOrNull,

  // Other destinations
  TOT_NOT_SUSTAINED: numberOrNull,
  TOT_NOT_SUSTAINEDPER: numberOrNull,
  TOT_NOT_CAPTURED: numberOrNull,
  TOT_NOT_CAPTUREDPER: numberOrNull,

  // Disadvantaged versions of all above fields
  TOT_EDUCATION_DIS: numberOrNull,
  TOT_EDUCATIONPER_DIS: numberOrNull,
  TOT_HE_DIS: numberOrNull,
  TOT_HEPER_DIS: numberOrNull,
  TOT_FE_DIS: numberOrNull,
  TOT_FEPER_DIS: numberOrNull,
  TOT_OTHER_EDU_DIS: numberOrNull,
  TOT_OTHER_EDUPER_DIS: numberOrNull,
  TOT_EMPLOYMENT_DIS: numberOrNull,
  TOT_EMPLOYMENTPER_DIS: numberOrNull,
  TOT_APPREN_DIS: numberOrNull,
  TOT_APPRENPER_DIS: numberOrNull,
  TOT_NOT_SUSTAINED_DIS: numberOrNull,
  TOT_NOT_SUSTAINEDPER_DIS: numberOrNull,
  TOT_NOT_CAPTURED_DIS: numberOrNull,
  TOT_NOT_CAPTUREDPER_DIS: numberOrNull,
});

export type KS5DestinationsRow = z.infer<typeof KS5DestinationsSchema>;
