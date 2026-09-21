import { createPublicKey, generateKeyPairSync } from 'crypto';
import { clearSupabaseJwksCache, resolveSupabaseJwtKey } from './supabase-jwt-key';

function encodeSegment(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

describe('resolveSupabaseJwtKey', () => {
  const originalSecret = process.env.SUPABASE_JWT_SECRET;
  const originalUrl = process.env.SUPABASE_URL;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
    process.env.SUPABASE_URL = 'https://example.supabase.co';
  });

  afterEach(() => {
    process.env.SUPABASE_JWT_SECRET = originalSecret;
    process.env.SUPABASE_URL = originalUrl;
    global.fetch = originalFetch;
    clearSupabaseJwksCache();
  });

  it('uses the HMAC secret for HS256 tokens', async () => {
    const token = `${encodeSegment({ alg: 'HS256', typ: 'JWT' })}.${encodeSegment({ sub: '1' })}.sig`;
    await expect(resolveSupabaseJwtKey(token)).resolves.toBe('test-secret');
  });

  it('loads the JWKS public key for ES256 tokens', async () => {
    const { publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
    const jwk = publicKey.export({ format: 'jwk' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        keys: [{ ...jwk, kid: 'key-1', alg: 'ES256' }],
      }),
    }) as unknown as typeof fetch;

    const token = `${encodeSegment({ alg: 'ES256', kid: 'key-1', typ: 'JWT' })}.${encodeSegment({ sub: '1' })}.sig`;
    const pem = await resolveSupabaseJwtKey(token);
    expect(typeof pem).toBe('string');
    expect(String(pem)).toContain('BEGIN PUBLIC KEY');
    expect(createPublicKey(pem)).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.supabase.co/auth/v1/.well-known/jwks.json',
    );
  });

  it('rejects unsupported algorithms', async () => {
    const token = `${encodeSegment({ alg: 'RS256', typ: 'JWT' })}.${encodeSegment({ sub: '1' })}.sig`;
    await expect(resolveSupabaseJwtKey(token)).rejects.toThrow('Unsupported JWT alg');
  });
});
