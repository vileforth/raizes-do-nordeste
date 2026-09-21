'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'success' | 'error';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  toast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const value = useMemo(
    () => ({
      toast: push,
      success: (message: string) => push('success', message),
      error: (message: string) => push('error', message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
            style={{
              background:
                t.type === 'success'
                  ? 'var(--raizes-green-soft)'
                  : 'var(--raizes-rose-soft)',
              color:
                t.type === 'success'
                  ? 'var(--raizes-green-text)'
                  : 'var(--raizes-rose-text)',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
