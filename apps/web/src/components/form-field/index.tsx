import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-[var(--raizes-petrol)]">
      <span>{label}</span>
      {children}
    </label>
  );
}
