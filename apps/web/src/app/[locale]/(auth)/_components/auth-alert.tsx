import { Prohibit, Warning } from '@phosphor-icons/react';

type AuthAlertProps = {
  tone: 'error' | 'notice' | 'forbidden';
  title?: string;
  message: string;
};

export function AuthAlert({ tone, title, message }: AuthAlertProps) {
  if (tone === 'forbidden') {
    return (
      <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
        <Prohibit className="mt-0.5 shrink-0 text-amber-700" size={18} />
        <div className="min-w-0">
          {title ? <p className="text-sm font-semibold text-amber-900">{title}</p> : null}
          <p className="mt-0.5 text-xs leading-relaxed text-amber-800">{message}</p>
        </div>
      </div>
    );
  }

  if (tone === 'notice') {
    return (
      <div className="mb-5 flex items-start gap-3 rounded-lg border border-[var(--raizes-border)] bg-[var(--raizes-surface-raised)] p-3.5">
        <p className="text-sm text-[var(--raizes-text-primary)]">{message}</p>
      </div>
    );
  }

  return (
    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3.5">
      <Warning className="shrink-0 text-red-700" size={18} />
      <p className="text-sm font-medium text-red-800">{message}</p>
    </div>
  );
}
