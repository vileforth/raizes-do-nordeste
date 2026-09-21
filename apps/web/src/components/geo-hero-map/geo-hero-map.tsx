'use client';

import { Fragment } from 'react';
import { CircleMarker, MapContainer, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BRAZIL_BOUNDS,
  BRAZIL_CENTER,
  positronTileAttribution,
  positronTileSubdomains,
  positronTileUrl,
} from '@/lib/map-tiles';
import { FitBounds, MapSizer } from './map-helpers';
import type { MapUnitPoint } from './map-types';

const UNIT_COLOR = '#FF4B00';
const UNIT_IDLE = '#072F33';

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
          <Fragment key={point.key}>
            {point.active ? (
              <CircleMarker
                center={[point.lat, point.lng]}
                radius={18}
                pathOptions={{
                  color: UNIT_COLOR,
                  weight: 1,
                  fillOpacity: 0,
                  className: 'geo-exec-pulse',
                }}
              />
            ) : null}
            <CircleMarker
              center={[point.lat, point.lng]}
              radius={point.active ? 8 : 6}
              pathOptions={{
                color: '#fff',
                weight: 1.5,
                fillColor: point.active ? UNIT_COLOR : UNIT_IDLE,
                fillOpacity: 0.95,
                className: point.active ? 'geo-exec-core' : undefined,
              }}
            >
              <Tooltip className="geo-tip" direction="top" offset={[0, -8]}>
                <span className="geo-tip__city">{point.name}</span>
                <span className="geo-tip__row">{point.address}</span>
              </Tooltip>
            </CircleMarker>
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
