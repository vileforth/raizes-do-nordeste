import Link from 'next/link';
import { BrandLogo } from '@/components/brand/brand-logo';

export function AuthLogo() {
  return (
    <div className="mb-7 flex justify-center">
      <Link href="/" prefetch={false} aria-label="Raizes do Nordeste" className="relative inline-block">
        <BrandLogo size="auth" />
      </Link>
    </div>
  );
}
