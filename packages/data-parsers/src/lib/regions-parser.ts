import { parseAndValidateCSV } from './helpers';
import { RegionRowSchema, RegionRow } from './schemas/regions';
import { ParseResult } from './shapes';

export async function regionsParser(
  csvData: string
): Promise<ParseResult<RegionRow>> {
  const { valid, errors } = await parseAndValidateCSV<RegionRow>(
    csvData,
    RegionRowSchema as any
  );

  if (errors.length > 0) {
    return {
      type: 'error',
      message: `Failures: ${errors.length}. First error happens on row ${errors[0].row}: ${errors[0].error.message}`,
    };
  }

  return {
    type: 'success',
    rows: valid,
  };
}
