'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { promotionsResource } from '@/services/promotions';

export default function PromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('promotions');
  const { data, isLoading } = promotionsResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard title={t('detail')}>
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">Name</dt><dd>{data.name}</dd></div>
        <div><dt className="t-eyebrow">{t('rule')}</dt><dd>{data.rule}</dd></div>
        <div><dt className="t-eyebrow">Status</dt><dd><StatusBadge status={data.status} /></dd></div>
      </dl>
    </SectionCard>
  );
}
