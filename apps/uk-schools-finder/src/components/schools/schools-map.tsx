import dynamic from 'next/dynamic';
import { SchoolDm } from '../../shapes';


// Dynamically import the client-side map component with no SSR
const ClientMap = dynamic(
  () => import('./client-map').then(mod => mod.ClientMap),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Loading map...
      </div>
    )
  }
);

type SchoolsMapProps = {
  schools: SchoolDm[];
  center?: [number, number];
  zoom?: number;
};


// Server Component
export function SchoolsMap({ 
  schools,
  center = [51.5074, -0.1278],
  zoom = 10,
}: SchoolsMapProps) {
  return (
    <div className="h-full w-full rounded-lg bg-white shadow">
      <ClientMap
        schools={schools}
        center={center}
        zoom={zoom}
      />
    </div>
  );
} 