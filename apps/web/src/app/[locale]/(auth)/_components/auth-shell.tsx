'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import { AuthLogo } from './auth-logo';

type AuthShellProps = {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthShell({
  backHref,
  backLabel,
  title,
  subtitle,
  footer,
  children,
}: AuthShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white py-8 md:bg-neutral-50 md:px-4 md:py-12">
      <div className="w-full max-w-full md:max-w-[460px]">
        <Link
          href={backHref}
          prefetch={false}
          className="mb-4 inline-flex items-center gap-1.5 px-6 text-sm font-medium text-[var(--raizes-text-secondary)] transition-colors hover:text-[var(--raizes-petrol)] md:px-0"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </Link>
        <div
          className="w-full bg-white px-6 pb-8 pt-4 transition-all duration-500 md:overflow-hidden md:rounded-2xl md:px-10 md:pb-10 md:pt-6 md:shadow-[0_24px_60px_-32px_rgba(7,47,51,0.18)]"
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0)' : 'blur(20px)',
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <AuthLogo />
          <div className="mb-6 text-center">
            <h1 className="text-[17px] font-semibold leading-tight tracking-[-0.01em] text-[var(--raizes-petrol)]">
              {title}
            </h1>
            <p className="mt-1.5 text-[13px] leading-snug text-[var(--raizes-text-secondary)]">
              {subtitle}
            </p>
          </div>
          {children}
          {footer ? <div className="mt-6 text-center">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
