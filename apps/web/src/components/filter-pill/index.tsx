'use client';

export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1 text-xs font-medium transition"
      style={{
        background: active ? 'var(--raizes-brand-soft)' : 'var(--raizes-surface-raised)',
        color: active ? 'var(--raizes-brand-text)' : 'var(--raizes-text-secondary)',
      }}
    >
      {label}
    </button>
  );
}
