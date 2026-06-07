import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';
import { ParallaxImage } from '@/components/site/ParallaxImage';
import { WHATSAPP_URL } from '@/lib/site-constants';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-bg">
          <ParallaxImage src="/site/images/home-hero.jpg" alt="" priority />
        </div>
        <div className="hero-inner">
          <Reveal className="hero-eyebrow">Construtora Fox · Ceará · Desde 2015</Reveal>
          <Reveal as="h1" delay={1}>
            Investimentos <em>inteligentes</em> começam com decisões bem construídas.
          </Reveal>
          <Reveal as="p" delay={2} className="sub">
            A Construtora Fox desenvolve projetos no Ceará com foco em valorização real,
            planejamento estratégico e qualidade que se mantém ao longo do tempo.
          </Reveal>
          <Reveal className="hero-ctas" delay={3}>
            <Link href="/projetos/recanto-de-mandacaru" className="site-btn site-btn-primary">
              Conhecer empreendimento <span className="arrow">→</span>
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn-ghost"
            >
              Falar no WhatsApp
            </a>
          </Reveal>
        </div>
        <Reveal className="hero-meta" delay={4}>
          <div>
            Em destaque<b>01</b>
          </div>
          <div>
            Empreendimento<b>Recanto</b>
          </div>
        </Reveal>
        <div className="scroll-cue">Role para descobrir</div>
      </section>

      <section className="site-section">
        <div className="wrap position">
          <Reveal className="position-text">
            <div className="eyebrow">Posicionamento</div>
            <h2 className="section-title">
              Construção com propósito.
              <br />
              <em>Investimento</em> com visão.
            </h2>
            <p className="lead">
              A Construtora Fox atua no desenvolvimento de empreendimentos planejados que unem
              organização urbana, localização estratégica e alto potencial de valorização.
            </p>
            <p className="lead">
              Mais do que construir, entregamos projetos pensados para gerar segurança e retorno a
              longo prazo.
            </p>
          </Reveal>
          <Reveal className="position-img" delay={2}>
            <Image
              src="/site/images/home-posicionamento.jpg"
              alt=""
              width={900}
              height={1100}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="feature" style={{ padding: 0 }}>
        <div className="feature-inner">
          <Reveal className="feature-img">
            <Image
              src="/site/images/mandacaru-5.png"
              alt="Recanto de Mandacaru"
              width={1254}
              height={1254}
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="feature-img-meta">
              <span>
                <i></i>Crateús · Ceará
              </span>
              <span>Loteamento planejado</span>
            </div>
          </Reveal>
          <Reveal className="feature-text" delay={2}>
            <div className="eyebrow">Empreendimento em destaque</div>
            <h2>
              Recanto de <em>Mandacaru</em>
            </h2>
            <p className="sub">
              Um loteamento planejado às margens da CE-189, em Crateús, ideal para quem busca investir com
              segurança e visão de futuro.
            </p>
            <p>
              Com localização estratégica e estrutura pensada para crescimento, o Recanto de
              Mandacaru representa uma oportunidade sólida para quem deseja construir ou investir
              em uma região com alto potencial de valorização.
            </p>
            <div className="feature-stats">
              <div>
                <b>154</b>
                <span>Lotes planejados</span>
              </div>
              <div>
                <b>100%</b>
                <span>Infraestrutura</span>
              </div>
              <div>
                <b>2026</b>
                <span>Lançamento</span>
              </div>
            </div>
            <div>
              <Link
                href="/projetos/recanto-de-mandacaru"
                className="site-btn site-btn-primary"
              >
                Ver detalhes do projeto <span className="arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="site-section diff">
        <div className="wrap">
          <div className="diff-head">
            <Reveal>
              <div className="eyebrow">Diferenciais</div>
              <h2 className="section-title">
                Por que escolher a <em>Construtora Fox</em>
              </h2>
            </Reveal>
            <Reveal as="p" delay={1} className="lead">
              Quatro pilares que definem nossa forma de construir e de cuidar do investimento de
              quem confia em nós.
            </Reveal>
          </div>
          <div className="diff-grid">
            {[
              {
                num: '01',
                title: 'Localização estratégica',
                desc: 'Projetos posicionados em regiões com crescimento planejado e expansão urbana consistente.',
                icon: (
                  <svg viewBox="0 0 44 44">
                    <path d="M22 6c-6 0-11 4.5-11 11 0 7.5 11 21 11 21s11-13.5 11-21c0-6.5-5-11-11-11z" />
                    <circle cx="22" cy="17" r="4" />
                  </svg>
                ),
              },
              {
                num: '02',
                title: 'Valorização consistente',
                desc: 'Empreendimentos pensados para retorno ao longo do tempo, com curva de valor previsível.',
                icon: (
                  <svg viewBox="0 0 44 44">
                    <path d="M8 32l8-10 7 6 13-16M30 12h6v6" />
                  </svg>
                ),
              },
              {
                num: '03',
                title: 'Planejamento inteligente',
                desc: 'Organização urbana e distribuição eficiente dos espaços, com rotas e respiros bem desenhados.',
                icon: (
                  <svg viewBox="0 0 44 44">
                    <rect x="8" y="8" width="12" height="12" />
                    <rect x="24" y="8" width="12" height="12" />
                    <rect x="8" y="24" width="12" height="12" />
                    <rect x="24" y="24" width="12" height="12" />
                  </svg>
                ),
              },
              {
                num: '04',
                title: 'Segurança no investimento',
                desc: 'Processos claros, documentação transparente e foco total na confiança do cliente em cada etapa.',
                icon: (
                  <svg viewBox="0 0 44 44">
                    <path d="M22 6l14 6v10c0 9-6 14-14 16-8-2-14-7-14-16V12l14-6z" />
                    <path d="M16 22l4 4 8-8" />
                  </svg>
                ),
              },
            ].map((card, i) => (
              <Reveal key={card.num} className="diff-card" delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                <div className="diff-num">{card.num}</div>
                <div className="diff-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </Reveal>
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
            Dê o próximo passo
            <br />
            com <em>segurança</em>
          </Reveal>
          <Reveal as="p" delay={2}>
            Fale diretamente com nossa equipe e descubra as melhores oportunidades disponíveis no
            Ceará.
          </Reveal>
          <Reveal delay={3}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn-primary"
            >
              Falar no WhatsApp <span className="arrow">→</span>
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
