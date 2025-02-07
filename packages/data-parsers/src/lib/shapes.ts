type SuccessParseResult<T> = {
    type: 'success',
    rows: T[];
}
type ErrorParseResult = {
    type: 'error',
    message: string;
}
export type ParseResult<T> = SuccessParseResult<T> | ErrorParseResult;
