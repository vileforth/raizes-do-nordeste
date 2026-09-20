'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { registerSchema, type RegisterFormValues } from '@/schemas/login.schema';
import { useToast } from '@/providers/toast-provider';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    try {
      const tokens = await apiPost<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', values);
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });
      toast.success(tCommon('success'));
      router.push('/');
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{t('registerTitle')}</h1>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Input label={t('name')} {...form.register('name')} />
        <Input label={t('email')} type="email" {...form.register('email')} />
        <Input label={t('phone')} {...form.register('phone')} />
        <Input label={t('password')} type="password" {...form.register('password')} />
        <Button color="primary" type="submit" className="w-full">{t('register')}</Button>
      </form>
      <p className="text-sm text-center">
        {t('hasAccount')} <Link href="/login" className="text-[var(--raizes-brand)]">{t('login')}</Link>
      </p>
    </div>
  );
}
