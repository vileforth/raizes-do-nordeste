'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { NavItem } from '@/lib/navigation/menu';

type Props = {
  item: NavItem;
  active: boolean;
  label: string;
};

export function PanelLink({ item, active, label }: Props) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className="relative flex h-9 items-center gap-3 rounded-lg pr-3 pl-3 text-[13px] transition-colors hover:bg-[var(--raizes-sidebar-hover)]"
      style={{
        color: active ? 'var(--raizes-sidebar-text-active)' : 'var(--raizes-sidebar-text)',
        fontWeight: active ? 500 : 400,
      }}
    >
      {active ? (
        <>
          <motion.span
            layoutId="panel-active"
            className="absolute inset-0 rounded-lg"
            style={{ background: 'var(--raizes-sidebar-active)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
          <motion.span
            layoutId="panel-active-bar"
            className="absolute top-1/2 -left-3 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
            style={{ background: 'var(--raizes-sidebar-accent)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        </>
      ) : null}
      <span
        className="relative z-10 flex items-center"
        style={{ color: active ? 'var(--raizes-sidebar-accent)' : undefined }}
      >
        <Icon size={16} weight={active ? 'fill' : 'regular'} />
      </span>
      <span className="relative z-10 flex-1 truncate">{label}</span>
    </Link>
  );
}
