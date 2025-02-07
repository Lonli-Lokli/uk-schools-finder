import { parseAndValidateCSV } from './helpers';
import { KS4ResultsSchema } from './schemas/ks4-results.schema';
import type { KS4ResultsRow } from './schemas/ks4-results.schema';
import { ParseResult } from './shapes';

export async function ks4ResultsParser(
  csvData: string
): Promise<ParseResult<KS4ResultsRow>> {
  const { valid, errors } = await parseAndValidateCSV<KS4ResultsRow>(
    csvData,
    KS4ResultsSchema as any,
    (row) => ['1', '2'].includes(row.RECTYPE?.toString() ?? '')
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
