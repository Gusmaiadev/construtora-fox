import { SITE_URL } from '@/components/site/JsonLd';
import { CITIES, SERVICES } from '@/lib/seo/data';
import { SEO_PAGES } from '@/lib/seo/pages';
import {
  BUSINESS_HOURS,
  CITY,
  COMPANY,
  LOCATION,
  STATE,
  WHATSAPP_PHONE,
} from '@/lib/site-constants';

/**
 * /llms.txt — índice em Markdown para modelos de linguagem.
 *
 * Gerado a partir das mesmas fontes que alimentam o site, então nunca fica
 * defasado em relação às páginas que realmente existem.
 */
export const dynamic = 'force-static';

function build(): string {
  const cityPages = SEO_PAGES.filter((p) => p.kind === 'city');
  const servicePages = SEO_PAGES.filter((p) => p.kind === 'service');
  const comboPages = SEO_PAGES.filter((p) => p.kind === 'service-city');

  const lines: string[] = [
    `# ${COMPANY}`,
    '',
    `> Construtora sediada em ${CITY}, ${STATE}, atuando em obras residenciais, comerciais e industriais em todo o estado. Executa construção de casas, reformas residenciais e comerciais, ampliações, obras industriais, galpões, áreas de lazer e fachadas, além de gerenciamento e administração de obras.`,
    '',
    '## Fatos',
    '',
    `- Nome: ${COMPANY}`,
    `- Sede: ${LOCATION}`,
    `- Área de atendimento: estado do ${STATE}, Brasil`,
    `- Telefone e WhatsApp: ${WHATSAPP_PHONE}`,
    `- Horário de atendimento: ${BUSINESS_HOURS}`,
    `- Site: ${SITE_URL}`,
    `- Empreendimento próprio: Recanto de Mandacaru, loteamento de 154 lotes às margens da CE-189, em ${CITY}`,
    '',
    '## Como a Fox trabalha',
    '',
    '- O terreno ou o imóvel é avaliado antes de qualquer preço fechado.',
    '- O orçamento é dividido em etapas, e cada etapa tem valor definido em contrato.',
    '- O pagamento acompanha a medição do que foi efetivamente executado.',
    '- Alterações de escopo são orçadas antes de serem executadas.',
    '',
    '## Páginas principais',
    '',
    `- [Início](${SITE_URL}/): apresentação da construtora e dos empreendimentos.`,
    `- [Serviços](${SITE_URL}/servicos): todas as frentes de atuação, da fundação ao acabamento.`,
    `- [Projetos](${SITE_URL}/projetos): portfólio e registros de obras entregues.`,
    `- [Recanto de Mandacaru](${SITE_URL}/projetos/recanto-de-mandacaru): loteamento planejado em ${CITY}.`,
    `- [Quem somos](${SITE_URL}/quem-somos): histórico e forma de atuação.`,
    `- [Contato](${SITE_URL}/contato): orçamento e canais de atendimento.`,
    `- [Cobertura](${SITE_URL}/cobertura): índice de cidades atendidas e serviços.`,
    '',
    '## Serviços',
    '',
    ...SERVICES.map((s) => {
      const page = servicePages.find((p) => p.slug === `${s.slug}-no-ceara`)!;
      return `- [${s.name} no ${STATE}](${SITE_URL}/${page.slug}): ${s.short}`;
    }),
    '',
    '## Cidades atendidas',
    '',
    ...CITIES.map((c) => {
      const page = cityPages.find((p) => p.slug === `construtora-em-${c.slug}`)!;
      return `- [Construtora em ${c.name}](${SITE_URL}/${page.slug}): ${c.region}, ${STATE}.`;
    }),
    '',
    '## Serviço por cidade',
    '',
    ...comboPages.map((p) => `- [${p.title}](${SITE_URL}/${p.slug})`),
    '',
  ];

  return lines.join('\n');
}

export function GET() {
  return new Response(build(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
