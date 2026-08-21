import { useEffect } from "react";
import { prerenderModal } from "../lib/cal";

/**
 * Baixa o Cal.com e monta o modal escondido na PRIMEIRA interacao da pessoa
 * com a pagina, seja ela qual for.
 *
 * Por que "qualquer interacao" e nao so o hover no botao de reservar: entre
 * chegar no site e clicar em reservar, a pessoa rola, mexe o mouse ou encosta
 * na tela. Isso da alguns segundos de vantagem, o suficiente para o iframe do
 * agendamento estar pronto quando o clique vier. Esperar o hover no botao
 * dava so uns 300ms, e no celular nem isso, porque nao existe hover.
 *
 * Quem abre a pagina e nao interage (inclusive o Lighthouse) nao baixa nada:
 * e o que mantem o script de terceiro e o cookie dele fora do carregamento.
 *
 * Chame uma vez, no App.
 */
export function useCalCom(namespace: string, link: string) {
  useEffect(() => {
    const eventos = ["pointermove", "scroll", "keydown", "touchstart"] as const;

    function aoInteragir() {
      void prerenderModal(namespace, link);
      remover();
    }

    function remover() {
      for (const nome of eventos) {
        window.removeEventListener(nome, aoInteragir);
      }
    }

    for (const nome of eventos) {
      // `once` nao basta: sao quatro eventos e qualquer um deles ja resolve,
      // entao o primeiro que disparar remove os outros tres.
      window.addEventListener(nome, aoInteragir, { passive: true, once: true });
    }

    return remover;
  }, [namespace, link]);
}
