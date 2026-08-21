import { useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { categorias, linkWhatsApp, servicos } from "../dados/conteudo";
import type { CategoriaId, TipoAgendamento } from "../tipos";
import { BotaoAgendar } from "./BotaoAgendar";
import { IconeRelogio, IconeWhatsapp } from "./Icones";
import { Revelar } from "./Revelar";
import { TituloSecao } from "./TituloSecao";

type Filtro = CategoriaId | "todos";

/** "40" vira "40 min"; "70" vira "1h10". Fica mais curto e mais legivel. */
function formatarDuracao(minutos: number) {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, "0")}`;
}

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Lista de servicos com filtro por categoria.
 *
 * Os chips existem porque sao 12 servicos em 4 categorias. Com menos de uns 8
 * itens eles atrapalhariam mais do que ajudam: o usuario le a lista inteira
 * mais rapido do que decide em qual chip clicar.
 *
 * Sobre o dourado: no site que serviu de referencia, todo preco e todo botao
 * da lista eram dourados, uns 20 destaques numa secao so. Aqui o preco e claro
 * e o botao e ghost; o dourado aparece so quando o usuario passa o mouse ou
 * tabula ate ele. Assim a cor continua significando "aja aqui".
 */
export function Servicos() {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const visiveis = useMemo(
    () =>
      filtro === "todos"
        ? servicos
        : servicos.filter((servico) => servico.categoria === filtro),
    [filtro],
  );

  return (
    <section id="servicos" className="secao">
      <div className="container-conteudo">
        <TituloSecao
          eyebrow="Serviços & preços"
          inicio="O que fazemos"
          destaque="bem feito."
          apoio="Do corte clássico ao acabamento na navalha: cada serviço com tempo próprio e preço fechado, sem surpresa na hora de pagar."
        />

        {/* --- Chips de filtro --------------------------------------------- */}
        <Revelar atraso={0.06}>
          <div
            role="group"
            aria-label="Filtrar serviços por categoria"
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {categorias.map((categoria) => {
              const ativo = filtro === categoria.id;
              return (
                <button
                  key={categoria.id}
                  type="button"
                  // aria-pressed conta ao leitor de tela qual chip esta ligado.
                  // Sem isso ele so anuncia "Corte, botao", sem dizer se aplicou.
                  aria-pressed={ativo}
                  onClick={() => setFiltro(categoria.id as Filtro)}
                  className={`rounded-full px-5 py-2.5 text-eyebrow font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                    ativo
                      ? "bg-ouro text-preto"
                      : "border border-claro/18 text-claro/65 hover:border-claro/40 hover:text-claro"
                  }`}
                >
                  {categoria.rotulo}
                </button>
              );
            })}
          </div>
        </Revelar>

        {/* --- Lista -------------------------------------------------------- */}
        <ul className="mt-10">
          <AnimatePresence initial={false} mode="popLayout">
            {visiveis.map((servico) => {
              /* A mensagem do WhatsApp e montada aqui, e nao em conteudo.ts,
                 porque e aqui que `servico.nome` existe. Escrever o nome de
                 novo no dado seria a mesma string duas vezes no mesmo objeto,
                 e um rename deixaria a mensagem falando de outro servico. */
              const agendamento: TipoAgendamento =
                servico.agendamento.tipo === "whatsapp"
                  ? {
                      tipo: "whatsapp",
                      url: linkWhatsApp(
                        `Olá! Vim pelo site e quero agendar: ${servico.nome}.`,
                      ),
                    }
                  : servico.agendamento;

              const porWhatsApp = agendamento.tipo === "whatsapp";

              return (
              <m.li
                key={servico.id}
                /* Sem `layout` de proposito: animacao de layout so existe no
                   pacote `domMax` do Motion, que e uns 10kb maior. A entrada e
                   a saida abaixo ja dao a leitura da troca de filtro. */
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-claro/12 py-4 first:border-t"
              >
                {/* No celular o nome ocupa a linha inteira e duracao, preco e
                    botao caem para a linha de baixo. Sem isso o `flex-1` do
                    nome fica com uns 5px de largura e o texto vaza da tela. */}
                <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                  <h3 className="text-h3 font-medium text-claro">
                    {servico.nome}
                    {servico.detalhe && (
                      <span className="ml-2 text-meta font-normal text-claro/56">
                        {servico.detalhe}
                      </span>
                    )}
                  </h3>
                </div>

                <p className="flex items-center gap-1.5 text-meta text-claro/56">
                  <IconeRelogio />
                  {formatarDuracao(servico.duracaoMin)}
                </p>

                <p className="text-meta font-semibold text-claro tabular-nums sm:w-22 sm:text-right">
                  {moeda.format(servico.precoBRL)}
                </p>

                {/* O icone e o rotulo dizem o destino ANTES do clique. Sem
                    essa diferenca, doze botoes iguais sugerem doze agendas
                    online iguais, e onze delas nao existem. */}
                <BotaoAgendar
                  agendamento={agendamento}
                  variante="ghost"
                  className="ml-auto sm:ml-0"
                  rotuloAcessivel={
                    porWhatsApp
                      ? `Pedir horário de ${servico.nome} no WhatsApp`
                      : `Reservar ${servico.nome}`
                  }
                >
                  {porWhatsApp ? (
                    <>
                      <IconeWhatsapp className="size-4" />
                      Pedir horário
                    </>
                  ) : (
                    "Reservar"
                  )}
                </BotaoAgendar>
              </m.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <Revelar>
          <p className="mt-8 text-center text-meta text-claro/56">
            Agenda online disponível para{" "}
            <strong className="font-semibold text-claro">Barba na Navalha</strong>.
            Nos demais, o horário é combinado no WhatsApp.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
