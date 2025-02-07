import {
  KS5DestinationsSchema,
  KS5DestinationsRow,
} from './schemas/ks5-destinations';
import { parseAndValidateCSV } from './helpers';
import { ParseResult } from './shapes';


export async function ks5DestinationsParser(
  csvData: string
): Promise<ParseResult<KS5DestinationsRow>> {
  const { valid, errors } = await parseAndValidateCSV<KS5DestinationsRow>(
    csvData,
    KS5DestinationsSchema as any,
    (row) => ['1', '3'].includes(row.RECTYPE?.toString() ?? '')
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
