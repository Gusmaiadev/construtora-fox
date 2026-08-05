import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/components/site/JsonLd';

/** O painel e a API não têm nada a indexar e expõem rotas internas. */
const DISALLOW = ['/admin', '/admin/', '/api/'];

/**
 * Crawlers de IA declarados explicitamente.
 *
 * Eles já passariam pela regra `*`, mas nomear cada um deixa a intenção
 * registrada: se a política padrão de algum deles mudar, ou se a regra geral
 * for endurecida um dia, o acesso continua liberado de propósito.
 *
 * Cobre tanto os bots de treinamento (GPTBot, ClaudeBot, Google-Extended)
 * quanto os de busca em tempo real (OAI-SearchBot, PerplexityBot), porque
 * aparecer na resposta da IA depende dos dois caminhos.
 */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'CCBot',
  'YouBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
