'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { useToast } from '@/providers/toast-provider';
import { orderSchema, type OrderFormValues } from '@/schemas/order.schema';
import { ordersResource } from '@/services/orders';
import { productsResource } from '@/services/products';
import { unitsResource } from '@/services/units';

export default function NewOrderPage() {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = ordersResource.useCreate();
  const products = productsResource.useList({ page: 1, pageSize: 100 });
  const units = unitsResource.useList({ page: 1, pageSize: 100 });
  const productRows = products.data?.data ?? [];
  const unitRows = units.data?.data ?? [];
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientId: 1,
      unitId: 1,
      consumptionType: 'RETIRADA_NO_BALCAO',
      items: [{ productId: 1, quantity: 1 }],
    },
  });
  const items = useFieldArray({ control: form.control, name: 'items' });

  async function onSubmit(values: OrderFormValues) {
    try {
      const order = await create.mutateAsync(values);
      toast.success(tCommon('success'));
      router.push(`/orders/${order.id}`);
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <FormPageScaffold title={t('new')}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label={t('client')}>
          <input className="input-soft w-full" type="number" {...form.register('clientId')} />
        </FormField>
        <FormField label={t('unit')}>
          <select className="input-soft w-full" {...form.register('unitId', { valueAsNumber: true })}>
            {unitRows.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t('type')}>
          <select className="input-soft w-full" {...form.register('consumptionType')}>
            <option value="RETIRADA_NO_BALCAO">{t('pickup')}</option>
            <option value="CONSUMO_NO_LOCAL">{t('dineIn')}</option>
          </select>
        </FormField>
        <div className="space-y-3">
          <p className="text-sm font-medium">{t('items')}</p>
          {items.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
              <select className="input-soft w-full" {...form.register(`items.${index}.productId`, { valueAsNumber: true })}>
                {productRows.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                className="input-soft w-full"
                type="number"
                min={1}
                {...form.register(`items.${index}.quantity`)}
              />
              {items.fields.length > 1 ? (
                <button type="button" className="btn-primary" onClick={() => items.remove(index)}>
                  {tCommon('delete')}
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            className="btn-primary"
            onClick={() => items.append({ productId: productRows[0]?.id ?? 1, quantity: 1 })}
          >
            {t('addItem')}
          </button>
        </div>
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {tCommon('create')}
        </button>
      </form>
    </FormPageScaffold>
  );
}
