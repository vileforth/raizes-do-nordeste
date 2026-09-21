'use client';

import { Button, Input, Textarea } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { useToast } from '@/providers/toast-provider';
import { productsResource } from '@/services/products';

export default function NewProductPage() {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = productsResource.useCreate();
  const [form, setForm] = useState({ name: '', description: '', price: 0, category: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const product = await create.mutateAsync({ ...form, active: true });
      toast.success(tCommon('success'));
      router.push(`/products/${product.id}`);
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <FormPageScaffold title={t('new')}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input label={t('name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Textarea label={t('description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Input label={t('price')} type="number" value={String(form.price)} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <Input label={t('category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Button color="primary" type="submit" isLoading={create.isPending}>{tCommon('create')}</Button>
      </form>
    </FormPageScaffold>
  );
}
