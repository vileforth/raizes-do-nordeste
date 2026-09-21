import { Skeleton } from '@/components/skeletons/skeleton';

export function AuthLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white py-8 md:bg-neutral-50 md:px-4 md:py-12">
      <div className="w-full max-w-full md:max-w-[460px]">
        <Skeleton className="mx-6 mb-4 h-4 w-32 rounded-md md:mx-0" />
        <div className="w-full bg-white px-6 pb-8 pt-4 md:overflow-hidden md:rounded-2xl md:px-10 md:pb-10 md:pt-6 md:shadow-[0_24px_60px_-32px_rgba(7,47,51,0.18)]">
          <div className="mb-7 flex justify-center">
            <Skeleton className="h-[18px] w-[140px] rounded-md" />
          </div>
          <div className="mb-7 flex flex-col items-center gap-2 text-center">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <Skeleton className="mx-auto mt-6 h-3 w-72 rounded-md" />
        </div>
      </div>
    </div>
  );
}
