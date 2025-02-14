import { SchoolsTable, SchoolsMap } from '../components';
type SearchParams = {
  page?: string;
  sort?: string;
  filter?: string;
  v?: string;
}

export default function SchoolFinderPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="h-full grid grid-cols-1 gap-4 lg:grid-cols-[minmax(700px,75%)_1fr]">
      <section className="h-full bg-white p-4">
        <SchoolsTable
          sort={searchParams.sort ?? ''}
          currentPage={Number(searchParams.page) || 1}
          filter={searchParams.filter ?? ''}
        />
      </section>

      <section className="h-full">
        <SchoolsMap
          filter={searchParams.filter ?? ''}
          viewport={searchParams.v}
        />
      </section>
    </div>
  );
}
