'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { employeesResource } from '@/services/employees';

export default function EmployeesPage() {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('title')}
      useList={employeesResource.useList}
      useRemove={employeesResource.useRemove}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/employees/${r.id}`}
      columns={[
        { key: 'name', header: t('name'), cell: (r) => r.name, sortable: true },
        { key: 'email', header: t('email'), cell: (r) => r.email, sortable: true },
        { key: 'phone', header: t('phone'), cell: (r) => r.phone },
        {
          key: 'registrationNumber',
          header: t('registration'),
          cell: (r) => r.registrationNumber,
          sortable: true,
        },
        {
          key: 'role',
          header: t('role'),
          cell: (r) => <StatusBadge status={r.role} />,
          sortable: true,
        },
        { key: 'unit', header: t('unit'), cell: (r) => r.unitName },
        {
          key: 'active',
          header: tCommon('status'),
          cell: (r) => (
            <StatusBadge status={r.active ? 'ATIVO' : 'INATIVO'} />
          ),
        },
      ]}
    />
  );
}
