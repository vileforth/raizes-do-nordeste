import type { ReactNode } from 'react';

export function SectionCard({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="t-section">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
