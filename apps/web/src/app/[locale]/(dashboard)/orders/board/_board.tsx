'use client';

import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { queryKeys } from '@/lib/query-keys';
import { canMoveOrderStatus, resolveBoardDropStatus } from '@/lib/helpers/board-drop';
import { ORDER_STATUSES } from '@/lib/helpers/order-status';
import { useToast } from '@/providers/toast-provider';
import { ordersResource, updateOrderStatus } from '@/services/orders';
import { OrdersBoardColumn } from './_column';

export function OrdersBoard() {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const queryClient = useQueryClient();
  const remove = ordersResource.useRemove();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const orderId = active.data.current?.orderId;
    const fromStatus = String(active.data.current?.status ?? '');
    const toStatus = resolveBoardDropStatus(over);
    if (!orderId || !toStatus || !canMoveOrderStatus(fromStatus, toStatus)) {
      return;
    }
    try {
      await updateOrderStatus(String(orderId), toStatus);
      toast.success(tCommon('success'));
      await queryClient.invalidateQueries({ queryKey: queryKeys.lists('orders') });
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="t-page-title">{t('board')}</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ORDER_STATUSES.map((status) => (
            <OrdersBoardColumn
              key={status}
              status={status}
              onRemove={(id) => remove.mutateAsync(id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
