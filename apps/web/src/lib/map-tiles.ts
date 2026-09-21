const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_API_KEY;

export const positronTileUrl = STADIA_KEY
  ? `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`
  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

export const positronTileSubdomains = STADIA_KEY ? undefined : 'abcd';

export const positronTileAttribution = STADIA_KEY
  ? '&copy; OpenStreetMap &copy; Stadia Maps'
  : '&copy; OpenStreetMap &copy; CARTO';

export const BRAZIL_BOUNDS: [[number, number], [number, number]] = [
  [5.3, -74],
  [-33.8, -34.8],
];

export const BRAZIL_CENTER: [number, number] = [-14.5, -52];
