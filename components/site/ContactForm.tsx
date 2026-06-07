'use client';

import { useState } from 'react';

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <h3>Ou envie uma mensagem</h3>
      <div className="field">
        <label htmlFor="contact-name">Nome</label>
        <input id="contact-name" type="text" placeholder="Seu nome completo" required />
      </div>
      <div className="field">
        <label htmlFor="contact-phone">Telefone</label>
        <input id="contact-phone" type="tel" placeholder="(00) 00000-0000" required />
      </div>
      <div className="field">
        <label htmlFor="contact-message">Mensagem</label>
        <textarea
          id="contact-message"
          placeholder="Conte-nos como podemos ajudar..."
          required
        />
      </div>
      <button
        type="submit"
        className="site-btn site-btn-dark"
        style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
      >
        {sent ? 'Mensagem enviada ✓' : (
          <>
            Enviar mensagem <span className="arrow">→</span>
          </>
        )}
      </button>
    </form>
  );
}
