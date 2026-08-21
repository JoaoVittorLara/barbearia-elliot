import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// A extensao .ts e obrigatoria nesta cadeia de imports (aqui, em seo.ts e em
// conteudo.ts). O carregador nativo de config do Vite le estes arquivos fora do
// bundler e nao resolve caminho sem extensao. Nos componentes, que passam pelo
// bundler normal, o import continua sem extensao.
import { montarJsonLd, montarSeo } from "./src/dados/seo.ts";
import { negocio } from "./src/dados/conteudo.ts";

/**
 * URL publica do site, resolvida no momento do build, nesta ordem:
 *
 *   1. `SITE_URL`, para quando existir dominio proprio;
 *   2. a URL de producao que a Vercel injeta sozinha no build;
 *   3. `negocio.site`, que e o que vale rodando local.
 *
 * POR QUE ISSO NAO E UMA CONSTANTE: canonical, og:url, og:image e o sitemap
 * precisam de URL absoluta, e a URL real so existe depois do primeiro deploy.
 * Chumbada no codigo, ela sai errada no ar ate alguem lembrar de trocar, e o
 * preview do link no WhatsApp e no LinkedIn aponta para um dominio inexistente,
 * ou seja, quebra exatamente onde o site esta sendo divulgado.
 *
 * `process.env` aqui e seguro: este arquivo roda no Node, nunca no browser.
 */
function resolverUrlDoSite() {
  const explicita = process.env.SITE_URL;
  if (explicita) return explicita.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return negocio.site;
}

/** Evita que um apostrofo ou < no conteudo quebre o HTML gerado. */
function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Troca o marcador <!--SEO--> do index.html pelas meta tags e pelo JSON-LD,
 * montados a partir de src/dados/conteudo.ts.
 *
 * Roda no dev e no build. Resultado: os dados do negocio existem em UM arquivo
 * so, mas chegam ao HTML estatico, que e onde o Google e o WhatsApp procuram.
 */
function pluginSeo(): Plugin {
  const seo = montarSeo(resolverUrlDoSite());

  return {
    name: "elliot-seo",
    transformIndexHtml(html) {
      const tags = `
    <title>${escapar(seo.titulo)}</title>
    <meta name="description" content="${escapar(seo.descricao)}" />
    <link rel="canonical" href="${seo.url}" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Barbearia Elliot" />
    <meta property="og:url" content="${seo.url}" />
    <meta property="og:title" content="${escapar(seo.titulo)}" />
    <meta property="og:description" content="${escapar(seo.descricao)}" />
    <meta property="og:image" content="${seo.imagemOg}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapar(seo.titulo)}" />
    <meta name="twitter:description" content="${escapar(seo.descricao)}" />
    <meta name="twitter:image" content="${seo.imagemOg}" />

    <script type="application/ld+json">
${JSON.stringify(montarJsonLd(seo.url), null, 2)}
    </script>`;

      return html.replace("<!--SEO-->", tags.trim());
    },
  };
}

/**
 * Gera robots.txt e sitemap.xml a partir da mesma URL resolvida acima.
 *
 * Os dois viviam em `public/` com o dominio escrito a mao, o que fazia deles a
 * segunda e a terceira copia do endereco do site. Sitemap apontando para
 * dominio errado nao e detalhe: e o arquivo que diz ao Google qual URL indexar.
 *
 * Servidos tambem no dev, para o que roda em `npm run dev` ser o mesmo que vai
 * para o ar.
 */
function pluginRobotsSitemap(): Plugin {
  const base = resolverUrlDoSite();

  const arquivos: Record<string, string> = {
    "robots.txt": `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<!-- Pagina unica: uma URL so. Gerado no build por vite.config.ts. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  };

  return {
    name: "elliot-robots-sitemap",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const nome = req.url?.replace(/^\//, "").split("?")[0] ?? "";
        const corpo = arquivos[nome];
        if (!corpo) return next();

        res.setHeader(
          "Content-Type",
          nome.endsWith(".xml") ? "application/xml" : "text/plain",
        );
        res.end(corpo);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(arquivos)) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}

// Tailwind v4 entra como plugin do Vite. Nao existe PostCSS nem
// tailwind.config.js neste projeto: os tokens moram no @theme de src/index.css.
export default defineConfig({
  plugins: [react(), tailwindcss(), pluginSeo(), pluginRobotsSitemap()],
});
