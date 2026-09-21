'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormField } from '@/components/form-field';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { useToast } from '@/providers/toast-provider';
import { promotionsResource } from '@/services/promotions';

export default function NewPromotionPage() {
  const t = useTranslations('promotions');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = promotionsResource.useCreate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    rule: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: 'ATIVA',
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const item = await create.mutateAsync(form);
      toast.success(tCommon('success'));
      router.push(`/promotions/${item.id}`);
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <FormPageScaffold title={t('new')}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField label="Name">
          <input
            className="input-soft w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            className="input-soft min-h-28 w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </FormField>
        <FormField label={t('rule')}>
          <input
            className="input-soft w-full"
            value={form.rule}
            onChange={(e) => setForm({ ...form, rule: e.target.value })}
          />
        </FormField>
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {tCommon('create')}
        </button>
      </form>
    </FormPageScaffold>
  );
}
