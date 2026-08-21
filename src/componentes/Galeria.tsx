import { galeria } from "../dados/conteudo";
import { useCarrossel } from "../hooks/useCarrossel";
import { IconeChevron } from "./Icones";
import { Imagem } from "./Imagem";
import { Revelar } from "./Revelar";
import { TituloSecao } from "./TituloSecao";

/**
 * Carrossel de fotos do trabalho e do espaco.
 *
 * A imagem e o conteudo aqui, entao vale a pena o cuidado extra:
 * proporcao fixa 4:5 na caixa, `object-cover` para nada distorcer, dimensoes
 * declaradas para o layout nao pular, e `sizes` para o browser nao baixar uma
 * foto de 800px quando so vai mostrar 300.
 *
 * `data-lenis-prevent` no trilho: sem isso o Lenis captura a roda do mouse e o
 * scroll horizontal do carrossel para de funcionar no trackpad.
 */
export function Galeria() {
  const { trilhoRef, indiceAtivo, irPara, avancar, voltar, podeVoltar, podeAvancar } =
    useCarrossel(galeria.length);

  return (
    <section id="galeria" className="secao border-t border-claro/12">
      <div className="container-conteudo">
        <TituloSecao
          eyebrow="Galeria"
          inicio="Nosso"
          destaque="trabalho."
          apoio="Cortes, barbas e o espaço da casa."
        />
      </div>

      <Revelar atraso={0.06}>
        <div className="container-largo mt-12">
          <ul
            ref={trilhoRef}
            data-lenis-prevent
            tabIndex={0}
            aria-label="Galeria de fotos, use as setas do teclado para navegar"
            className="trilho-carrossel gap-3 md:gap-4"
          >
            {galeria.map((foto) => (
              <li
                key={foto.src}
                className="w-[70vw] max-w-80 overflow-hidden rounded-card sm:w-[45vw] lg:w-88"
              >
                <Imagem
                  src={foto.src}
                  srcSet={
                    foto.srcMenor
                      ? `${foto.srcMenor} 480w, ${foto.src} 800w`
                      : undefined
                  }
                  alt={foto.alt}
                  largura={foto.largura}
                  altura={foto.altura}
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 22rem"
                  className="aspect-4/5 size-full object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                />
              </li>
            ))}
          </ul>

          {/* --- Controles ---------------------------------------------------
              O id nao e decorativo: o BotaoWhatsApp observa este elemento para
              sair da frente. As setas ficam na mesma coluna do FAB (24px a 68px
              da direita contra 20px a 76px dele), entao sem isso a seta
              "proxima" fica coberta quando esta linha cai perto do rodape da
              tela. Renomear o id sem mexer la traz o bug de volta. */}
          <div
            id="galeria-controles"
            className="mt-6 flex items-center justify-between gap-6"
          >
            {/* No celular, dez dots mais duas setas nao cabem em 375px e as
                setas eram empurradas para fora da tela. Ali entra um contador;
                os dots voltam a partir de 640px, onde ha espaco. */}
            <p
              aria-live="polite"
              className="text-meta tabular-nums text-claro/56 sm:hidden"
            >
              <span className="text-claro">{indiceAtivo + 1}</span> / {galeria.length}
            </p>

            <div
              className="hidden gap-2 sm:flex"
              role="tablist"
              aria-label="Ir para a foto"
            >
              {galeria.map((foto, indice) => {
                const ativo = indice === indiceAtivo;
                return (
                  <button
                    key={foto.src}
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    aria-label={`Foto ${indice + 1} de ${galeria.length}`}
                    onClick={() => irPara(indice)}
                    /* Alvo de toque de 24px com o ponto visivel menor dentro:
                       um dot de 8px sozinho e pequeno demais para o dedo. */
                    className="grid size-6 place-items-center"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        ativo ? "w-5 bg-claro" : "w-1.5 bg-claro/30"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <BotaoSeta
                direcao="anterior"
                onClick={voltar}
                desabilitado={!podeVoltar}
              />
              <BotaoSeta
                direcao="proxima"
                onClick={avancar}
                desabilitado={!podeAvancar}
              />
            </div>
          </div>
        </div>
      </Revelar>
    </section>
  );
}

function BotaoSeta({
  direcao,
  onClick,
  desabilitado,
}: {
  direcao: "anterior" | "proxima";
  onClick: () => void;
  desabilitado: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      aria-label={direcao === "anterior" ? "Foto anterior" : "Próxima foto"}
      className="grid size-11 place-items-center rounded-reto border border-claro/18 text-claro/80 transition-colors hover:border-claro/45 hover:text-claro disabled:pointer-events-none disabled:opacity-30"
    >
      <IconeChevron className={direcao === "anterior" ? "size-5 rotate-180" : "size-5"} />
    </button>
  );
}
