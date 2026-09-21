import { TotalSkeleton } from './chart-skeletons';

export function ChartCardHeader({
  title,
  subtitle,
  total,
  totalLabel,
  loading,
}: {
  title: string;
  subtitle: string;
  total: string;
  totalLabel: string;
  loading?: boolean;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold leading-tight tracking-tight text-[var(--raizes-petrol)]">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] text-[var(--raizes-text-secondary)]">{subtitle}</p>
      </div>
      <div className="shrink-0 text-right">
        {loading ? (
          <TotalSkeleton />
        ) : (
          <p className="text-2xl font-semibold leading-none tabular-nums text-[var(--raizes-petrol)]">
            {total}
          </p>
        )}
        <p className="mt-0.5 text-[11px] text-[var(--raizes-text-secondary)]">{totalLabel}</p>
      </div>
    </div>
  );
}
