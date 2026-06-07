import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';
import { ParallaxImage } from '@/components/site/ParallaxImage';
import { WHATSAPP_URL } from '@/lib/site-constants';

export const metadata = {
  title: 'Serviços',
  description:
    'Soluções completas em construção, engenharia e desenvolvimento imobiliário. 40+ frentes de atuação com qualidade técnica integral.',
};

const SERV_PRINCIPAIS = [
  { num: '01', title: 'Construção de Casas', desc: 'Projetos residenciais executados com alto padrão de acabamento, planejamento eficiente e atenção aos detalhes construtivos.', img: '/site/images/servicos-01-casas.jpg' },
  { num: '02', title: 'Reformas Residenciais', desc: 'Modernização de ambientes com soluções inteligentes, acabamento refinado e execução organizada.', img: '/site/images/servicos-04-reformas-residenciais.jpg' },
  { num: '03', title: 'Reformas Comerciais', desc: 'Reformas planejadas para melhorar a experiência do cliente e valorizar espaços comerciais.', img: '/site/images/servicos-05-reformas-comerciais.jpg' },
  { num: '04', title: 'Ampliações de Imóveis', desc: 'Projetos de expansão executados com integração estrutural e harmonia arquitetônica.', img: '/site/images/servicos-06-ampliacoes.jpg' },
  { num: '05', title: 'Obras Industriais', desc: 'Execução de estruturas industriais com foco em desempenho, logística e durabilidade.', img: '/site/images/servicos-08-industriais.jpg' },
  { num: '06', title: 'Gerenciamento de Obras', desc: 'Controle técnico e operacional para garantir eficiência, cronograma e qualidade na execução.', img: '/site/images/servicos-09-gerenciamento.jpg' },
  { num: '07', title: 'Administração de Obras', desc: 'Gestão completa de fornecedores, equipes, materiais e processos construtivos.', img: '/site/images/servicos-10-administracao.jpg' },
  { num: '08', title: 'Construção Personalizada', desc: 'Projetos sob medida que traduzem o estilo e as necessidades específicas de cada cliente.', img: '/site/images/servicos-11-personalizadas.jpg' },
  { num: '09', title: 'Lojas e Pontos Comerciais', desc: 'Construção de espaços comerciais que valorizam identidade visual e experiência do cliente.', img: '/site/images/servicos-12-comerciais-pontos.jpg' },
];

const EXEC_ITEMS = [
  { num: '01', title: 'Terraplanagem', desc: 'Preparação técnica do terreno para garantir estabilidade e segurança da obra.' },
  { num: '02', title: 'Fundação e Estrutura', desc: 'Execução estrutural com precisão técnica e materiais de alta qualidade.' },
  { num: '03', title: 'Acabamentos', desc: 'Detalhes que elevam o padrão visual e funcional do projeto.' },
  { num: '04', title: 'Instalações Elétricas', desc: 'Execução técnica segura e organizada.' },
  { num: '05', title: 'Instalações Hidráulicas', desc: 'Infraestrutura hidráulica eficiente e durável.' },
  { num: '06', title: 'Pisos e Revestimentos', desc: 'Aplicação refinada com acabamento de alto padrão.' },
  { num: '07', title: 'Pintura Interna e Externa', desc: 'Acabamentos que valorizam estética e proteção.' },
  { num: '08', title: 'Impermeabilização', desc: 'Proteção estrutural contra infiltrações e desgaste.' },
];

const GRANDES = [
  { num: '01 / Turnkey', title: 'Obras Turnkey', desc: 'Execução completa do projeto à entrega final, com gerenciamento integral da obra.' },
  { num: '02 / Incorporação', title: 'Incorporação Imobiliária', desc: 'Desenvolvimento de empreendimentos com visão estratégica e potencial de valorização.' },
  { num: '03 / Galpões', title: 'Construção de Galpões', desc: 'Estruturas industriais e logísticas com foco em eficiência operacional.' },
  { num: '04 / Lazer', title: 'Construção de Áreas de Lazer', desc: 'Espaços planejados para convivência, conforto e valorização do empreendimento.' },
  { num: '05 / Fachadas', title: 'Construção de Fachadas Comerciais', desc: 'Projetos modernos que fortalecem presença visual e identidade comercial.' },
  { num: '06 / Educacional', title: 'Obras Educacionais', desc: 'Escolas e centros de ensino com infraestrutura segura e funcional.' },
  { num: '07 / Saúde', title: 'Obras Hospitalares', desc: 'Clínicas e hospitais construídos sob normas técnicas e sanitárias rigorosas.' },
];

export default function ServicosPage() {
  return (
    <main>
      <section className="serv-hero">
        <div className="serv-hero-bg">
          <ParallaxImage src="/site/images/servicos-hero.jpg" alt="" factor={0.4} priority />
        </div>
        <div className="serv-hero-inner">
          <Reveal className="hero-eyebrow">Serviços · Construtora Fox</Reveal>
          <Reveal as="h1" delay={1}>
            Soluções completas em construção, engenharia e{' '}
            <em>desenvolvimento imobiliário</em>
          </Reveal>
          <Reveal as="p" delay={2} className="sub">
            Da fundação ao acabamento, a Construtora Fox executa projetos com planejamento,
            qualidade técnica e alto padrão de execução.
          </Reveal>
          <Reveal className="hero-ctas" delay={3}>
            <Link href="/contato" className="site-btn site-btn-primary">
              Solicitar orçamento <span className="arrow">→</span>
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
        <Reveal className="serv-hero-stats" delay={4}>
          <div>
            Frentes de atuação<b>20+</b>
          </div>
          <div>
            Capacidade técnica<b>Integral</b>
          </div>
        </Reveal>
      </section>

      <section className="serv-intro">
        <div className="wrap">
          <Reveal className="eyebrow" style={{ justifyContent: 'center' }}>
            Introdução
          </Reveal>
          <Reveal as="h2" delay={1}>
            Experiência técnica aplicada em <em>cada etapa</em> da obra
          </Reveal>
          <Reveal as="p" delay={2}>
            A Construtora Fox atua em projetos residenciais, comerciais e corporativos oferecendo
            soluções completas em engenharia, construção e gerenciamento de obras.
          </Reveal>
          <Reveal as="p" delay={3}>
            Cada projeto é conduzido com foco em eficiência, organização e excelência nos detalhes.
          </Reveal>
        </div>
      </section>

      <section className="serv-section">
        <div className="wrap">
          <div className="serv-head">
            <Reveal>
              <div className="eyebrow">Serviços principais</div>
              <h2>
                Construção e <em>execução</em> de alto padrão
              </h2>
            </Reveal>
            <Reveal as="p" delay={1} className="lead">
              Dez frentes principais de atuação que atendem desde residências unifamiliares até
              grandes empreendimentos verticais e industriais.
            </Reveal>
          </div>
          <div className="serv-grid">
            {SERV_PRINCIPAIS.map((s, i) => (
              <Reveal
                as="article"
                key={s.num}
                className="serv-card"
                delay={(i % 3) as 0 | 1 | 2}
              >
                <div className="serv-card-img">
                  <div className="serv-card-num">{s.num}</div>
                  <Image src={s.img} alt={s.title} width={600} height={450} sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="serv-card-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="more">Saiba mais</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="serv-section">
        <div className="wrap">
          <div className="serv-head">
            <Reveal>
              <div className="eyebrow">Execução &amp; Infraestrutura</div>
              <h2>
                Engenharia executiva, do <em>terreno</em> ao acabamento
              </h2>
            </Reveal>
            <Reveal as="p" delay={1} className="lead">
              Cada etapa conduzida com técnica, organização e materiais selecionados para garantir
              performance ao longo do tempo.
            </Reveal>
          </div>
          <div className="serv-exec">
            <Reveal className="serv-exec-img">
              <div className="lead">
                <Image
                  src="/site/images/servicos-execucao.jpg"
                  alt="Projeto & Execução"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>Projeto &amp; Execução</figcaption>
              </div>
              <div>
                <Image
                  src="/site/images/exec-pisos.jpg"
                  alt="Pisos"
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 33vw, 15vw"
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>06 · Pisos</figcaption>
              </div>
              <div>
                <Image
                  src="/site/images/exec-pintura.jpg"
                  alt="Pintura"
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 33vw, 15vw"
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>07 · Pintura</figcaption>
              </div>
              <div>
                <Image
                  src="/site/images/exec-impermeabilizacao.jpg"
                  alt="Impermeabilização"
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 33vw, 15vw"
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>08 · Impermeab.</figcaption>
              </div>
            </Reveal>
            <div className="serv-exec-list">
              {EXEC_ITEMS.map((item) => (
                <Reveal key={item.num} className="serv-exec-item">
                  <div className="serv-exec-item-num">{item.num}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="serv-grandes">
        <div className="wrap">
          <div className="serv-head">
            <Reveal>
              <div className="eyebrow">Grandes projetos</div>
              <h2>
                Capacidade para <em>grandes empreendimentos</em>
              </h2>
            </Reveal>
            <Reveal as="p" delay={1} className="lead" style={{ color: 'rgba(255,255,255,.7)' }}>
              Estrutura e know-how para conduzir obras de grande porte do conceito à entrega final.
            </Reveal>
          </div>
          <div className="serv-grandes-grid">
            {GRANDES.map((g, i) => (
              <Reveal
                key={g.num}
                className="serv-grandes-card"
                delay={(i % 4) as 0 | 1 | 2 | 3}
              >
                <div className="serv-grandes-num">{g.num}</div>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="serv-cta">
        <div className="serv-cta-inner">
          <Reveal className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>
            Próximo passo
          </Reveal>
          <Reveal as="h2" delay={1}>
            Seu projeto merece execução profissional
            <br />e <em>visão estratégica</em>
          </Reveal>
          <Reveal as="p" delay={2}>
            Fale com a equipe da Construtora Fox e solicite um atendimento personalizado.
          </Reveal>
          <Reveal className="serv-cta-ctas" delay={3}>
            <Link href="/contato" className="site-btn site-btn-primary">
              Solicitar orçamento <span className="arrow">→</span>
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn-ghost"
            >
              Conversar no WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
