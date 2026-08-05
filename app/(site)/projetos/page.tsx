import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';
import { Marquee } from '@/components/site/Marquee';

export const metadata = { title: 'Projetos' };

const OBRA_1 = Array.from({ length: 6 }, (_, i) => `/site/images/obra-1/img${i + 1}.jpg`);
const OBRA_3 = Array.from({ length: 8 }, (_, i) => `/site/images/obra-3/img${i + 1}.jpg`);

export default function ProjetosPage() {
  return (
    <main>
      <section className="proj-hero">
        <div>
          <Reveal className="hero-eyebrow">Portfólio · Construtora Fox</Reveal>
          <Reveal as="h1" delay={1}>
            Projetos que acompanham
            <br />o <em>crescimento</em> das regiões
            <br />
            onde estão inseridos
          </Reveal>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap">
          <div className="proj-grid">
            <Reveal as="article" className="proj-card">
              <div className="proj-card-img">
                <Image
                  src="/site/images/mandacaru-5.jpg"
                  alt="Recanto de Mandacaru"
                  width={1254}
                  height={1254}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className="proj-card-status">Lançamento 2026</div>
              </div>
              <div className="proj-card-body">
                <div className="proj-card-loc">CE-189 · Crateús, Ceará</div>
                <h3>Recanto de Mandacaru</h3>
                <p>
                  Um loteamento planejado com foco em valorização e organização urbana, em uma
                  região com expansão constante.
                </p>
                <div className="proj-card-meta">
                  <div>
                    <b>154</b>
                    <span>Lotes</span>
                  </div>
                  <div>
                    <b>Crateús</b>
                    <span>Localização</span>
                  </div>
                  <div>
                    <b>Loteamento</b>
                    <span>Tipologia</span>
                  </div>
                </div>
                <div>
                  <Link
                    href="/projetos/recanto-de-mandacaru"
                    className="site-btn site-btn-outline-dark"
                  >
                    Explorar projeto <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="obras">
        <div className="obras-head">
          <Reveal className="eyebrow">Obras</Reveal>
          <Reveal as="h2" delay={1} className="section-title">
            Registros das nossas <em>obras</em>
          </Reveal>
        </div>

        <div className="obras-row">
          <Marquee images={OBRA_1} alt="Obra 1" duration={45} />
        </div>

        <div className="obras-row">
          <Marquee images={OBRA_3} alt="Obra 3" duration={55} reverse />
        </div>
      </section>
    </main>
  );
}
