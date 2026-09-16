// Extensao explicita: este arquivo tambem e lido pelo vite.config.ts, fora do
// bundler. Veja o comentario la.
import { horarios, negocio, perguntas, servicos } from "./conteudo.ts";
import type { CategoriaId } from "../tipos.ts";

/**
 * Monta as meta tags e o JSON-LD a partir de conteudo.ts.
 *
 * POR QUE NAO ESCREVER ISSO DIRETO NO index.html: seria a segunda copia do
 * endereco, do telefone e dos horarios. Na primeira vez que a Elliot mudasse
 * de horario, o site diria uma coisa e o Google leria outra. Aqui o dado
 * continua tendo um dono so.
 *
 * O vite.config.ts chama estas funcoes durante o build e injeta o resultado
 * no HTML. Nada disso roda no browser: o custo em runtime e zero.
 */

/**
 * `base` e a URL publica do site, sem barra no final. Ela chega de fora, do
 * vite.config.ts, porque so e conhecida no momento do build: em producao vem da
 * Vercel, rodando local vem de `negocio.site`. Ver `resolverUrlDoSite()` la.
 */
const imagemOg = (base: string) => `${base}/imagens/og-elliot-1200x630.jpg`;

export function montarSeo(base: string) {
  return {
    titulo: `${negocio.nome} · Corte masculino, barba na navalha e acabamento`,
    descricao: `${negocio.descricaoCurta} Agendamento online, hora marcada, em ${negocio.endereco.cidade}.`,
    url: base,
    imagemOg: imagemOg(base),
  };
}

/**
 * Tipo generico de servico por categoria, para o `serviceType` do schema.
 * Nao e dado inventado: e so uma classificacao do que a categoria ja diz em
 * `conteudo.ts`. Sem isso, todo Service sairia com o mesmo tipo implicito.
 */
const SERVICE_TYPE_POR_CATEGORIA: Record<CategoriaId, string> = {
  corte: "Corte de cabelo masculino",
  barba: "Barba",
  combos: "Combo de corte e barba",
  outros: "Serviço de barbearia",
};

/**
 * ItemList com um Service por linha do cardapio de `conteudo.ts`. Cada
 * Service referencia a barbearia por `@id` (`provider`) em vez de repetir
 * nome, endereco ou telefone: o node `HairSalon` continua sendo o unico
 * lugar onde esses dados existem.
 *
 * So "Barba na Navalha" (`agendamento.tipo === "cal"`) recebe `offers` com
 * preco: e o unico servico com agenda online real. Preco em `Offer` e
 * afirmacao comercial, e emitir isso para um servico que a Elliot ainda nao
 * confirmou seria o mesmo erro que a regra do projeto ja proibe para
 * depoimento com nome falso ou nota inventada — so que agora lido por
 * mecanismo de busca em vez de por uma pessoa.
 */
function montarCatalogoServicos(base: string, barbeariaId: string) {
  return {
    "@type": "ItemList",
    "@id": `${base}/#servicos`,
    name: `Serviços — ${negocio.nome}`,
    itemListElement: servicos.map((servico, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      item: {
        "@type": "Service",
        name: servico.nome,
        serviceType: SERVICE_TYPE_POR_CATEGORIA[servico.categoria],
        areaServed: {
          "@type": "City",
          name: negocio.endereco.cidade,
        },
        provider: { "@id": barbeariaId },
        ...(servico.agendamento.tipo === "cal" && {
          offers: {
            "@type": "Offer",
            price: servico.precoBRL,
            priceCurrency: "BRL",
          },
        }),
      },
    })),
  };
}

/**
 * FAQPage a partir de `perguntas` em conteudo.ts. Mesmo array que alimenta a
 * secao visivel (Faq.tsx): pergunta e resposta aqui tem que ser sempre o
 * texto que a pessoa le na tela, nunca uma segunda copia dele.
 */
function montarFaqPage(base: string) {
  return {
    "@type": "FAQPage",
    "@id": `${base}/#faq`,
    mainEntity: perguntas.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  };
}

/**
 * Schema.org, como `@graph` para caber mais de um node sob o mesmo
 * `@context`. `HairSalon` em vez de `LocalBusiness` puro: e um subtipo dele,
 * mais especifico, e e o que o Google usa para montar o painel de negocio
 * local de barbearia.
 */
export function montarJsonLd(base: string) {
  const expediente = horarios
    .filter((horario) => horario.diasSchema && horario.abre && horario.fecha)
    .map((horario) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: horario.diasSchema,
      opens: horario.abre,
      closes: horario.fecha,
    }));

  const precos = servicos.map((servico) => servico.precoBRL);
  const barbeariaId = `${base}/#barbearia`;

  const barbearia = {
    "@type": "HairSalon",
    "@id": barbeariaId,
    name: negocio.nome,
    description: negocio.descricaoCurta,
    url: base,
    image: imagemOg(base),
    telephone: negocio.telefoneLink,
    priceRange: `R$${Math.min(...precos)} a R$${Math.max(...precos)}`,
    currenciesAccepted: "BRL",
    // Rua e CEP entram so quando existem. Campo de endereco vazio no JSON-LD e
    // pior do que campo ausente: o Google trata como dado incompleto.
    address: {
      "@type": "PostalAddress",
      ...(negocio.endereco.rua && { streetAddress: negocio.endereco.rua }),
      addressLocality: negocio.endereco.cidade,
      addressRegion: negocio.endereco.uf,
      ...(negocio.endereco.cep && { postalCode: negocio.endereco.cep }),
      addressCountry: "BR",
    },
    hasMap: negocio.mapaRotaUrl,
    openingHoursSpecification: expediente,
    // Sem `aggregateRating`: nota agregada so entra quando existir avaliacao
    // real. Numero inventado aqui e motivo de penalizacao do Google, alem de
    // ser mentira para quem le.
    //
    // Sem `makesOffer` aqui: ele existia com Offer/price para os 12 servicos,
    // 11 deles placeholder, o que violava a mesma regra do paragrafo acima.
    // O ItemList abaixo cobre o catalogo de servicos e ja respeita o filtro.
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      barbearia,
      montarCatalogoServicos(base, barbeariaId),
      montarFaqPage(base),
    ],
  };
}
