'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { productsResource } from '@/services/products';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('products');
  const { data, isLoading } = productsResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard title={t('detail')}>
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">{t('name')}</dt><dd>{data.name}</dd></div>
        <div><dt className="t-eyebrow">{t('description')}</dt><dd>{data.description}</dd></div>
        <div><dt className="t-eyebrow">{t('price')}</dt><dd>{data.price}</dd></div>
        <div><dt className="t-eyebrow">Status</dt><dd><StatusBadge status={data.active ? 'ATIVO' : 'INATIVO'} /></dd></div>
      </dl>
    </SectionCard>
  );
}
