import { KS5HEDestinationsRow } from './schemas/ks5-he-destinations';
import { KS5HEDestinationsSchema } from './schemas/ks5-he-destinations';
import { parseAndValidateCSV } from './helpers';
import { ParseResult } from './shapes';


export async function ks5HEDestinationsParser(csvData: string): Promise<ParseResult<KS5HEDestinationsRow>> {
  const { valid, errors } = await parseAndValidateCSV<KS5HEDestinationsRow>(
    csvData,
    KS5HEDestinationsSchema as any,
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