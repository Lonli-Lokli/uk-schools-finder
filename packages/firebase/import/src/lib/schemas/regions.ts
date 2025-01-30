import { z } from 'zod';

export const RegionRowSchema = z.object({
  LEA: z.string().or(z.number()).transform(val => val.toString()),
  'LA Name': z.string(),
  REGION: z.string().or(z.number()).transform(val => val.toString()),
  'REGION NAME': z.string()
});

export type RegionRow = z.infer<typeof RegionRowSchema>;
