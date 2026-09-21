'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { usersResource } from '@/services/users';

export default function UsersPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('users')}
      useList={usersResource.useList}
      useRemove={usersResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/users/${r.id}`}
      columns={[
        { key: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
        { key: 'email', header: 'Email', cell: (r) => r.email },
        { key: 'status', header: tCommon('status'), cell: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
