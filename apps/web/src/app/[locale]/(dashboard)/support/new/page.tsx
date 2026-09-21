'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { useToast } from '@/providers/toast-provider';
import { supportSchema, type SupportFormValues } from '@/schemas/support.schema';
import { supportResource } from '@/services/support';

const TYPES = ['PEDIDO', 'SUPORTE', 'PAGAMENTO', 'FIDELIDADE'] as const;

export default function NewSupportPage() {
  const t = useTranslations('support');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = supportResource.useCreate();
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: { type: 'SUPORTE', description: '' },
  });

  async function onSubmit(values: SupportFormValues) {
    try {
      const ticket = await create.mutateAsync(values);
      toast.success(tCommon('success'));
      router.push(`/support/${ticket.id}`);
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <FormPageScaffold title={t('open')}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label={t('type')}>
          <select className="input-soft w-full" {...form.register('type')}>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`types.${type}`)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t('description')}>
          <textarea className="input-soft min-h-28 w-full" {...form.register('description')} />
        </FormField>
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {tCommon('create')}
        </button>
      </form>
    </FormPageScaffold>
  );
}
