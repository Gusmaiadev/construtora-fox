import {
  CITY,
  COMPANY,
  INSTAGRAM_URL,
  LOCATION,
  STATE,
  WHATSAPP_PHONE,
} from '@/lib/site-constants';

export const SITE_URL = 'https://www.construtorafox.com.br';

/**
 * Injeta um bloco JSON-LD. O conteúdo vem das nossas constantes, nunca de
 * input externo — ainda assim escapamos `<`, `>` e `&`, porque um `</script>`
 * dentro de uma string fecharia a tag e permitiria injeção de markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** Identidade da empresa — base do painel de conhecimento e do SEO local. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY,
    url: SITE_URL,
    logo: `${SITE_URL}/site/images/logo-fox.png`,
    image: `${SITE_URL}/site/images/home-hero.jpg`,
    description:
      'Construtora no Ceará especializada em construção de casas, reformas residenciais e comerciais, ampliações, obras industriais e gerenciamento de obras.',
    telephone: WHATSAPP_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: LOCATION.split('—')[0]?.trim(),
      addressLocality: CITY,
      addressRegion: 'CE',
      addressCountry: 'BR',
    },
    areaServed: {
      '@type': 'State',
      name: STATE,
    },
    sameAs: [INSTAGRAM_URL],
    knowsLanguage: 'pt-BR',
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  areaName: string;
  areaType: 'City' | 'State';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    serviceType: opts.name,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': opts.areaType, name: opts.areaName },
  };
}
