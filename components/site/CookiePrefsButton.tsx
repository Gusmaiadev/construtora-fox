'use client';

import { OPEN_PREFS_EVENT } from '@/components/site/CookieConsent';

/** Reabre o painel de cookies. Fica no rodapé, exigência prática da LGPD:
 *  revogar precisa ser tão acessível quanto consentir. */
export function CookiePrefsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_PREFS_EVENT))}>
      Preferências de cookies
    </button>
  );
}
