import { ClientTableWrapper } from './client-table-wrapper';
import { parseFilterString, parseSortString } from './utils';
import { getSchools } from '@lonli-lokli/supabase/data-access';

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
      <ClientTableWrapper
        dataSource={schools}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: false,
        }}
        sortFields={sortFields}
      />
    </div>
  );
}
