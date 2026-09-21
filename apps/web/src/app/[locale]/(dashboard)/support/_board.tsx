'use client';

import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { canMoveBoardStatus, resolveBoardDropStatus } from '@/lib/helpers/board-drop';
import {
  SUPPORT_STATUSES,
  canDeleteSupportTicket,
  canManageSupportBoard,
} from '@/lib/helpers/support-status';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import { supportResource } from '@/services/support';
import { SupportBoardColumn } from './_column';

export function SupportBoard() {
  const t = useTranslations('support');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const { user } = useAuth();
  const roles = user?.roles ?? [];
  const canDrag = canManageSupportBoard(roles);
  const canDelete = canDeleteSupportTicket(roles);
  const update = supportResource.useUpdate();
  const remove = supportResource.useRemove();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    if (!canDrag) {
      return;
    }
    const { active, over } = event;
    if (!over) {
      return;
    }
    const ticketId = active.data.current?.ticketId;
    const fromStatus = String(active.data.current?.status ?? '');
    const toStatus = resolveBoardDropStatus(over, SUPPORT_STATUSES);
    if (!ticketId || !toStatus || !canMoveBoardStatus(fromStatus, toStatus, SUPPORT_STATUSES)) {
      return;
    }
    try {
      await update.mutateAsync({
        id: String(ticketId),
        input: { status: toStatus },
      });
      toast.success(tCommon('success'));
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="t-page-title">{t('title')}</h1>
        <Link href="/support/new" className="btn-primary">
          {t('open')}
        </Link>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {SUPPORT_STATUSES.map((status) => (
            <SupportBoardColumn
              key={status}
              status={status}
              canDrag={canDrag}
              onRemove={canDelete ? (id) => remove.mutateAsync(id) : undefined}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
