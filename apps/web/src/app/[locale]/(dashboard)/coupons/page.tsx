'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { couponsResource } from '@/services/coupons';

export default function CouponsPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('coupons')}
      useList={couponsResource.useList}
      useRemove={couponsResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      columns={[
        { key: 'code', header: 'Code', cell: (r) => r.code, sortable: true },
        { key: 'active', header: tCommon('status'), cell: (r) => <StatusBadge status={r.active ? 'ATIVO' : 'INATIVO'} /> },
      ]}
    />
  );
}
