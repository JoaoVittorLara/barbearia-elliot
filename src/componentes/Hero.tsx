import { m } from "motion/react";
import { agendamentoPrincipal, negocio } from "../dados/conteudo";
import { BotaoAgendar } from "./BotaoAgendar";
import { IconeCalendario } from "./Icones";
import { Marquee } from "./Marquee";

/**
 * Primeira tela. Unico lugar do site onde o dourado pode ser alto: ele aparece
 * na metade italica do titulo e no botao, e em mais nada.
 *
 * ATENCAO: a FOTO DE FUNDO nao esta neste arquivo. Ela mora no index.html
 * (bloco `#hero-fundo`) com o estilo em src/index.css, porque e a imagem que
 * define o LCP e dentro do React ela so pintava depois do bundle carregar.
 * Este componente cuida so do texto e do botao, que ficam por cima.
 * A altura das duas partes precisa continuar batendo: 100svh dos dois lados.
 *
 * A entrada e uma sequencia curta: titulo, apoio, botao. Feita com delay
 * escalonado em vez de timeline de biblioteca, que aqui seria peso a toa.
 */
export function Hero() {
  const agendamento = {
    tipo: "cal" as const,
    namespace: agendamentoPrincipal.namespace,
    link: agendamentoPrincipal.link,
  };

  const entrada = (atraso: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: atraso, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="hero"
      /* min-h-svh precisa bater com a altura de #hero-fundo no index.css. */
      className="flex min-h-svh flex-col justify-end"
    >
      {/* --- Conteudo ------------------------------------------------------- */}
      <div className="container-conteudo pt-[calc(var(--h-header)+4rem)] pb-14 md:pb-20">
        {/* Traco dos dois lados, igual ao eyebrow das outras secoes
            (ver TituloSecao.tsx). `w-fit` para os tracos abracarem a palavra
            em vez de esticarem ate a borda da coluna. */}
        <m.p
          {...entrada(0)}
          className="eyebrow mb-6 flex w-fit items-center gap-3"
        >
          <span aria-hidden="true" className="h-px w-8 bg-claro/30" />
          Barbearia
          <span aria-hidden="true" className="h-px w-8 bg-claro/30" />
        </m.p>

        <m.h1
          {...entrada(0.08)}
          className="max-w-[15ch] font-display text-display font-bold text-claro"
        >
          Corte <span className="display-italico text-ouro">perfeito.</span>
          <br />
          Barba <span className="display-italico text-ouro">alinhada.</span>
        </m.h1>

        <m.p
          {...entrada(0.18)}
          className="mt-7 max-w-[46ch] text-corpo text-claro/65"
        >
          {negocio.descricaoCurta} Hora marcada, sem fila e sem improviso.
        </m.p>

        <m.div {...entrada(0.26)} className="mt-9">
          <BotaoAgendar
            agendamento={agendamento}
            rotuloAcessivel="Reservar meu horário na Barbearia Elliot"
          >
            <IconeCalendario />
            Reservar meu horário
          </BotaoAgendar>
        </m.div>
      </div>

      <Marquee />
    </section>
  );
}
