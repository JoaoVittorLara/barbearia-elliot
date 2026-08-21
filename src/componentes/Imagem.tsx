type Props = {
  src: string;
  /**
   * Versao WebP opcional. Quando existe, o browser escolhe ela e cai no `src`
   * se nao souber WebP.
   *
   * Cuidado: um <source type="image/webp"> apontando para arquivo que nao
   * existe NAO faz o browser cair no <img>. Ele mostra imagem quebrada. Por
   * isso o <picture> so e montado quando `srcWebp` foi realmente informado.
   */
  srcWebp?: string;
  alt: string;
  largura: number;
  altura: number;
  /**
   * Lista de variantes por largura, ex.:
   * "/foto-480x600.webp 480w, /foto-800x1000.webp 800w".
   * Junto com `sizes`, deixa o browser baixar so o tamanho que vai usar.
   */
  srcSet?: string;
  className?: string;
  /**
   * Marque `true` apenas na imagem que aparece antes da dobra (a da hero).
   * Ela sai do lazy e ganha prioridade de download, porque e o LCP da pagina.
   */
  prioridade?: boolean;
  /** Dica de tamanho para o browser escolher a fonte certa. */
  sizes?: string;
};

export function Imagem({
  src,
  srcWebp,
  srcSet,
  alt,
  largura,
  altura,
  className = "",
  prioridade = false,
  sizes,
}: Props) {
  const img = (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      // Largura e altura explicitas reservam o espaco antes do download,
      // que e o que evita o conteudo pular quando a imagem chega (CLS).
      width={largura}
      height={altura}
      loading={prioridade ? "eager" : "lazy"}
      decoding={prioridade ? "sync" : "async"}
      fetchPriority={prioridade ? "high" : "auto"}
      sizes={sizes}
      className={className}
    />
  );

  if (!srcWebp) return img;

  return (
    <picture>
      <source srcSet={srcWebp} type="image/webp" sizes={sizes} />
      {img}
    </picture>
  );
}
