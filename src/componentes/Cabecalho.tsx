import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { agendamentoPrincipal, navegacao } from "../dados/conteudo";
import { BotaoAgendar } from "./BotaoAgendar";
import { IconeFechar, IconeMenu } from "./Icones";
import { Logo } from "./Logo";

/**
 * Header fixo com as ancoras e o CTA de agendamento sempre a vista.
 *
 * Sobre a hero ele e transparente, para a foto respirar. Assim que a pagina
 * rola, ganha fundo e uma hairline embaixo: sem isso o texto branco do menu
 * some quando passa por cima de uma foto clara.
 */
export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Menu aberto no celular: Esc fecha e a pagina atras nao rola junto.
  useEffect(() => {
    if (!menuAberto) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAberto(false);
    };

    document.addEventListener("keydown", aoTeclar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [menuAberto]);

  const agendamento = {
    tipo: "cal" as const,
    namespace: agendamentoPrincipal.namespace,
    link: agendamentoPrincipal.link,
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-(--h-header) transition-colors duration-300 ${
        rolou || menuAberto
          ? "border-b border-claro/12 bg-preto/92 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-largo flex h-full items-center justify-between gap-6">
        {/* Sem aria-label aqui, de proposito. Um aria-label SUBSTITUI o texto
            que aparece na tela, e pela regra WCAG 2.5.3 o nome acessivel tem
            que conter esse texto visivel: quem usa comando de voz fala o que
            le. Deixando o nome sair do proprio conteudo, os dois nunca
            divergem. O complemento vai num span so para leitor de tela, DEPOIS
            da marca, para a ordem continuar batendo. */}
        <a href="#hero" className="shrink-0">
          <Logo />
          <span className="apenas-leitor-tela">, ir para o topo da página</span>
        </a>

        {/* Navegacao de desktop */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navegacao.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-eyebrow font-medium uppercase tracking-[0.16em] text-claro/65 transition-colors hover:text-claro"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Ghost enquanto a hero esta na tela, ouro depois que ela sai.
              Motivo: o CTA da hero ja e um botao dourado grande. Dois dourados
              na mesma dobra disputam a mesma atencao e nenhum vence. Assim
              existe sempre exatamente um CTA dourado visivel. */}
          <BotaoAgendar
            agendamento={agendamento}
            variante={rolou ? "ouro" : "ghost"}
            className="hidden px-6 py-3 sm:inline-flex"
            rotuloAcessivel="Agendar horário na Barbearia Elliot"
          >
            Agendar
          </BotaoAgendar>

          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            className="p-2 text-claro md:hidden"
          >
            {menuAberto ? <IconeFechar /> : <IconeMenu />}
          </button>
        </div>
      </div>

      {/* Painel do celular */}
      <AnimatePresence>
        {menuAberto && (
          <m.nav
            id="menu-mobile"
            aria-label="Navegação principal"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b border-claro/12 bg-preto/98 backdrop-blur-sm md:hidden"
          >
            <ul className="container-largo flex flex-col py-2">
              {navegacao.map((item) => (
                <li key={item.href} className="border-b border-claro/10 last:border-0">
                  <a
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    className="block py-4 text-h3 font-display text-claro"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
              <li className="pt-4 pb-2 sm:hidden">
                <BotaoAgendar
                  agendamento={agendamento}
                  className="w-full"
                  rotuloAcessivel="Agendar horário na Barbearia Elliot"
                >
                  Agendar
                </BotaoAgendar>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
