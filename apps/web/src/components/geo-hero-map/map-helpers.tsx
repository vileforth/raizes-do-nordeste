'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { MapUnitPoint } from './map-types';

export function MapSizer() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    const raf = requestAnimationFrame(invalidate);
    const id = window.setTimeout(invalidate, 120);
    window.addEventListener('resize', invalidate);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
      window.removeEventListener('resize', invalidate);
    };
  }, [map]);
  return null;
}

export function FitBounds({
  points,
  leftInset,
  fallbackBounds,
  fitMaxZoom,
}: {
  points: MapUnitPoint[];
  leftInset: number;
  fallbackBounds: [[number, number], [number, number]];
  fitMaxZoom: number;
}) {
  const map = useMap();
  const prevSig = useRef('');
  useEffect(() => {
    const sig = `${points.map((point) => point.key).sort().join('|')}@${leftInset}`;
    if (sig === prevSig.current) return;
    prevSig.current = sig;
    map.invalidateSize();
    const topLeft: [number, number] = [leftInset + 24, 40];
    const bottomRight: [number, number] = [40, 40];
    if (points.length === 0) {
      map.fitBounds(fallbackBounds, {
        paddingTopLeft: topLeft,
        paddingBottomRight: bottomRight,
        animate: false,
      });
      return;
    }
    map.fitBounds(
      points.map((point) => [point.lat, point.lng] as [number, number]),
      {
        paddingTopLeft: topLeft,
        paddingBottomRight: bottomRight,
        maxZoom: fitMaxZoom,
        animate: true,
      },
    );
  }, [map, points, leftInset, fallbackBounds, fitMaxZoom]);
  return null;
}
