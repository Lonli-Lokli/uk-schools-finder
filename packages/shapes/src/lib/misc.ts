export type DeepNamePath<
  Store,
  ParentNamePath extends any[] = [],
  Depth extends any[] = []
> = Depth['length'] extends 4
  ? never
  : Store extends string | number | boolean
  ? ParentNamePath['length'] extends 0
    ? Store
    : never
  : Store extends (string | number | boolean)[]
  ? ParentNamePath['length'] extends 0
    ? Store
    : [...ParentNamePath, number]
  : Store extends any[]
  ?
      | [...ParentNamePath, number]
      | DeepNamePath<
          Store[number],
          [...ParentNamePath, number],
          [unknown, ...Depth]
        >
  : Store extends object
  ? {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      [FieldKey in keyof Store]: Store[FieldKey] extends Function
        ? never
        :
            | (ParentNamePath['length'] extends 0 ? FieldKey : never)
            | [...ParentNamePath, FieldKey]
            | DeepNamePath<
                Required<Store>[FieldKey],
                [...ParentNamePath, FieldKey],
                [unknown, ...Depth]
              >;
    }[keyof Store]
  : never;
