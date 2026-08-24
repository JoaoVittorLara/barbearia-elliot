// Extensao explicita: este arquivo tambem e lido pelo vite.config.ts, fora do
// bundler. Veja o comentario la.
import { horarios, negocio, servicos } from "./conteudo.ts";

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
 * Schema.org. `HairSalon` em vez de `LocalBusiness` puro: e um subtipo dele,
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

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
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
    makesOffer: servicos.map((servico) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: servico.nome,
      },
      price: servico.precoBRL,
      priceCurrency: "BRL",
    })),
  };
}
