'use client';

import { CaretDoubleLeft } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useSyncExternalStore } from 'react';
import {
  categoryOfHref,
  findActiveHref,
  getCategoriesForRoles,
  type SidebarCategory,
} from '@/lib/navigation/categories';
import {
  readSidebarCollapsed,
  SIDEBAR_COLLAPSED_CLEAR,
  SIDEBAR_EXPANDED_CLEAR,
  subscribeSidebarCollapsed,
  writeSidebarCollapsed,
} from '@/lib/navigation/sidebar-collapse';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useAuth } from '@/providers/auth-provider';
import { PanelLink } from './panel-link';
import { RailButton } from './rail-button';

const MD_MIN_WIDTH = 768;
const MOBILE_CLEAR = 16;

function subscribeDesktop(onStoreChange: () => void) {
  const media = window.matchMedia(`(min-width: ${MD_MIN_WIDTH}px)`);
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribeSidebarCollapsed, readSidebarCollapsed, () => false);
}

export function useSidebarClearLeft(): number {
  const collapsed = useSidebarCollapsed();
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(`(min-width: ${MD_MIN_WIDTH}px)`).matches,
    () => true,
  );
  if (!isDesktop) {
    return MOBILE_CLEAR;
  }
  return collapsed ? SIDEBAR_COLLAPSED_CLEAR : SIDEBAR_EXPANDED_CLEAR;
}

export function Sidebar() {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const t = useTranslations('nav');
  const { user, isLoading } = useAuth();
  const categories = useMemo(
    () => getCategoriesForRoles(user?.roles ?? []),
    [user?.roles],
  );
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    readSidebarCollapsed,
    () => false,
  );
  const activeHref = useMemo(() => findActiveHref(pathname, categories), [pathname, categories]);
  const activeCategoryKey = useMemo(
    () => categoryOfHref(activeHref, categories),
    [activeHref, categories],
  );
  const openCategory =
    categories.find((category) => category.key === activeCategoryKey) ?? categories[0];
  const showPanel = !collapsed && (isLoading || Boolean(openCategory));

  function handleSelectCategory(category: SidebarCategory) {
    if (category.key === activeCategoryKey) {
      writeSidebarCollapsed(!collapsed);
      return;
    }
    if (collapsed) {
      writeSidebarCollapsed(false);
    }
    router.push(category.items[0].href);
  }

  return (
    <aside
      className="z-30 hidden h-full shrink-0 rounded-2xl backdrop-blur-xl backdrop-saturate-150 md:flex"
      style={{
        background: 'rgba(255,255,255,0.92)',
        boxShadow: '0 1px 3px rgba(31,42,69,0.05), 0 8px 24px -18px rgba(31,42,69,0.15)',
      }}
    >
      <div
        className={`flex w-16 shrink-0 flex-col items-center ${
          collapsed ? 'rounded-2xl' : 'rounded-l-2xl border-r'
        }`}
        style={{ borderColor: 'var(--raizes-sidebar-border)' }}
      >
        <Link
          href="/"
          className="flex h-14 shrink-0 items-center justify-center"
          aria-label="Raízes do Nordeste"
        >
          <BrandLogo size="rail" />
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1 pt-2 pb-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-10 w-10 animate-pulse rounded-xl bg-black/[0.06]" />
              ))
            : categories.map((category) => (
                <RailButton
                  key={category.key}
                  category={category}
                  label={t(category.labelKey)}
                  isActive={category.key === activeCategoryKey}
                  isOpen={!collapsed && category.key === activeCategoryKey}
                  onSelect={() => handleSelectCategory(category)}
                />
              ))}
        </nav>
      </div>
      <AnimatePresence initial={false}>
        {showPanel ? (
          <motion.div
            key="sidebar-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 224, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            className="overflow-hidden rounded-r-2xl"
          >
            <div className="flex h-full w-56 flex-col">
              <div className="flex h-14 shrink-0 items-center justify-between px-4">
                {isLoading || !openCategory ? (
                  <div className="h-3 w-20 animate-pulse rounded-md bg-black/[0.06]" />
                ) : (
                  <span className="t-eyebrow">{t(openCategory.labelKey)}</span>
                )}
                <button
                  type="button"
                  onClick={() => writeSidebarCollapsed(true)}
                  className="grid h-7 w-7 place-items-center rounded-lg text-[var(--raizes-sidebar-text)] transition-colors hover:bg-[var(--raizes-sidebar-hover)]"
                  aria-label={t('collapseMenu')}
                  title={t('collapseMenu')}
                >
                  <CaretDoubleLeft size={16} />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-6">
                {isLoading || !openCategory
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex h-9 items-center gap-3 rounded-lg px-3">
                        <div className="h-4 w-4 animate-pulse rounded bg-black/[0.06]" />
                        <div
                          className="h-3 animate-pulse rounded-md bg-black/[0.06]"
                          style={{ width: 60 + ((index * 17) % 60) }}
                        />
                      </div>
                    ))
                  : openCategory.items.map((item) => (
                      <PanelLink
                        key={item.href}
                        item={item}
                        active={item.href === activeHref}
                        label={t(item.labelKey)}
                      />
                    ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}
