import { useEffect, useState } from "react";
import { m } from "motion/react";
import { negocio } from "../dados/conteudo";
import { IconeWhatsapp } from "./Icones";

/**
 * Botao flutuante de WhatsApp.
 *
 * Dourado, e nao verde do WhatsApp, por uma razao: a paleta do site tem tres
 * cores e so tres. Um verde de marca aqui seria uma quarta cor gritando na
 * tela inteira. Como so existe um botao flutuante por vez, ele nao briga com
 * o CTA da hero pelo mesmo espaco visual.
 */

/**
 * Elementos que o FAB nao pode cobrir. Enquanto qualquer um deles estiver na
 * tela, ele sai de cena.
 *
 * - `hero`               o CTA principal ja esta ali. Dois botoes competindo na
 *                        primeira tela e uma escolha a mais que ninguem pediu.
 * - `galeria-controles`  as setas do carrossel ocupam a mesma coluna da direita
 *                        que o FAB, entao a seta "proxima" fica embaixo dele.
 *                        Subir o FAB nao resolveria: os dois seguem na mesma
 *                        coluna e a rolagem e continua, entao o encontro so
 *                        mudaria de altura. Ceder o lugar resolve.
 */
const ZONAS_DE_CONFLITO = ["hero", "galeria-controles"];

export function BotaoWhatsApp() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvos = ZONAS_DE_CONFLITO.map((id) =>
      document.getElementById(id),
    ).filter((elemento) => elemento !== null);

    if (alvos.length === 0) return;

    // Um observer para todos os alvos. O Set guarda quem esta na tela agora,
    // porque o callback so recebe quem mudou, nao a situacao inteira.
    const naTela = new Set<Element>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) naTela.add(entrada.target);
          else naTela.delete(entrada.target);
        }
        setVisivel(naTela.size === 0);
      },
      { threshold: 0 },
    );

    for (const alvo of alvos) observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <m.a
      href={negocio.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Barbearia Elliot no WhatsApp"
      initial={false}
      animate={
        visivel
          ? { opacity: 1, scale: 1, pointerEvents: "auto" }
          : { opacity: 0, scale: 0.85, pointerEvents: "none" }
      }
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-8 right-5 z-40 grid size-14 place-items-center rounded-full bg-ouro text-preto shadow-lg shadow-black/40"
    >
      {/* Anel de pulso. Decorativo e fora do fluxo, some com movimento reduzido. */}
      <span
        aria-hidden="true"
        className="pulso-fab absolute inset-0 rounded-full bg-ouro"
      />
      <IconeWhatsapp className="relative size-7" />
    </m.a>
  );
}
