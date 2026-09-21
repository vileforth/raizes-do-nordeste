'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  onConfirm,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !pending) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, pending, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={pending ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md rounded-2xl bg-[var(--raizes-surface)] p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="t-section">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--raizes-text-secondary)]">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[var(--raizes-text-primary)] hover:bg-[var(--raizes-surface-raised)]"
            onClick={onClose}
            disabled={pending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--raizes-rose-text)' }}
            onClick={onConfirm}
            disabled={pending}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
