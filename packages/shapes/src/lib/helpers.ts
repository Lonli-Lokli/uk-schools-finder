export type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: 
    | TKey 
    | (TObj[TKey] extends object 
      ? [TKey] | [TKey, keyof NonNullable<TObj[TKey]>] 
      : [TKey]);
}[keyof TObj & (string | number)];


