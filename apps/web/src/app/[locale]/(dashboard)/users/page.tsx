'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { usersResource } from '@/services/users';

export default function UsersPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = usersResource.useList();
  return (
    <EntityListPage
      title={t('users')}
      rows={data}
      isLoading={isLoading}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/users/${r.id}`}
      columns={[
        { key: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
        { key: 'email', header: 'Email', cell: (r) => r.email },
        { key: 'status', header: 'Status', cell: (r) => r.status },
      ]}
    />
  );
}
