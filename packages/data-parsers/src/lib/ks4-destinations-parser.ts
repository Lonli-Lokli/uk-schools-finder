import { parseAndValidateCSV } from './helpers';
import { KS4DestinationsSchema } from './schemas/ks4-destinations.schema';
import type { KS4DestinationsRow } from './schemas/ks4-destinations.schema';
import { ParseResult } from './shapes';

export async function ks4DestinationsParser(
  csvData: string
): Promise<ParseResult<KS4DestinationsRow>> {
  const { valid, errors } = await parseAndValidateCSV<KS4DestinationsRow>(
    csvData,
    KS4DestinationsSchema as any,
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
