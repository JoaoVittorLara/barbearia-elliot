import { indicadores } from "../dados/conteudo";

/**
 * Faixa de indicadores de confianca que corre sob a hero.
 *
 * A lista e duplicada no DOM porque o loop e feito com translateX de -50%:
 * quando a primeira copia sai de cena, a segunda ja esta exatamente no lugar
 * dela e a emenda nao aparece.
 *
 * A copia e `aria-hidden` para o leitor de tela nao ler tudo duas vezes.
 * A animacao pausa no hover e no foco (regra WCAG 2.2.2: conteudo em movimento
 * precisa poder ser parado).
 */
export function Marquee() {
  return (
    <div
      className="marquee mascara-lateral overflow-hidden border-y border-claro/12 py-4"
      aria-label="Indicadores da barbearia"
    >
      <div className="marquee-trilho">
        <Fila />
        <Fila ariaOculto />
      </div>
    </div>
  );
}

function Fila({ ariaOculto = false }: { ariaOculto?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={ariaOculto || undefined}>
      {indicadores.map((texto, indice) => (
        <li
          key={`${texto}-${indice}`}
          className="flex items-center whitespace-nowrap px-6 text-eyebrow font-medium uppercase tracking-[0.2em] text-claro/65"
        >
          {texto}
          {/* Separador decorativo entre um item e o proximo. */}
          <span aria-hidden="true" className="ml-6 text-claro/25">
            /
          </span>
        </li>
      ))}
    </ul>
  );
}
