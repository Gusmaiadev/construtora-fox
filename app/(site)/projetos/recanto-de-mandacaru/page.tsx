import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';
import { ParallaxImage } from '@/components/site/ParallaxImage';
import { GalleryTrack } from '@/components/site/GalleryTrack';
import { WHATSAPP_URL_RECANTO } from '@/lib/site-constants';

export const metadata = {
  title: 'Recanto de Mandacaru',
  description:
    'Loteamento planejado às margens da CE-189, em Crateús, Ceará — investimento com potencial real de valorização.',
};

export default function RecantoPage() {
  return (
    <main>
      <section className="recanto-hero">
        <div className="recanto-hero-bg">
          <ParallaxImage src="/site/images/recanto-hero.jpg" alt="" factor={0.45} priority />
        </div>
        <div className="recanto-hero-inner">
          <Reveal className="recanto-tag">Empreendimento — Recanto de Mandacaru</Reveal>
          <Reveal as="h1" delay={1}>
            Invista em um projeto com potencial real de <em>valorização</em>
          </Reveal>
          <Reveal as="p" delay={2} className="sub">
            Recanto de Mandacaru — um loteamento planejado para quem busca segurança, organização e
            crescimento.
          </Reveal>
          <Reveal className="hero-ctas" delay={3}>
            <a
              href={WHATSAPP_URL_RECANTO}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn-primary"
            >
              Falar no WhatsApp <span className="arrow">→</span>
            </a>
            <Link href="/contato" className="site-btn site-btn-ghost">
              Solicitar informações
            </Link>
          </Reveal>
        </div>
        <div className="recanto-meta-bar">
          <div>
            Localização<b>CE-189, Crateús</b>
          </div>
          <div>
            Tipologia<b>Loteamento</b>
          </div>
          <div>
            Lotes<b>154</b>
          </div>
          <div>
            Status<b>Lançamento</b>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap recanto-about">
          <Reveal className="recanto-about-img">
            <Image
              src="/site/images/recanto-about.jpg"
              alt=""
              width={900}
              height={1100}
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Reveal>
          <Reveal delay={1}>
            <div className="eyebrow">Sobre o projeto</div>
            <h2 className="section-title">
              Um loteamento pensado para o <em>futuro</em>
            </h2>
            <p className="lead" style={{ marginTop: 24 }}>
              Localizado às margens da CE-189, em Crateús, o Recanto de Mandacaru foi desenvolvido com foco em
              organização, acessibilidade e valorização.
            </p>
            <p className="lead" style={{ marginTop: 20 }}>
              Cada detalhe foi planejado para oferecer uma base sólida tanto para construção quanto
              para investimento.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="benefits">
        <div className="wrap">
          <div className="diff-head">
            <Reveal>
              <div className="eyebrow">Benefícios</div>
              <h2 className="section-title">
                Por que investir no <em>Recanto</em>
              </h2>
            </Reveal>
          </div>
          <div className="benefits-grid">
            {[
              {
                num: '01',
                title: 'Região em crescimento',
                desc: 'Área com expansão e potencial de valorização contínua, dentro do plano de desenvolvimento da região.',
                first: true,
              },
              {
                num: '02',
                title: 'Facilidade de acesso',
                desc: 'Localização estratégica às margens da CE-189, com vias de fácil conexão aos principais pontos da cidade.',
                first: false,
              },
              {
                num: '03',
                title: 'Planejamento urbano',
                desc: 'Distribuição organizada dos lotes, com respiros e áreas comuns pensadas para a vida cotidiana.',
                first: false,
              },
              {
                num: '04',
                title: 'Excelente custo-benefício',
                desc: 'Uma oportunidade acessível com visão de longo prazo, tanto para investir quanto para construir.',
                first: false,
              },
            ].map((b, i) => (
              <Reveal
                key={b.num}
                className="benefit"
                delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
                style={{
                  paddingLeft: 32,
                  borderLeft: b.first ? '1px solid rgba(255,255,255,.1)' : undefined,
                }}
              >
                <div className="benefit-num">{b.num}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" id="localizacao">
        <div className="wrap local">
          <Reveal>
            <div className="eyebrow">Localização</div>
            <h2 className="section-title">
              Localização <em>estratégica</em>
            </h2>
            <p className="lead" style={{ marginTop: 24 }}>
              Situado às margens da CE-189, em Crateús, o empreendimento oferece acesso facilitado e está
              inserido em uma região com crescimento constante.
            </p>
            <div
              style={{
                marginTop: 48,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
                maxWidth: 480,
              }}
            >
              <div style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 8,
                  }}
                >
                  Cidade
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink)' }}>
                  Crateús
                </div>
              </div>
              <div style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 8,
                  }}
                >
                  Estado
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink)' }}>
                  Ceará
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal className="map" delay={1}>
            <svg viewBox="0 0 400 400" preserveAspectRatio="none" style={{ opacity: 0.25 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#93BFE2" strokeWidth=".5" />
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
              <path
                d="M0 200 Q100 180 200 200 T400 220"
                fill="none"
                stroke="#C6A15B"
                strokeWidth="1.5"
                opacity=".6"
              />
              <path
                d="M0 280 Q120 260 200 290 T400 270"
                fill="none"
                stroke="#93BFE2"
                strokeWidth="1"
                opacity=".4"
              />
              <path
                d="M180 0 Q200 100 220 200 T240 400"
                fill="none"
                stroke="#93BFE2"
                strokeWidth="1"
                opacity=".4"
              />
            </svg>
            <div className="map-pin">
              <div className="map-pin-label">Recanto de Mandacaru</div>
              <div className="map-pin-dot" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="gallery" id="galeria" style={{ background: 'var(--paper-2)', padding: '140px 0' }}>
        <div className="gallery-head">
          <Reveal className="eyebrow">Galeria</Reveal>
          <Reveal as="h2" delay={1} className="section-title">
            Visualize o <em>potencial</em> do projeto
          </Reveal>
        </div>
        <GalleryTrack>
          {[
            { src: '/site/images/mandacaru-1.jpeg', cap: '01 / Recanto de Mandacaru' },
            { src: '/site/images/mandacaru-2.jpeg', cap: '02 / Recanto de Mandacaru' },
            { src: '/site/images/mandacaru-3.jpeg', cap: '03 / Recanto de Mandacaru' },
            { src: '/site/images/mandacaru-4.jpeg', cap: '04 / Recanto de Mandacaru' },
          ].map((g, i) => (
            <div key={i} className="gallery-item">
              <Image src={g.src} alt={g.cap} width={1024} height={768} sizes="80vw" />
              <div className="gallery-item-cap">{g.cap}</div>
            </div>
          ))}
        </GalleryTrack>
      </section>

      <section className="cta-final">
        <div className="cta-final-inner">
          <Reveal className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>
            Garanta sua oportunidade
          </Reveal>
          <Reveal as="h2" delay={1}>
            Garanta sua <em>oportunidade</em>
          </Reveal>
          <Reveal as="p" delay={2}>
            Entre em contato agora e descubra as condições disponíveis para o Recanto de Mandacaru.
          </Reveal>
          <Reveal className="hero-ctas" delay={3} style={{ justifyContent: 'center' }}>
            <a
              href={WHATSAPP_URL_RECANTO}
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
