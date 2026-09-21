import { Skeleton } from '@/components/skeletons/skeleton';

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-1">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

export function TablePageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="surface-card space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
