'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useSidebarClearLeft } from '@/components/sidebar';
import { useAuth } from '@/providers/auth-provider';
import { LanguageSwitch } from './language-switch';
import { TopbarUserMenu } from './user-menu';

const TIMEZONE = 'America/Fortaleza';

function greetingKey(date: Date): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: false,
      timeZone: TIMEZONE,
    }).format(date),
  );
  if (hour < 12) {
    return 'greetingMorning';
  }
  if (hour < 18) {
    return 'greetingAfternoon';
  }
  return 'greetingEvening';
}

export function Topbar() {
  const t = useTranslations('common');
  const clearLeft = useSidebarClearLeft();
  const { user } = useAuth();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const firstName =
    (user?.name || user?.email?.split('@')[0] || t('greetingFallback')).split(' ')[0];
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: TIMEZONE,
  }).format(now);

  return (
    <header className="relative z-10 h-14 shrink-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 backdrop-blur-xl backdrop-saturate-150"
        style={{ background: 'rgba(255,255,255,0.92)' }}
      />
      <div
        className="relative flex h-full items-center justify-between gap-4 pr-6 max-md:!pl-4 lg:pr-8"
        style={{ paddingLeft: clearLeft }}
      >
        <div className="flex min-w-0 items-center gap-2.5 truncate">
          <BrandLogo size="header" />
          <span className="truncate text-sm text-[var(--raizes-text-secondary)]">
            {t(greetingKey(now))},{' '}
            <span className="font-semibold text-[var(--raizes-text-primary)]">{firstName}</span>
            .{' '}
            <span aria-hidden>👋</span>
          </span>
          <span aria-hidden className="select-none text-[var(--raizes-text-secondary)]/40">
            |
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-sm text-[var(--raizes-text-secondary)] tabular-nums"
            aria-label={t('clockLabel')}
            title={t('clockLabel')}
          >
            <span aria-hidden className="text-sm leading-none">
              🇧🇷
            </span>
            <span suppressHydrationWarning>{time}</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitch />
          <span
            aria-hidden
            className="mx-1 h-5 w-px"
            style={{ background: 'var(--raizes-border)' }}
          />
          <TopbarUserMenu />
        </div>
      </div>
    </header>
  );
}
