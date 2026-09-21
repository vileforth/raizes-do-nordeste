'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { unitsResource } from '@/services/units';

export default function UnitsPage() {
  const t = useTranslations('units');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('title')}
      useList={unitsResource.useList}
      useRemove={unitsResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/units/${r.id}`}
      actions={<Link href="/units/new" className="btn-primary">{tCommon('create')}</Link>}
      columns={[
        { key: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
        { key: 'address', header: t('address'), cell: (r) => r.address },
        { key: 'status', header: tCommon('status'), cell: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
