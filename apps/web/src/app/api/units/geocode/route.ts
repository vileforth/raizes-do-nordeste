import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_URL =
  process.env.NOMINATIM_BASE_URL ?? 'https://nominatim.openstreetmap.org';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');
  if (!address) {
    return NextResponse.json({ message: 'address required' }, { status: 400 });
  }
  const url = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'raizes-do-nordeste/1.0' },
  });
  if (!response.ok) {
    return NextResponse.json({ message: 'geocode failed' }, { status: 502 });
  }
  const data = (await response.json()) as Array<{ lat: string; lon: string }>;
  if (!data.length) {
    return NextResponse.json({ latitude: null, longitude: null });
  }
  return NextResponse.json({
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  });
}
