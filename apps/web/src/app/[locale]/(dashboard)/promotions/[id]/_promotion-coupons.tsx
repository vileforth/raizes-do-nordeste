'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@raizes/shared';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DataTable } from '@/components/data-table';
import { DeleteAction } from '@/components/delete-action';
import { FormField } from '@/components/form-field';
import { Pagination } from '@/components/pagination';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { useTableState } from '@/hooks/use-table-state';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import { couponSchema, type CouponFormValues } from '@/schemas/coupon.schema';
import { couponsResource, type Coupon } from '@/services/coupons';

type Props = {
  promotionId: number;
  defaultExpiry: string;
};

function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PromotionCoupons({ promotionId, defaultExpiry }: Props) {
  const t = useTranslations('promotions');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const toast = useToast();
  const { user } = useAuth();
  const canManage = user?.roles.includes(UserRole.ADMINISTRADOR) ?? false;
  const table = useTableState({ defaultPageSize: 10 });
  const listParams = useMemo(
    () => ({ ...table.params, promotionId }),
    [table.params, promotionId],
  );
  const coupons = couponsResource.useList(listParams, { enabled: canManage });
  const create = couponsResource.useCreate();
  const remove = couponsResource.useRemove();
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      expiry: toDateTimeLocal(defaultExpiry),
      usageLimit: 1,
      active: true,
    },
  });

  if (!canManage) {
    return null;
  }

  async function onSubmit(values: CouponFormValues) {
    try {
      await create.mutateAsync({
        promotionId,
        code: values.code,
        expiry: new Date(values.expiry).toISOString(),
        usageLimit: values.usageLimit,
        active: values.active,
      });
      toast.success(tCommon('success'));
      form.reset({
        code: '',
        expiry: toDateTimeLocal(defaultExpiry),
        usageLimit: 1,
        active: true,
      });
    } catch {
      toast.error(tCommon('error'));
    }
  }

  const dateFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const rows = coupons.data?.data ?? [];
  const pagination = coupons.data?.pagination;

  return (
    <SectionCard title={t('coupons')}>
      <form className="mb-6 grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label={t('couponCode')}>
          <input className="input-soft w-full uppercase" {...form.register('code')} />
        </FormField>
        <FormField label={t('couponExpiry')}>
          <input className="input-soft w-full" type="datetime-local" {...form.register('expiry')} />
        </FormField>
        <FormField label={t('couponUsageLimit')}>
          <input
            className="input-soft w-full"
            type="number"
            min={1}
            {...form.register('usageLimit')}
          />
        </FormField>
        <FormField label={t('couponActive')}>
          <input type="checkbox" className="size-4" {...form.register('active')} />
        </FormField>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={create.isPending}>
            {t('newCoupon')}
          </button>
        </div>
      </form>
      <input
        className="input-soft mb-3 !w-48"
        placeholder={tCommon('search')}
        value={table.search}
        onChange={(event) => table.setSearch(event.target.value)}
      />
      <DataTable<Coupon>
        rows={rows}
        rowKey={(row) => row.id}
        isLoading={coupons.isLoading}
        emptyMessage={tCommon('noResults')}
        orderBy={table.orderBy}
        onOrderByChange={table.setOrderBy}
        columns={[
          { key: 'code', header: t('couponCode'), cell: (row) => row.code, sortable: true },
          {
            key: 'expiry',
            header: t('couponExpiry'),
            cell: (row) => dateFormat.format(new Date(row.expiry)),
          },
          {
            key: 'usageLimit',
            header: t('couponUsageLimit'),
            cell: (row) => row.usageLimit,
          },
          {
            key: 'active',
            header: tCommon('status'),
            cell: (row) => <StatusBadge status={row.active ? 'ATIVO' : 'INATIVO'} />,
          },
          {
            key: 'actions',
            header: tCommon('actions'),
            align: 'right',
            cell: (row) => (
              <DeleteAction onRemove={() => remove.mutateAsync(String(row.id))} compact />
            ),
          },
        ]}
      />
      {pagination ? <Pagination {...pagination} onPageChange={table.setPage} /> : null}
    </SectionCard>
  );
}
