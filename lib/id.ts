/**
 * Gerador de identificador único compatível com browsers modernos.
 * Usa crypto.randomUUID quando disponível; fallback simples caso contrário.
 */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
