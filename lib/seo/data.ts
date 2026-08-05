/**
 * Base de conteúdo das páginas de SEO local.
 *
 * Cada cidade e cada serviço carrega texto próprio — as páginas são compostas
 * a partir daqui, não geradas por template genérico. É o que separa uma rede
 * de páginas locais legítima de doorway pages.
 */

export interface City {
  slug: string;
  name: string;
  /** Mesorregião / recorte regional usado no texto. */
  region: string;
  /** Frase que situa a cidade — entra no primeiro parágrafo. */
  context: string;
  /** Gancho ligado ao perfil construtivo local. */
  angle: string;
  /** Slugs de cidades vizinhas, para links internos. */
  near: string[];
}

export const CITIES: City[] = [
  {
    slug: 'crateus',
    name: 'Crateús',
    region: 'Sertão de Crateús',
    context:
      'polo regional do oeste cearense e sede da Construtora Fox, com um raio de influência que alcança dezenas de municípios do sertão',
    angle:
      'A cidade concentra a demanda por moradia própria de toda a região, o que exige obras que resistam ao clima semiárido — cobertura bem executada, impermeabilização criteriosa e ventilação pensada desde a planta.',
    near: ['independencia', 'novo-oriente', 'ipueiras', 'taua'],
  },
  {
    slug: 'fortaleza',
    name: 'Fortaleza',
    region: 'Região Metropolitana de Fortaleza',
    context:
      'capital do estado e maior mercado imobiliário do Ceará, com forte adensamento urbano e obras sujeitas a exigências municipais rigorosas',
    angle:
      'Obra em Fortaleza pede domínio de aprovação e regularização: alvará, projeto complementar, acompanhamento de vizinhança e logística de canteiro em terreno apertado. É onde o gerenciamento pesa tanto quanto a execução.',
    near: ['caucaia', 'maracanau', 'maranguape', 'pacajus'],
  },
  {
    slug: 'caucaia',
    name: 'Caucaia',
    region: 'Região Metropolitana de Fortaleza',
    context:
      'segundo município mais populoso do Ceará, com expansão residencial acelerada na faixa litorânea e nos distritos próximos à capital',
    angle:
      'A combinação de solo arenoso e proximidade do mar muda o projeto: fundação dimensionada para o terreno real e especificação de materiais resistentes à maresia deixam de ser detalhe e viram requisito.',
    near: ['fortaleza', 'maracanau', 'itapipoca', 'maranguape'],
  },
  {
    slug: 'juazeiro-do-norte',
    name: 'Juazeiro do Norte',
    region: 'Cariri',
    context:
      'centro econômico do Cariri e um dos maiores polos comerciais do interior nordestino, com fluxo intenso de visitantes o ano inteiro',
    angle:
      'O comércio movimenta a construção local: ponto comercial, fachada e reforma de loja competem por atenção numa cidade que recebe romeiros e compradores de todo o Nordeste.',
    near: ['crato', 'iguatu', 'taua', 'fortaleza'],
  },
  {
    slug: 'maracanau',
    name: 'Maracanaú',
    region: 'Região Metropolitana de Fortaleza',
    context:
      'principal polo industrial da Grande Fortaleza, com distrito industrial consolidado e demanda constante por galpões e obras corporativas',
    angle:
      'Obra industrial tem outro relógio: cada semana parada é produção perdida. Cronograma realista, medição por etapa e coordenação com o cliente valem mais que qualquer promessa de prazo curto.',
    near: ['fortaleza', 'caucaia', 'pacajus', 'maranguape'],
  },
  {
    slug: 'sobral',
    name: 'Sobral',
    region: 'Norte do Ceará',
    context:
      'maior cidade do norte cearense, com centro histórico tombado, universidade consolidada e crescimento urbano organizado',
    angle:
      'Sobral combina zona histórica com bairros novos em expansão. Reforma em área tombada segue regra própria; já os loteamentos periféricos abrem espaço para construção do zero com liberdade de projeto.',
    near: ['camocim', 'tiangua', 'santa-quiteria', 'itapipoca'],
  },
  {
    slug: 'crato',
    name: 'Crato',
    region: 'Cariri',
    context:
      'cidade universitária do Cariri, ao pé da Chapada do Araripe, com clima mais ameno que o restante do sertão',
    angle:
      'O relevo da encosta do Araripe cobra atenção com drenagem e contenção. Terreno em declive bem resolvido no projeto evita o custo que aparece depois, na forma de infiltração e recalque.',
    near: ['juazeiro-do-norte', 'iguatu', 'taua', 'fortaleza'],
  },
  {
    slug: 'itapipoca',
    name: 'Itapipoca',
    region: 'Litoral Norte',
    context:
      'município de três climas — serra, litoral e sertão — e um dos maiores em população do interior cearense',
    angle:
      'Poucas cidades exigem tanta adaptação de projeto dentro do próprio território: a casa que funciona na serra não é a mesma que funciona na praia, e a especificação precisa acompanhar.',
    near: ['caucaia', 'sobral', 'camocim', 'maranguape'],
  },
  {
    slug: 'maranguape',
    name: 'Maranguape',
    region: 'Região Metropolitana de Fortaleza',
    context:
      'cidade serrana da Grande Fortaleza, procurada por quem quer sair da capital sem perder proximidade',
    angle:
      'A serra atrai obra residencial de padrão mais alto, com terreno acidentado e vista para aproveitar. Implantação bem pensada transforma a topografia de problema em diferencial do projeto.',
    near: ['fortaleza', 'caucaia', 'maracanau', 'caninde'],
  },
  {
    slug: 'iguatu',
    name: 'Iguatu',
    region: 'Centro-Sul cearense',
    context:
      'entroncamento rodoviário e ferroviário do centro-sul, com papel de polo comercial para os municípios do entorno',
    angle:
      'A posição de entroncamento facilita logística de material — vantagem real de custo em obra de médio porte, desde que a compra seja planejada e não emergencial.',
    near: ['juazeiro-do-norte', 'crato', 'quixada', 'taua'],
  },
  {
    slug: 'quixada',
    name: 'Quixadá',
    region: 'Sertão Central',
    context:
      'cidade dos monólitos, referência do Sertão Central e polo de ensino superior da região',
    angle:
      'O solo rochoso característico da região muda o custo de fundação. Sondagem antes do orçamento evita a surpresa mais cara que uma obra pode ter: descobrir a rocha depois de fechado o preço.',
    near: ['quixeramobim', 'caninde', 'iguatu', 'russas'],
  },
  {
    slug: 'caninde',
    name: 'Canindé',
    region: 'Sertão de Canindé',
    context:
      'destino de romaria de alcance nacional, com forte sazonalidade de fluxo e demanda por hospedagem e comércio',
    angle:
      'A sazonalidade define o calendário da obra: reforma de comércio e hospedagem precisa estar pronta antes da romaria, o que torna o cronograma o item mais crítico do contrato.',
    near: ['santa-quiteria', 'quixada', 'maranguape', 'crateus'],
  },
  {
    slug: 'aracati',
    name: 'Aracati',
    region: 'Litoral Leste',
    context:
      'município do litoral leste que abriga Canoa Quebrada, com forte presença de segunda residência e empreendimentos turísticos',
    angle:
      'Construir na faixa litorânea exige proteção contra maresia em cada escolha: esquadria, ferragem, pintura externa e impermeabilização definem se a casa vai bem por dez anos ou por dois.',
    near: ['russas', 'cascavel', 'pacajus', 'fortaleza'],
  },
  {
    slug: 'pacajus',
    name: 'Pacajus',
    region: 'Região Metropolitana de Fortaleza',
    context:
      'cidade da Grande Fortaleza em expansão industrial e residencial, favorecida pelo acesso rodoviário à capital',
    angle:
      'O crescimento recente abriu muitos loteamentos novos — terreno limpo, sem preexistência, é o cenário ideal para construção do zero com projeto sob medida.',
    near: ['fortaleza', 'cascavel', 'maracanau', 'aracati'],
  },
  {
    slug: 'cascavel',
    name: 'Cascavel',
    region: 'Litoral Leste',
    context:
      'município do litoral leste com praias procuradas e ligação direta com a Região Metropolitana',
    angle:
      'A proximidade da capital com preço de terreno menor faz da região um alvo natural para quem quer construir a casa própria sem abrir mão de acesso rápido a Fortaleza.',
    near: ['pacajus', 'aracati', 'fortaleza', 'russas'],
  },
  {
    slug: 'quixeramobim',
    name: 'Quixeramobim',
    region: 'Sertão Central',
    context:
      'centro geográfico do Ceará, com economia ligada à pecuária e ao comércio regional',
    angle:
      'A posição central encurta o deslocamento para qualquer ponto do estado, o que ajuda no acompanhamento técnico frequente — visita de obra deixa de ser evento raro.',
    near: ['quixada', 'caninde', 'russas', 'crateus'],
  },
  {
    slug: 'russas',
    name: 'Russas',
    region: 'Vale do Jaguaribe',
    context:
      'polo do Vale do Jaguaribe, com tradição em cerâmica vermelha e agricultura irrigada',
    angle:
      'A cidade produz material de construção que abastece boa parte do estado. Isso encurta prazo de entrega de alvenaria e telha, vantagem que só se converte em economia com compra bem programada.',
    near: ['aracati', 'quixeramobim', 'cascavel', 'quixada'],
  },
  {
    slug: 'tiangua',
    name: 'Tianguá',
    region: 'Serra da Ibiapaba',
    context:
      'porta de entrada da Serra da Ibiapaba, com clima ameno e vocação turística consolidada',
    angle:
      'Clima serrano e umidade alta mudam a especificação: impermeabilização, tratamento de madeira e ventilação cruzada evitam o mofo que aparece na primeira estação chuvosa.',
    near: ['sobral', 'camocim', 'santa-quiteria', 'ipueiras'],
  },
  {
    slug: 'camocim',
    name: 'Camocim',
    region: 'Litoral Norte',
    context:
      'cidade portuária do extremo noroeste cearense, entre a foz do Coreaú e as praias de Jericoacoara',
    angle:
      'O turismo puxa obra de pousada, restaurante e segunda residência. São projetos em que o acabamento vende — e em que a maresia castiga tudo o que foi especificado sem critério.',
    near: ['sobral', 'tiangua', 'itapipoca', 'santa-quiteria'],
  },
  {
    slug: 'independencia',
    name: 'Independência',
    region: 'Sertão dos Inhamuns',
    context:
      'município dos Inhamuns vizinho a Crateús, com economia ligada à pecuária e ao comércio local',
    angle:
      'A proximidade com a sede da Fox permite acompanhamento presencial constante, o que reduz o retrabalho que nasce de decisão tomada à distância.',
    near: ['crateus', 'taua', 'novo-oriente', 'quixeramobim'],
  },
  {
    slug: 'novo-oriente',
    name: 'Novo Oriente',
    region: 'Sertão de Crateús',
    context:
      'município do sertão de Crateús, na divisa com o Piauí, com forte vínculo comercial com a sede regional',
    angle:
      'Obra em cidade menor depende de logística de material bem resolvida — programar entrega e evitar compra emergencial é o que mantém o orçamento de pé.',
    near: ['crateus', 'independencia', 'ipueiras', 'taua'],
  },
  {
    slug: 'taua',
    name: 'Tauá',
    region: 'Sertão dos Inhamuns',
    context:
      'maior município dos Inhamuns em extensão, com clima semiárido acentuado e economia de base rural',
    angle:
      'Amplitude térmica alta cobra do projeto: inércia térmica, pé-direito e orientação solar bem resolvidos derrubam a conta de energia pelo resto da vida da casa.',
    near: ['independencia', 'crateus', 'iguatu', 'quixeramobim'],
  },
  {
    slug: 'ipueiras',
    name: 'Ipueiras',
    region: 'Sertão de Crateús',
    context:
      'município entre o sertão de Crateús e a Ibiapaba, com relevo variado e comércio regional ativo',
    angle:
      'O terreno entre sertão e serra varia muito em um raio curto. Avaliar o lote antes de fechar o projeto evita adaptar planta no meio da obra — o tipo de mudança que sempre sai caro.',
    near: ['crateus', 'novo-oriente', 'tiangua', 'santa-quiteria'],
  },
  {
    slug: 'santa-quiteria',
    name: 'Santa Quitéria',
    region: 'Sertão de Canindé',
    context:
      'maior município do Ceará em área, entre o sertão central e o norte do estado',
    angle:
      'Distâncias grandes dentro do próprio município tornam o planejamento de canteiro decisivo: estoque de material dimensionado certo evita parada por falta de insumo.',
    near: ['caninde', 'sobral', 'crateus', 'ipueiras'],
  },
];

export interface Service {
  slug: string;
  /** Nome do serviço em título. */
  name: string;
  /** Forma usada no meio da frase. */
  lower: string;
  short: string;
  /** Dois parágrafos de abertura, próprios do serviço. */
  intro: [string, string];
  /** O que está incluso — vira lista na página. */
  includes: string[];
  /** Etapas do processo. */
  steps: { title: string; desc: string }[];
  /** Perguntas frequentes específicas do serviço. */
  faq: { q: string; a: string }[];
}

export const SERVICES: Service[] = [
  {
    slug: 'construcao-de-casas',
    name: 'Construção de Casas',
    lower: 'construção de casas',
    short: 'Casa do zero, da fundação à entrega das chaves.',
    intro: [
      'Construir do zero é a única situação em que cada decisão ainda está aberta: implantação no terreno, orientação solar, distribuição dos ambientes, padrão de acabamento. É também quando um erro custa mais caro, porque vira estrutura.',
      'A Construtora Fox executa residências unifamiliares com projeto aprovado, cronograma por etapa e medição documentada. O cliente sabe o que foi feito, quanto custou e o que vem em seguida.',
    ],
    includes: [
      'Análise do terreno e definição da implantação',
      'Terraplanagem, fundação e estrutura',
      'Alvenaria, cobertura e impermeabilização',
      'Instalações elétricas e hidráulicas',
      'Pisos, revestimentos e pintura interna e externa',
      'Limpeza final e entrega com vistoria',
    ],
    steps: [
      { title: 'Estudo do terreno', desc: 'Levantamento das condições reais do lote antes de qualquer preço fechado.' },
      { title: 'Projeto e orçamento', desc: 'Planta, memorial e orçamento por etapa, com o padrão de acabamento definido junto.' },
      { title: 'Execução', desc: 'Obra conduzida por etapas medidas, com acompanhamento técnico e registro do que foi executado.' },
      { title: 'Entrega', desc: 'Vistoria final, ajustes e entrega com a documentação da obra organizada.' },
    ],
    faq: [
      {
        q: 'Quanto tempo leva para construir uma casa?',
        a: 'Uma residência térrea de padrão médio costuma levar de 6 a 10 meses entre fundação e entrega, variando com o tamanho, o acabamento escolhido e as condições do terreno. O prazo real só é confiável depois do estudo do lote e do projeto fechado.',
      },
      {
        q: 'Vocês fazem o projeto ou preciso levar pronto?',
        a: 'Os dois caminhos funcionam. Se você já tem projeto aprovado, executamos a partir dele. Se não tem, desenvolvemos a planta junto com você antes de fechar o orçamento.',
      },
      {
        q: 'Como funciona o pagamento?',
        a: 'Por medição: a obra é dividida em etapas, cada etapa tem valor definido em contrato e o pagamento acompanha o que foi efetivamente executado e medido.',
      },
      {
        q: 'O orçamento pode mudar durante a obra?',
        a: 'O orçamento aprovado é o que vale. Alterações só entram por decisão do cliente — mudança de acabamento, acréscimo de ambiente — e são orçadas antes de qualquer execução.',
      },
    ],
  },
  {
    slug: 'reformas-residenciais',
    name: 'Reformas Residenciais',
    lower: 'reformas residenciais',
    short: 'Modernização de ambientes com execução organizada.',
    intro: [
      'Reforma tem uma dificuldade que obra nova não tem: você só descobre o que existe atrás da parede quando abre. Instalação antiga fora de norma, laje comprometida, tubulação improvisada — tudo aparece com a obra em andamento.',
      'Por isso a Fox trata o diagnóstico como etapa paga do trabalho, não como cortesia antes do orçamento. Levantar o que existe antes de precificar é o que impede a reforma de virar uma sequência de aditivos.',
    ],
    includes: [
      'Diagnóstico do que existe antes do orçamento',
      'Demolição controlada e remoção de entulho',
      'Substituição de instalações elétricas e hidráulicas',
      'Novos pisos, revestimentos e forro',
      'Marcenaria, esquadrias e pintura',
      'Entrega com o ambiente limpo e pronto para uso',
    ],
    steps: [
      { title: 'Diagnóstico', desc: 'Vistoria do imóvel para mapear instalações, estrutura e patologias antes do preço.' },
      { title: 'Escopo e orçamento', desc: 'Definição do que entra e do que fica, com valor por frente de trabalho.' },
      { title: 'Execução por ambiente', desc: 'Obra organizada para reduzir o tempo de casa inutilizável.' },
      { title: 'Entrega', desc: 'Limpeza, ajuste de acabamento e conferência item a item.' },
    ],
    faq: [
      {
        q: 'Preciso desocupar a casa durante a reforma?',
        a: 'Nem sempre. Reformas parciais podem ser executadas por ambiente, mantendo o restante da casa em uso. Reforma estrutural ou troca completa de instalações costuma exigir desocupação.',
      },
      {
        q: 'Como vocês lidam com surpresa atrás da parede?',
        a: 'O diagnóstico inicial reduz muito a chance disso. Quando aparece algo não previsto, o cliente é informado antes de qualquer execução e recebe o custo da correção separado do orçamento original.',
      },
      {
        q: 'Reforma precisa de aprovação na prefeitura?',
        a: 'Reforma sem alteração de área e sem mexer em estrutura geralmente não precisa. Ampliação, mudança de fachada ou intervenção estrutural exigem projeto e aprovação — cuidamos disso quando for o caso.',
      },
      {
        q: 'Vale mais a pena reformar ou construir do zero?',
        a: 'Depende do estado da estrutura. Quando a reforma passa de 60% do custo de uma obra nova, geralmente compensa construir. O diagnóstico dá esse número antes da decisão.',
      },
    ],
  },
  {
    slug: 'reformas-comerciais',
    name: 'Reformas Comerciais',
    lower: 'reformas comerciais',
    short: 'Espaços comerciais reformados sem perder faturamento.',
    intro: [
      'Reforma comercial tem um custo que não aparece no orçamento: cada dia de porta fechada é receita que não volta. O cronograma deixa de ser detalhe operacional e vira o item mais caro do contrato.',
      'A Fox planeja reforma de loja, escritório e ponto comercial em torno dessa restrição — obra por etapa, trabalho fora do horário quando faz sentido e prazo assumido com margem real, não com otimismo.',
    ],
    includes: [
      'Planejamento do cronograma em torno do funcionamento',
      'Layout e adequação do espaço ao fluxo de clientes',
      'Instalações elétricas, lógica e climatização',
      'Revestimentos, forro e iluminação',
      'Fachada, comunicação visual e vitrine',
      'Adequações de acessibilidade e segurança',
    ],
    steps: [
      { title: 'Leitura do negócio', desc: 'Entender fluxo, horário e o que não pode parar antes de desenhar a obra.' },
      { title: 'Projeto e cronograma', desc: 'Layout novo e sequência de execução que preserva o máximo de operação.' },
      { title: 'Execução faseada', desc: 'Frentes de trabalho organizadas para liberar áreas conforme avançam.' },
      { title: 'Entrega', desc: 'Espaço limpo, testado e pronto para receber cliente.' },
    ],
    faq: [
      {
        q: 'Dá para reformar sem fechar a loja?',
        a: 'Em boa parte dos casos, sim — dividindo a obra em setores e liberando área conforme avança. Fechamento total costuma ser necessário só em troca de piso na área de vendas ou intervenção estrutural.',
      },
      {
        q: 'Vocês trabalham fora do horário comercial?',
        a: 'Sim, quando o ganho compensa. Trabalho noturno ou de fim de semana encarece a mão de obra, mas costuma sair mais barato que o faturamento perdido com a loja fechada.',
      },
      {
        q: 'A reforma inclui a fachada?',
        a: 'Pode incluir. Fachada é o item de maior retorno visual em reforma comercial e normalmente é executada junto, aproveitando o mesmo canteiro.',
      },
      {
        q: 'Como fica a acessibilidade?',
        a: 'Reforma de espaço com atendimento ao público precisa atender a NBR 9050. Avaliamos o que já está conforme e o que precisa ser adequado logo no projeto.',
      },
    ],
  },
  {
    slug: 'ampliacoes-de-imoveis',
    name: 'Ampliações de Imóveis',
    lower: 'ampliações de imóveis',
    short: 'Mais área construída, integrada ao que já existe.',
    intro: [
      'Ampliar é mais difícil que construir do zero. A parte nova precisa conversar com a existente em estrutura, nível, cobertura e linguagem — e a estrutura antiga nem sempre foi dimensionada para receber carga adicional.',
      'A Fox avalia a capacidade do que já está construído antes de projetar o acréscimo. É a diferença entre uma ampliação que parece ter nascido junto com a casa e um puxadinho caro.',
    ],
    includes: [
      'Avaliação estrutural do imóvel existente',
      'Projeto de ampliação integrado ao original',
      'Fundação e estrutura do novo trecho',
      'Amarração com a alvenaria e a cobertura existentes',
      'Extensão das instalações elétricas e hidráulicas',
      'Acabamento compatibilizado com o restante do imóvel',
    ],
    steps: [
      { title: 'Avaliação do existente', desc: 'Verificação da estrutura e das instalações que vão receber o acréscimo.' },
      { title: 'Projeto integrado', desc: 'Desenho da ampliação resolvendo nível, cobertura e circulação com o que já existe.' },
      { title: 'Execução', desc: 'Obra conduzida com proteção da área em uso e amarração correta entre novo e antigo.' },
      { title: 'Entrega', desc: 'Acabamento compatibilizado e conferência da integração.' },
    ],
    faq: [
      {
        q: 'Minha casa aguenta um segundo pavimento?',
        a: 'Depende da fundação e da estrutura originais. Casas construídas sem projeto estrutural frequentemente precisam de reforço. A avaliação técnica responde isso antes de qualquer orçamento.',
      },
      {
        q: 'Ampliação precisa de aprovação?',
        a: 'Sim. Aumento de área construída exige projeto aprovado na prefeitura e atualização da averbação do imóvel. Conduzimos esse processo junto com a obra.',
      },
      {
        q: 'Dá para morar na casa durante a ampliação?',
        a: 'Na maioria dos casos sim, isolando a frente de obra. A convivência fica mais difícil em ampliação vertical, pela intervenção na laje.',
      },
      {
        q: 'A parte nova vai ficar visivelmente diferente?',
        a: 'Não precisa. Compatibilizar reboco, esquadria, telha e pintura resolve — desde que a decisão de padronizar entre no projeto, e não no fim da obra.',
      },
    ],
  },
  {
    slug: 'obras-industriais',
    name: 'Obras Industriais',
    lower: 'obras industriais',
    short: 'Estruturas industriais com foco em operação.',
    intro: [
      'Obra industrial é medida por disponibilidade: o que importa é quando a operação começa a rodar. Layout de produção, capacidade de piso, altura livre e infraestrutura elétrica precisam sair certos de primeira, porque correção depois significa parada.',
      'A Fox executa galpões, ampliações fabris e adequações prediais com cronograma por etapa e coordenação direta com a equipe do cliente.',
    ],
    includes: [
      'Terraplanagem e fundação dimensionada para a carga',
      'Estrutura metálica ou em concreto',
      'Piso industrial com resistência especificada',
      'Cobertura, ventilação e iluminação zenital',
      'Infraestrutura elétrica de potência',
      'Docas, pátio de manobra e urbanização',
    ],
    steps: [
      { title: 'Levantamento operacional', desc: 'Entender o processo produtivo antes de dimensionar o galpão.' },
      { title: 'Projeto executivo', desc: 'Estrutura, piso e instalações especificados para a operação prevista.' },
      { title: 'Execução com medição', desc: 'Etapas medidas e coordenadas com o cronograma do cliente.' },
      { title: 'Comissionamento', desc: 'Testes, ajustes e entrega com a documentação técnica.' },
    ],
    faq: [
      {
        q: 'Estrutura metálica ou concreto?',
        a: 'Metálica costuma vencer em prazo e em vãos livres grandes; concreto compete em custo e em ambientes agressivos. A escolha sai do uso previsto, não de preferência.',
      },
      {
        q: 'Como é definida a resistência do piso?',
        a: 'Pela carga real de operação — peso de equipamento, tipo de empilhadeira e movimentação. Piso subdimensionado é um dos defeitos mais caros de corrigir depois.',
      },
      {
        q: 'Vocês executam com a fábrica funcionando?',
        a: 'Sim, em ampliação e adequação. Exige isolamento da frente de obra, controle de poeira e ruído, e cronograma acertado com a produção.',
      },
      {
        q: 'A obra inclui licenciamento?',
        a: 'Acompanhamos o processo junto aos órgãos competentes. Licença ambiental e de bombeiros variam com a atividade e entram no planejamento desde o início.',
      },
    ],
  },
  {
    slug: 'gerenciamento-de-obras',
    name: 'Gerenciamento de Obras',
    lower: 'gerenciamento de obras',
    short: 'Controle técnico e de cronograma da sua obra.',
    intro: [
      'Nem toda obra precisa ser executada pela construtora. Quando o cliente já tem equipe ou quer contratar direto, o que falta normalmente é quem responda tecnicamente pelo conjunto: cronograma, qualidade, medição e compra.',
      'No gerenciamento a Fox assume esse papel. O controle passa a ser documentado e o cliente enxerga onde o dinheiro está indo, semana a semana.',
    ],
    includes: [
      'Planejamento e cronograma físico-financeiro',
      'Acompanhamento técnico das frentes de trabalho',
      'Medição e validação do que foi executado',
      'Controle de compras e de fornecedores',
      'Relatório periódico de avanço e de custo',
      'Verificação de conformidade com o projeto',
    ],
    steps: [
      { title: 'Diagnóstico', desc: 'Leitura do projeto, do orçamento e do estágio atual da obra.' },
      { title: 'Plano de controle', desc: 'Cronograma, marcos de medição e rotina de acompanhamento definidos.' },
      { title: 'Acompanhamento', desc: 'Visitas técnicas, medições e correção de desvio antes que vire custo.' },
      { title: 'Prestação de contas', desc: 'Relatório de avanço físico e financeiro em cada ciclo.' },
    ],
    faq: [
      {
        q: 'Qual a diferença entre gerenciar e executar?',
        a: 'Na execução a construtora contrata e responde pela mão de obra. No gerenciamento ela coordena, mede e fiscaliza o trabalho de terceiros, respondendo pelo controle técnico e não pela produção.',
      },
      {
        q: 'Compensa gerenciar uma obra pequena?',
        a: 'Costuma compensar quando o proprietário não tem tempo ou repertório técnico para acompanhar. O ganho vem de evitar retrabalho e compra mal feita, que em obra pequena pesam proporcionalmente mais.',
      },
      {
        q: 'Vocês assumem obra já iniciada?',
        a: 'Sim. O diagnóstico inicial registra o que já foi executado e em que condição, para separar o que é responsabilidade anterior do que passa a ser acompanhado.',
      },
      {
        q: 'Que tipo de relatório eu recebo?',
        a: 'Avanço físico por etapa, custo realizado contra orçado, pendências abertas e registro fotográfico do período.',
      },
    ],
  },
  {
    slug: 'administracao-de-obras',
    name: 'Administração de Obras',
    lower: 'administração de obras',
    short: 'Gestão completa de equipes, compras e processos.',
    intro: [
      'Administrar uma obra é lidar com o que não aparece na planta: contratar e pagar equipe, comprar na hora certa, controlar estoque, resolver o fornecedor que atrasou e manter o caixa previsível.',
      'A Fox assume essa operação por completo. O cliente decide o que quer e aprova gastos; o resto da máquina fica do nosso lado.',
    ],
    includes: [
      'Contratação e gestão das equipes de campo',
      'Cotação, compra e recebimento de material',
      'Controle de estoque e de perdas no canteiro',
      'Gestão de fornecedores e prestadores',
      'Controle financeiro com prestação de contas',
      'Documentação e regularização da obra',
    ],
    steps: [
      { title: 'Estruturação', desc: 'Montagem do plano de compras, das equipes e do fluxo de caixa da obra.' },
      { title: 'Operação', desc: 'Condução do dia a dia do canteiro, das contratações e do abastecimento.' },
      { title: 'Controle', desc: 'Acompanhamento de custo por categoria, com desvio identificado cedo.' },
      { title: 'Fechamento', desc: 'Prestação de contas final e organização da documentação.' },
    ],
    faq: [
      {
        q: 'Eu perco o controle do dinheiro?',
        a: 'Ao contrário. Todo gasto é registrado por categoria e apresentado em prestação de contas periódica — normalmente o cliente passa a enxergar melhor o custo do que enxergava antes.',
      },
      {
        q: 'Como é a remuneração desse serviço?',
        a: 'Por taxa de administração sobre o custo da obra ou por valor fixo mensal, definido no contrato conforme o porte e o prazo.',
      },
      {
        q: 'Vocês compram em nome do cliente?',
        a: 'Pode funcionar dos dois jeitos. O modelo mais transparente é a nota sair no nome do cliente, com a construtora cotando, negociando e recebendo o material.',
      },
      {
        q: 'Serve para obra fora da sede de vocês?',
        a: 'Sim. A administração é estruturada com equipe local e acompanhamento técnico presencial em ciclo definido no contrato.',
      },
    ],
  },
  {
    slug: 'construcao-personalizada',
    name: 'Construção Personalizada',
    lower: 'construção personalizada',
    short: 'Projeto sob medida, do conceito à entrega.',
    intro: [
      'Nem todo cliente cabe numa planta padrão. Terreno com formato difícil, programa de necessidades específico, exigência de acessibilidade, home office, ateliê, área gourmet integrada — cada um desses pede desenho próprio.',
      'A Fox trabalha esse tipo de obra do conceito à entrega, com o cliente participando das decisões que realmente importam e sem ser soterrado pelas que não importam.',
    ],
    includes: [
      'Levantamento do programa de necessidades',
      'Estudo de implantação e partido arquitetônico',
      'Projeto executivo e complementares',
      'Especificação de acabamento junto com o cliente',
      'Execução com acompanhamento próximo',
      'Entrega com vistoria detalhada',
    ],
    steps: [
      { title: 'Conceito', desc: 'Conversa sobre rotina, uso e prioridades antes de qualquer traço.' },
      { title: 'Projeto', desc: 'Estudo, ajustes e fechamento da planta com o orçamento correspondente.' },
      { title: 'Execução', desc: 'Obra com acompanhamento próximo e decisões de acabamento no tempo certo.' },
      { title: 'Entrega', desc: 'Vistoria item a item e ajustes finais antes da entrega das chaves.' },
    ],
    faq: [
      {
        q: 'Custa muito mais que uma planta pronta?',
        a: 'O projeto custa mais; a obra, não necessariamente. Uma planta bem adaptada ao terreno costuma economizar em fundação, movimentação de terra e área construída desperdiçada.',
      },
      {
        q: 'Quanto tempo leva a fase de projeto?',
        a: 'De 4 a 10 semanas até o projeto executivo, dependendo da complexidade e da agilidade nas definições do cliente.',
      },
      {
        q: 'Posso mudar de ideia durante a obra?',
        a: 'Pode, e é comum. Mudança de acabamento costuma ser simples; mudança de layout depois da alvenaria levantada custa caro. Por isso as decisões estruturais são fechadas ainda no projeto.',
      },
      {
        q: 'Vocês trabalham com arquiteto do cliente?',
        a: 'Sim. Quando já existe arquiteto, a Fox executa e faz a compatibilização entre o projeto arquitetônico e os complementares.',
      },
    ],
  },
  {
    slug: 'lojas-e-pontos-comerciais',
    name: 'Lojas e Pontos Comerciais',
    lower: 'lojas e pontos comerciais',
    short: 'Construção de espaços que vendem.',
    intro: [
      'Ponto comercial é ferramenta de venda. Fluxo de circulação, iluminação, vitrine e fachada influenciam quanto tempo o cliente fica e o que ele enxerga — e isso se decide no projeto, não na decoração.',
      'A Fox constrói e adapta lojas, salas e pontos comerciais tratando o espaço como parte da operação do negócio.',
    ],
    includes: [
      'Layout orientado ao fluxo de clientes',
      'Fachada e comunicação visual',
      'Iluminação projetada para exposição de produto',
      'Instalações elétricas, lógica e climatização',
      'Revestimentos de alta circulação',
      'Acessibilidade e adequação às normas',
    ],
    steps: [
      { title: 'Entendimento do negócio', desc: 'Tipo de produto, ticket, fluxo e público antes do desenho.' },
      { title: 'Layout e projeto', desc: 'Circulação, exposição e fachada resolvidos em conjunto.' },
      { title: 'Execução', desc: 'Obra com prazo assumido, porque abertura atrasada custa caro.' },
      { title: 'Entrega', desc: 'Espaço testado e liberado para montagem da operação.' },
    ],
    faq: [
      {
        q: 'Quanto tempo leva para montar uma loja?',
        a: 'Adequação de sala pronta costuma levar de 30 a 60 dias. Construção do ponto do zero depende do porte e da aprovação, geralmente de 4 a 8 meses.',
      },
      {
        q: 'Vocês fazem a fachada e o letreiro?',
        a: 'A fachada sim, integrada à obra. Letreiro e comunicação visual são coordenados com o fornecedor especializado para que a instalação já encontre a infraestrutura pronta.',
      },
      {
        q: 'Loja em shopping tem diferença?',
        a: 'Bastante. Há manual técnico do empreendimento, prazos rígidos de montagem e horário restrito de trabalho — tudo isso entra no cronograma desde o início.',
      },
      {
        q: 'Precisa de projeto aprovado?',
        a: 'Ponto novo sim. Adequação interna sem alteração de área normalmente exige apenas as licenças de funcionamento e do corpo de bombeiros.',
      },
    ],
  },
  {
    slug: 'construcao-de-galpoes',
    name: 'Construção de Galpões',
    lower: 'construção de galpões',
    short: 'Galpões logísticos e industriais sob medida.',
    intro: [
      'Galpão é um problema de eficiência: vão livre, altura útil, resistência de piso e pátio de manobra determinam quanto cabe dentro e com que velocidade a carga entra e sai.',
      'A Fox dimensiona cada um desses itens a partir da operação real do cliente, não de um modelo genérico de catálogo.',
    ],
    includes: [
      'Terraplanagem e drenagem do terreno',
      'Fundação dimensionada para a estrutura',
      'Estrutura metálica com vãos livres',
      'Piso industrial nivelado e resistente',
      'Cobertura com ventilação e iluminação natural',
      'Docas, pátio de manobra e cercamento',
    ],
    steps: [
      { title: 'Dimensionamento', desc: 'Vão, altura e piso definidos a partir do que vai operar dentro.' },
      { title: 'Projeto', desc: 'Estrutura, drenagem e pátio resolvidos em conjunto.' },
      { title: 'Execução', desc: 'Montagem coordenada, com etapas medidas.' },
      { title: 'Entrega', desc: 'Testes, ajustes e liberação para operação.' },
    ],
    faq: [
      {
        q: 'Qual altura útil eu preciso?',
        a: 'Sai do sistema de armazenagem: porta-palete de quatro níveis pede pé-direito bem maior que estocagem em bloco. Definir isso antes evita galpão novo já limitado.',
      },
      {
        q: 'Quanto tempo leva a construção?',
        a: 'Um galpão metálico de porte médio costuma levar de 4 a 8 meses, com a montagem da estrutura sendo a fase mais rápida e a terraplanagem a mais sujeita a surpresa.',
      },
      {
        q: 'Vale a pena investir em iluminação zenital?',
        a: 'Costuma valer. Telha translúcida bem distribuída reduz consumo de energia no turno diurno e melhora a condição de trabalho, com custo baixo no total da obra.',
      },
      {
        q: 'A drenagem é mesmo tão importante?',
        a: 'É um dos itens que mais gera problema depois. Área de cobertura grande concentra volume enorme de água — sem drenagem dimensionada, o pátio alaga na primeira chuva forte.',
      },
    ],
  },
  {
    slug: 'areas-de-lazer',
    name: 'Áreas de Lazer',
    lower: 'áreas de lazer',
    short: 'Espaços de convivência bem executados.',
    intro: [
      'Área de lazer é onde a construção mais aparece no dia a dia — e onde erro de execução fica mais visível. Piscina com problema de impermeabilização, deck que empena, churrasqueira que devolve fumaça: todos são defeitos de obra, não de projeto.',
      'A Fox executa área gourmet, piscina, deck e espaço de convivência com a mesma atenção técnica dada à estrutura da casa.',
    ],
    includes: [
      'Área gourmet com bancada e churrasqueira',
      'Piscina com impermeabilização e casa de máquinas',
      'Deck, pergolado e cobertura',
      'Iluminação e pontos elétricos externos',
      'Pisos externos antiderrapantes',
      'Paisagismo e drenagem do entorno',
    ],
    steps: [
      { title: 'Estudo do espaço', desc: 'Aproveitamento do terreno, sol e ventilação antes do desenho.' },
      { title: 'Projeto', desc: 'Definição de piscina, gourmet e circulação com as instalações necessárias.' },
      { title: 'Execução', desc: 'Obra com atenção redobrada a impermeabilização e drenagem.' },
      { title: 'Entrega', desc: 'Testes de estanqueidade e ajuste final de acabamento.' },
    ],
    faq: [
      {
        q: 'Quanto tempo leva para construir uma piscina?',
        a: 'De 45 a 90 dias entre escavação e liberação, dependendo do tipo, do tamanho e da cura da impermeabilização, que não deve ser apressada.',
      },
      {
        q: 'Dá para fazer área de lazer em terreno pequeno?',
        a: 'Dá. Terreno pequeno exige projeto mais cuidadoso — integrar gourmet com a circulação da casa e escolher piscina compacta resolve na maioria dos casos.',
      },
      {
        q: 'Por que a churrasqueira devolve fumaça?',
        a: 'Quase sempre por dimensionamento errado de coifa e chaminé, ou por altura insuficiente em relação à cobertura. É defeito de execução e tem correção, mas sai mais barato acertar de primeira.',
      },
      {
        q: 'Preciso de drenagem específica?',
        a: 'Sim. Área externa com piso impermeável concentra água. Sem caimento e captação corretos, o problema aparece na fundação da casa.',
      },
    ],
  },
  {
    slug: 'fachadas-comerciais',
    name: 'Fachadas Comerciais',
    lower: 'fachadas comerciais',
    short: 'Fachadas que fortalecem a presença do negócio.',
    intro: [
      'A fachada é o único elemento da obra que trabalha 24 horas por dia. Ela é vista por quem passa, define se o negócio parece confiável e é, proporcionalmente, o investimento de maior retorno visual em uma obra comercial.',
      'A Fox executa fachadas novas e reformas de fachada resolvendo o que vem junto: iluminação, impermeabilização, fixação segura e manutenção viável.',
    ],
    includes: [
      'Projeto de fachada alinhado à identidade do negócio',
      'Revestimentos, ACM, vidro e estruturas de apoio',
      'Iluminação de destaque e infraestrutura elétrica',
      'Impermeabilização e tratamento de infiltração',
      'Adequação de acesso e acessibilidade',
      'Preparo para instalação de comunicação visual',
    ],
    steps: [
      { title: 'Leitura da identidade', desc: 'Entender a marca e o entorno antes de propor a fachada.' },
      { title: 'Projeto', desc: 'Materiais, iluminação e fixação definidos com orçamento fechado.' },
      { title: 'Execução', desc: 'Obra com proteção da calçada e mínimo impacto no funcionamento.' },
      { title: 'Entrega', desc: 'Limpeza, teste de iluminação e liberação para comunicação visual.' },
    ],
    faq: [
      {
        q: 'Quanto tempo leva uma reforma de fachada?',
        a: 'De 20 a 60 dias na maioria dos casos comerciais, dependendo da altura, do material escolhido e da necessidade de tratar infiltração antes do revestimento.',
      },
      {
        q: 'ACM ou revestimento tradicional?',
        a: 'ACM entrega prazo curto e visual limpo, com manutenção simples. Revestimento tradicional dura mais e custa menos, mas exige mais tempo de obra. A escolha depende do prazo e do quanto a fachada precisa se destacar.',
      },
      {
        q: 'A obra atrapalha o funcionamento?',
        a: 'Pouco. Fachada é executada pelo lado externo, com proteção de calçada. O acesso é preservado durante quase toda a obra.',
      },
      {
        q: 'Precisa de autorização da prefeitura?',
        a: 'Alteração de fachada costuma exigir aprovação, e em área histórica as regras são mais rígidas. Verificamos a exigência local antes de iniciar.',
      },
    ],
  },
];

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
export const SERVICE_BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));
