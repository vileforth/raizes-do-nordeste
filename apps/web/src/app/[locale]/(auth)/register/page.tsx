'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  async function onSubmit(values: RegisterFormValues) {
    setErrorMessage(null);
    try {
      await apiPost<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', values);
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
        <AuthSubmit loading={form.formState.isSubmitting} loadingLabel={t('submitting')}>
          {t('register')}
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}
