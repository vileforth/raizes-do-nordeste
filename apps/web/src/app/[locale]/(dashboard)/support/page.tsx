'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { supportResource } from '@/services/support';

export default function SupportPage() {
  const t = useTranslations('support');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('title')}
      useList={supportResource.useList}
      useRemove={supportResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/support/${r.id}`}
      actions={<Link href="/support/new" className="btn-primary">{t('open')}</Link>}
      columns={[
        { key: 'protocol', header: t('protocol'), cell: (r) => r.protocol },
        { key: 'type', header: t('type'), cell: (r) => <StatusBadge status={r.type} /> },
        { key: 'status', header: tCommon('status'), cell: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
