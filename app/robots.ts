import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/components/site/JsonLd';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // O painel e a API não têm nada a indexar e expõem rotas internas.
      disallow: ['/admin', '/admin/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
