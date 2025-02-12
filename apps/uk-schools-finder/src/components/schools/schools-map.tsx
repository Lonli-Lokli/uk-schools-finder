import dynamic from 'next/dynamic';
import { parseFilterString } from './utils';
import { getQuadrantByGeohash } from '@lonli-lokli/supabase/data-access';

// Dynamically import the client-side map component with no SSR
const ClientMap = dynamic(
  () => import('./client-map').then((mod) => mod.ClientMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Loading map...
      </div>
    ),
  }
);

type SchoolsMapProps = {
  filter: string;
};

const default_center = [51.5074, -0.1278] as [number, number];

// Server Component
export async function SchoolsMap({ filter }: SchoolsMapProps) {
  const filters = parseFilterString(filter);
  const quadrant = await getQuadrantByGeohash({
    geohash: '',
  });
  return (
    <div className="h-full w-full rounded-lg bg-white shadow">
      <ClientMap
        schools={quadrant.schools}
        center={default_center}
        zoom={10}
       />
    </div>
  );
}
