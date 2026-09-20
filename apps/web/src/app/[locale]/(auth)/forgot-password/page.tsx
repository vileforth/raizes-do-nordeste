'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@heroui/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/login.schema';
import { useToast } from '@/providers/toast-provider';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const form = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await apiPost('/auth/forgot-password', values);
      toast.success(tCommon('success'));
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{t('forgotTitle')}</h1>
      <p className="t-subtitle">{t('forgotHint')}</p>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block text-sm font-medium">
          {t('email')}
          <Input className="mt-1" type="email" placeholder={t('email')} {...form.register('email')} />
        </label>
        <Button color="primary" type="submit" className="w-full">{t('sendLink')}</Button>
      </form>
      <p className="text-sm text-center">
        <Link href="/login" className="text-[var(--raizes-brand)]">{t('login')}</Link>
      </p>
    </div>
  );
}
