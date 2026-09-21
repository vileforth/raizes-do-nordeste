'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GlassPanel } from '@/components/glass-panel';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { formatMoney } from '@/lib/helpers/money';
import { ordersResource } from '@/services/orders';

const COLUMN_PAGE_SIZE = 8;

export function OrdersBoardColumn({ status }: { status: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = ordersResource.useList({
    status,
    page,
    pageSize: COLUMN_PAGE_SIZE,
  });
  const items = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <GlassPanel>
      <div className="mb-3 flex items-center justify-between">
        <StatusBadge status={status} />
        <span className="text-xs text-[var(--raizes-text-secondary)]">
          {pagination?.total ?? 0}
        </span>
      </div>
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-black/5" />
            ))
          : items.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="row-hover block rounded-lg border border-[var(--raizes-border)] p-3 text-sm"
              >
                <p className="font-medium">{order.orderCode}</p>
                <p className="text-xs text-[var(--raizes-text-secondary)]">
                  {formatMoney(order.totalValue)}
                </p>
              </Link>
            ))}
      </div>
      {pagination ? <Pagination {...pagination} onPageChange={setPage} /> : null}
    </GlassPanel>
  );
}
