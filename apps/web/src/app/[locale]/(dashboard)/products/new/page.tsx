'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormField } from '@/components/form-field';
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
        <FormField label={t('name')}>
          <input
            className="input-soft w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </FormField>
        <FormField label={t('description')}>
          <textarea
            className="input-soft min-h-28 w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </FormField>
        <FormField label={t('price')}>
          <input
            className="input-soft w-full"
            type="number"
            value={String(form.price)}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </FormField>
        <FormField label={t('category')}>
          <input
            className="input-soft w-full"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </FormField>
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {tCommon('create')}
        </button>
      </form>
    </FormPageScaffold>
  );
}
