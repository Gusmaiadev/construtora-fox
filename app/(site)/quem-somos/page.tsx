import Image from 'next/image';
import { Reveal } from '@/components/site/Reveal';

export const metadata = { title: 'Quem Somos' };

export default function QuemSomosPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="about-hero-inner">
          <Reveal className="hero-eyebrow">Quem Somos</Reveal>
          <Reveal as="h1" delay={1}>
            Compromisso com qualidade e visão de <em>longo prazo</em>
          </Reveal>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap about-text">
          <Reveal style={{ position: 'relative' }}>
            <div className="manifesto-img">
              <Image
                src="/site/images/manifesto.jpg"
                alt=""
                width={900}
                height={1100}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p>
              A Construtora Fox nasceu da convicção de que cada empreendimento deve refletir{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
                propósito, planejamento e qualidade
              </em>{' '}
              em todas as etapas — do estudo da região à entrega final.
            </p>
            <p>
              Atuamos no desenvolvimento de projetos cuidadosamente desenhados para gerar valor
              real, organização urbana e oportunidades de crescimento sólido para quem investe e
              para quem escolhe construir conosco.
            </p>
            <p>
              Nosso compromisso vai além da construção: entregamos{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>segurança</em> para quem
              investe,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>qualidade</em> para quem
              constrói e{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>visão</em> para quem
              acredita no futuro.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="site-section values">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Valores</div>
            <h2 className="section-title">
              Os <em>princípios</em> que guiam
              <br />
              cada decisão.
            </h2>
          </Reveal>
          <div className="values-grid">
            {[
              { num: '01', title: 'Compromisso', desc: 'Entrega alinhada com o que é prometido — do primeiro contato ao pós-venda.' },
              { num: '02', title: 'Planejamento', desc: 'Cada projeto nasce com visão estratégica e estudo aprofundado da região.' },
              { num: '03', title: 'Transparência', desc: 'Relacionamento direto e claro com o cliente em todas as etapas do investimento.' },
            ].map((v, i) => (
              <Reveal key={v.num} className="value" delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                <div className="value-num">{v.num}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
