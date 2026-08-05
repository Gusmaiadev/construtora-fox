import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { JsonLd, SITE_URL, organizationSchema, websiteSchema } from '@/components/site/JsonLd';
import { COMPANY } from '@/lib/site-constants';

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
    default: 'Construtora no Ceará | Construtora Fox — Crateús e todo o estado',
    template: '%s · Construtora Fox',
  },
  description:
    'Construtora no Ceará com sede em Crateús: construção de casas, reformas residenciais e comerciais, ampliações, obras industriais e gerenciamento de obras. Orçamento por etapa e acompanhamento técnico.',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  icons: { icon: '/fox.svg' },
  applicationName: COMPANY,
  authors: [{ name: COMPANY, url: SITE_URL }],
  creator: COMPANY,
  publisher: COMPANY,
  category: 'Construção civil',
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    siteName: COMPANY,
    title: 'Construtora no Ceará — Construtora Fox',
    description:
      'Construção de casas, reformas, ampliações e obras comerciais em todo o Ceará. Orçamento por etapa e obra acompanhada de perto.',
    url: SITE_URL,
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/site/images/home-hero.jpg',
        width: 1800,
        height: 1200,
        alt: 'Obra da Construtora Fox no Ceará',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construtora no Ceará — Construtora Fox',
    description:
      'Construção de casas, reformas, ampliações e obras comerciais em todo o Ceará.',
    images: ['/site/images/home-hero.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body suppressHydrationWarning>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        {children}
      </body>
    </html>
  );
}
