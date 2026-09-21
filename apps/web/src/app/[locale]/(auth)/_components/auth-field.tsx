'use client';

import { forwardRef } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';

export type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hasToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  revealLabel?: string;
  hideLabel?: string;
};

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  {
    label,
    error,
    hasToggle,
    showPassword,
    onTogglePassword,
    revealLabel = 'Show password',
    hideLabel = 'Hide password',
    id,
    name,
    type,
    ...rest
  },
  ref,
) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-[var(--raizes-text-primary)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[var(--raizes-text-primary)] placeholder:text-[var(--raizes-text-secondary)]/70 outline-none transition-colors ${
            error
              ? 'border-red-400 bg-red-50/50 focus:border-red-400'
              : 'border-[var(--raizes-border-strong)] focus:border-[var(--raizes-petrol)]'
          } ${hasToggle ? 'pr-11' : ''}`}
          {...rest}
        />
        {hasToggle ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--raizes-text-secondary)] transition-colors hover:text-[var(--raizes-text-primary)]"
            aria-label={showPassword ? hideLabel : revealLabel}
          >
            {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
});
