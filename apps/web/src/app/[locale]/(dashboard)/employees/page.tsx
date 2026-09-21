'use client';

import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { employeesResource } from '@/services/employees';

export default function EmployeesPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = employeesResource.useList();
  return (
    <EntityListPage
      title={t('employees')}
      rows={data}
      isLoading={isLoading}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      columns={[
        { key: 'registration', header: 'Registration', cell: (r) => r.registrationNumber },
        { key: 'role', header: 'Role', cell: (r) => r.role },
        { key: 'unit', header: 'Unit', cell: (r) => r.unitId },
      ]}
    />
  );
}
