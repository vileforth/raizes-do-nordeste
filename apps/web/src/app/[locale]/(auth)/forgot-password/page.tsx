'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/login.schema';
import { AuthAlert } from '../_components/auth-alert';
import { AuthField } from '../_components/auth-field';
import { AuthShell } from '../_components/auth-shell';
import { AuthSubmit } from '../_components/auth-submit';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setErrorMessage(null);
    setNotice(null);
    try {
      await apiPost('/auth/forgot-password', values);
    } catch {
      setErrorMessage(null);
    }
    setNotice(t('forgotSent'));
  }

  return (
    <AuthShell
      backHref="/login"
      backLabel={t('backToLogin')}
      title={t('forgotTitle')}
      subtitle={t('forgotHint')}
      footer={
        <p className="text-xs leading-relaxed text-[var(--raizes-text-secondary)]">
          <Link href="/login" className="font-semibold text-[var(--raizes-petrol)] underline">
            {t('login')}
          </Link>
        </p>
      }
    >
      {errorMessage ? <AuthAlert tone="error" message={errorMessage} /> : null}
      {notice && !errorMessage ? <AuthAlert tone="notice" message={notice} /> : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          label={t('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        <AuthSubmit loading={form.formState.isSubmitting} loadingLabel={t('forgotSending')}>
          {t('sendLink')}
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}
