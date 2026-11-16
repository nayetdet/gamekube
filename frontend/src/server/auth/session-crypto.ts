import { EncryptJWT, jwtDecrypt, type JWTPayload } from 'jose';
import { env } from '@/config/env';

const HEADER = { alg: 'dir', enc: 'A256GCM' } as const;

let derivedKey: Promise<Uint8Array> | null = null;

function key(): Promise<Uint8Array> {
  derivedKey ??= crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(env().SESSION_SECRET))
    .then((digest) => new Uint8Array(digest));
  return derivedKey;
}

export async function seal(
  payload: JWTPayload,
  ttlSeconds: number,
): Promise<string> {
  return new EncryptJWT(payload)
    .setProtectedHeader(HEADER)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .encrypt(await key());
}

export async function unseal<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, await key());
    return payload as T;
  } catch {
    return null;
  }
}
