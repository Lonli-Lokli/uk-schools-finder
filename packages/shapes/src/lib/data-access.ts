export interface FilterPart {
  field: FilterableFields;
  operator: Operator;
  value: string;
}

export type Operator = 'eq' | 'in' | 'like' | 'gt' | 'lt';
export type FilterableFields = 'name' | 'type';
export type FieldFilter = {
  value: string | string[] | number | number[];
  operator: Operator;
}
export type SchoolFilters = {
  [key in FilterableFields]?: FieldFilter;
};

export interface SortField {
  field: string;
  order: 'ascend' | 'descend';
}
