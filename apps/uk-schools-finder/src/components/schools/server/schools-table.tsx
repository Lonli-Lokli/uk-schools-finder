import { getSchools } from '@lonli-lokli/supabase/data-access';
import { parseFilterString, parseSortString } from '../utils';
import { ClientTable } from '../client';

type SchoolsTableProps = {
  currentPage: number;
  sort: string;
  filter: string;
};

export async function SchoolsTable({
  currentPage,
  sort,
  filter,
}: SchoolsTableProps) {
  const filters = parseFilterString(filter);
  const sortFields = parseSortString(sort);

  const { schools, total, pageSize } = await getSchools({
    page: currentPage,
    sortFields,
    filters,
  });
  return (
    <div className="bg-white rounded-lg shadow">
      <ClientTable
        schools={schools}
        currentPage={currentPage}
        total={total}
        pageSize={pageSize}
        filters={filters}
        sortFields={sortFields}
      />
    </div>
  );
}
