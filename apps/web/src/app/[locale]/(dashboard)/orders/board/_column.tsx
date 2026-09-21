'use client';

import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { GlassPanel } from '@/components/glass-panel';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { ordersResource } from '@/services/orders';
import { OrdersBoardCard } from './_card';

const COLUMN_PAGE_SIZE = 8;

type Props = {
  status: string;
  onRemove: (id: string) => Promise<unknown>;
};

export function OrdersBoardColumn({ status, onRemove }: Props) {
  const [page, setPage] = useState(1);
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: 'column', status },
  });
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
      <div
        ref={setNodeRef}
        className="min-h-40 space-y-2 rounded-lg p-1"
        style={{
          background: isOver ? 'var(--raizes-brand-soft)' : 'transparent',
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-black/5" />
            ))
          : items.map((order) => (
              <OrdersBoardCard
                key={order.id}
                order={order}
                status={status}
                onRemove={onRemove}
              />
            ))}
      </div>
      {pagination ? <Pagination {...pagination} onPageChange={setPage} /> : null}
    </GlassPanel>
  );
}
