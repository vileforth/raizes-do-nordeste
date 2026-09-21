type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={`animate-pulse bg-black/8 ${className ?? ''}`} />;
}
