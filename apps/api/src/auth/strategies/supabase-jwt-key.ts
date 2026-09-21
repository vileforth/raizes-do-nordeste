import { createPublicKey } from 'crypto';

type JwtHeader = {
  alg?: string;
  kid?: string;
};

type JwkKey = {
  kid?: string;
  kty?: string;
  crv?: string;
  x?: string;
  y?: string;
};

const publicKeyCache = new Map<string, string>();

export function decodeJwtHeader(rawJwtToken: string): JwtHeader {
  const [encodedHeader] = rawJwtToken.split('.');
  if (!encodedHeader) {
    throw new Error('Invalid JWT');
  }
  return JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8')) as JwtHeader;
}

export function clearSupabaseJwksCache(): void {
  publicKeyCache.clear();
}

async function loadJwksPublicKey(kid: string): Promise<string> {
  const cached = publicKeyCache.get(kid);
  if (cached) {
    return cached;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not configured');
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`);
  if (!response.ok) {
    throw new Error('Failed to load Supabase JWKS');
  }

  const body = (await response.json()) as { keys?: JwkKey[] };
  const jwk = (body.keys ?? []).find((key) => key.kid === kid);
  if (!jwk?.kty || !jwk.crv || !jwk.x || !jwk.y) {
    throw new Error('Supabase JWKS key not found');
  }

  const pem = createPublicKey({
    key: {
      kty: jwk.kty,
      crv: jwk.crv,
      x: jwk.x,
      y: jwk.y,
    },
    format: 'jwk',
  }).export({ type: 'spki', format: 'pem' });

  const pemString = typeof pem === 'string' ? pem : pem.toString('utf8');
  publicKeyCache.set(kid, pemString);
  return pemString;
}

export async function resolveSupabaseJwtKey(rawJwtToken: string): Promise<string> {
  const header = decodeJwtHeader(rawJwtToken);
  if (header.alg === 'HS256') {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error('SUPABASE_JWT_SECRET is not configured');
    }
    return secret;
  }

  if (header.alg === 'ES256') {
    if (!header.kid) {
      throw new Error('ES256 JWT is missing kid');
    }
    return loadJwksPublicKey(header.kid);
  }

  throw new Error(`Unsupported JWT alg: ${header.alg ?? 'unknown'}`);
}
