'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TopbarUserMenu() {
  const t = useTranslations('nav');
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const userLabel = user?.name || user?.email || t('profile');
  const initials = initialsFromName(userLabel);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={userLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-[var(--raizes-border-strong)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--raizes-surface-raised)] text-[11px] font-semibold text-[var(--raizes-text-primary)]">
          {initials}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 w-64 overflow-hidden rounded-lg border border-[var(--raizes-border)] bg-[var(--raizes-surface)] shadow-lg"
        >
          <div className="border-b border-[var(--raizes-border)] px-3 py-3">
            <p className="truncate text-sm font-medium text-[var(--raizes-text-primary)]">
              {user?.name || '—'}
            </p>
            <p className="truncate text-xs text-[var(--raizes-text-secondary)]">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--raizes-text-primary)] transition-colors hover:bg-[var(--raizes-surface-raised)]"
          >
            {t('logout')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
