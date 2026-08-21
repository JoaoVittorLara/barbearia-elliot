import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Controla um carrossel feito com scroll nativo + scroll-snap.
 *
 * POR QUE SCROLL NATIVO e nao transform em JS: o gesto de arrastar no celular,
 * o scroll horizontal do trackpad e a navegacao por teclado ja vem prontos do
 * browser. Reimplementar isso com transform costuma quebrar pelo menos um dos
 * tres.
 *
 * O indicador ativo vem de IntersectionObserver, nunca de conta com scrollLeft.
 * Conta manual erra com scroll suave, com zoom e com gap variavel, e o dot
 * comeca a piscar entre dois estados.
 */
export function useCarrossel(quantidade: number) {
  const trilhoRef = useRef<HTMLUListElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    const itens = Array.from(trilho.children) as HTMLElement[];
    const visiveis = new Set<number>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const indice = itens.indexOf(entrada.target as HTMLElement);
          if (indice === -1) continue;
          if (entrada.isIntersecting) visiveis.add(indice);
          else visiveis.delete(indice);
        }
        // Quando varios itens aparecem juntos (desktop mostra 3), o "atual" e
        // o primeiro da esquerda. E o que casa com a posicao do scroll.
        if (visiveis.size > 0) setIndiceAtivo(Math.min(...visiveis));
      },
      { root: trilho, threshold: 0.6 },
    );

    itens.forEach((item) => observador.observe(item));
    return () => observador.disconnect();
  }, [quantidade]);

  const irPara = useCallback((alvo: number) => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    const item = trilho.children[alvo] as HTMLElement | undefined;
    if (!item) return;

    const querMenosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    trilho.scrollTo({
      left: item.offsetLeft - trilho.offsetLeft,
      behavior: querMenosMovimento ? "auto" : "smooth",
    });
  }, []);

  const avancar = useCallback(
    () => irPara(Math.min(indiceAtivo + 1, quantidade - 1)),
    [irPara, indiceAtivo, quantidade],
  );

  const voltar = useCallback(
    () => irPara(Math.max(indiceAtivo - 1, 0)),
    [irPara, indiceAtivo],
  );

  return {
    trilhoRef,
    indiceAtivo,
    irPara,
    avancar,
    voltar,
    podeVoltar: indiceAtivo > 0,
    podeAvancar: indiceAtivo < quantidade - 1,
  };
}
