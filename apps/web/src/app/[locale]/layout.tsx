import { Manrope, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { Providers } from '@/providers/providers';

const sans = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

const display = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['900'],
  style: ['italic'],
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--raizes-bg)] text-[var(--raizes-text-primary)]">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
