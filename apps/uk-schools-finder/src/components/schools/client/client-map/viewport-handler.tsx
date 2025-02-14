'use client';

import { useMap, useMapEvents } from 'react-leaflet';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import Geohash from 'latlon-geohash';

export function ViewportHandler() {
  const map = useMap();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateViewportParams = useCallback(() => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    const geohash = Geohash.encode(center.lat, center.lng, 9);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('v', `${geohash},${zoom}`);  // v for viewport

    router.push(`?${params.toString()}`, { scroll: false });
  }, [map, router, searchParams]);

  useEffect(() => {
    // Initial bounds update
    updateViewportParams();
  }, [updateViewportParams]);

  useMapEvents({
    moveend: updateViewportParams,
    zoomend: updateViewportParams,
  });
  return null;
} 