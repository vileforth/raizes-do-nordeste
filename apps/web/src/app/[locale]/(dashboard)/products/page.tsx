'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { formatMoney } from '@/lib/helpers/money';
import { productsResource } from '@/services/products';

export default function ProductsPage() {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = productsResource.useList();
  return (
    <EntityListPage
      title={t('title')}
      rows={data}
      isLoading={isLoading}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/products/${r.id}`}
      actions={<Link href="/products/new" className="btn-primary">{t('new')}</Link>}
      columns={[
        { key: 'name', header: t('name'), cell: (r) => r.name, sortable: true },
        { key: 'category', header: t('category'), cell: (r) => r.category },
        { key: 'price', header: t('price'), cell: (r) => formatMoney(r.price) },
      ]}
    />
  );
}
