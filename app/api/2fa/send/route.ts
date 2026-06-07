import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  verifyFirebaseToken,
  genCode,
  signCode,
  maskEmail,
  CODE_COOKIE,
  cookieOpts,
} from '@/lib/server/twofa';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let user;
  try {
    const { idToken } = await req.json();
    user = await verifyFirebaseToken(idToken);
  } catch {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 });
  }
  if (!user.email) {
    return NextResponse.json({ error: 'Sua conta não tem e-mail cadastrado.' }, { status: 400 });
  }

  const code = genCode();
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: user.email,
      subject: 'Seu código de acesso — Construtora Fox',
      html: emailHtml(code),
    });
    if (error) throw new Error((error as { message?: string }).message ?? String(error));
  } catch (e) {
    return NextResponse.json(
      { error: 'Falha ao enviar o e-mail: ' + ((e as Error).message ?? '') },
      { status: 502 },
    );
  }

  const res = NextResponse.json({ ok: true, email: maskEmail(user.email) });
  res.cookies.set(CODE_COOKIE, await signCode(user.uid, code), { ...cookieOpts, maxAge: 600 });
  return res;
}

function emailHtml(code: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0a0d1f">
    <div style="text-align:center;margin-bottom:16px">
      <div style="display:inline-flex;width:48px;height:48px;border-radius:14px;background:#f97316;color:#fff;font-weight:bold;font-size:22px;align-items:center;justify-content:center;line-height:48px">F</div>
    </div>
    <h2 style="text-align:center;margin:0 0 4px">Código de acesso</h2>
    <p style="text-align:center;color:#5c6388;margin:0 0 20px">Construtora Fox — Painel de gestão</p>
    <p style="color:#13172e">Use o código abaixo para concluir seu acesso. Ele expira em <strong>10 minutos</strong>.</p>
    <div style="text-align:center;margin:24px 0">
      <span style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:bold;background:#f5f6fa;border:1px solid #e3e6ef;border-radius:12px;padding:14px 22px">${code}</span>
    </div>
    <p style="color:#787e9f;font-size:13px">Se você não tentou entrar, ignore este e-mail.</p>
  </div>`;
}
