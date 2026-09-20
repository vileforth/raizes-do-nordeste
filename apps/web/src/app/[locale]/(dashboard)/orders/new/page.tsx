'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { orderSchema, type OrderFormValues } from '@/schemas/order.schema';
import { useToast } from '@/providers/toast-provider';
import { ordersResource } from '@/services/orders';

export default function NewOrderPage() {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const router = useRouter();
  const create = ordersResource.useCreate();
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientId: 1,
      unitId: 1,
      consumptionType: 'RETIRADA_NO_BALCAO',
      items: [{ productId: 1, quantity: 1 }],
    },
  });

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
        <Input label={t('client')} type="number" {...form.register('clientId')} />
        <Input label={t('unit')} type="number" {...form.register('unitId')} />
        <Button color="primary" type="submit" isLoading={create.isPending}>{tCommon('create')}</Button>
      </form>
    </FormPageScaffold>
  );
}
