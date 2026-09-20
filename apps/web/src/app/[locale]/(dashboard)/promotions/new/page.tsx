'use client';

import { Button, Input, Textarea } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Input label={t('rule')} value={form.rule} onChange={(e) => setForm({ ...form, rule: e.target.value })} />
        <Button color="primary" type="submit" isLoading={create.isPending}>{tCommon('create')}</Button>
      </form>
    </FormPageScaffold>
  );
}
