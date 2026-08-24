/**
 * Gera as imagens de public/imagens/ no tamanho e formato certos.
 *
 *   npm run imagens
 *
 * Serve para dois momentos:
 *
 * 1. AGORA: baixa a serie de fotos CC0 que esta servindo de placeholder.
 * 2. DEPOIS: quando a Elliot mandar as fotos reais, coloque os arquivos
 *    originais em `fotos-originais/` na raiz, troque o campo `origem` de cada
 *    item abaixo pelo nome do arquivo, tire o prefixo PLACEHOLDER- do `saida`
 *    e rode de novo. O script corta, redimensiona e converte para WebP.
 *
 * O corte e "cover" com foco no centro: a imagem preenche a caixa inteira sem
 * distorcer, sobrando o que passar da proporcao.
 */

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const destino = join(raiz, "public", "imagens");
const originais = join(raiz, "fotos-originais");
const cache = join(raiz, ".cache-imagens");

/** Base dos arquivos CC0 no Wikimedia Commons (autor Alvinategyeka, dominio publico). */
const CC0 = "https://upload.wikimedia.org/wikipedia/commons";

/**
 * O Wikimedia devolve 429 para User-Agent generico ou sem contato. A politica
 * deles exige nome do cliente + forma de contato. Sem isso, todo download falha.
 * TODO: trocar pelo e-mail real ao publicar.
 */
const UA = "barbearia-elliot/1.0 (preparar-imagens; contato@exemplo.com.br)";

/**
 * origem: URL http(s) OU nome de arquivo dentro de fotos-originais/
 * saida:  nome do arquivo gerado em public/imagens/
 */
const imagens = [
  // --- Hero: a unica imagem que carrega antes da dobra ---------------------
  {
    origem: `${CC0}/0/04/Barbershop_Ritual_01_Arrival.jpg`,
    saida: "PLACEHOLDER-hero-salao-1920x1080.webp",
    largura: 1920,
    altura: 1080,
    qualidade: 68,
  },
  // Versao retrato do hero para celular: a paisagem 16:9 nao preenche a tela
  // em pe, e servir 1920px num aparelho de 390px e desperdicio puro de banda.
  {
    origem: `${CC0}/0/04/Barbershop_Ritual_01_Arrival.jpg`,
    saida: "PLACEHOLDER-hero-salao-960x1280.webp",
    largura: 960,
    altura: 1280,
    qualidade: 66,
  },

  // --- Galeria: 4:5, sempre 800x1000 --------------------------------------
  {
    origem: `${CC0}/7/73/Barbershop_Ritual_03_First_Cut.jpg`,
    saida: "PLACEHOLDER-galeria-01-corte-degrade-800x1000.webp",
  },
  {
    origem: `${CC0}/5/50/Barbershop_Ritual_07_Beard_Trimming.jpg`,
    saida: "PLACEHOLDER-galeria-02-barba-navalha-800x1000.webp",
  },
  {
    origem: `${CC0}/d/dc/Barbershop_Ritual_02_Choosing_Style.jpg`,
    saida: "PLACEHOLDER-galeria-03-cadeira-barbeiro-800x1000.webp",
  },
  {
    origem: `${CC0}/9/90/Barbershop_Ritual_06_Front_Hairline_Precision.jpg`,
    saida: "PLACEHOLDER-galeria-04-acabamento-pezinho-800x1000.webp",
  },
  {
    origem: `${CC0}/7/74/Barbershop_Ritual_05_Barbershop_Conversation.jpg`,
    saida: "PLACEHOLDER-galeria-05-ambiente-800x1000.webp",
  },
  {
    origem: `${CC0}/c/c0/Barbershop_Ritual_08_Perfecting_the_Cut.jpg`,
    saida: "PLACEHOLDER-galeria-06-corte-tesoura-800x1000.webp",
  },
  {
    origem: `${CC0}/1/10/Barbershop_Ritual_10_Aftershave_Ritual.jpg`,
    saida: "PLACEHOLDER-galeria-07-ferramentas-800x1000.webp",
  },
  {
    origem: `${CC0}/7/7f/Barbershop_Ritual_09_Hot_Towel.jpg`,
    saida: "PLACEHOLDER-galeria-08-barba-finalizada-800x1000.webp",
  },
  {
    origem: `${CC0}/8/8d/Barbershop_Ritual_11_Final_Mirror_Check.jpg`,
    saida: "PLACEHOLDER-galeria-09-recepcao-800x1000.webp",
  },
  {
    origem: `${CC0}/d/db/Barbershop_Ritual_12_Proud_Result.jpg`,
    saida: "PLACEHOLDER-galeria-10-corte-social-800x1000.webp",
  },

  // O card de Open Graph nao entra aqui. Ele ja foi uma foto do Wikimedia
  // cortada em 1200x630, e era a peca com mais cara de placeholder do projeto
  // justamente onde ela e vista primeiro: no preview do link, antes de alguem
  // abrir o site. Hoje e um card proprio, com a logo sobre o preto, e a fonte
  // dele e `scripts/og-card.html`. As instrucoes de regerar estao la dentro.
];

const PADRAO = { largura: 800, altura: 1000, qualidade: 72 };

/**
 * Cada foto da galeria tambem sai numa versao menor.
 *
 * No desktop o card tem 352px de largura; servir 800px ali e mandar quase
 * quatro vezes mais pixel do que a tela usa. Com as duas versoes, o `srcset`
 * do componente Imagem deixa o browser escolher: 480 em tela comum, 800 em
 * tela retina.
 */
const LARGURA_MENOR = 480;
const ALTURA_MENOR = 600;

async function existe(caminho) {
  try {
    await access(caminho);
    return true;
  } catch {
    return false;
  }
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Baixa uma vez e guarda em .cache-imagens/. Rodar o script de novo nao volta
 * na rede. O Wikimedia devolve 429 se a gente pedir rapido demais, entao a
 * cada falha o intervalo dobra.
 */
async function baixarComCache(url) {
  const nomeCache = url.split("/").pop();
  const caminhoCache = join(cache, nomeCache);

  if (await existe(caminhoCache)) {
    return readFile(caminhoCache);
  }

  let intervalo = 1500;
  for (let tentativa = 1; tentativa <= 4; tentativa += 1) {
    const resposta = await fetch(url, {
      headers: { "User-Agent": UA },
    });

    if (resposta.ok) {
      const bytes = Buffer.from(await resposta.arrayBuffer());
      await writeFile(caminhoCache, bytes);
      return bytes;
    }

    if (resposta.status !== 429 || tentativa === 4) {
      throw new Error(`HTTP ${resposta.status}`);
    }

    await espera(intervalo);
    intervalo *= 2;
  }

  throw new Error("esgotou as tentativas");
}

async function carregarOrigem(origem) {
  if (origem.startsWith("http")) {
    return baixarComCache(origem);
  }

  const caminho = join(originais, origem);
  if (!(await existe(caminho))) {
    throw new Error(`nao encontrei fotos-originais/${origem}`);
  }
  return readFile(caminho);
}

async function main() {
  await mkdir(destino, { recursive: true });
  await mkdir(cache, { recursive: true });

  let ok = 0;
  let falhas = 0;

  for (const item of imagens) {
    const largura = item.largura ?? PADRAO.largura;
    const altura = item.altura ?? PADRAO.altura;
    const qualidade = item.qualidade ?? PADRAO.qualidade;

    try {
      const entrada = await carregarOrigem(item.origem);
      const canal = sharp(entrada).resize(largura, altura, {
        fit: "cover",
        position: "centre",
      });

      const saida = item.saida.endsWith(".jpg")
        ? await canal.jpeg({ quality: qualidade, mozjpeg: true }).toBuffer()
        : await canal.webp({ quality: qualidade, effort: 5 }).toBuffer();

      await writeFile(join(destino, item.saida), saida);
      const kb = Math.round(saida.length / 1024);
      console.log(`  ok   ${item.saida}  ${largura}x${altura}  ${kb} KB`);
      ok += 1;

      // Galeria ganha a versao menor automaticamente, com o sufixo -480w.
      if (item.saida.includes("galeria")) {
        const menor = await sharp(entrada)
          .resize(LARGURA_MENOR, ALTURA_MENOR, { fit: "cover", position: "centre" })
          .webp({ quality: qualidade, effort: 5 })
          .toBuffer();

        const nomeMenor = item.saida.replace(/-(\d+)x(\d+)\.webp$/, "-480x600.webp");
        await writeFile(join(destino, nomeMenor), menor);
        console.log(
          `  ok   ${nomeMenor}  ${LARGURA_MENOR}x${ALTURA_MENOR}  ${Math.round(menor.length / 1024)} KB`,
        );
        ok += 1;
      }
    } catch (erro) {
      console.error(`  FALHOU  ${item.saida}  ${erro.message}`);
      falhas += 1;
    }

    // Educacao com o servidor de origem: um pedido por vez, com folga.
    if (item.origem.startsWith("http")) await espera(400);
  }

  console.log(`\n${ok} imagem(ns) gerada(s), ${falhas} falha(s).`);
  if (falhas > 0) process.exitCode = 1;
}

main();
