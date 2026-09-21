'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import type { PaginationProps } from './pagination.types';

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
  const locale = useLocale();
  const t = useTranslations('common');
  const fmt = new Intl.NumberFormat(locale);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <footer className="flex items-center justify-between border-t border-[var(--raizes-border)] px-4 py-2.5 text-[12px] text-[var(--raizes-text-secondary)] sm:px-5">
      <span className="tabular-nums">
        {t('paginationRange', {
          start: fmt.format(start),
          end: fmt.format(end),
          total: fmt.format(total),
        })}
      </span>
      <div className="flex items-center gap-0.5">
        <PageButton
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          ariaLabel={t('previousPage')}
        >
          <CaretLeft size={12} weight="bold" />
        </PageButton>
        <span className="px-3 font-medium tabular-nums text-[var(--raizes-text-primary)]">
          {page} <span className="text-[var(--raizes-text-secondary)]">/</span> {totalPages || 1}
        </span>
        <PageButton
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          ariaLabel={t('nextPage')}
        >
          <CaretRight size={12} weight="bold" />
        </PageButton>
      </div>
    </footer>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--raizes-text-primary)] transition-colors hover:bg-[var(--raizes-surface-raised)] disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}
