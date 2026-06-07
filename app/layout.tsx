import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Construtora Fox — Investimentos bem construídos',
    template: '%s · Construtora Fox',
  },
  description:
    'Construtora Fox: desenvolvimento de empreendimentos planejados no Ceará — loteamentos, condomínios, residenciais e comerciais com alto potencial de valorização.',
  metadataBase: new URL('https://construtorafox.com.br'),
  icons: { icon: '/fox.svg' },
  openGraph: {
    title: 'Construtora Fox — Investimentos bem construídos',
    description:
      'Empreendimentos planejados, valorização real e qualidade que atravessa o tempo.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
