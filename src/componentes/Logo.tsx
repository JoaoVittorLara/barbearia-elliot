import { negocio } from "../dados/conteudo";

/* ============================================================================
   LOGO

   Arquivo: `public/logo-elliot.svg`, gerado a partir do original em
   `IMGS/Elliot Logo - Svg.svg`. Tres coisas mudaram, e vale saber por que:

   1. O original tem um retangulo de fundo creme (#F9F8F3) cobrindo a arte
      inteira. Num site preto isso viraria uma placa branca. Foi removido; o
      fundo agora e a propria pagina.
   2. O traco era quase preto (#0A080B) e sumiria no escuro. Virou
      `currentColor`, com `color="#E5E5E5"` na raiz do SVG. O atributo na raiz
      e necessario porque dentro de um <img> o SVG e um documento isolado e
      `currentColor` cairia para preto.
   3. O miolo do "O" era pintado de creme, nao e um furo de verdade. Como so
      existe uma cor de fundo no site, ficou #0D0D0D fixo. Se um dia a logo
      precisar aparecer sobre outra cor, esse miolo tem que acompanhar.

   O dourado da marca era #EDB203 e foi mapeado para o #E8B004 do sistema. A
   diferenca e imperceptivel sozinha, mas dois dourados quase iguais lado a
   lado (logo e botao) pareceriam erro.

   Proporcao do arquivo: 1046 x 292, ou seja 3.58:1.
   ========================================================================= */

type Props = {
  className?: string;
  /** No rodape a marca aparece maior. */
  tamanho?: "normal" | "grande";
};

const MEDIDAS = {
  normal: { altura: 26, largura: 93 },
  grande: { altura: 38, largura: 136 },
} as const;

export function Logo({ className = "", tamanho = "normal" }: Props) {
  const { altura, largura } = MEDIDAS[tamanho];

  return (
    <img
      src="/logo-elliot.svg"
      alt={negocio.nome}
      width={largura}
      height={altura}
      className={className}
      style={{ height: altura, width: "auto" }}
    />
  );
}
