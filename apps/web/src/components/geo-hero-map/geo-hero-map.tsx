'use client';

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BRAZIL_BOUNDS,
  BRAZIL_CENTER,
  positronTileAttribution,
  positronTileSubdomains,
  positronTileUrl,
} from '@/lib/map-tiles';
import { FitBounds, MapSizer } from './map-helpers';
import { MapPointMarker } from './map-markers';
import type { MapUnitPoint } from './map-types';

export default function GeoHeroMap({
  points,
  interactive = false,
  leftInset = 0,
  bounds = BRAZIL_BOUNDS,
  center = BRAZIL_CENTER,
  fitMaxZoom = 6,
}: {
  points: MapUnitPoint[];
  interactive?: boolean;
  leftInset?: number;
  bounds?: [[number, number], [number, number]];
  center?: [number, number];
  fitMaxZoom?: number;
}) {
  return (
    <div className="geo-map-root absolute inset-0">
      <MapContainer
        center={center}
        zoom={5}
        className="h-full w-full"
        zoomControl={false}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        attributionControl={false}
      >
        <TileLayer
          url={positronTileUrl}
          attribution={positronTileAttribution}
          subdomains={positronTileSubdomains}
        />
        {interactive ? <ZoomControl position="bottomright" /> : null}
        <MapSizer />
        <FitBounds
          points={points}
          leftInset={leftInset}
          fallbackBounds={bounds}
          fitMaxZoom={fitMaxZoom}
        />
        {points.map((point) => (
          <MapPointMarker key={point.key} point={point} />
        ))}
      </MapContainer>
    </div>
  );
}
