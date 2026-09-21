'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { GLASS } from '@/lib/glass';
import { ChartCardHeader } from './chart-card-header';
import { BarsSkeleton } from './chart-skeletons';

export type DailyBar = {
  key: string;
  date: Date;
  count: number;
};

export function DailyBarChart({
  title,
  subtitle,
  total,
  totalLabel,
  bars,
  loading,
  empty,
  locale = 'pt-BR',
}: {
  title: string;
  subtitle: string;
  total: number;
  totalLabel: string;
  bars: DailyBar[];
  loading: boolean;
  empty: string;
  locale?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...bars.map((bar) => bar.count));
  const dayFmt = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit' });
  const labelEvery = Math.ceil(bars.length / 5) || 1;

  return (
    <div className="rounded-2xl border p-4 backdrop-blur-xl sm:p-5" style={GLASS}>
      <ChartCardHeader
        title={title}
        subtitle={subtitle}
        total={total.toLocaleString(locale)}
        totalLabel={totalLabel}
        loading={loading}
      />
      {loading ? (
        <BarsSkeleton />
      ) : (
        <div className="relative">
          <div className="flex h-36 items-end gap-[3px]">
            {bars.map((bar, index) => {
              const height = (bar.count / max) * 100;
              const active = hover === index;
              return (
                <div
                  key={bar.key}
                  className="relative flex h-full flex-1 items-end"
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover((current) => (current === index ? null : current))}
                >
                  {active ? (
                    <div
                      className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-center"
                      style={{ ...GLASS, background: 'rgba(255,255,255,0.92)' }}
                    >
                      <span className="block text-[13px] font-bold tabular-nums text-[var(--raizes-petrol)]">
                        {bar.count}
                      </span>
                      <span className="block text-[10px] text-[var(--raizes-text-secondary)]">
                        {dayFmt.format(bar.date)}
                      </span>
                    </div>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 top-0 rounded-md bg-black/[0.03]" />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.012, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full origin-bottom rounded-md"
                    style={{
                      height: `${Math.max(height, bar.count > 0 ? 4 : 1.5)}%`,
                      background: active
                        ? 'linear-gradient(to top, #3a3d42, #17181b)'
                        : 'linear-gradient(to top, #5a5d62, #2b2d31)',
                      boxShadow: active ? '0 4px 14px -4px rgba(24,26,29,0.5)' : 'none',
                      opacity: hover != null && !active ? 0.55 : 1,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-[3px]">
            {bars.map((bar, index) => (
              <div key={bar.key} className="flex-1 text-center">
                {index % labelEvery === 0 ? (
                  <span className="text-[9px] tabular-nums text-[var(--raizes-text-secondary)]">
                    {dayFmt.format(bar.date)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
      {total === 0 && !loading ? (
        <p className="mt-3 text-center text-[12px] text-[var(--raizes-text-secondary)]">{empty}</p>
      ) : null}
    </div>
  );
}
