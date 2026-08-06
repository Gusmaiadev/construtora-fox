import type { MetadataRoute } from 'next';
import { SEO_PAGES } from '@/lib/seo/pages';
import { SITE_URL } from '@/components/site/JsonLd';

/** Páginas institucionais, com prioridade acima das landings de SEO. */
const CORE: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, freq: 'monthly' },
  { path: '/servicos', priority: 0.9, freq: 'monthly' },
  { path: '/projetos', priority: 0.9, freq: 'monthly' },
  { path: '/projetos/recanto-de-mandacaru', priority: 0.8, freq: 'monthly' },
  { path: '/quem-somos', priority: 0.7, freq: 'yearly' },
  { path: '/contato', priority: 0.7, freq: 'yearly' },
  { path: '/cobertura', priority: 0.6, freq: 'monthly' },
  { path: '/politica-de-cookies', priority: 0.2, freq: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...CORE.map((c) => ({
      url: `${SITE_URL}${c.path}`,
      lastModified,
      changeFrequency: c.freq,
      priority: c.priority,
    })),
    ...SEO_PAGES.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      // Cidade acima de serviço-cidade: é a busca de maior volume.
      priority: p.kind === 'city' ? 0.6 : 0.5,
    })),
  ];
}
