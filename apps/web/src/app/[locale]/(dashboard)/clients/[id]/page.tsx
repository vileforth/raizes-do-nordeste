'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ResourceDeleteButton } from '@/components/resource-delete-button';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { clientsResource } from '@/services/clients';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('clients');
  const { data, isLoading } = clientsResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard
      title={t('detail')}
      actions={<ResourceDeleteButton id={id} href="/clients" useRemove={clientsResource.useRemove} />}
    >
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">ID</dt><dd>{data.id}</dd></div>
        <div><dt className="t-eyebrow">{t('cpf')}</dt><dd>{data.cpf}</dd></div>
        <div><dt className="t-eyebrow">{t('active')}</dt><dd><StatusBadge status={data.active ? 'ATIVO' : 'INATIVO'} /></dd></div>
        <div><dt className="t-eyebrow">{t('registeredAt')}</dt><dd>{new Date(data.registeredAt).toLocaleString()}</dd></div>
      </dl>
    </SectionCard>
  );
}
