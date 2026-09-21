'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ResourceDeleteButton } from '@/components/resource-delete-button';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { supportResource } from '@/services/support';

export default function SupportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('support');
  const { data, isLoading } = supportResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard
      title={t('detail')}
      actions={<ResourceDeleteButton id={id} href="/support" useRemove={supportResource.useRemove} />}
    >
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">{t('protocol')}</dt><dd>{data.protocol}</dd></div>
        <div><dt className="t-eyebrow">{t('type')}</dt><dd><StatusBadge status={data.type} /></dd></div>
        <div><dt className="t-eyebrow">Status</dt><dd><StatusBadge status={data.status} /></dd></div>
        <div><dt className="t-eyebrow">Description</dt><dd>{data.description}</dd></div>
      </dl>
    </SectionCard>
  );
}
