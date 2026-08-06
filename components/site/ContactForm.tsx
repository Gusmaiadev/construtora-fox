'use client';

import { useState } from 'react';
import { WHATSAPP_URL } from '@/lib/site-constants';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY = { name: '', phone: '', message: '', website: '' };

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const set = (field: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Não foi possível enviar sua mensagem.');
      setStatus('sent');
      setValues(EMPTY);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Não foi possível enviar sua mensagem.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form form-done" role="status">
        <h3>Mensagem enviada</h3>
        <p>
          Recebemos seu contato e retornamos em breve. Se preferir falar agora, chame no{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </p>
        <button
          type="button"
          className="site-btn site-btn-dark"
          style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
          onClick={() => setStatus('idle')}
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <h3>Ou envie uma mensagem</h3>

      <div className="field">
        <label htmlFor="contact-name">Nome</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          value={values.name}
          onChange={set('name')}
          disabled={sending}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="contact-phone">Telefone</label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          value={values.phone}
          onChange={set('phone')}
          disabled={sending}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="contact-message">Mensagem</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Conte-nos como podemos ajudar..."
          value={values.message}
          onChange={set('message')}
          disabled={sending}
          required
        />
      </div>

      {/* Campo-isca contra robôs: some da tela, do leitor e do teclado. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="contact-website">Não preencha este campo</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={set('website')}
        />
      </div>

      {status === 'error' && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="site-btn site-btn-dark"
        style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
        disabled={sending}
      >
        {sending ? (
          'Enviando…'
        ) : (
          <>
            Enviar mensagem <span className="arrow">→</span>
          </>
        )}
      </button>
    </form>
  );
}
