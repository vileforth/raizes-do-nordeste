'use client';

import { useMessages } from 'next-intl';
import { humanizeStatus, toneFor, type StatusTone } from '@/lib/helpers/status';

type Props = {
  status: string;
  label?: string;
  tone?: StatusTone;
};

export function StatusBadge({ status, label, tone }: Props) {
  const messages = useMessages() as { status?: Record<string, string> };
  const resolvedTone = tone ?? toneFor(status);
  const resolvedLabel = label ?? messages.status?.[status] ?? humanizeStatus(status);
  const styles = TONE_STYLES[resolvedTone];

  return (
    <span
      className="inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold"
      style={{ background: styles.bg, color: styles.fg }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: styles.dot }}
      />
      {resolvedLabel}
    </span>
  );
}

const TONE_STYLES: Record<StatusTone, { bg: string; fg: string; dot: string }> = {
  neutral: {
    bg: 'var(--raizes-petrol-soft)',
    fg: 'var(--raizes-petrol-text)',
    dot: 'var(--raizes-petrol-text)',
  },
  info: {
    bg: 'var(--raizes-cyan-soft)',
    fg: 'var(--raizes-cyan-text)',
    dot: 'var(--raizes-cyan-text)',
  },
  success: {
    bg: 'var(--raizes-green-soft)',
    fg: 'var(--raizes-green-text)',
    dot: 'var(--raizes-green-text)',
  },
  warning: {
    bg: 'var(--raizes-amber-soft)',
    fg: 'var(--raizes-amber-text)',
    dot: 'var(--raizes-amber-text)',
  },
  danger: {
    bg: 'var(--raizes-rose-soft)',
    fg: 'var(--raizes-rose-text)',
    dot: 'var(--raizes-rose-text)',
  },
  muted: {
    bg: 'var(--raizes-surface-raised)',
    fg: 'var(--raizes-text-secondary)',
    dot: 'var(--raizes-text-secondary)',
  },
};
