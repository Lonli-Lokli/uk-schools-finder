import { SchoolsTable, SchoolsMap } from '../components';
import { getSchools } from '../data-access/schools';

type SearchParams = {
  page?: string;
  sort?: string;
  order?: string;
  type?: string;
  rating?: string;
  search?: string;
};



export default async function SchoolFinderPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Parse all URL parameters on server side
  const page = Number(searchParams.page) || 1;
  const sortFields = searchParams.sort?.split(',').map(field => ({
    field: field.startsWith('-') ? field.slice(1) : field,
    order: field.startsWith('-') ? 'descend' as const : 'ascend' as const
  })) || [];

  const filters = {
    type: searchParams.type,
    rating: searchParams.rating,
    search: searchParams.search,
  };

  // Get data with parsed parameters
  const { schools, total, pageSize } = await getSchools({
    page,
    sortFields,
    filters,
  });

  // Pass ready-to-use data to client components
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="order-2 lg:order-1">
            <SchoolsTable
              schools={schools}
              total={total}
              pageSize={pageSize}
              currentPage={page}
              sortFields={sortFields}
            />
          </section>

          <section className="order-1 h-[300px] lg:order-2 lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4">
            <SchoolsMap schools={schools} />
          </section>
        </div>
      </div>
    </main>
  );
}
