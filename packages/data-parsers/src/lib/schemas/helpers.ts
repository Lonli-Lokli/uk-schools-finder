import { z } from 'zod';

export function stringOrNumber() {
  return z
    .string()
    .or(z.number())
    .transform((val) => (val !== null ? val.toString() : val));
}

export function mustBePercentage() {
  return z
    .string()
    .or(z.number())
    .or(z.null())
    .or(z.undefined())
    .transform<number | null>((val) => {
      if (val === null || val === undefined) return null;
      if (val === 'SUPP' || val === 'NP' || val === 'NE' || val === '')
        return null;
      if (typeof val === 'number') return val;

      const num = parseFloat(val.replace('%', ''));
      return isNaN(num) ? null : num;
    });
}

export function mustBeNumber() {
  return z.coerce
    .number()
    .or(z.null())
    .or(z.undefined())
    .or(
      z.union([
        z.literal(''),
        z.literal('LOWCOV'),
        z.literal('NA'),
        z.literal('NE'),
        z.literal('NEW'),
        z.literal('NP'),
        z.literal('SUPP'),
      ])
    )
    .transform<number | null>((val) =>
      val === null || val === undefined
        ? null
        : typeof val === 'number'
        ? val
        : typeof val === 'string'
        ? null
        : intParser(val)
    );
}
export function optionalString() {
  return z
    .string()
    .optional()
    .nullable()
    .or(z.number())
    .transform((value) =>
      value === undefined
        ? null
        : typeof value === 'number'
        ? value.toString()
        : value
    );
}


// Helper function for integer parsing
function intParser(val: string) {
    const num = parseInt(val);
    return isNaN(num) ? null : num;
  }

export const normalizePostcode = (postcode: string | null | undefined): string | null => {
  if (!postcode) return null;
  return postcode.toUpperCase().replace(/\s+/g, ' ').trim();
};
  