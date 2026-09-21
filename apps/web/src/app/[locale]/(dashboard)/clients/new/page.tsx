'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { useToast } from '@/providers/toast-provider';
import { clientSchema, type ClientFormValues } from '@/schemas/client.schema';
import { clientsResource } from '@/services/clients';

export default function NewClientPage() {
  const t = useTranslations('clients');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = clientsResource.useCreate();
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { userId: 1, cpf: '', active: true },
  });

  async function onSubmit(values: ClientFormValues) {
    try {
      const client = await create.mutateAsync(values);
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
