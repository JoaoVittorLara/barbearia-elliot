import { Revelar } from "./Revelar";

/**
 * Abertura padrao de secao: eyebrow, titulo em duas partes e linha de apoio.
 *
 * O titulo vem partido em `inicio` + `destaque` porque o padrao tipografico do
 * projeto e sempre esse: a primeira metade em romano, a segunda em italico.
 * Repetir esse markup em cada secao daria divergencia na terceira copia.
 *
 * O italico aqui NAO e dourado. So a hero usa dourado no titulo; nas demais
 * secoes ele gastaria o acento sem pedir acao nenhuma.
 */

type Props = {
  eyebrow: string;
  inicio: string;
  destaque: string;
  apoio?: string;
  /** Centralizado na maioria das secoes; a esquerda quando divide espaco. */
  alinhamento?: "centro" | "esquerda";
};

export function TituloSecao({
  eyebrow,
  inicio,
  destaque,
  apoio,
  alinhamento = "centro",
}: Props) {
  const centro = alinhamento === "centro";

  return (
    <Revelar className={centro ? "text-center" : ""}>
      <p
        className={`eyebrow flex items-center gap-3 ${centro ? "justify-center" : ""}`}
      >
        <span aria-hidden="true" className="h-px w-6 bg-claro/25" />
        {eyebrow}
        <span aria-hidden="true" className="h-px w-6 bg-claro/25" />
      </p>

      <h2 className="mt-5 font-display text-h2 font-bold text-claro text-balance">
        {inicio} <span className="display-italico text-claro/80">{destaque}</span>
      </h2>

      {apoio && (
        <p
          className={`mt-5 max-w-[52ch] text-corpo text-claro/65 text-pretty ${centro ? "mx-auto" : ""}`}
        >
          {apoio}
        </p>
      )}
    </Revelar>
  );
}
