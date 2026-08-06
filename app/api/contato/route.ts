import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { COMPANY } from '@/lib/site-constants';

export const runtime = 'nodejs';

const MAX = { name: 120, phone: 40, message: 4000 };

/**
 * Limite simples por IP. As instâncias do Fluid Compute são reaproveitadas
 * entre requisições, então o contador sobrevive o bastante para segurar um
 * envio em massa — não substitui um rate limit distribuído, mas evita o
 * cenário comum de robô disparando o formulário em sequência.
 */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  const to = process.env.CONTACT_TO;
  if (!to) {
    console.error('[contato] CONTACT_TO não configurado');
    return NextResponse.json(
      { error: 'Canal de mensagens indisponível. Fale conosco pelo WhatsApp.' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  // Campo-isca: invisível e fora da navegação por teclado. Humano nunca
  // preenche; robô que preenche formulário cegamente, sim.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const phone = clean(body.phone, MAX.phone);
  const message = clean(body.message, MAX.message);

  if (!name || !phone || !message) {
    return NextResponse.json({ error: 'Preencha nome, telefone e mensagem.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Escreva um pouco mais na mensagem.' }, { status: 400 });
  }

  // O limite só conta envios de verdade: erro de preenchimento não deve
  // gastar a cota de quem ainda está tentando mandar a primeira mensagem.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconhecido';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.' },
      { status: 429 },
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to,
      subject: `Novo contato pelo site — ${name}`,
      html: emailHtml({ name, phone, message }),
      text: `Nome: ${name}\nTelefone: ${phone}\n\n${message}`,
    });
    if (error) throw new Error((error as { message?: string }).message ?? String(error));
  } catch (e) {
    // O detalhe fica no log do servidor; o visitante recebe algo acionável.
    console.error('[contato] falha no envio:', e);
    return NextResponse.json(
      { error: 'Não conseguimos enviar agora. Tente pelo WhatsApp.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

function emailHtml({ name, phone, message }: { name: string; phone: string; message: string }) {
  const wa = phone.replace(/\D/g, '');
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0F172A">
    <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#C6A15B;margin:0 0 6px">${COMPANY}</p>
    <h2 style="margin:0 0 20px">Novo contato pelo site</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;width:110px;color:#64748B">Nome</td>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB"><strong>${escapeHtml(name)}</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;color:#64748B">Telefone</td>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB">
          <strong>${escapeHtml(phone)}</strong>
          <a href="https://wa.me/55${wa}" style="margin-left:10px;font-size:13px;color:#C6A15B">abrir no WhatsApp</a>
        </td>
      </tr>
    </table>
    <p style="color:#64748B;font-size:13px;margin:24px 0 8px">Mensagem</p>
    <div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</div>
  </div>`;
}
