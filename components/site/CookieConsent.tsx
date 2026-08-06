'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  ALLOW_ALL,
  DENY_ALL,
  type Consent,
  readConsent,
  writeConsent,
} from '@/lib/cookies/consent';

/** Reabre o painel a partir de qualquer lugar (link do rodapé, por exemplo). */
export const OPEN_PREFS_EVENT = 'fox:open-cookie-prefs';

const CATEGORIAS = [
  {
    id: 'necessarios' as const,
    nome: 'Necessários',
    desc: 'Mantêm o site funcionando e protegem o acesso ao painel administrativo. Incluem a memória desta sua escolha. Não podem ser desligados.',
    fixo: true,
  },
  {
    id: 'analiticos' as const,
    nome: 'Analíticos',
    desc: 'Ajudam a entender quais páginas são visitadas e por onde as pessoas chegam. Os dados são agregados e não identificam você.',
    fixo: false,
  },
  {
    id: 'marketing' as const,
    nome: 'Marketing',
    desc: 'Permitem medir o resultado de anúncios e apresentar conteúdo mais relevante fora do site.',
    fixo: false,
  },
];

export function CookieConsent() {
  // null = ainda não verificamos. Evita o banner piscar para quem já escolheu.
  const [aberto, setAberto] = useState<boolean | null>(null);
  const [detalhes, setDetalhes] = useState(false);
  const [escolha, setEscolha] = useState({ analiticos: false, marketing: false });

  useEffect(() => {
    const atual = readConsent();
    if (atual) {
      setEscolha({ analiticos: atual.analiticos, marketing: atual.marketing });
      setAberto(false);
    } else {
      setAberto(true);
    }
  }, []);

  useEffect(() => {
    const reabrir = () => {
      const atual = readConsent();
      if (atual) setEscolha({ analiticos: atual.analiticos, marketing: atual.marketing });
      setDetalhes(true);
      setAberto(true);
    };
    window.addEventListener(OPEN_PREFS_EVENT, reabrir);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, reabrir);
  }, []);

  const salvar = useCallback((choice: Omit<Consent, 'ts' | 'v'>) => {
    writeConsent(choice);
    setEscolha(choice);
    setAberto(false);
    setDetalhes(false);
  }, []);

  if (!aberto) return null;

  return (
    <div
      className="ck"
      role="dialog"
      aria-modal="false"
      aria-labelledby="ck-titulo"
      aria-describedby="ck-texto"
    >
      <div className="ck-inner">
        <div className="ck-head">
          <p className="ck-eyebrow">Privacidade</p>
          <h2 id="ck-titulo">Cookies neste site</h2>
          <p id="ck-texto">
            Usamos apenas o necessário para o site funcionar. Nada de análise ou publicidade é
            carregado sem a sua autorização. Você pode mudar de ideia quando quiser.{' '}
            <Link href="/politica-de-cookies">Ver a política de cookies</Link>.
          </p>
        </div>

        {detalhes && (
          <ul className="ck-cats">
            {CATEGORIAS.map((cat) => {
              const marcado = cat.fixo || escolha[cat.id as 'analiticos' | 'marketing'];
              return (
                <li key={cat.id}>
                  <label className="ck-cat">
                    <input
                      type="checkbox"
                      checked={marcado}
                      disabled={cat.fixo}
                      onChange={(e) =>
                        setEscolha((s) => ({ ...s, [cat.id]: e.target.checked }))
                      }
                    />
                    <span>
                      <strong>
                        {cat.nome}
                        {cat.fixo && <em> · sempre ativos</em>}
                      </strong>
                      <span className="ck-cat-desc">{cat.desc}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        <div className="ck-acoes">
          <button type="button" className="ck-btn ck-btn-primary" onClick={() => salvar(ALLOW_ALL)}>
            Aceitar todos
          </button>
          {/* Recusar precisa ser tão fácil quanto aceitar — mesmo peso visual. */}
          <button type="button" className="ck-btn ck-btn-primary" onClick={() => salvar(DENY_ALL)}>
            Recusar opcionais
          </button>
          {detalhes ? (
            <button type="button" className="ck-btn ck-btn-quiet" onClick={() => salvar(escolha)}>
              Salvar escolha
            </button>
          ) : (
            <button type="button" className="ck-btn ck-btn-quiet" onClick={() => setDetalhes(true)}>
              Personalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
