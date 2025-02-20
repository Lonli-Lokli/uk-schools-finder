export function identity<T>(value: T): T {
  return value;
}

export class NeverError extends Error {
  constructor(value: never) {
    super(`Unreachable code reached with value: ${value}`);
  }
}

type Invalid<T> = ['Needs to be all of', T];
export const createArrayOfAll =
  <T>() =>
  <U extends T[]>(
    array: U & ([T] extends [U[number]] ? unknown : Invalid<T>)
  ) =>
    array;

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
