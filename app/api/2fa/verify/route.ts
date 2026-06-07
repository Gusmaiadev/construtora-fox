import { NextRequest, NextResponse } from 'next/server';
import {
  verifyFirebaseToken,
  readCode,
  signCode,
  signTrust,
  CODE_COOKIE,
  TRUST_COOKIE,
  cookieOpts,
  TRUST_DAYS,
  MAX_ATTEMPTS,
} from '@/lib/server/twofa';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let uid: string;
  let submitted = '';
  try {
    const body = await req.json();
    const user = await verifyFirebaseToken(body.idToken);
    uid = user.uid;
    submitted = String(body.code ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 });
  }

  const stored = await readCode(req.cookies.get(CODE_COOKIE)?.value);
  if (!stored || stored.uid !== uid) {
    return NextResponse.json({ error: 'Código expirado. Envie um novo.' }, { status: 400 });
  }

  if (submitted !== stored.code) {
    const attempts = stored.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      const res = NextResponse.json({ error: 'Muitas tentativas. Envie um novo código.' }, { status: 429 });
      res.cookies.set(CODE_COOKIE, '', { ...cookieOpts, maxAge: 0 });
      return res;
    }
    const res = NextResponse.json(
      { error: 'Código incorreto.', left: MAX_ATTEMPTS - attempts },
      { status: 400 },
    );
    res.cookies.set(CODE_COOKIE, await signCode(uid, stored.code, attempts), { ...cookieOpts, maxAge: 600 });
    return res;
  }

  // Sucesso: marca o dispositivo como confiável por 30 dias e limpa o código.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TRUST_COOKIE, await signTrust(uid), { ...cookieOpts, maxAge: TRUST_DAYS * 86400 });
  res.cookies.set(CODE_COOKIE, '', { ...cookieOpts, maxAge: 0 });
  return res;
}
