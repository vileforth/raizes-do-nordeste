'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ResourceDeleteButton } from '@/components/resource-delete-button';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/providers/toast-provider';
import { geocodeAddress, unitsResource } from '@/services/units';

export default function UnitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('units');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const { data, isLoading, refetch } = unitsResource.useDetail(id);
  const update = unitsResource.useUpdate();
  const [address, setAddress] = useState('');

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;

  async function saveAddress() {
    try {
      const coords = await geocodeAddress(address || data!.address);
      await update.mutateAsync({
        id: id!,
        input: {
          address: address || data!.address,
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
      toast.success(tCommon('success'));
      refetch();
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <SectionCard
      title={t('detail')}
      actions={<ResourceDeleteButton id={id} href="/units" useRemove={unitsResource.useRemove} />}
    >
      <dl className="mb-4 grid gap-3 text-sm">
        <div><dt className="t-eyebrow">Name</dt><dd>{data.name}</dd></div>
        <div><dt className="t-eyebrow">Status</dt><dd><StatusBadge status={data.status} /></dd></div>
        <div><dt className="t-eyebrow">{t('address')}</dt><dd>{data.address}</dd></div>
        <div><dt className="t-eyebrow">Coords</dt><dd>{data.latitude}, {data.longitude}</dd></div>
      </dl>
      <div className="flex gap-2">
        <input
          className="input-soft w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={data.address}
        />
        <button type="button" className="btn-primary" onClick={saveAddress} disabled={update.isPending}>
          {t('geocode')}
        </button>
      </div>
    </SectionCard>
  );
}
