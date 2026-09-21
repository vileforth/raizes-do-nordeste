'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ConfirmModal } from '@/components/confirm-modal';
import { useToast } from '@/providers/toast-provider';

type Props = {
  onRemove: () => Promise<unknown>;
  onDeleted?: () => void;
  compact?: boolean;
};

export function DeleteAction({ onRemove, onDeleted, compact = false }: Props) {
  const t = useTranslations('common');
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onRemove();
      toast.success(t('success'));
      setOpen(false);
      onDeleted?.();
    } catch {
      toast.error(t('error'));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={
          compact
            ? 'text-[11px] font-semibold text-[var(--raizes-rose-text)]'
            : 'rounded-full px-2.5 py-1 text-[12px] font-semibold text-[var(--raizes-rose-text)] hover:bg-[var(--raizes-rose-soft)]'
        }
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        {t('delete')}
      </button>
      <ConfirmModal
        open={open}
        title={t('confirmDeleteTitle')}
        description={t('confirmDeleteDescription')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        pending={pending}
        onConfirm={handleConfirm}
        onClose={() => {
          if (!pending) {
            setOpen(false);
          }
        }}
      />
    </>
  );
}
