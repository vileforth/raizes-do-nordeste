type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'muted';

const TONE_STYLES: Record<StatusTone, { bg: string; fg: string }> = {
  neutral: { bg: 'transparent', fg: 'var(--raizes-text-primary)' },
  info: { bg: 'var(--raizes-cyan-soft)', fg: 'var(--raizes-cyan-text)' },
  success: { bg: 'var(--raizes-green-soft)', fg: 'var(--raizes-green-text)' },
  warning: { bg: 'var(--raizes-amber-soft)', fg: 'var(--raizes-amber-text)' },
  danger: { bg: 'var(--raizes-rose-soft)', fg: 'var(--raizes-rose-text)' },
  muted: { bg: 'transparent', fg: 'var(--raizes-text-secondary)' },
};

export function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: StatusTone;
}) {
  const styles = TONE_STYLES[tone];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: styles.bg, color: styles.fg }}
    >
      {label}
    </span>
  );
}
