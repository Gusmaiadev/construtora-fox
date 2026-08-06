import Link from 'next/link';
import { SiteNav } from '@/components/site/SiteNav';
import { SiteFooter } from '@/components/site/SiteFooter';
import { WhatsAppFloat } from '@/components/site/WhatsAppFloat';
import { SiteBodyClass } from '@/components/site/SiteBodyClass';
import { WHATSAPP_URL } from '@/lib/site-constants';

const DESTINOS = [
  { href: '/', label: 'Início' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/cobertura', label: 'Onde atendemos' },
  { href: '/contato', label: 'Contato' },
];

export default function NotFound() {
  return (
    <>
      <SiteBodyClass />
      <SiteNav />
      <main className="nf">
        {/* Malha de planta baixa: mesmo motivo do mapa do Recanto. */}
        <svg className="nf-grid" aria-hidden="true">
          <defs>
            <pattern id="nf-mesh" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0 L0 0 0 48" fill="none" stroke="#93BFE2" strokeWidth=".6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nf-mesh)" />
        </svg>

        <div className="nf-inner">
          <p className="nf-eyebrow">Erro 404</p>

          {/* O número é a peça desenhada; as cotas medem o que não existe. */}
          <div className="nf-plate">
            <span className="nf-num">404</span>
            {/* O SVG fica absoluto: com viewBox e altura fixa ele imporia
                400px de largura à prancha e a cota ficaria maior que o
                número que ela mede. */}
            <span className="nf-dimwrap">
              <svg className="nf-dim" viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true">
                <path className="nf-ext" d="M6 0 V26" />
                <path className="nf-ext nf-ext-2" d="M394 0 V26" />
                <path className="nf-line" d="M6 15 H394" />
                <path className="nf-tick" d="M6 15 l11 -5 v10 Z" />
                <path className="nf-tick nf-tick-2" d="M394 15 l-11 -5 v10 Z" />
              </svg>
            </span>
            <span className="nf-label">0,00 m</span>
          </div>

          <h1 className="nf-title">
            Este endereço não <em>existe</em>
          </h1>
          <p className="nf-text">
            O link pode estar desatualizado ou ter sido digitado errado. Escolha por onde seguir:
          </p>

          <nav className="nf-links" aria-label="Páginas do site">
            {DESTINOS.map((d) => (
              <Link key={d.href} href={d.href}>
                {d.label}
              </Link>
            ))}
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-btn site-btn-primary nf-cta"
          >
            Falar no WhatsApp <span className="arrow">→</span>
          </a>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
