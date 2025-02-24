import { createEvent, createStore, sample } from 'effector';
import { createAction } from 'effector-action';

export interface FilterOperation {
  column: string;
  operator: 'equals' | 'contains' | 'in';
  value: string | string[];
}

// Events
export const columnSelected = createEvent<string>();
export const filterAdded = createEvent();
export const filterRemoved = createEvent<number>();
export const filterChanged = createEvent<{
  index: number;
  value: string | string[];
}>();
export const operatorChanged = createEvent<{
  index: number;
  operator: FilterOperation['operator'];
}>();

// Stores
export const $selectedColumn = createStore<string | null>(null);
export const $filters = createStore<FilterOperation[]>([]);

// Sample to add new filter
createAction({
  clock: filterAdded,
  source: { $selectedColumn, $filters },
  target: { $filters, $selectedColumn },
  fn: (target, { selectedColumn, filters }) => {
    if (selectedColumn) {
      target.$filters([
        ...filters,
        {
          column: selectedColumn,
          operator: 'contains',
          value: '',
        },
      ]);
      target.$selectedColumn.reinit();
    }
  },
});

// Handle column selection
sample({
  clock: columnSelected,
  target: $selectedColumn,
});

// Handle filter removal
sample({
  source: $filters,
  clock: filterRemoved,
  fn: (filters, index) => filters.filter((_, i) => i !== index),
  target: $filters,
});

// Handle filter value changes
sample({
  source: $filters,
  clock: filterChanged,
  fn: (filters, { index, value }) =>
    filters.map((filter, i) => (i === index ? { ...filter, value } : filter)),
  target: $filters,
});

// Handle operator changes
sample({
  source: $filters,
  clock: operatorChanged,
  fn: (filters, { index, operator }) =>
    filters.map((filter, i) =>
      i === index
        ? { ...filter, operator, value: operator === 'in' ? [] : '' }
        : filter
    ),
  target: $filters,
});
