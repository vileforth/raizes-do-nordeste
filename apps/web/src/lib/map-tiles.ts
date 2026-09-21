const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_API_KEY;

function withKey(url: string): string {
  if (!STADIA_KEY) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}api_key=${STADIA_KEY}`;
}

export const positronTileUrl = withKey(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
);

export const BRAZIL_BOUNDS: [[number, number], [number, number]] = [
  [5.3, -74],
  [-33.8, -34.8],
];

export const BRAZIL_CENTER: [number, number] = [-14.5, -52];
