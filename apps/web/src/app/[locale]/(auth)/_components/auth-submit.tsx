'use client';

import type { ReactNode } from 'react';
import { AuthSpinner } from './auth-spinner';

type AuthSubmitProps = {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
};

export function AuthSubmit({ children, loading, loadingLabel, disabled }: AuthSubmitProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
      style={{ background: 'var(--raizes-cta)' }}
      onMouseOver={(event) => {
        event.currentTarget.style.background = 'var(--raizes-cta-hover)';
      }}
      onMouseOut={(event) => {
        event.currentTarget.style.background = 'var(--raizes-cta)';
      }}
    >
      {loading ? (
        <>
          <AuthSpinner light />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
