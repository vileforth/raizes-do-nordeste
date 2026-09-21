'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { employeesResource } from '@/services/employees';

export default function EmployeesPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  return (
    <EntityListPage
      title={t('employees')}
      useList={employeesResource.useList}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      columns={[
        { key: 'registration', header: 'Registration', cell: (r) => r.registrationNumber },
        { key: 'role', header: 'Role', cell: (r) => <StatusBadge status={r.role} /> },
        { key: 'unit', header: 'Unit', cell: (r) => r.unitId },
        { key: 'active', header: tCommon('status'), cell: (r) => <StatusBadge status={r.active ? 'ATIVO' : 'INATIVO'} /> },
      ]}
    />
  );
}
