import Link from 'next/link';

export function AuthLogo() {
  return (
    <div className="mb-7 flex justify-center">
      <Link href="/" prefetch={false} aria-label="Raizes do Nordeste" className="relative inline-block">
        <span className="flex items-baseline gap-1.5">
          <span className="font-[family-name:var(--font-playfair)] text-[28px] italic leading-none text-[var(--raizes-petrol)]">
            Raízes
          </span>
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--raizes-brand)]">
            do Nordeste
          </span>
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full opacity-[0.06] blur-2xl"
          style={{ background: 'var(--raizes-brand)' }}
        />
      </Link>
    </div>
  );
}
