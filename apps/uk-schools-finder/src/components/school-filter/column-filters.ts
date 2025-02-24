export type FilterType = 'text' | 'select';

export interface ColumnFilter {
  key: string;
  title: string;
  filterType: FilterType;
  options?: Array<{ label: string; value: string }>;
  operators: Array<'equals' | 'contains' | 'in'>;
}

export const columnFilters: ColumnFilter[] = [
  {
    key: 'name',
    title: 'School Name',
    filterType: 'text',
    operators: ['contains', 'equals'],
  },
  {
    key: 'type',
    title: 'School Type',
    filterType: 'select',
    operators: ['equals', 'in'],
    options: [
      { label: 'Academy', value: 'academy' },
      { label: 'Community School', value: 'community' },
      { label: 'Independent School', value: 'independent' },
      { label: 'Free School', value: 'free' },
    ],
  },
  {
    key: 'educationPhase',
    title: 'Education Phase',
    filterType: 'select',
    operators: ['equals', 'in'],
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Sixth Form', value: 'sixthform' },
      { label: 'All-through', value: 'allthrough' },
    ],
  },
  {
    key: 'gender',
    title: 'Gender',
    filterType: 'select',
    operators: ['equals', 'in'],
    options: [
      { label: 'Mixed', value: 'mixed' },
      { label: 'Boys', value: 'boys' },
      { label: 'Girls', value: 'girls' },
    ],
  },
  {
    key: 'postcode',
    title: 'Postcode',
    filterType: 'text',
    operators: ['contains', 'equals'],
  },
  {
    key: 'group',
    title: 'School Group',
    filterType: 'text',
    operators: ['contains', 'equals'],
  },
]; 