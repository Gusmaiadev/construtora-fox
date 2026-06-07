import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';

export const metadata = { title: 'Projetos' };

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
                  src="/site/images/recanto-feature.jpg"
                  alt="Recanto de Mandacaru"
                  width={900}
                  height={720}
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
    </main>
  );
}
