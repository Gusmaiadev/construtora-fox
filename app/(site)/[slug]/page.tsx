import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/site/Reveal';
import {
  JsonLd,
  SITE_URL,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from '@/components/site/JsonLd';
import { SEO_PAGES, getSeoPage } from '@/lib/seo/pages';
import { WHATSAPP_URL } from '@/lib/site-constants';

/** Só os 60 slugs conhecidos existem — qualquer outro cai em 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url: `${SITE_URL}/${page.slug}`,
      type: 'website',
      locale: 'pt_BR',
    },
  };
}

export default async function SeoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const areaName = page.kind === 'service' ? 'Ceará' : page.title.split(' em ').pop() || 'Ceará';

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Cobertura', path: '/cobertura' },
          { name: page.breadcrumb, path: `/${page.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(page.faq)} />
      <JsonLd
        data={serviceSchema({
          name: page.title,
          description: page.description,
          path: `/${page.slug}`,
          areaName,
          areaType: page.kind === 'service' ? 'State' : 'City',
        })}
      />

      <section className="lp-hero">
        <div className="wrap">
          <nav className="lp-crumb" aria-label="Você está aqui">
            <Link href="/">Início</Link>
            <span aria-hidden>/</span>
            <Link href="/cobertura">Cobertura</Link>
            <span aria-hidden>/</span>
            <span>{page.breadcrumb}</span>
          </nav>
          <Reveal className="hero-eyebrow">{page.eyebrow}</Reveal>
          <Reveal as="h1" delay={1}>
            {page.h1}
          </Reveal>
          <Reveal as="p" delay={2} className="sub">
            {page.lead}
          </Reveal>
          <Reveal className="hero-ctas" delay={3}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn-primary"
            >
              Falar no WhatsApp <span className="arrow">→</span>
            </a>
            <Link href="/contato" className="site-btn site-btn-ghost">
              Solicitar orçamento
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap lp-body">
          {page.body.map((p, i) => (
            <Reveal as="p" key={i} className="lead" delay={Math.min(i, 2) as 0 | 1 | 2}>
              {p}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="benefits">
        <div className="wrap">
          <div className="diff-head">
            <Reveal>
              <div className="eyebrow">
                {page.kind === 'city' ? 'O que executamos' : 'Como funciona'}
              </div>
              <h2 className="section-title">
                {page.kind === 'city' ? (
                  <>
                    Frentes de <em>atuação</em>
                  </>
                ) : (
                  <>
                    Do orçamento à <em>entrega</em>
                  </>
                )}
              </h2>
            </Reveal>
          </div>
          <div className="benefits-grid lp-grid">
            {page.bullets.map((b, i) => (
              <Reveal
                key={b.title}
                className="benefit"
                delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
                style={{
                  paddingLeft: 32,
                  borderLeft: i === 0 ? '1px solid rgba(255,255,255,.1)' : undefined,
                }}
              >
                <div className="benefit-num">{String(i + 1).padStart(2, '0')}</div>
                <h3>{b.title}</h3>
                {b.desc && <p>{b.desc}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Perguntas frequentes</div>
            <h2 className="section-title">
              Dúvidas <em>comuns</em>
            </h2>
          </Reveal>
          <div className="lp-faq">
            {page.faq.map((f, i) => (
              <Reveal key={f.q} className="lp-faq-item" delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="eyebrow">Veja também</Reveal>
          <div className="lp-links">
            {page.related.map((r) => (
              <Link key={r.href} href={r.href}>
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="cta-final-inner">
          <Reveal className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>
            Próximo passo
          </Reveal>
          <Reveal as="h2" delay={1}>
            Vamos falar sobre a sua <em>obra</em>
          </Reveal>
          <Reveal as="p" delay={2}>
            Conte o que você precisa e receba um retorno com o escopo e as condições.
          </Reveal>
          <Reveal className="hero-ctas" delay={3} style={{ justifyContent: 'center' }}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn-primary"
            >
              WhatsApp <span className="arrow">→</span>
            </a>
            <Link href="/contato" className="site-btn site-btn-ghost">
              Formulário
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
