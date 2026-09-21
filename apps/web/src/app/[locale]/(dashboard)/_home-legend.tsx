import { GLASS_STRONG } from '@/lib/glass';

export function HomeLegend({
  unitsLabel,
  activeLabel,
  clientsLabel,
}: {
  unitsLabel: string;
  activeLabel: string;
  clientsLabel: string;
}) {
  return (
    <div
      className="inline-flex h-9 items-center gap-3 rounded-full border px-3 text-[11px] font-semibold text-[var(--raizes-petrol)] backdrop-blur-xl"
      style={GLASS_STRONG}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#072F33]" />
        {unitsLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#FF4B00]" />
        {activeLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#0F766E]" />
        {clientsLabel}
      </span>
    </div>
  );
}
