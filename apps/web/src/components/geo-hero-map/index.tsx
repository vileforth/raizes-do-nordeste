'use client';

import dynamic from 'next/dynamic';

export const GeoHeroMap = dynamic(() => import('./geo-hero-map'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[var(--raizes-surface-raised)]" />,
});
