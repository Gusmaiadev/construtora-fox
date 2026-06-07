/** Formatação BRL. */
const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const brlCompact = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const numberFmt = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

const numberCompact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});

const dateLong = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'R$ 0,00';
  return brl.format(value);
}

export function formatCurrencyCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'R$ 0';
  return brlCompact.format(value).replace('mil', 'k');
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0';
  return numberFmt.format(value);
}

export function formatNumberCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0';
  return numberCompact.format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return dateFmt.format(d);
}

export function formatDateLong(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return dateLong.format(d);
}

export function formatPercent(value: number, decimals = 1): string {
  if (Number.isNaN(value)) return '0%';
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date);
}

/** Converte input do usuário (string com vírgula) para número. */
export function parseNumberInput(s: string): number {
  if (!s || typeof s !== 'string') return 0;
  const cleaned = s
    .replace(/[^\d,.\-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}
