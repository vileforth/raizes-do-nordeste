'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { formatCpf } from '@/lib/helpers/cpf';
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
        { key: 'name', header: t('name'), cell: (r) => r.name, sortable: true },
        { key: 'email', header: t('email'), cell: (r) => r.email, sortable: true },
        { key: 'phone', header: t('phone'), cell: (r) => r.phone },
        { key: 'cpf', header: t('cpf'), cell: (r) => formatCpf(r.cpf), sortable: true },
        { key: 'ordersCount', header: t('ordersCount'), cell: (r) => r.ordersCount },
        {
          key: 'loyalty',
          header: t('loyalty'),
          cell: (r) => (r.loyaltyLevel ? <StatusBadge status={r.loyaltyLevel} /> : '—'),
        },
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
