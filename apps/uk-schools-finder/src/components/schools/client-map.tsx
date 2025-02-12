'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { QuadrantSchoolDm } from '@lonli-lokli/shapes';
type ClientMapProps = {
  schools: QuadrantSchoolDm[];
  center: [number, number];
  zoom: number;
};

export function ClientMap({ schools, center, zoom }: ClientMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {schools.map((school) => (
        <Marker
          key={school.urn}
          position={[
            school.location.lat,
            school.location.lng,
          ]}
        >
          <Popup>
            <div>{school.name}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
