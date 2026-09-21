'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { clientsResource } from '@/services/clients';

export default function ClientsPage() {
  const t = useTranslations('clients');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('title')}
      useList={clientsResource.useList}
      useRemove={clientsResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/clients/${r.id}`}
      actions={<Link href="/clients/new" className="btn-primary">{t('new')}</Link>}
      columns={[
        { key: 'id', header: 'ID', cell: (r) => r.id, sortable: true },
        { key: 'cpf', header: t('cpf'), cell: (r) => r.cpf },
        {
          key: 'active',
          header: t('active'),
          cell: (r) => (
            <StatusBadge status={r.active ? 'ATIVO' : 'INATIVO'} />
          ),
        },
      ]}
    />
  );
}
