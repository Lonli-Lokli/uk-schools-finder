import { SchoolDm } from '@lonli-lokli/shapes';
import { ColumnType } from 'antd/es/table';
import { combine, createEvent, createStore, sample } from 'effector';

export type ColumnVm = ColumnType<SchoolDm>;
// events
export const selectAllClicked = createEvent();
export const columnVisibilityChanged = createEvent<{
  column: ColumnVm;
  checked: boolean;
}>();

// events
const $columns = createStore(getDefaultColumns());
const $allColumnState = $columns.map<'checked' | 'unchecked' | 'indeterminate'>(
  (columns) =>
    columns.every((column) => !column.hidden)
      ? 'checked'
      : columns.every((column) => column.hidden)
      ? 'unchecked'
      : 'indeterminate'
);

export const $viewModel = combine({
  columns: $columns,
  allColumnState: $allColumnState,
});

// logic
sample({
  clock: selectAllClicked,
  source: $columns,
  fn: (columns) =>
    columns.map((column) => ({ ...column, hidden: !column.hidden })),
  target: $columns,
});

sample({
  clock: columnVisibilityChanged,
  source: $columns,
  fn: (columns, { column, checked }) => {
    const res = columns.map((col) =>
      col.dataIndex === column.dataIndex ? { ...col, hidden: !checked } : col
    );
    return res;
  },
  target: $columns,
});

// helpers
function getDefaultColumns(): ColumnVm[] {
  return ([
    // Visible by default (most important info)
    { dataIndex: 'name', title: 'School Name' },
    { dataIndex: ['type', 'name'], title: 'School Type' },
    { dataIndex: ['type', 'group'], title: 'School Group' },  // e.g., Academies, State, Independent
    { dataIndex: ['location', 'postcode'], title: 'Postcode' },
    { dataIndex: 'gender', title: 'Gender' },
    { dataIndex: ['phase', 'name'], title: 'Education Phase' },
    { dataIndex: 'capacity', title: 'Student Capacity' },
    
    // Hidden by default (additional info)
    { dataIndex: ['phase', 'statutoryAges', 'low'], title: 'Age From' },
    { dataIndex: ['phase', 'statutoryAges', 'high'], title: 'Age To' },
    { dataIndex: ['type', 'furtherEducationType'], title: 'Further Education Type' },
    { dataIndex: 'officialSixthForm', title: 'Has Sixth Form' },
    { dataIndex: 'boarders', title: 'Boarding School' },
    { dataIndex: 'senNoStat', title: 'SEN Status' },
    { dataIndex: 'specialClasses', title: 'Special Classes' },
    { dataIndex: ['contact', 'telephone'], title: 'Phone' },
    { dataIndex: ['contact', 'website'], title: 'Website' },
    { dataIndex: ['contact', 'headTeacher', 'firstName'], title: 'Head Teacher' },
    { dataIndex: 'trust', title: 'Trust Name' },
    { dataIndex: 'status', title: 'Status' },
  ]).map((col, idx) => ({
    ...col,
    hidden: idx > 5,
  }));
}
