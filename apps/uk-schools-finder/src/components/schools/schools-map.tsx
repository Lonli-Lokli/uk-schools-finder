import dynamic from 'next/dynamic';
import type { School } from '@/types';

// Dynamically import the client-side map component with no SSR
const ClientMap = dynamic(
  () => import('./client-map').then(mod => mod.ClientMap),
  { ssr: false }
);

type SchoolsMapProps = {
  schools: School[];
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