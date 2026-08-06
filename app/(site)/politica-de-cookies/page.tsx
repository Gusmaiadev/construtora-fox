import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/site/Reveal';
import { CookiePrefsButton } from '@/components/site/CookiePrefsButton';
import { JsonLd, SITE_URL, breadcrumbSchema } from '@/components/site/JsonLd';
import { COMPANY, LOCATION, WHATSAPP_PHONE } from '@/lib/site-constants';

export const metadata: Metadata = {
  title: 'Política de cookies',
  description:
    'Quais cookies o site da Construtora Fox utiliza, para que servem, quanto tempo duram e como você controla o seu consentimento.',
  alternates: { canonical: '/politica-de-cookies' },
};

/** Espelha exatamente o que o site grava hoje. Mudou o código, muda aqui. */
const COOKIES = [
  {
    nome: 'fox_consent',
    finalidade: 'Guarda a sua escolha sobre cookies, para não perguntarmos de novo a cada visita.',
    duracao: '180 dias',
    categoria: 'Necessário',
    origem: 'Próprio',
  },
  {
    nome: 'fox_2fa_code',
    finalidade:
      'Valida o código de verificação em duas etapas durante o login no painel administrativo. Só existe para quem acessa o painel.',
    duracao: '10 minutos',
    categoria: 'Necessário',
    origem: 'Próprio',
  },
  {
    nome: 'fox_2fa_trust',
    finalidade:
      'Registra que aquele dispositivo já passou pela verificação em duas etapas, evitando repetir o código a cada acesso ao painel.',
    duracao: '30 dias',
    categoria: 'Necessário',
    origem: 'Próprio',
  },
];

export default function PoliticaCookiesPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Política de cookies', path: '/politica-de-cookies' },
        ])}
      />

      <section className="lp-hero">
        <div className="wrap">
          <Reveal className="hero-eyebrow">Privacidade</Reveal>
          <Reveal as="h1" delay={1}>
            Política de <em>cookies</em>
          </Reveal>
          <Reveal as="p" delay={2} className="sub">
            O que este site grava no seu navegador, por quanto tempo e como você controla isso.
          </Reveal>
        </div>
      </section>

      <section className="site-section">
        <div className="wrap doc">
          <h2>O que são cookies</h2>
          <p>
            Cookies são pequenos arquivos que um site grava no seu navegador. Servem para lembrar
            informações entre uma página e outra — como o fato de você já ter feito login, ou a
            escolha que fez neste aviso.
          </p>

          <h2>Cookies que usamos</h2>
          <p>
            O site institucional da {COMPANY} <strong>não usa cookies de análise nem de
            publicidade</strong>. Não há Google Analytics, pixel de rede social ou qualquer
            rastreador de terceiros nas páginas públicas. Os três cookies abaixo são todos
            próprios e estritamente necessários:
          </p>

          <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Finalidade</th>
                  <th>Duração</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.nome}>
                    <td>
                      <code>{c.nome}</code>
                    </td>
                    <td>{c.finalidade}</td>
                    <td>{c.duracao}</td>
                    <td>{c.categoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Categorias</h2>
          <p>
            <strong>Necessários</strong> — mantêm o site em funcionamento e protegem o acesso ao
            painel. Ficam sempre ativos, porque sem eles o serviço não opera. É o caso dos três
            cookies da tabela acima.
          </p>
          <p>
            <strong>Analíticos</strong> — mediriam quais páginas são visitadas e por onde as
            pessoas chegam, de forma agregada. <em>Nenhum está em uso hoje.</em> A categoria existe
            no painel de preferências para que, se um dia forem adicionados, só carreguem depois da
            sua autorização.
          </p>
          <p>
            <strong>Marketing</strong> — mediriam o resultado de anúncios. <em>Nenhum está em uso
            hoje</em>, pela mesma razão acima.
          </p>

          <h2>Como controlar</h2>
          <p>
            Na primeira visita você escolhe entre aceitar todos, recusar os opcionais ou
            personalizar por categoria. A escolha vale por 180 dias e pode ser alterada a qualquer
            momento:
          </p>
          <p className="doc-inline-action">
            <CookiePrefsButton />
          </p>
          <p>
            Se você recusar uma categoria depois de tê-la aceitado, os cookies correspondentes são
            apagados do seu navegador na mesma hora. Você também pode bloquear ou remover cookies
            pelas configurações do próprio navegador — mas bloquear os necessários impede o login
            no painel.
          </p>

          <h2>Dados enviados pelo formulário</h2>
          <p>
            O formulário da página de <Link href="/contato">contato</Link> não usa cookies. Os
            dados que você digita — nome, telefone e mensagem — são enviados por e-mail para a
            equipe e usados apenas para responder ao seu contato. Para solicitar a exclusão desses
            dados, fale conosco pelo WhatsApp {WHATSAPP_PHONE}.
          </p>

          <h2>Quem é o responsável</h2>
          <p>
            {COMPANY} — {LOCATION}. Contato para assuntos de privacidade: {WHATSAPP_PHONE}.
          </p>

          <p className="doc-meta">
            Esta política reflete os cookies em uso nesta versão do site. Se a lista mudar, o aviso
            de consentimento é reapresentado.
          </p>
        </div>
      </section>
    </main>
  );
}
