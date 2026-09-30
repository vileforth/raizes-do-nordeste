'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { registerSchema, type RegisterFormValues } from '@/schemas/login.schema';
import { AuthAlert } from '../_components/auth-alert';
import { AuthField } from '../_components/auth-field';
import { AuthShell } from '../_components/auth-shell';
import { AuthSubmit } from '../_components/auth-submit';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      privacyConsent: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setErrorMessage(null);
    try {
      await apiPost<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/');
      router.refresh();
    } catch {
      setErrorMessage(t('errorGeneric'));
    }
  }

  return (
    <AuthShell
      backHref="/login"
      backLabel={t('backToLogin')}
      title={t('registerTitle')}
      subtitle={t('registerSubtitle')}
      footer={
        <p className="text-xs leading-relaxed text-[var(--raizes-text-secondary)]">
          {t('hasAccount')}{' '}
          <Link href="/login" className="font-semibold text-[var(--raizes-petrol)] underline">
            {t('login')}
          </Link>
        </p>
      }
    >
      {errorMessage ? <AuthAlert tone="error" message={errorMessage} /> : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          label={t('name')}
          placeholder={t('namePlaceholder')}
          autoComplete="name"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        <AuthField
          label={t('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        <AuthField
          label={t('phone')}
          placeholder={t('phonePlaceholder')}
          autoComplete="tel"
          error={form.formState.errors.phone?.message}
          {...form.register('phone')}
        />
        <AuthField
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder={t('passwordPlaceholder')}
          autoComplete="new-password"
          error={form.formState.errors.password?.message}
          hasToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((value) => !value)}
          revealLabel={t('showPassword')}
          hideLabel={t('hidePassword')}
          {...form.register('password')}
        />
        <label className="flex items-start gap-2 text-sm text-[var(--raizes-text-primary)]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--raizes-border-strong)] accent-[var(--raizes-petrol)]"
            {...form.register('privacyConsent')}
          />
          <span>
            {t('privacyConsent')}{' '}
            <Link href="/privacidade" className="font-semibold text-[var(--raizes-petrol)] underline">
              {t('privacyLink')}
            </Link>
          </span>
        </label>
        {form.formState.errors.privacyConsent ? (
          <p className="text-xs text-[var(--raizes-rose-text)]">{t('privacyRequired')}</p>
        ) : null}
        <AuthSubmit loading={form.formState.isSubmitting} loadingLabel={t('submitting')}>
          {t('register')}
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}
