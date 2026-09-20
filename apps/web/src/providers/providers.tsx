'use client';

import { HeroUIProvider } from '@heroui/react';
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';
import { ToastProvider } from './toast-provider';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HeroUIProvider>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
}
