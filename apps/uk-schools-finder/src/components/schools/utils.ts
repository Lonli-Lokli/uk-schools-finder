import { createArrayOfAll, identity } from '@lonli-lokli/core';
import {
  FieldFilter,
  FilterableFields,
  FilterPart,
  Operator,
  SortField,
} from '@lonli-lokli/shapes';
import { SchoolFilters } from '@lonli-lokli/shapes';

export function getRatingColor(rating?: string): string {
  switch (rating?.toLowerCase()) {
    case 'outstanding':
      return 'text-green-600';
    case 'good':
      return 'text-blue-600';
    case 'requires improvement':
      return 'text-amber-600';
    case 'inadequate':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function parseFilterString(filterStr?: string | null): SchoolFilters {
  if (!filterStr) return {};

  return filterStr
    .split('|')
    .map(parseFilterPart)
    .filter((part): part is FilterPart => part !== null)
    .reduce<SchoolFilters>(
      (acc, { field, operator, value }) =>
        identity<SchoolFilters>({
          ...acc,
          [field]: identity<FieldFilter>({
            operator,
            value,
          }),
        }),
      {}
    );
}

function parseFilterPart(filter: string): FilterPart | null {
  const match = filter.match(/^(.+?)\[(.+?)\](.+)$/);
  if (!match) return null;

  const [_, field, operator, value] = match;

  if (!isValidOperator(operator)) return null;
  if (!isValidField(field)) return null;

  return { field, operator, value };
}

const OPERATORS = createArrayOfAll<Operator>()([
  'eq',
  'in',
  'like',
  'gt',
  'lt',
]);
const FILTERABLE_FIELDS = createArrayOfAll<FilterableFields>()([
  'type',
  'name',
]);

function isValidOperator(op: string): op is Operator {
  return OPERATORS.includes(op as Operator);
}

function isValidField(field: string): field is FilterableFields {
  return FILTERABLE_FIELDS.includes(field as FilterableFields);
}

export function parseSortString(sortStr?: string | null): SortField[] {
  if (!sortStr) return [];

  return sortStr.split(',').map((field) => ({
    field: field.startsWith('-') ? field.slice(1) : field,
    order: field.startsWith('-') ? 'descend' : 'ascend',
  }));
}
