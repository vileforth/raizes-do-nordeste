'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { GeoHeroMap } from '@/components/geo-hero-map';
import type { MapUnitPoint } from '@/components/geo-hero-map/map-types';
import { BRAZIL_BOUNDS, BRAZIL_CENTER } from '@/lib/map-tiles';

export function FullscreenMap({
  points,
  onClose,
  backLabel,
  controls,
}: {
  points: MapUnitPoint[];
  onClose: () => void;
  backLabel: string;
  controls?: ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[var(--raizes-app-bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GeoHeroMap points={points} interactive leftInset={0} bounds={BRAZIL_BOUNDS} center={BRAZIL_CENTER} fitMaxZoom={12} />
      <div className="pointer-events-none absolute inset-x-0 top-4 z-[110] flex items-start justify-between px-4">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-full border bg-white/80 px-3.5 text-sm font-semibold text-[var(--raizes-petrol)] backdrop-blur-xl"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </button>
        {controls ? <div className="pointer-events-auto">{controls}</div> : null}
      </div>
    </motion.div>
  );
}
