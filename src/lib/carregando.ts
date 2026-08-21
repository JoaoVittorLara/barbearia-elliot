/**
 * Tira o loader de abertura da tela.
 *
 * O loader mora no index.html (marcacao e CSS embutido) para pintar antes de
 * qualquer JS. Quem o remove e este arquivo, chamado uma vez no main.tsx logo
 * depois do render.
 *
 * A saida espera tres coisas, nesta ordem:
 *   1. o React ter pintado o primeiro quadro;
 *   2. a foto da hero ter sido decodificada, senao o loader sairia para
 *      revelar um hero ainda preto, que e pior do que o loader;
 *   3. ter passado o tempo minimo, para o loader nao virar um piscao.
 *
 * Cada espera tem saida de emergencia: imagem quebrada, transicao que nao
 * dispara, nada disso pode deixar a tela travada.
 */

/** Tempo minimo na tela. Abaixo disso o loader le como falha de renderizacao. */
const MINIMO_MS = 600;

/** Teto para a espera da foto. Imagem que nao carrega nao segura a pagina. */
const TETO_FOTO_MS = 2500;

/** Precisa bater com a duracao da transicao no <style> do index.html. */
const FADE_MS = 400;

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Dois quadros: o primeiro agenda, o segundo confirma que o React ja pintou. */
function proximoQuadroPintado() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function fotoDaHeroPronta() {
  const foto = document.querySelector<HTMLImageElement>("#hero-fundo img");
  if (!foto) return;

  // `decode()` rejeita se a imagem falhou. Aqui isso nao e motivo para
  // segurar o loader: melhor mostrar a pagina sem a foto do que nao mostrar.
  await foto.decode().catch(() => undefined);
}

export async function esconderCarregando() {
  const loader = document.getElementById("carregando");
  if (!loader) return;

  await proximoQuadroPintado();
  await Promise.race([fotoDaHeroPronta(), espera(TETO_FOTO_MS)]);

  const desde = window.__carregandoDesde ?? 0;
  const decorrido = performance.now() - desde;
  if (decorrido < MINIMO_MS) await espera(MINIMO_MS - decorrido);

  document.documentElement.classList.remove("carregando-ativo");
  // O #root nasce `inert` no index.html para o teclado nao alcancar o
  // conteudo escondido atras do loader. Devolvido aqui.
  document.getElementById("root")?.removeAttribute("inert");
  loader.classList.add("saindo");

  // Remover do DOM, e nao so esconder: sao 18 elementos animando com
  // drop-shadow, que continuariam gastando CPU e bateria a visita inteira.
  //
  // O timeout ao lado do transitionend nao e redundancia inutil: com
  // movimento reduzido a transicao dura 0.01ms e o evento pode nao ser
  // observado a tempo, e ai o loader nunca sairia.
  let removido = false;
  const remover = () => {
    if (removido) return;
    removido = true;
    loader.remove();
  };

  loader.addEventListener("transitionend", remover, { once: true });
  setTimeout(remover, FADE_MS + 200);
}
