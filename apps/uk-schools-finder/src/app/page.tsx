import { SchoolsTable, SchoolsMap } from '../components';

type SearchParams = {
  page?: string;
  sort?: string;
  filter?: string;
  v?: string;
};

export default function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="h-full overflow-hidden">
      {/* Mobile: Map on top, fixed height table below */}
      <div className="lg:hidden h-full grid grid-rows-[1fr_398px]">
        <div className="relative">
          <SchoolsMap
            filter={searchParams.filter ?? ''}
            viewport={searchParams.v}
          />
        </div>
        <div className="overflow-hidden">
          <div className="p-4 overflow-x-auto overflow-y-hidden">
            <SchoolsTable
              sort={searchParams.sort ?? ''}
              currentPage={Number(searchParams.page) || 1}
              filter={searchParams.filter ?? ''}
            />
          </div>
        </div>
      </div>

      {/* Desktop: Table on top, map fills remaining space below */}
      <div className="hidden lg:block h-full grid grid-rows-[398px_1fr] overflow-hidden">
        <div className="overflow-hidden">
          <div className="p-4 overflow-x-auto overflow-y-hidden">
            <SchoolsTable
              sort={searchParams.sort ?? ''}
              currentPage={Number(searchParams.page) || 1}
              filter={searchParams.filter ?? ''}
            />
          </div>
        </div>
        <div className="relative">
          <SchoolsMap
            filter={searchParams.filter ?? ''}
            viewport={searchParams.v}
          />
        </div>
      </div>
    </div>
  );
}
