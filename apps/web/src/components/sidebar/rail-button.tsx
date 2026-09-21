'use client';

import { motion } from 'framer-motion';
import type { SidebarCategory } from '@/lib/navigation/categories';

type Props = {
  category: SidebarCategory;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onSelect: () => void;
};

export function RailButton({ category, label, isActive, isOpen, onSelect }: Props) {
  const Icon = category.icon;
  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={onSelect}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={isOpen}
        className="peer relative grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-[var(--raizes-sidebar-hover)]"
      >
        {isActive ? (
          <motion.span
            layoutId="rail-active"
            className="absolute inset-0 rounded-xl"
            style={{ background: 'var(--raizes-sidebar-active)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        ) : null}
        {isOpen && !isActive ? (
          <span
            className="absolute inset-0 rounded-xl"
            style={{ background: 'var(--raizes-sidebar-hover)' }}
          />
        ) : null}
        <Icon
          size={20}
          weight="duotone"
          color={isActive ? 'var(--raizes-sidebar-accent)' : 'var(--raizes-petrol)'}
        />
      </button>
      <span
        role="tooltip"
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-x-1 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-md transition duration-150 peer-hover:translate-x-0 peer-hover:opacity-100 peer-focus-visible:translate-x-0 peer-focus-visible:opacity-100"
        style={{ background: 'var(--raizes-text-primary)', color: '#ffffff' }}
      >
        {label}
      </span>
    </div>
  );
}
