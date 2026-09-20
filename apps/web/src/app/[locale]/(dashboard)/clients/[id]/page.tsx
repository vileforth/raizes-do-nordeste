'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SectionCard } from '@/components/section-card';
import { clientsResource } from '@/services/clients';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('clients');
  const { data, isLoading } = clientsResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard title={t('detail')}>
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">ID</dt><dd>{data.id}</dd></div>
        <div><dt className="t-eyebrow">{t('cpf')}</dt><dd>{data.cpf}</dd></div>
        <div><dt className="t-eyebrow">{t('registeredAt')}</dt><dd>{new Date(data.registeredAt).toLocaleString()}</dd></div>
      </dl>
    </SectionCard>
  );
}
