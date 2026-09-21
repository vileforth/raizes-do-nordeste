type BrandLogoSize = 'rail' | 'header' | 'auth';

const SIZE_CLASS: Record<BrandLogoSize, string> = {
  rail: 'h-10 w-10',
  header: 'h-9 w-auto max-w-[128px]',
  auth: 'h-[7.5rem] w-auto max-w-[260px]',
};

const SRC: Record<BrandLogoSize, string> = {
  rail: '/brand/logo-mark.svg',
  header: '/brand/logo-mark.svg',
  auth: '/brand/logo-wordmark.svg',
};

export function BrandLogo({ size = 'header' }: { size?: BrandLogoSize }) {
  return (
    <img
      src={SRC[size]}
      alt="Raízes do Nordeste"
      className={`object-contain ${SIZE_CLASS[size]}`}
    />
  );
}
