'use client';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  Marker,
  Popup,
} from 'react-leaflet';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { geohashForLocation } from 'geofire-common';
import { QuadrantSchoolDm } from '@lonli-lokli/shapes';
type ClientMapProps = {
  schools: QuadrantSchoolDm[];
  center: [number, number];
  zoom: number;
};

export function ClientMap({ schools, center, zoom }: ClientMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} className="h-full w-full">
      <ViewportHandler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {schools.map((school) => (
        <Marker
          key={school.urn}
          position={[school.location.lat, school.location.lng]}
        >
          <Popup>
            <div>{school.name}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function ViewportHandler() {
  const map = useMap();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateViewportGeohash = useCallback(() => {
    const center = map.getCenter();
    const geohash = geohashForLocation([center.lat, center.lng], 9);

    const params = new URLSearchParams(searchParams.toString());
    params.set('vg', geohash);

    router.push(`?${params.toString()}`, { scroll: false });
  }, [map, router, searchParams]);

  useMapEvents({
    moveend: updateViewportGeohash,
    zoomend: updateViewportGeohash,
  });

  return null;
}
