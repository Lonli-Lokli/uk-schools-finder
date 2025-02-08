import { parseAndValidateCSV } from './helpers';
import { SchoolRow, SchoolRowSchema } from './schemas/schools';
import { ParseResult } from './shapes';

export async function schoolsParser(
  csvData: string
): Promise<ParseResult<SchoolRow>> {
  const { valid, errors } = await parseAndValidateCSV<SchoolRow>(
    csvData,
    SchoolRowSchema as any
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
