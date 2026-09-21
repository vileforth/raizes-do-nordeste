const COLLAPSE_KEY = 'raizes.sidebar.collapsed';
const collapseListeners = new Set<() => void>();

export function readSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeSidebarCollapsed(next: boolean): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
    } catch {
      return;
    }
  }
  collapseListeners.forEach((listener) => listener());
}

export function subscribeSidebarCollapsed(listener: () => void): () => void {
  collapseListeners.add(listener);
  return () => {
    collapseListeners.delete(listener);
  };
}

export const SIDEBAR_EXPANDED_CLEAR = 316;
export const SIDEBAR_COLLAPSED_CLEAR = 92;
export const HEADER_HEIGHT = 56;
