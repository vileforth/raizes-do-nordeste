export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 text-xs font-semibold text-[var(--raizes-petrol)] backdrop-blur-xl">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      {label}
    </span>
  );
}
