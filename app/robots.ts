import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/components/site/JsonLd';

/**
 * `/admin` NÃO entra aqui de propósito.
 *
 * robots.txt é público: listar o painel apenas anuncia onde ele fica. E
 * `Disallow` bloqueia rastreamento, não indexação — uma URL bloqueada ainda
 * pode aparecer na busca se alguém linkar para ela, e o `noindex` nunca é
 * lido justamente porque o robô foi proibido de entrar.
 *
 * O painel é mantido fora do índice pelo cabeçalho `X-Robots-Tag: noindex`
 * definido em next.config.mjs, que não é público e é respeitado de verdade.
 */
const DISALLOW = ['/api/'];

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
