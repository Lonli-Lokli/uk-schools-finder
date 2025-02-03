'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { School } from '../../shapes';
import { getRatingColor } from './utils';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

type ClientMapProps = {
  schools: School[];
  center: [number, number];
  zoom: number;
};

export function ClientMap({ schools, center, zoom }: ClientMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.location.lat, school.location.lng]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-medium">{school.name}</h3>
              <p className="text-sm text-gray-600">{school.type}</p>
              <p className={`text-sm ${getRatingColor(school.rating)}`}>
                {school.rating}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}