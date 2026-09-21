'use client';

import { useDraggable } from '@dnd-kit/core';
import Link from 'next/link';
import { DeleteAction } from '@/components/delete-action';
import { formatMoney } from '@/lib/helpers/money';
import type { Order } from '@/services/orders';

type Props = {
  order: Order;
  status: string;
  onRemove: (id: string) => Promise<unknown>;
};

export function OrdersBoardCard({ order, status, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `order-${order.id}`,
    data: { type: 'card', orderId: order.id, status },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="rounded-lg border border-[var(--raizes-border)] bg-[var(--raizes-surface)] p-3"
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/orders/${order.id}`}
          className="min-w-0 flex-1"
        >
          <p className="font-medium">{order.orderCode}</p>
          <p className="text-xs text-[var(--raizes-text-secondary)]">
            {formatMoney(order.totalValue)}
          </p>
        </Link>
        <DeleteAction onRemove={() => onRemove(String(order.id))} compact />
      </div>
    </div>
  );
}
