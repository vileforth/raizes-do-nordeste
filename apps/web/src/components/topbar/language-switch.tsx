'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';

export function LanguageSwitch() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    const stripped = pathname.replace(/^\/(pt-BR|en)/, '') || '/';
    router.push(next === 'pt-BR' ? stripped : `/${next}${stripped}`);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border p-0.5 text-[11px]"
      style={{
        background: 'var(--raizes-bg)',
        borderColor: 'var(--raizes-border)',
      }}
    >
      {locales.map((item) => {
        const active = locale === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => switchLocale(item)}
            className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 transition-all"
            style={{
              background: active ? 'var(--raizes-text-primary)' : 'transparent',
              color: active ? '#ffffff' : 'var(--raizes-text-secondary)',
              fontWeight: active ? 600 : 500,
            }}
            aria-label={t('language')}
          >
            {item === 'pt-BR' ? 'PT' : 'EN'}
          </button>
        );
      })}
    </div>
  );
}
