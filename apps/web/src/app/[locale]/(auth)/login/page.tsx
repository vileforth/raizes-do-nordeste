'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { loginSchema, type LoginFormValues } from '@/schemas/login.schema';
import { AuthAlert } from '../_components/auth-alert';
import { AuthField } from '../_components/auth-field';
import { AuthShell } from '../_components/auth-shell';
import { AuthSubmit } from '../_components/auth-submit';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const search = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);
    try {
      const tokens = await apiPost<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', values);
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });
      router.push(search.get('redirect') || '/');
    } catch {
      setErrorMessage(t('errorInvalid'));
    }
  }

  return (
    <AuthShell
      backHref="/"
      backLabel={t('back')}
      title={t('brandTitle')}
      subtitle={t('loginSubtitle')}
      footer={
        <div className="space-y-2">
          <p className="text-xs leading-relaxed text-[var(--raizes-text-secondary)]">
            {t('noAccount')}{' '}
            <Link href="/register" className="font-semibold text-[var(--raizes-petrol)] underline">
              {t('register')}
            </Link>
          </p>
          <p className="text-xs leading-relaxed text-[var(--raizes-text-secondary)]">{t('accessNote')}</p>
        </div>
      }
    >
      {errorMessage ? <AuthAlert tone="error" message={errorMessage} /> : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          label={t('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        <AuthField
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder={t('passwordPlaceholder')}
          autoComplete="current-password"
          error={form.formState.errors.password?.message}
          hasToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((value) => !value)}
          revealLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          {...form.register('password')}
        />
        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 rounded border-[var(--raizes-border-strong)] accent-[var(--raizes-brand)]"
            />
            <span className="text-sm text-[var(--raizes-text-secondary)]">{t('remember')}</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[var(--raizes-petrol)]/80 underline transition-colors hover:text-[var(--raizes-petrol)]"
          >
            {t('forgotPassword')}
          </Link>
        </div>
        <AuthSubmit loading={form.formState.isSubmitting} loadingLabel={t('submitting')}>
          {t('login')}
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}
