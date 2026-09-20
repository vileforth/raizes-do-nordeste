'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { couponsResource } from '@/services/coupons';

export default function CouponsPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = couponsResource.useList();
  return (
    <EntityListPage
      title={t('coupons')}
      rows={data}
      isLoading={isLoading}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      columns={[
        { key: 'code', header: 'Code', cell: (r) => r.code, sortable: true },
        { key: 'active', header: 'Active', cell: (r) => String(r.active) },
      ]}
    />
  );
}
