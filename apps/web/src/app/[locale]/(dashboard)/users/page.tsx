'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { usersResource } from '@/services/users';

export default function UsersPage() {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('title')}
      useList={usersResource.useList}
      useRemove={usersResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(row) => row.id}
      detailPath={(row) => `/users/${row.id}`}
      actions={
        <Link href="/users/new" className="btn-primary">
          {t('new')}
        </Link>
      }
      columns={[
        { key: 'name', header: t('name'), cell: (row) => row.name, sortable: true },
        { key: 'email', header: t('email'), cell: (row) => row.email, sortable: true },
        {
          key: 'roles',
          header: t('roles'),
          cell: (row) => (
            <div className="flex flex-wrap gap-1.5">
              {row.profiles.map((profile) => (
                <StatusBadge key={profile} status={profile} />
              ))}
            </div>
          ),
        },
        {
          key: 'status',
          header: tCommon('status'),
          cell: (row) => <StatusBadge status={row.status} />,
        },
      ]}
    />
  );
}
