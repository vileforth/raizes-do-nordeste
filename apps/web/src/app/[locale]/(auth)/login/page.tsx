'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@heroui/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { loginSchema, type LoginFormValues } from '@/schemas/login.schema';
import { useToast } from '@/providers/toast-provider';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const search = useSearchParams();
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
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
      toast.success(tCommon('success'));
      router.push(search.get('redirect') || '/');
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{t('loginTitle')}</h1>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block text-sm font-medium">
          {t('email')}
          <Input className="mt-1" type="email" placeholder={t('email')} {...form.register('email')} />
        </label>
        <label className="block text-sm font-medium">
          {t('password')}
          <Input className="mt-1" type="password" placeholder={t('password')} {...form.register('password')} />
        </label>
        <Button color="primary" type="submit" className="w-full">{t('login')}</Button>
      </form>
      <p className="text-sm text-center">
        <Link href="/forgot-password" className="text-[var(--raizes-brand)]">{t('forgotPassword')}</Link>
      </p>
      <p className="text-sm text-center">
        {t('noAccount')} <Link href="/register" className="text-[var(--raizes-brand)]">{t('register')}</Link>
      </p>
    </div>
  );
}
