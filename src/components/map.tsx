'use client';

import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Place } from '@/lib/data';

type MapProps = {
  places: Place[];
  center: { lat: number; lng: number };
  zoom?: number;
};

export default function Map({ places, center, zoom = 12 }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey!}>
      <GoogleMap
        style={{ width: '100%', height: '100%' }}
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="a2e4c8c2a3d3c1d"
      >
        {places.map((place) => (
          <AdvancedMarker key={place.id} position={place.coordinates} title={place.name}>
            <Pin background={'hsl(var(--primary))'} borderColor={'hsl(var(--primary-foreground))'} glyphColor={'hsl(var(--primary-foreground))'} />
          </AdvancedMarker>
        ))}
      </GoogleMap>
    </APIProvider>
  );
}
