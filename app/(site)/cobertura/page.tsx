import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';
import { JsonLd, SITE_URL, breadcrumbSchema } from '@/components/site/JsonLd';
import { SEO_PAGES } from '@/lib/seo/pages';

export const metadata: Metadata = {
  title: 'Cobertura no Ceará — cidades e serviços',
  description:
    'Onde a Construtora Fox atende no Ceará e quais serviços executa: construção de casas, reformas, ampliações, obras industriais e gerenciamento em cidades de todo o estado.',
  alternates: { canonical: '/cobertura' },
  openGraph: {
    title: 'Cobertura no Ceará — Construtora Fox',
    description: 'Cidades atendidas e serviços executados pela Construtora Fox em todo o Ceará.',
    url: `${SITE_URL}/cobertura`,
    type: 'website',
    locale: 'pt_BR',
  },
};

const GROUPS: { title: string; kind: 'city' | 'service' | 'service-city'; note: string }[] = [
  { title: 'Cidades atendidas', kind: 'city', note: 'Obra residencial, comercial e industrial por município.' },
  { title: 'Serviços no Ceará', kind: 'service', note: 'Cada frente de atuação, com escopo e processo.' },
  { title: 'Serviço por cidade', kind: 'service-city', note: 'Combinações mais procuradas.' },
];

export default function CoberturaPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Cobertura', path: '/cobertura' },
        ])}
      />

      <section className="lp-hero">
        <div className="wrap">
          <Reveal className="hero-eyebrow">Cobertura · Ceará</Reveal>
          <Reveal as="h1" delay={1}>
            Onde a Fox <em>atende</em>
          </Reveal>
          <Reveal as="p" delay={2} className="sub">
            A Construtora Fox executa obras em municípios de todo o Ceará, da Região Metropolitana
            de Fortaleza ao Cariri, à Ibiapaba, ao Vale do Jaguaribe e ao sertão.
          </Reveal>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section className="site-section" key={g.kind} style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <div className="eyebrow">{g.title}</div>
              <p className="lead" style={{ marginBottom: 28 }}>
                {g.note}
              </p>
            </Reveal>
            <div className="lp-links">
              {SEO_PAGES.filter((p) => p.kind === g.kind).map((p) => (
                <Link key={p.slug} href={`/${p.slug}`}>
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
