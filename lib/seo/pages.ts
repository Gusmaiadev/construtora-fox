/**
 * As 60 páginas de SEO local: 24 por cidade, 12 por serviço no estado e
 * 24 cruzando serviço com cidade.
 *
 * Cada página é montada a partir do texto próprio da cidade e do serviço
 * (lib/seo/data.ts), então título, H1, abertura, FAQ e links internos mudam
 * de verdade entre elas.
 */
import { CITIES, CITY_BY_SLUG, SERVICES, SERVICE_BY_SLUG, type City, type Service } from './data';

export type PageKind = 'city' | 'service' | 'service-city';

export interface Faq {
  q: string;
  a: string;
}

export interface SeoPage {
  slug: string;
  kind: PageKind;
  title: string;
  metaTitle: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  body: string[];
  bullets: { title: string; desc: string }[];
  faq: Faq[];
  /** Links internos: [href, rótulo]. */
  related: { href: string; label: string }[];
  breadcrumb: string;
}

/**
 * Regiões de nome feminino — sem isso o texto sai "no Região Metropolitana".
 * São as únicas duas entre as regiões usadas.
 */
const FEMININE_REGIONS = new Set(['Região Metropolitana de Fortaleza', 'Serra da Ibiapaba']);

const isFem = (c: City) => FEMININE_REGIONS.has(c.region);
/** "no Sertão de Crateús" / "na Região Metropolitana de Fortaleza" */
const inRegion = (c: City) => `${isFem(c) ? 'na' : 'no'} ${c.region}`;
/** "do Sertão de Crateús" / "da Região Metropolitana de Fortaleza" */
const ofRegion = (c: City) => `${isFem(c) ? 'da' : 'do'} ${c.region}`;
/** "todo o Sertão de Crateús" / "toda a Região Metropolitana de Fortaleza" */
const allRegion = (c: City) => `${isFem(c) ? 'toda a' : 'todo o'} ${c.region}`;

/** Combinações serviço × cidade com intenção de busca real. */
const COMBOS: [string, string][] = [
  ['construcao-de-casas', 'crateus'],
  ['construcao-de-casas', 'fortaleza'],
  ['construcao-de-casas', 'sobral'],
  ['construcao-de-casas', 'juazeiro-do-norte'],
  ['construcao-de-casas', 'quixada'],
  ['construcao-de-casas', 'iguatu'],
  ['reformas-residenciais', 'crateus'],
  ['reformas-residenciais', 'fortaleza'],
  ['reformas-residenciais', 'sobral'],
  ['reformas-residenciais', 'juazeiro-do-norte'],
  ['reformas-comerciais', 'fortaleza'],
  ['reformas-comerciais', 'juazeiro-do-norte'],
  ['reformas-comerciais', 'crateus'],
  ['ampliacoes-de-imoveis', 'fortaleza'],
  ['ampliacoes-de-imoveis', 'crateus'],
  ['obras-industriais', 'maracanau'],
  ['obras-industriais', 'fortaleza'],
  ['construcao-de-galpoes', 'maracanau'],
  ['construcao-de-galpoes', 'pacajus'],
  ['gerenciamento-de-obras', 'fortaleza'],
  ['gerenciamento-de-obras', 'crateus'],
  ['lojas-e-pontos-comerciais', 'juazeiro-do-norte'],
  ['areas-de-lazer', 'fortaleza'],
  ['fachadas-comerciais', 'sobral'],
];

/**
 * Abertura própria de cada combinação serviço × cidade.
 *
 * Sem isso as 24 páginas começariam com o mesmo parágrafo do serviço — até
 * sete repetições do mesmo texto, que é o que caracteriza conteúdo duplicado.
 */
const COMBO_NOTES: Record<string, string> = {
  'construcao-de-casas|crateus':
    'Construir em Crateús normalmente significa construir para ficar: a maior parte das obras residenciais da cidade é para moradia da própria família, não para revenda. Isso muda a prioridade do orçamento — conforto térmico, cobertura bem executada e instalação dimensionada para o futuro valem mais que acabamento aparente.',
  'construcao-de-casas|fortaleza':
    'Construir uma casa em Fortaleza é, antes de tudo, um problema de terreno e de aprovação. Lote urbano estreito, recuo obrigatório, taxa de ocupação e vizinhança colada exigem que o projeto resolva a implantação antes de discutir planta — e que a obra funcione com canteiro mínimo.',
  'construcao-de-casas|sobral':
    'Sobral tem duas realidades para quem vai construir: o entorno do centro histórico, com restrição de gabarito e fachada, e os loteamentos em expansão, onde o terreno chega limpo e o projeto nasce sem amarras. Saber em qual delas está o lote muda o caminho da aprovação.',
  'construcao-de-casas|juazeiro-do-norte':
    'Em Juazeiro do Norte a casa própria concorre com o investimento em ponto comercial — e muita obra residencial já nasce prevendo um espaço de trabalho ou aluguel na frente do lote. Quando essa intenção entra no projeto desde o início, a estrutura e a instalação já saem preparadas.',
  'construcao-de-casas|quixada':
    'Quixadá tem uma particularidade que pesa direto no orçamento: o embasamento rochoso do Sertão Central. Sondagem antes de fechar preço não é formalidade — é o que separa uma fundação orçada corretamente de um aditivo logo na primeira semana de obra.',
  'construcao-de-casas|iguatu':
    'Iguatu concentra fornecedor de material para boa parte do centro-sul, o que dá vantagem real de logística a quem constrói na cidade. Essa vantagem só vira economia com plano de compras — comprar parcelado ao longo da obra, e não em regime de urgência.',
  'reformas-residenciais|crateus':
    'Boa parte do estoque residencial de Crateús foi construído sem projeto elétrico e hidráulico formal. Em reforma isso aparece rápido: fiação subdimensionada para o consumo de hoje e tubulação sem registro de setor. Trocar a instalação costuma ser o item que mais entrega resultado.',
  'reformas-residenciais|fortaleza':
    'Reforma em Fortaleza esbarra em regra de condomínio: horário de obra, uso de elevador, restrição a intervenção estrutural e exigência de ART. Levantar essas restrições antes do orçamento evita o cronograma que só existe no papel.',
  'reformas-residenciais|sobral':
    'Em Sobral, reforma perto da área tombada segue regra própria de fachada e cor. Já nos bairros residenciais mais recentes, a reforma típica é de ampliação de área social e atualização de instalação — dois trabalhos com natureza e custo bem diferentes.',
  'reformas-residenciais|juazeiro-do-norte':
    'O clima do Cariri, mais úmido que o restante do sertão, torna infiltração e mofo as queixas mais frequentes em reforma residencial em Juazeiro do Norte. Tratar a causa — impermeabilização e ventilação — resolve; repintar por cima só adia.',
  'reformas-comerciais|fortaleza':
    'Reforma comercial em Fortaleza acontece quase sempre com a loja vizinha aberta e o shopping ou a rua em funcionamento. Isso impõe janela de trabalho, controle de ruído e logística de entulho — restrições que precisam estar no cronograma, não na conversa de última hora.',
  'reformas-comerciais|juazeiro-do-norte':
    'O calendário comercial de Juazeiro do Norte é ditado pelas romarias. Reforma de loja entregue depois do pico perde a temporada inteira, e por isso o prazo costuma ser a cláusula mais discutida do contrato — com razão.',
  'reformas-comerciais|crateus':
    'Em Crateús, o comércio de rua concentra a atividade e a reforma acontece com o vizinho aberto e a calçada em uso. Executar por setor, com proteção de fachada e entulho retirado fora do horário de pico, é o que permite reformar sem afastar cliente.',
  'ampliacoes-de-imoveis|fortaleza':
    'Ampliar em Fortaleza esbarra em taxa de ocupação e recuo antes de esbarrar em estrutura. Muitos lotes já estão no limite do que o plano diretor permite, e a única direção possível é vertical — o que joga a discussão para a capacidade da fundação existente.',
  'ampliacoes-de-imoveis|crateus':
    'Em Crateús, o lote costuma ser generoso, então a ampliação normalmente é horizontal: área gourmet, quarto extra, garagem coberta. O ponto crítico deixa de ser o limite legal e passa a ser a amarração com a cobertura existente, onde nasce a maioria das infiltrações.',
  'obras-industriais|maracanau':
    'Maracanaú tem distrito industrial consolidado, o que significa vizinho em operação e infraestrutura já implantada. Obra ali é executada com restrição de acesso, horário de carga e coordenação com o entorno — o cronograma precisa contar com isso desde o primeiro dia.',
  'obras-industriais|fortaleza':
    'Obra industrial em Fortaleza convive com malha urbana: licenciamento mais exigente, restrição de circulação de caminhão e vizinhança residencial próxima. Ruído, poeira e horário deixam de ser detalhe operacional e viram condicionante do projeto.',
  'construcao-de-galpoes|maracanau':
    'Galpão em Maracanaú costuma nascer da necessidade de estar perto da malha logística da Grande Fortaleza. Isso puxa a discussão para pátio de manobra e docas: um galpão bem dimensionado por dentro e apertado por fora trava a operação do mesmo jeito.',
  'construcao-de-galpoes|pacajus':
    'Pacajus atrai galpão por terreno mais barato com acesso rodoviário rápido. O ganho de custo no terreno só se sustenta se a terraplanagem e a drenagem forem bem dimensionadas — área grande de cobertura concentra volume enorme de água na primeira chuva.',
  'gerenciamento-de-obras|fortaleza':
    'Em Fortaleza é comum o proprietário contratar mão de obra direto e comprar material por conta própria, buscando economia. Funciona quando existe alguém acompanhando tecnicamente; sem isso, o que se economiza na contratação costuma voltar em retrabalho e compra errada.',
  'gerenciamento-de-obras|crateus':
    'Muita obra em Crateús é tocada por proprietário que mora em outra cidade — é o caso clássico de quem constrói para voltar ou para a família. Gerenciamento existe justamente para essa situação: alguém responde tecnicamente pela obra e presta contas de longe.',
  'lojas-e-pontos-comerciais|juazeiro-do-norte':
    'Juazeiro do Norte recebe comprador de todo o Nordeste, e a loja disputa atenção numa rua cheia de concorrente direto. Fachada, vitrine e iluminação deixam de ser acabamento e passam a ser investimento comercial com retorno mensurável.',
  'areas-de-lazer|fortaleza':
    'Área de lazer em Fortaleza quase sempre é feita em espaço apertado, aproveitando o fundo do lote ou a laje. Terreno pequeno com sol forte exige sombreamento e ventilação bem resolvidos — sem isso o espaço fica bonito e inutilizável entre dez e quatro da tarde.',
  'fachadas-comerciais|sobral':
    'Em Sobral, fachada comercial no perímetro histórico segue diretriz de preservação: há limite de material, de cor e de intervenção no que é original. Verificar essa regra antes de fechar o projeto evita o retrabalho mais caro possível — refazer o que já foi instalado.',
};

/** Serviços destacados na página de cidade, como links internos. */
const HIGHLIGHT_SERVICES = [
  'construcao-de-casas',
  'reformas-residenciais',
  'reformas-comerciais',
  'ampliacoes-de-imoveis',
  'gerenciamento-de-obras',
  'construcao-personalizada',
];

function cityFaq(city: City): Faq[] {
  return [
    {
      q: `A Construtora Fox atende em ${city.name}?`,
      a: `Sim. A Fox atende ${city.name} e as demais cidades ${ofRegion(city)}, com obra residencial, comercial e industrial. O primeiro passo é uma conversa sobre o terreno ou o imóvel para entender o escopo antes de qualquer orçamento.`,
    },
    {
      q: `Quanto custa construir em ${city.name}?`,
      a: `O custo depende do tamanho, do padrão de acabamento e das condições do terreno — não existe valor por metro quadrado que sirva para todos os casos. Levantamos o lote e fechamos o orçamento por etapa, para que o preço apresentado seja o preço que vale.`,
    },
    {
      q: `Vocês cuidam da documentação e da aprovação na prefeitura?`,
      a: `Sim. Projeto, alvará e regularização entram no escopo quando a obra exige. Cada município tem exigência própria, e verificamos a de ${city.name} antes de iniciar.`,
    },
    {
      q: `Como acompanho o andamento da obra?`,
      a: `A obra é dividida em etapas medidas, com registro do que foi executado e do custo de cada frente. Você acompanha o avanço físico e financeiro sem depender de visita ao canteiro.`,
    },
  ];
}

function serviceStateFaq(service: Service): Faq[] {
  return [
    ...service.faq,
    {
      q: `A Fox faz ${service.lower} em todo o Ceará?`,
      a: `Sim. A partir de Crateús, a Construtora Fox atende obras de ${service.lower} em municípios de todo o estado, da Região Metropolitana de Fortaleza ao Cariri, ao Vale do Jaguaribe e ao sertão.`,
    },
  ];
}

function serviceCityFaq(service: Service, city: City): Faq[] {
  return [
    {
      q: `Vocês fazem ${service.lower} em ${city.name}?`,
      a: `Sim. ${service.name} é uma das frentes de atuação da Construtora Fox em ${city.name} e nas cidades ${ofRegion(city)}. O escopo é definido depois de uma visita técnica ao local.`,
    },
    ...service.faq.slice(0, 3),
  ];
}

function buildCityPage(city: City): SeoPage {
  const services = HIGHLIGHT_SERVICES.map((s) => SERVICE_BY_SLUG.get(s)!).filter(Boolean);
  return {
    slug: `construtora-em-${city.slug}`,
    kind: 'city',
    title: `Construtora em ${city.name}`,
    metaTitle: `Construtora em ${city.name} — CE`,
    description: `Construtora em ${city.name}, ${inRegion(city)}. Construção de casas, reformas, ampliações e obras comerciais com orçamento por etapa e acompanhamento técnico. Fale com a Construtora Fox.`,
    h1: `Construtora em ${city.name}`,
    eyebrow: `${city.name} · Ceará`,
    lead: `Obra residencial, comercial e industrial em ${city.name} e em ${allRegion(city)}, com projeto, execução e medição documentada.`,
    body: [
      `${city.name} é ${city.context}. A Construtora Fox atende a cidade a partir de Crateús, com a mesma estrutura técnica aplicada em obras de todo o Ceará.`,
      city.angle,
      `Seja construção do zero, reforma ou ampliação, o método é o mesmo: entender o terreno e o imóvel antes de precificar, fechar o orçamento por etapa e medir o que foi executado. É o que faz o preço combinado no início continuar valendo no fim.`,
    ],
    bullets: services.map((s) => ({ title: s.name, desc: s.short })),
    faq: cityFaq(city),
    related: [
      ...city.near.map((slug) => {
        const c = CITY_BY_SLUG.get(slug)!;
        return { href: `/construtora-em-${c.slug}`, label: `Construtora em ${c.name}` };
      }),
      ...HIGHLIGHT_SERVICES.slice(0, 4).map((slug) => {
        const s = SERVICE_BY_SLUG.get(slug)!;
        return { href: `/${s.slug}-no-ceara`, label: `${s.name} no Ceará` };
      }),
    ],
    breadcrumb: `Construtora em ${city.name}`,
  };
}

function buildServicePage(service: Service): SeoPage {
  return {
    slug: `${service.slug}-no-ceara`,
    kind: 'service',
    title: `${service.name} no Ceará`,
    metaTitle: `${service.name} no Ceará`,
    description: `${service.short} A Construtora Fox executa ${service.lower} em todo o Ceará, com orçamento por etapa, cronograma real e acompanhamento técnico. Solicite uma proposta.`,
    h1: `${service.name} no Ceará`,
    eyebrow: `Serviço · Ceará`,
    lead: service.short,
    body: [...service.intro, `A Fox atende obras de ${service.lower} em municípios de todo o estado — da Região Metropolitana de Fortaleza ao Cariri, à Ibiapaba, ao Vale do Jaguaribe e ao sertão.`],
    bullets: service.steps.map((s) => ({ title: s.title, desc: s.desc })),
    faq: serviceStateFaq(service),
    related: [
      ...COMBOS.filter(([s]) => s === service.slug)
        .slice(0, 4)
        .map(([s, c]) => {
          const city = CITY_BY_SLUG.get(c)!;
          return { href: `/${s}-em-${c}`, label: `${service.name} em ${city.name}` };
        }),
      ...SERVICES.filter((s) => s.slug !== service.slug)
        .slice(0, 4)
        .map((s) => ({ href: `/${s.slug}-no-ceara`, label: `${s.name} no Ceará` })),
    ],
    breadcrumb: service.name,
  };
}

function buildServiceCityPage(service: Service, city: City): SeoPage {
  return {
    slug: `${service.slug}-em-${city.slug}`,
    kind: 'service-city',
    title: `${service.name} em ${city.name}`,
    metaTitle: `${service.name} em ${city.name} — CE`,
    description: `${service.name} em ${city.name}, ${inRegion(city)}. ${service.short} Orçamento por etapa e acompanhamento técnico com a Construtora Fox.`,
    h1: `${service.name} em ${city.name}`,
    eyebrow: `${city.name} · Ceará`,
    lead: `${service.short} Em ${city.name} e nas cidades ${ofRegion(city)}.`,
    // A abertura é própria da combinação — só depois vem o texto do serviço.
    body: [
      COMBO_NOTES[`${service.slug}|${city.slug}`] ??
        `${service.name} em ${city.name} parte do contexto local: a cidade é ${city.context}.`,
      city.angle,
      service.intro[0],
      service.intro[1],
    ],
    bullets: service.includes.slice(0, 6).map((i) => ({ title: i, desc: '' })),
    faq: serviceCityFaq(service, city),
    related: [
      { href: `/${service.slug}-no-ceara`, label: `${service.name} no Ceará` },
      { href: `/construtora-em-${city.slug}`, label: `Construtora em ${city.name}` },
      ...city.near.slice(0, 2).map((slug) => {
        const c = CITY_BY_SLUG.get(slug)!;
        return { href: `/construtora-em-${c.slug}`, label: `Construtora em ${c.name}` };
      }),
      ...SERVICES.filter((s) => s.slug !== service.slug)
        .slice(0, 3)
        .map((s) => ({ href: `/${s.slug}-no-ceara`, label: `${s.name} no Ceará` })),
    ],
    breadcrumb: `${service.name} em ${city.name}`,
  };
}

export const SEO_PAGES: SeoPage[] = [
  ...CITIES.map(buildCityPage),
  ...SERVICES.map(buildServicePage),
  ...COMBOS.map(([s, c]) => buildServiceCityPage(SERVICE_BY_SLUG.get(s)!, CITY_BY_SLUG.get(c)!)),
];

export const SEO_PAGE_BY_SLUG = new Map(SEO_PAGES.map((p) => [p.slug, p]));

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGE_BY_SLUG.get(slug);
}
