/**
 * 2FA por e-mail — utilidades de SERVIDOR (só rotas de API).
 *
 * - Verifica o ID token do Firebase usando as chaves públicas do Google
 *   (sem precisar de service account / Admin SDK).
 * - Guarda o código e o "dispositivo confiável" em cookies HTTP-only ASSINADOS
 *   (JWT HS256 com TWOFA_SECRET) — o navegador não lê nem forja.
 */
import 'server-only';
import { jwtVerify, createRemoteJWKSet, SignJWT } from 'jose';
import { randomInt } from 'node:crypto';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'construtora-fox-c8f1b';
const SECRET = new TextEncoder().encode(
  process.env.TWOFA_SECRET ?? 'dev-inseguro-troque-no-env-local',
);

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

export const CODE_COOKIE = 'fox_2fa_code';
export const TRUST_COOKIE = 'fox_2fa_trust';
export const TRUST_DAYS = 30;
export const MAX_ATTEMPTS = 5;

export interface FirebaseUser {
  uid: string;
  email: string | null;
}

/** Valida o ID token do Firebase e retorna uid + e-mail. Lança se inválido. */
export async function verifyFirebaseToken(idToken: string): Promise<FirebaseUser> {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    audience: PROJECT_ID,
  });
  return { uid: String(payload.sub), email: (payload.email as string | undefined) ?? null };
}

export function genCode(): string {
  return String(randomInt(100000, 1000000)); // 6 dígitos
}

export async function signCode(uid: string, code: string, attempts = 0): Promise<string> {
  return new SignJWT({ uid, code, attempts })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(SECRET);
}

export async function readCode(
  value: string | undefined,
): Promise<{ uid: string; code: string; attempts: number } | null> {
  if (!value) return null;
  try {
    const { payload } = await jwtVerify(value, SECRET);
    return {
      uid: String(payload.uid),
      code: String(payload.code),
      attempts: Number(payload.attempts ?? 0),
    };
  } catch {
    return null;
  }
}

export async function signTrust(uid: string): Promise<string> {
  return new SignJWT({ uid })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TRUST_DAYS}d`)
    .sign(SECRET);
}

export async function readTrust(value: string | undefined): Promise<string | null> {
  if (!value) return null;
  try {
    const { payload } = await jwtVerify(value, SECRET);
    return String(payload.uid);
  } catch {
    return null;
  }
}

export function maskEmail(email: string | null): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  const head = user.slice(0, Math.min(2, user.length));
  return `${head}${'*'.repeat(Math.max(1, user.length - head.length))}@${domain}`;
}

export const cookieOpts = {
  httpOnly: true as const,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
