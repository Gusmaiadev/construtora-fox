'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { INSTAGRAM_URL, WHATSAPP_URL } from '@/lib/site-constants';

const LINKS: { href: string; label: string; matches?: string[] }[] = [
  { href: '/', label: 'Home' },
  {
    href: '/projetos',
    label: 'Projetos',
    matches: ['/projetos', '/projetos/recanto-de-mandacaru'],
  },
  { href: '/servicos', label: 'Serviços' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/contato', label: 'Contato' },
];

const DARK_HERO_PATHS = ['/', '/projetos', '/projetos/recanto-de-mandacaru', '/servicos', '/quem-somos'];

function isLinkActive(href: string, pathname: string, matches?: string[]): boolean {
  if (matches) return matches.includes(pathname);
  return pathname === href;
}

export function SiteNav() {
  const pathname = usePathname() ?? '/';
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDarkHero = DARK_HERO_PATHS.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      <nav
        className={`nav${isDarkHero ? ' dark' : ''}${scrolled ? ' scrolled' : ''}`}
        aria-label="Navegação principal"
      >
        <Link href="/" className="nav-brand" aria-label="Construtora Fox">
          <Image
            src="/site/images/logo-fox.png"
            alt="Construtora Fox"
            width={54}
            height={54}
            priority
          />
        </Link>

        <div className="nav-links">
          <Link href="/" className={isLinkActive('/', pathname) ? 'active' : undefined}>
            Home
          </Link>
          <div className="nav-item">
            <Link
              href="/projetos"
              className={
                isLinkActive('/projetos', pathname, [
                  '/projetos',
                  '/projetos/recanto-de-mandacaru',
                ])
                  ? 'active'
                  : undefined
              }
            >
              Projetos<span className="caret">▾</span>
            </Link>
            <div className="nav-dropdown">
              <div className="dd-eyebrow">Empreendimentos</div>
              <Link href="/projetos">Todos os projetos</Link>
              <Link href="/projetos/recanto-de-mandacaru">Recanto de Mandacaru</Link>
            </div>
          </div>
          <Link
            href="/servicos"
            className={isLinkActive('/servicos', pathname) ? 'active' : undefined}
          >
            Serviços
          </Link>
          <Link
            href="/quem-somos"
            className={isLinkActive('/quem-somos', pathname) ? 'active' : undefined}
          >
            Quem Somos
          </Link>
          <Link
            href="/contato"
            className={isLinkActive('/contato', pathname) ? 'active' : undefined}
          >
            Contato
          </Link>
        </div>

        <div className="nav-right">
          <div className="nav-social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
              </svg>
            </a>
          </div>
          <a
            href={WHATSAPP_URL}
            className="nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <button
            className={`nav-burger${drawerOpen ? ' open' : ''}`}
            aria-label="Menu"
            onClick={() => setDrawerOpen((v) => !v)}
            type="button"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div
        className={`drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      <aside className={`mobile-drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        <Link href="/" className={`m-link${isLinkActive('/', pathname) ? ' active' : ''}`}>
          Home
        </Link>
        <Link
          href="/projetos"
          className={`m-link${pathname === '/projetos' ? ' active' : ''}`}
        >
          Projetos
        </Link>
        <Link
          href="/projetos/recanto-de-mandacaru"
          className={`m-link${pathname === '/projetos/recanto-de-mandacaru' ? ' active' : ''}`}
          style={{ fontSize: 20, paddingLeft: 18, opacity: 0.85 }}
        >
          — Recanto de Mandacaru
        </Link>
        <Link
          href="/servicos"
          className={`m-link${isLinkActive('/servicos', pathname) ? ' active' : ''}`}
        >
          Serviços
        </Link>
        <Link
          href="/quem-somos"
          className={`m-link${isLinkActive('/quem-somos', pathname) ? ' active' : ''}`}
        >
          Quem Somos
        </Link>
        <Link
          href="/contato"
          className={`m-link${isLinkActive('/contato', pathname) ? ' active' : ''}`}
        >
          Contato
        </Link>
        <div className="m-foot">
          <div className="m-eyebrow">Conecte-se</div>
          <div className="m-social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
              </svg>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="m-cta">
            Falar no WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
