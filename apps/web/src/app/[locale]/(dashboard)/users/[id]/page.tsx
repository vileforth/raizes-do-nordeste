'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { usersResource } from '@/services/users';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('nav');
  const { data, isLoading } = usersResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard title={t('users')}>
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">Name</dt><dd>{data.name}</dd></div>
        <div><dt className="t-eyebrow">Email</dt><dd>{data.email}</dd></div>
        <div><dt className="t-eyebrow">Status</dt><dd><StatusBadge status={data.status} /></dd></div>
        <div>
          <dt className="t-eyebrow">Profiles</dt>
          <dd className="flex flex-wrap gap-1.5">
            {data.profiles.map((profile) => (
              <StatusBadge key={profile} status={profile} />
            ))}
          </dd>
        </div>
      </dl>
    </SectionCard>
  );
}
