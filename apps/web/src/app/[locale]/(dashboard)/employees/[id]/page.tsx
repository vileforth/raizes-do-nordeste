'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ResourceDeleteButton } from '@/components/resource-delete-button';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { employeesResource } from '@/services/employees';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('employees');
  const { data, isLoading } = employeesResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <div className="space-y-4">
      <SectionCard
        title={t('detail')}
        actions={<ResourceDeleteButton id={id} href="/employees" useRemove={employeesResource.useRemove} />}
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="t-eyebrow">{t('name')}</dt><dd>{data.name}</dd></div>
          <div><dt className="t-eyebrow">{t('email')}</dt><dd>{data.email}</dd></div>
          <div><dt className="t-eyebrow">{t('phone')}</dt><dd>{data.phone}</dd></div>
          <div>
            <dt className="t-eyebrow">{t('userStatus')}</dt>
            <dd><StatusBadge status={data.userStatus} /></dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('registeredAt')}</dt>
            <dd>{new Date(data.registeredAt).toLocaleString()}</dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title={t('assignment')}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="t-eyebrow">{t('registration')}</dt><dd>{data.registrationNumber}</dd></div>
          <div>
            <dt className="t-eyebrow">{t('role')}</dt>
            <dd><StatusBadge status={data.role} /></dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('unit')}</dt>
            <dd>
              <Link href={`/units/${data.unitId}`} className="underline">
                {data.unitName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('active')}</dt>
            <dd><StatusBadge status={data.active ? 'ATIVO' : 'INATIVO'} /></dd>
          </div>
        </dl>
      </SectionCard>
    </div>
  );
}
