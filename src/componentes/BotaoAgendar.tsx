import { m } from "motion/react";
import type { ReactNode } from "react";
import { negocio } from "../dados/conteudo";
import { abrirAgendamento } from "../lib/cal";
import type { TipoAgendamento } from "../tipos";

/**
 * O unico botao de agendamento do site. Tudo que reserva horario passa por aqui.
 *
 * Dois comportamentos, definidos no dado (conteudo.ts), nunca no markup:
 *
 * - `cal`       abre o modal do Cal.com por chamada de funcao, nao pelos
 *               atributos data-cal-*. O `useCalCom` no App ja deixou o iframe
 *               montado na primeira interacao da pessoa com a pagina, entao o
 *               clique so mostra. Se por algum motivo ainda nao estiver pronto,
 *               a funcao espera em vez de falhar.
 * - `whatsapp`  abre uma conversa, com a mensagem de `url` quando ela existe.
 *               E um <a> de verdade, nao um <button> disfarcado: assim o
 *               teclado, o "abrir em nova aba" e o menu do botao direito
 *               funcionam sozinhos.
 *
 * NAO EXISTE VARIANTE SEM DESTINO, e isso e deliberado. Ja existiu: onze dos
 * doze servicos tinham um <button> com onClick undefined, mas com whileHover e
 * whileTap ligados. O botao levantava com o mouse, afundava no clique e nao
 * acontecia nada. A animacao promete resposta; quem testa conclui que o site
 * esta quebrado. Botao sem destino e pior do que ausencia de botao.
 */

type Props = {
  agendamento: TipoAgendamento;
  children: ReactNode;
  /** `ouro` e o CTA principal. `ghost` e a acao por linha da lista. */
  variante?: "ouro" | "ghost";
  className?: string;
  /**
   * Contexto para o leitor de tela. Sem isso, uma lista com doze botoes
   * "Reservar" vira doze rotulos identicos.
   *
   * WCAG 2.5.3: precisa CONTER o texto visivel do botao, nao substitui-lo.
   */
  rotuloAcessivel?: string;
};

/** Um objeto so, para os dois elementos nao divergirem no movimento. */
const movimento = {
  whileHover: { y: -2 },
  whileTap: { y: 0, scale: 0.98 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
} as const;

export function BotaoAgendar({
  agendamento,
  children,
  variante = "ouro",
  className = "",
  rotuloAcessivel,
}: Props) {
  const classes = `btn ${variante === "ouro" ? "btn-ouro" : "btn-ghost"} ${className}`;

  if (agendamento.tipo === "whatsapp") {
    return (
      <m.a
        href={agendamento.url ?? negocio.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={rotuloAcessivel}
        className={classes}
        {...movimento}
      >
        {children}
      </m.a>
    );
  }

  return (
    <m.button
      type="button"
      onClick={() => void abrirAgendamento(agendamento.namespace, agendamento.link)}
      aria-label={rotuloAcessivel}
      className={classes}
      {...movimento}
    >
      {children}
    </m.button>
  );
}
