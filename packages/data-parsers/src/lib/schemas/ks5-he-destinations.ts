import { z } from 'zod';
import { mustBeNumber, mustBePercentage, stringOrNumber } from './helpers';

export const KS5HEDestinationsSchema = z.object({
  URN: stringOrNumber(),
  RECTYPE: stringOrNumber(),

  // University groups
  ALL_OXBRIDGE: mustBeNumber(),
  ALL_RUSSELL: mustBeNumber(),
  ALL_TOP3RD: mustBePercentage(),
  ALL_HTECH: mustBePercentage(),

  // Percentages
  ALL_OXBRIDGEPER: mustBePercentage(),
  ALL_RUSSELLPER: mustBePercentage(),
  ALL_TOP3RDPER: mustBePercentage(),
  ALL_HTECHPER: mustBePercentage(),

  // Disadvantaged versions
  DIS_OXBRIDGE: mustBeNumber(),
  DIS_RUSSELL: mustBeNumber(),
  DIS_TOP3RD: mustBePercentage(),
  DIS_HTECH: mustBePercentage(),

  DIS_OXBRIDGEPER: mustBePercentage(),
  DIS_RUSSELLPER: mustBePercentage(),
  DIS_TOP3RDPER: mustBePercentage(),
  DIS_HTECHPER: mustBePercentage(),

  // Performance measures
  ALL_SCORE: mustBeNumber(),
  ALL_BAND: mustBeNumber(),
  ALL_UPPER: mustBeNumber(),
  ALL_LOWER: mustBeNumber(),
});

export type KS5HEDestinationsRow = z.infer<typeof KS5HEDestinationsSchema>;
