import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { perguntas } from "../dados/conteudo";
import { IconeChevron } from "./Icones";
import { Revelar } from "./Revelar";
import { TituloSecao } from "./TituloSecao";

/**
 * Perguntas frequentes, em acordeao: uma aberta por vez, abrir outra fecha a
 * anterior. Botao inteiro clicavel, nao so a seta, e a seta gira 90° ao abrir
 * — o mesmo gesto do IconeChevron nas setas da Galeria, então quem já rolou o
 * carrossel reconhece o sinal aqui.
 *
 * Altura animada com `height: "auto"` via AnimatePresence, sem a prop
 * `layout`: o pacote `domAnimation` (ver App.tsx) não tem animação de layout,
 * só anima valor explícito, que é o que fazemos aqui.
 *
 * Mesma fonte que alimenta o FAQPage em seo.ts: a pergunta e a resposta aqui
 * têm que ser sempre o texto que o Google lê, nunca uma segunda versão.
 */
export function Faq() {
  const [abertaId, setAbertaId] = useState<string | null>(null);

  function alternar(id: string) {
    setAbertaId((atual) => (atual === id ? null : id));
  }

  return (
    <section
      id="faq"
      className="secao border-t border-claro/12"
      aria-labelledby="faq-titulo"
    >
      <div className="container-conteudo">
        <TituloSecao
          id="faq-titulo"
          eyebrow="Perguntas frequentes"
          inicio="Ainda com"
          destaque="dúvidas?"
          apoio="As perguntas que mais chegam antes de alguém agendar."
        />

        <div className="mx-auto mt-12 max-w-[68ch]">
          {perguntas.map((item, indice) => {
            const aberta = abertaId === item.id;
            const idResposta = `faq-resposta-${item.id}`;

            return (
              <Revelar
                key={item.id}
                atraso={Math.min(indice, 4) * 0.05}
                className="border-b border-claro/12 first:border-t"
              >
                {/* h3 envolve o botao: o padrao de disclosure acessivel do
                    WAI-ARIA. O titulo continua sendo cabecalho de verdade,
                    so que agora clicavel. */}
                <h3>
                  <button
                    type="button"
                    onClick={() => alternar(item.id)}
                    aria-expanded={aberta}
                    aria-controls={idResposta}
                    className={`flex w-full items-center justify-between gap-4 py-5 text-left text-h3 font-medium transition-colors hover:text-claro ${
                      aberta ? "text-claro" : "text-claro/80"
                    }`}
                  >
                    {item.pergunta}
                    <m.span
                      aria-hidden="true"
                      animate={{ rotate: aberta ? -90 : 90 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 text-claro/56"
                    >
                      <IconeChevron className="size-4" />
                    </m.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {aberta && (
                    <m.div
                      id={idResposta}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-corpo text-claro/65 text-pretty">
                        {item.resposta}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
