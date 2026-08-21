import { useEffect } from "react";

/**
 * Liga o smooth scroll com inercia e faz as ancoras (#servicos, #contato...)
 * pararem na altura certa, e nao debaixo do header fixo.
 *
 * Quatro detalhes que nao sao obvios:
 *
 * 1. Se o usuario pede movimento reduzido, o Lenis nem e carregado. Scroll
 *    sequestrado e justamente o tipo de coisa que incomoda quem ativou isso.
 *
 * 2. O Lenis substitui o scroll nativo, entao `href="#secao"` pararia de
 *    animar. Por isso o clique e interceptado e passado para `lenis.scrollTo`.
 *
 * 3. NAO passe `offset` para o scrollTo. O Lenis ja respeita o
 *    `scroll-margin-top` que o CSS coloca nas secoes; somar um offset aqui
 *    aplica o desconto duas vezes e a secao para uns 90px abaixo do certo.
 *    Quem manda na altura da parada e so o CSS.
 *
 * 4. O import e dinamico e so roda quando o browser fica ocioso. Scroll suave
 *    e enfeite: ninguem rola a pagina no primeiro instante, e ate o Lenis
 *    chegar o scroll nativo funciona igual, inclusive as ancoras (o
 *    `scroll-margin-top` do CSS vale sozinho). Tirar isso do caminho critico
 *    adianta a primeira pintura no celular.
 */
export function useLenis() {
  useEffect(() => {
    const querMenosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (querMenosMovimento) return;

    let cancelado = false;
    let desmontar: (() => void) | null = null;

    async function iniciar() {
      const { default: Lenis } = await import("lenis");
      if (cancelado) return;

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        // O gesto de toque do celular ja e suave por conta do sistema.
        // Sobrepor isso deixa o scroll com sensacao de "escorregadio".
        syncTouch: false,
      });

      let quadro = requestAnimationFrame(function passo(tempo) {
        lenis.raf(tempo);
        quadro = requestAnimationFrame(passo);
      });

      function aoClicar(evento: MouseEvent) {
        // Ctrl/Cmd ou botao do meio: deixa o browser abrir em outra aba.
        if (evento.defaultPrevented || evento.metaKey || evento.ctrlKey) return;

        const alvo = (evento.target as HTMLElement | null)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!alvo) return;

        const ancora = alvo.getAttribute("href");
        if (!ancora || ancora === "#") return;

        const destino = document.querySelector(ancora);
        if (!destino) return;

        evento.preventDefault();
        lenis.scrollTo(destino as HTMLElement);
        // Mantem a URL compartilhavel sem provocar o pulo nativo do browser.
        history.pushState(null, "", ancora);
      }

      document.addEventListener("click", aoClicar);

      desmontar = () => {
        document.removeEventListener("click", aoClicar);
        cancelAnimationFrame(quadro);
        lenis.destroy();
      };
    }

    // requestIdleCallback nao existe no Safari mais antigo: cai no timeout.
    const agendar =
      window.requestIdleCallback ??
      ((fn: () => void) => window.setTimeout(fn, 600));
    const cancelarAgendamento = window.cancelIdleCallback ?? window.clearTimeout;

    const idAgendamento = agendar(() => void iniciar());

    return () => {
      cancelado = true;
      cancelarAgendamento(idAgendamento as number);
      desmontar?.();
    };
  }, []);
}
