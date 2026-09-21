'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { supportResource } from '@/services/support';

export default function SupportPage() {
  const t = useTranslations('support');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = supportResource.useList();
  return (
    <EntityListPage
      title={t('title')}
      rows={data}
      isLoading={isLoading}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/support/${r.id}`}
      actions={<Link href="/support/new" className="btn-primary">{t('open')}</Link>}
      columns={[
        { key: 'protocol', header: t('protocol'), cell: (r) => r.protocol },
        { key: 'type', header: t('type'), cell: (r) => r.type },
        { key: 'status', header: 'Status', cell: (r) => r.status },
      ]}
    />
  );
}
