import { z } from 'zod';

const ifEmpty = (val: string | number | undefined | null) =>
  val === '' || val === undefined || val === null ? null : Number(val);
const numberOrNull = z
  .string()
  .or(z.number())
  .or(z.undefined())
  .or(z.null())
  .transform(ifEmpty)
  .nullable();

export const KS5HEDestinationsSchema = z.object({
  URN: z
    .string()
    .or(z.number())
    .or(z.null())
    .transform((val) => val?.toString() ?? ''),
  RECTYPE: z
    .string()
    .or(z.number())
    .transform((val) => val.toString()),

  // University groups
  ALL_OXBRIDGE: numberOrNull,
  ALL_RUSSELL: numberOrNull,
  ALL_TOP3RD: numberOrNull,
  ALL_HTECH: numberOrNull,

  // Percentages
  ALL_OXBRIDGEPER: numberOrNull,
  ALL_RUSSELLPER: numberOrNull,
  ALL_TOP3RDPER: numberOrNull,
  ALL_HTECHPER: numberOrNull,

  // Disadvantaged versions
  DIS_OXBRIDGE: numberOrNull,
  DIS_RUSSELL: numberOrNull,
  DIS_TOP3RD: numberOrNull,
  DIS_HTECH: numberOrNull,

  DIS_OXBRIDGEPER: numberOrNull,
  DIS_RUSSELLPER: numberOrNull,
  DIS_TOP3RDPER: numberOrNull,
  DIS_HTECHPER: numberOrNull,

  // Performance measures
  ALL_SCORE: numberOrNull,
  ALL_BAND: numberOrNull,
  ALL_UPPER: numberOrNull,
  ALL_LOWER: numberOrNull,
});

export type KS5HEDestinationsRow = z.infer<typeof KS5HEDestinationsSchema>;
