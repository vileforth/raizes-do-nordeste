'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { useToast } from '@/providers/toast-provider';
import { clientSchema, type ClientFormValues } from '@/schemas/client.schema';
import { clientsResource } from '@/services/clients';
import { unitsResource } from '@/services/units';

export default function NewClientPage() {
  const t = useTranslations('clients');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = clientsResource.useCreate();
  const units = unitsResource.useList({ pageSize: 100 });
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      userId: 1,
      cpf: '',
      birthDate: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      active: true,
    },
  });

  async function onSubmit(values: ClientFormValues) {
    try {
      const client = await create.mutateAsync({
        ...values,
        birthDate: values.birthDate || undefined,
        zipCode: values.zipCode.replace(/\D/g, ''),
      });
      toast.success(tCommon('success'));
      router.push(`/clients/${client.id}`);
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <FormPageScaffold title={t('new')}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label={t('userId')}>
          <input className="input-soft w-full" type="number" {...form.register('userId')} />
        </FormField>
        <FormField label={t('cpf')}>
          <input className="input-soft w-full" placeholder="00000000000" {...form.register('cpf')} />
        </FormField>
        <FormField label={t('birthDate')}>
          <input className="input-soft w-full" type="date" {...form.register('birthDate')} />
        </FormField>
        <FormField label={t('street')}>
          <input className="input-soft w-full" {...form.register('address')} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label={t('city')}>
            <input className="input-soft w-full" {...form.register('city')} />
          </FormField>
          <FormField label={t('state')}>
            <input className="input-soft w-full" maxLength={2} {...form.register('state')} />
          </FormField>
          <FormField label={t('zipCode')}>
            <input className="input-soft w-full" placeholder="00000-000" {...form.register('zipCode')} />
          </FormField>
        </div>
        <FormField label={t('preferredUnit')}>
          <select className="input-soft w-full" {...form.register('preferredUnitId')}>
            <option value="">{t('noPreferredUnit')}</option>
            {(units.data?.data ?? []).map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </FormField>
        <p className="text-xs leading-relaxed text-[var(--raizes-text-secondary)]">
          {t('privacyNotice')}{' '}
          <Link href="/privacidade" className="font-semibold text-[var(--raizes-petrol)] underline">
            {t('privacyLink')}
          </Link>
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register('active')} />
          {t('active')}
        </label>
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {tCommon('create')}
        </button>
      </form>
    </FormPageScaffold>
  );
}
