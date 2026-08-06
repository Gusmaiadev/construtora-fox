/**
 * Consentimento de cookies (LGPD).
 *
 * A escolha é guardada num cookie primário, não em localStorage: assim ela
 * viaja na requisição e pode ser lida no servidor se um dia precisarmos
 * decidir algo antes de renderizar.
 *
 * O cookie de consentimento é, ele próprio, estritamente necessário — guarda
 * o exercício de um direito e é o único que pode ser gravado sem opt-in.
 */

export const CONSENT_COOKIE = 'fox_consent';

/** Suba a versão sempre que a lista de cookies mudar: reabre o banner. */
export const CONSENT_VERSION = 1;

/** 180 dias — depois disso perguntamos de novo. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type OptionalCategory = 'analiticos' | 'marketing';

export interface Consent {
  v: number;
  analiticos: boolean;
  marketing: boolean;
  /** ISO — data em que a escolha foi registrada. */
  ts: string;
}

export const DENY_ALL: Omit<Consent, 'ts' | 'v'> = { analiticos: false, marketing: false };
export const ALLOW_ALL: Omit<Consent, 'ts' | 'v'> = { analiticos: true, marketing: true };

/** Disparado sempre que a escolha muda, para quem precisar reagir. */
export const CONSENT_EVENT = 'fox:consent-change';

function readRawCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const found = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : null;
}

/**
 * Lê a escolha guardada. Qualquer coisa inesperada — JSON inválido, versão
 * antiga, tipo errado — vira "sem consentimento", que é o padrão seguro:
 * na dúvida, nada opcional é carregado.
 */
export function readConsent(): Consent | null {
  const raw = readRawCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const c = parsed as Record<string, unknown>;
    if (c.v !== CONSENT_VERSION) return null;
    if (typeof c.analiticos !== 'boolean' || typeof c.marketing !== 'boolean') return null;
    return {
      v: CONSENT_VERSION,
      analiticos: c.analiticos,
      marketing: c.marketing,
      ts: typeof c.ts === 'string' ? c.ts : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(choice: Omit<Consent, 'ts' | 'v'>): Consent {
  const consent: Consent = { v: CONSENT_VERSION, ...choice, ts: new Date().toISOString() };
  const value = encodeURIComponent(JSON.stringify(consent));
  // Secure só faz sentido em HTTPS: em http://localhost o navegador
  // descartaria o cookie silenciosamente.
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  // Retirou o consentimento? Os cookies daquela categoria saem junto.
  if (!consent.analiticos) dropCookies(ANALYTICS_PREFIXES);
  if (!consent.marketing) dropCookies(MARKETING_PREFIXES);

  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function hasConsent(category: OptionalCategory): boolean {
  return readConsent()?.[category] === true;
}

/** Prefixos conhecidos, para limpar de verdade quando o consentimento cai. */
const ANALYTICS_PREFIXES = ['_ga', '_gid', '_gat', '_clck', '_clsk'];
const MARKETING_PREFIXES = ['_fbp', '_fbc', '_gcl_'];

function dropCookies(prefixes: string[]) {
  if (typeof document === 'undefined') return;
  const host = location.hostname;
  // Sem o domínio-pai o cookie de terceiro sobrevive à remoção.
  const domains = [undefined, host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  for (const entry of document.cookie.split('; ')) {
    const name = entry.split('=')[0];
    if (!name || !prefixes.some((p) => name.startsWith(p))) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`;
    }
  }
}
