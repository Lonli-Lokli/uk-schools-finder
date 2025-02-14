import dynamic from 'next/dynamic';
import { getQuadrantForBounds } from '@lonli-lokli/supabase/data-access';
import Geohash from 'latlon-geohash';
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

const defaultCenter: [number, number] = [51.5074, -0.1278]; // Default London

type SchoolsMapProps = {
  filter: string;
  viewport?: string;
  zoom?: string;
};

// Server Component
export async function SchoolsMap({
  filter,
  viewport,
}: SchoolsMapProps) {
  let center = defaultCenter; // Default London
  let zoom = 13;

  if (viewport) {
    const [geohash, zoomStr] = viewport.split(',');
    const { lat, lon } = Geohash.decode(geohash);
    center = [lat, lon];
    zoom = parseInt(zoomStr, 10);
  }

  const filters = parseFilterString(filter);

  const bounds = getBoundsFromCenterZoom(center, zoom);
  const quadrant = await getQuadrantForBounds({ filters, bounds });

  return (
    <div className="h-full w-full rounded-lg bg-white shadow">
      <ClientMap schools={quadrant.schools} center={center} zoom={zoom} />
    </div>
  );
}


function getBoundsFromCenterZoom(center: [number, number], zoom: number) {
  // Approximate bounds calculation
  // At zoom level z, each tile covers 360/2^z degrees
  const tileSize = 360 / Math.pow(2, zoom);
  const [lat, lng] = center;
  
  return {
    ne: { 
      lat: lat + tileSize/2, 
      lng: lng + tileSize/2 
    },
    sw: { 
      lat: lat - tileSize/2, 
      lng: lng - tileSize/2 
    }
  };
}