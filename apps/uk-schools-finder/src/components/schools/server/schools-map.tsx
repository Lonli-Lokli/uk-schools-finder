import dynamic from 'next/dynamic';
import { getQuadrantForBounds } from '@lonli-lokli/supabase/data-access';
import { parseFilterString } from '../utils';

// Dynamically import the client-side map component with no SSR
const ClientMap = dynamic(
  () => import('../client').then((mod) => mod.ClientMap),
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
  ne_lat?: string;
  ne_lng?: string;
  sw_lat?: string;
  sw_lng?: string;
  zoom?: string;
};

// Server Component
export async function SchoolsMap({
  filter,
  ne_lat,
  ne_lng,
  sw_lat,
  sw_lng,
  zoom,
}: SchoolsMapProps) {
  const filters = parseFilterString(filter);

  const bounds =
    ne_lat && ne_lng && sw_lat && sw_lng
      ? {
          ne: {
            lat: parseFloat(ne_lat),
            lng: parseFloat(ne_lng),
          },
          sw: {
            lat: parseFloat(sw_lat),
            lng: parseFloat(sw_lng),
          },
        }
      : undefined;

  const parsedZoom = zoom ? parseInt(zoom) : 13;

  const center = bounds
    ? ([
        (bounds.ne.lat + bounds.sw.lat) / 2,
        (bounds.ne.lng + bounds.sw.lng) / 2,
      ] as [number, number])
    : ([51.5074, -0.1278] as [number, number]);

  const schools = bounds
    ? (await getQuadrantForBounds({ filters, bounds })).schools
    : [];

  return (
    <div className="h-full w-full rounded-lg bg-white shadow">
      <ClientMap schools={schools} center={center} zoom={parsedZoom} />
    </div>
  );
}
