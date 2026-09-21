'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ResourceDeleteButton } from '@/components/resource-delete-button';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { formatCpf } from '@/lib/helpers/cpf';
import { formatMoney } from '@/lib/helpers/money';
import { clientsResource } from '@/services/clients';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('clients');
  const { data, isLoading } = clientsResource.useDetail(id);
  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <div className="space-y-4">
      <SectionCard
        title={t('detail')}
        actions={<ResourceDeleteButton id={id} href="/clients" useRemove={clientsResource.useRemove} />}
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="t-eyebrow">{t('name')}</dt><dd>{data.name}</dd></div>
          <div><dt className="t-eyebrow">{t('email')}</dt><dd>{data.email}</dd></div>
          <div><dt className="t-eyebrow">{t('phone')}</dt><dd>{data.phone}</dd></div>
          <div><dt className="t-eyebrow">{t('cpf')}</dt><dd>{formatCpf(data.cpf)}</dd></div>
          <div>
            <dt className="t-eyebrow">{t('userStatus')}</dt>
            <dd><StatusBadge status={data.userStatus} /></dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('active')}</dt>
            <dd><StatusBadge status={data.active ? 'ATIVO' : 'INATIVO'} /></dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('registeredAt')}</dt>
            <dd>{new Date(data.registeredAt).toLocaleString()}</dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title={t('activity')}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="t-eyebrow">{t('ordersCount')}</dt><dd>{data.ordersCount}</dd></div>
          <div><dt className="t-eyebrow">{t('ticketsCount')}</dt><dd>{data.ticketsCount}</dd></div>
          <div>
            <dt className="t-eyebrow">{t('loyalty')}</dt>
            <dd>{data.loyaltyLevel ? <StatusBadge status={data.loyaltyLevel} /> : '—'}</dd>
          </div>
          <div><dt className="t-eyebrow">{t('points')}</dt><dd>{data.pointsBalance ?? 0}</dd></div>
          <div className="sm:col-span-2">
            <dt className="t-eyebrow">{t('lastOrder')}</dt>
            <dd className="flex flex-wrap items-center gap-2">
              {data.lastOrder ? (
                <>
                  <Link href={`/orders/${data.lastOrder.id}`} className="underline">
                    {data.lastOrder.orderCode} · {formatMoney(data.lastOrder.totalValue)}
                  </Link>
                  <StatusBadge status={data.lastOrder.status} />
                </>
              ) : (
                t('noLastOrder')
              )}
            </dd>
          </div>
        </dl>
      </SectionCard>
    </div>
  );
}
