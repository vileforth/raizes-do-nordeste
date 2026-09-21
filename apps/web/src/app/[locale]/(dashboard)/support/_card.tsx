'use client';

import { useDraggable } from '@dnd-kit/core';
import Link from 'next/link';
import { DeleteAction } from '@/components/delete-action';
import { StatusBadge } from '@/components/status-badge';
import type { SupportTicket } from '@/services/support';

type Props = {
  ticket: SupportTicket;
  status: string;
  canDrag: boolean;
  onRemove?: (id: string) => Promise<unknown>;
};

export function SupportBoardCard({ ticket, status, canDrag, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `support-${ticket.id}`,
    data: { type: 'card', ticketId: ticket.id, status },
    disabled: !canDrag,
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
      {...(canDrag ? listeners : {})}
      {...(canDrag ? attributes : {})}
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/support/${ticket.id}`} className="min-w-0 flex-1">
          <p className="font-medium">{ticket.protocol}</p>
          <div className="mt-1">
            <StatusBadge status={ticket.type} />
          </div>
        </Link>
        {onRemove ? (
          <DeleteAction onRemove={() => onRemove(String(ticket.id))} compact />
        ) : null}
      </div>
    </div>
  );
}
