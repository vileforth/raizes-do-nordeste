'use client';

import { GLASS } from '@/lib/glass';
import { ResponsiveLine } from './nivo';
import { ChartCardHeader } from './chart-card-header';
import { ChartBodySkeleton } from './chart-skeletons';

const GRAPHITE = '#2b2d31';

export function AreaLineChart({
  title,
  subtitle,
  total,
  totalLabel,
  points,
  loading,
  empty,
  locale = 'pt-BR',
  formatTotal,
}: {
  title: string;
  subtitle: string;
  total: number;
  totalLabel: string;
  points: { date: string; value: number }[];
  loading?: boolean;
  empty: string;
  locale?: string;
  formatTotal?: (value: number) => string;
}) {
  const fmtDate = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' });
  const labelFor = (date: string) => fmtDate.format(new Date(`${date}T00:00:00`)).replace('.', '');
  const serie = [{ id: 'series', data: points.map((point) => ({ x: labelFor(point.date), y: point.value })) }];
  const tickEvery = Math.max(1, Math.floor(points.length / 6));
  const tickValues = points.filter((_, index) => index % tickEvery === 0).map((point) => labelFor(point.date));

  return (
    <div className="rounded-2xl border p-4 backdrop-blur-xl sm:p-5" style={GLASS}>
      <ChartCardHeader
        title={title}
        subtitle={subtitle}
        total={formatTotal ? formatTotal(total) : total.toLocaleString(locale)}
        totalLabel={totalLabel}
        loading={loading}
      />
      <div style={{ height: 220 }}>
        {loading ? (
          <ChartBodySkeleton height={220} />
        ) : points.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[12px] text-[var(--raizes-text-secondary)]">
            {empty}
          </div>
        ) : (
          <ResponsiveLine
            data={serie}
            margin={{ top: 14, right: 18, bottom: 30, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
            curve="monotoneX"
            colors={[GRAPHITE]}
            lineWidth={2.5}
            enablePoints={false}
            enableArea
            areaOpacity={1}
            areaBaselineValue={0}
            defs={[
              {
                id: 'areaGrad',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: GRAPHITE, opacity: 0.28 },
                  { offset: 100, color: GRAPHITE, opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: '*', id: 'areaGrad' }]}
            enableGridX={false}
            gridYValues={4}
            axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 4 }}
            axisBottom={{ tickSize: 0, tickPadding: 10, tickValues }}
            enableSlices="x"
            sliceTooltip={({ slice }) => {
              const point = slice.points[0];
              return (
                <div className="rounded-lg border px-2.5 py-1.5" style={{ ...GLASS, background: 'rgba(255,255,255,0.94)' }}>
                  <p className="text-[10px] text-[var(--raizes-text-secondary)]">{String(point.data.x)}</p>
                  <p className="text-sm font-semibold tabular-nums text-[var(--raizes-petrol)]">
                    {Number(point.data.y).toLocaleString(locale)}
                  </p>
                </div>
              );
            }}
            theme={{
              text: { fontSize: 10, fill: '#aeaeb2' },
              axis: { ticks: { text: { fill: '#aeaeb2', fontSize: 10 } } },
              grid: { line: { stroke: 'rgba(0,0,0,0.05)' } },
              crosshair: { line: { stroke: 'rgba(7,47,51,0.2)', strokeWidth: 1 } },
            }}
            motionConfig="gentle"
          />
        )}
      </div>
    </div>
  );
}
