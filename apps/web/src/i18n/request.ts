import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './config';

const namespaces = [
  'common',
  'auth',
  'nav',
  'orders',
  'clients',
  'products',
  'promotions',
  'loyalty',
  'support',
  'units',
  'reports',
  'dashboard',
  'status',
] as const;

async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`../messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }
  return {
    locale,
    timeZone: 'America/Sao_Paulo',
    messages: await loadMessages(locale as Locale),
  };
});
