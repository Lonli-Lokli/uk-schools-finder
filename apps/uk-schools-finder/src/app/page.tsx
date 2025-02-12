import { SchoolsTable, SchoolsMap } from '../components';
type SearchParams = {
  page?: string;
  sort?: string;
  filter?: string;
};

export default async function SchoolFinderPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="order-2 lg:order-1">
            <SchoolsTable
              sort={searchParams.sort ?? ''}
              currentPage={Number(searchParams.page) || 1}
              filter={searchParams.filter ?? ''}
            />
          </section>

          <section className="order-1 h-[300px] lg:order-2 lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4">
            <SchoolsMap filter={searchParams.filter ?? ''} />
          </section>
        </div>
      </div>
    </main>
  );
}
