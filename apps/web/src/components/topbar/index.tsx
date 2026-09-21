'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
import { useAuth } from '@/providers/auth-provider';
import { locales, type Locale } from '@/i18n/config';

export function Topbar() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { user, signOut } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    const stripped = pathname.replace(/^\/(pt-BR|en)/, '') || '/';
    router.push(next === 'pt-BR' ? stripped : `/${next}${stripped}`);
  }

  return (
    <header className="flex h-14 items-center justify-between px-4 md:pl-60">
      <p className="text-sm font-medium text-[var(--raizes-text-primary)]">
        {user ? t('greeting', { name: user.name }) : ''}
      </p>
      <div className="flex items-center gap-2">
        <select
          className="input-soft !h-9 !w-auto"
          value={locale}
          onChange={(e) => switchLocale(e.target.value as Locale)}
          aria-label={tNav('language')}
        >
          {locales.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <Button size="sm" variant="flat" onPress={signOut}>
          {tNav('logout')}
        </Button>
      </div>
    </header>
  );
}
