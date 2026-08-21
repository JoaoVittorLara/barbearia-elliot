import { avaliacoes } from "../dados/conteudo";
import { IconeEstrela } from "./Icones";
import { Revelar } from "./Revelar";
import { TituloSecao } from "./TituloSecao";

/**
 * Prova social.
 *
 * Grade de tres colunas no desktop em vez de carrossel: prova escondida atras
 * de uma seta nao convence ninguem, porque quase ninguem clica na seta. No
 * celular, onde tres colunas nao cabem, a MESMA lista vira um trilho horizontal
 * com scroll-snap. Sem JS e sem DOM duplicado, so CSS trocando de modo.
 */
export function Avaliacoes() {
  return (
    <section id="avaliacoes" className="secao border-t border-claro/12">
      <div className="container-conteudo">
        <TituloSecao
          eyebrow="Avaliações"
          inicio="O que dizem"
          destaque="os clientes."
          apoio="Avaliações publicadas no Google, no Booksy e no Instagram."
        />

        <ul
          className="trilho-carrossel mt-12 gap-4 pb-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0"
          data-lenis-prevent
        >
          {avaliacoes.map((avaliacao, indice) => (
            <Revelar
              key={avaliacao.id}
              como="li"
              atraso={Math.min(indice, 2) * 0.07}
              className="w-[85vw] max-w-88 md:w-auto md:max-w-none"
            >
              <figure className="card flex h-full flex-col p-7">
                <div
                  className="flex gap-0.5 text-claro/80"
                  role="img"
                  aria-label={`${avaliacao.nota} de 5 estrelas`}
                >
                  {Array.from({ length: avaliacao.nota }, (_, i) => (
                    <IconeEstrela key={i} />
                  ))}
                </div>

                <blockquote className="mt-5 flex-1 text-corpo text-claro/80 text-pretty">
                  {avaliacao.texto}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-2 border-t border-claro/10 pt-5 text-meta">
                  <span className="font-medium text-claro">{avaliacao.autor}</span>
                  <span aria-hidden="true" className="text-claro/30">
                    ·
                  </span>
                  <span className="text-claro/56">{avaliacao.fonte}</span>
                </figcaption>
              </figure>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}
