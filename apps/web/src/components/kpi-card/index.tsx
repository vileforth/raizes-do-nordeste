'use client';

import { motion } from 'framer-motion';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

export type KpiSpec = {
  key: string;
  Icon: PhosphorIcon;
  accent: string;
  label: string;
  raw?: number;
  format: (n: number) => string;
};

export function KpiCard({ kpi, index }: { kpi: KpiSpec; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl border p-4 backdrop-blur-xl"
      style={{
        background: 'rgba(255,255,255,0.72)',
        borderColor: 'rgba(255,255,255,0.75)',
        boxShadow: '0 1px 2px rgba(7,47,51,0.04), 0 14px 36px -18px rgba(7,47,51,0.3)',
      }}
    >
      <p className="t-eyebrow">{kpi.label}</p>
      <p className="t-stat-lg mt-2" style={{ color: kpi.accent }}>
        {kpi.raw != null ? kpi.format(kpi.raw) : '—'}
      </p>
    </motion.div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--raizes-border)] p-4">
      <div className="h-3 w-16 animate-pulse rounded bg-black/5" />
      <div className="mt-3 h-8 w-24 animate-pulse rounded bg-black/5" />
    </div>
  );
}
