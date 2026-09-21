import { Fragment } from 'react';
import { divIcon } from 'leaflet';
import { CircleMarker, Marker, Tooltip } from 'react-leaflet';
import type { MapUnitPoint } from './map-types';

const MARKER_COLORS = {
  unit: { active: '#FF4B00', idle: '#072F33' },
  client: { active: '#0F766E', idle: '#5EEAD4' },
} as const;

function createClientIcon(active: boolean) {
  const fill = active ? MARKER_COLORS.client.active : MARKER_COLORS.client.idle;
  return divIcon({
    className: 'geo-client-pin',
    iconSize: [18, 22],
    iconAnchor: [9, 22],
    html: `<svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true"><path d="M9 21.2C9 21.2 16 13.4 16 8.2A7 7 0 1 0 2 8.2c0 5.2 7 13 7 13z" fill="${fill}" stroke="#fff" stroke-width="1.5"/><circle cx="9" cy="8.2" r="2.3" fill="#fff"/></svg>`,
  });
}

function PointTooltip({ point }: { point: MapUnitPoint }) {
  return (
    <Tooltip className="geo-tip" direction="top" offset={[0, -8]}>
      <span className="geo-tip__city">{point.name}</span>
      <span className="geo-tip__row">{point.address}</span>
    </Tooltip>
  );
}

export function MapPointMarker({ point }: { point: MapUnitPoint }) {
  const kind = point.kind ?? 'unit';
  const colors = MARKER_COLORS[kind];
  const fill = point.active ? colors.active : colors.idle;

  if (kind === 'client') {
    return (
      <Marker position={[point.lat, point.lng]} icon={createClientIcon(point.active)}>
        <PointTooltip point={point} />
      </Marker>
    );
  }

  return (
    <Fragment>
      {point.active ? (
        <CircleMarker
          center={[point.lat, point.lng]}
          radius={18}
          pathOptions={{
            color: colors.active,
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
          fillColor: fill,
          fillOpacity: 0.95,
          className: point.active ? 'geo-exec-core' : undefined,
        }}
      >
        <PointTooltip point={point} />
      </CircleMarker>
    </Fragment>
  );
}
