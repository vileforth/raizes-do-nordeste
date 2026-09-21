export function TotalSkeleton() {
  return <div className="ml-auto h-7 w-16 animate-pulse rounded bg-black/5" />;
}

export function BarsSkeleton() {
  return (
    <div className="flex h-36 items-end gap-[3px]">
      {Array.from({ length: 14 }).map((_, index) => (
        <div
          key={index}
          className="flex-1 animate-pulse rounded-md bg-black/5"
          style={{ height: `${30 + ((index * 17) % 60)}%` }}
        />
      ))}
    </div>
  );
}

export function ChartBodySkeleton({ height }: { height: number }) {
  return <div className="w-full animate-pulse rounded-xl bg-black/5" style={{ height }} />;
}
