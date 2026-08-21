/**
 * Carregamento sob demanda do Cal.com.
 *
 * POR QUE NAO CARREGAR JUNTO COM A PAGINA:
 * o `embed.js` do Cal e script de terceiro, roda no thread principal e ainda
 * grava um cookie de terceiro (`__cf_bm`, do Cloudflare deles). Carregado no
 * boot, custava 300ms de bloqueio e um cookie que a maioria dos visitantes
 * nunca chega a usar, porque nem todo mundo agenda.
 *
 * Agora ele entra na PRIMEIRA interacao da pessoa com a pagina: rolar, mexer o
 * mouse, apertar uma tecla ou encostar na tela. Isso acontece segundos antes de
 * qualquer clique em "reservar", entao quando o botao e clicado o modal ja esta
 * montado e abre na hora. Quem so passa o olho e vai embora nao baixa nada.
 *
 * Tres funcoes, em ordem de agressividade:
 *   prepararCal    baixa o embed e aplica o tema
 *   prerenderModal alem disso, ja monta o iframe escondido
 *   abrirAgendamento espera o que faltar e abre
 *
 * A promessa e memorizada: nao importa quantas vezes seja chamado, o script
 * baixa uma vez so.
 */

type ApiDoCal = Awaited<
  ReturnType<typeof import("@calcom/embed-react").getCalApi>
>;

let carregamento: Promise<ApiDoCal> | null = null;
let jaPrerenderizou = false;

export function prepararCal(namespace: string): Promise<ApiDoCal> {
  if (!carregamento) {
    carregamento = (async () => {
      const { getCalApi } = await import("@calcom/embed-react");
      const cal = await getCalApi({ namespace });

      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#E8B004" },
          dark: {
            "cal-brand": "#E8B004",
            // `cal-bg` e o fundo da PAGINA do Cal dentro do iframe, e esse
            // iframe ocupa a largura inteira da tela, nao so a do card. Com o
            // cinza padrao dele, aparecia uma placa clara atras e ao redor do
            // agendamento. Transparente, o iframe deixa passar o escurecimento
            // do modal e so o card continua visivel.
            // (Pintar de #0D0D0D tambem tira a placa, mas ai a area do iframe
            // fica mais CLARA que o resto, porque o escurecimento do modal nao
            // se aplica a ela. Transparente e o unico que casa em toda a tela.)
            "cal-bg": "transparent",
            // Superficies internas (dias, campos) sobem um degrau a partir do
            // preto, em vez do cinza medio padrao, para o card nao ficar chapado.
            "cal-bg-emphasis": "#242424",
            "cal-bg-subtle": "#1a1a1a",
            "cal-bg-muted": "#141414",
            "cal-border": "#2b2b2b",
            "cal-border-subtle": "#1f1f1f",
          },
        },
      });

      return cal;
    })();
  }

  return carregamento;
}

/**
 * Monta o iframe do agendamento escondido, antes do clique. E o que faz o modal
 * abrir instantaneo em vez de mostrar o carregando.
 */
export async function prerenderModal(namespace: string, link: string) {
  const cal = await prepararCal(namespace);
  if (jaPrerenderizou) return;
  jaPrerenderizou = true;

  cal("preload", { calLink: link, type: "modal" });
}

export async function abrirAgendamento(namespace: string, link: string) {
  const cal = await prepararCal(namespace);

  cal("modal", {
    calLink: link,
    // `theme` precisa vir tambem aqui, no config do modal, e nao so no `ui`:
    // o `ui` sozinho nao venceu a preferencia de aparencia do evento no Cal e
    // o modal abria claro no meio da pagina preta.
    config: {
      layout: "month_view",
      theme: "dark",
      "ui.color-scheme": "dark",
    },
  });
}
