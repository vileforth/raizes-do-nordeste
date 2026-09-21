'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { promotionsResource } from '@/services/promotions';

export default function PromotionsPage() {
  const t = useTranslations('promotions');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('title')}
      useList={promotionsResource.useList}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/promotions/${r.id}`}
      actions={<Link href="/promotions/new" className="btn-primary">{t('new')}</Link>}
      columns={[
        { key: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
        { key: 'status', header: tCommon('status'), cell: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
