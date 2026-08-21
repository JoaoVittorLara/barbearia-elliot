import { horarios, negocio } from "../dados/conteudo";
import { IconePin, IconeRelogio, IconeSeta, IconeTelefone, IconeWhatsapp } from "./Icones";
import { Revelar } from "./Revelar";
import { TituloSecao } from "./TituloSecao";

/**
 * Contato e localizacao. Esta secao nao existia no Figma de referencia,
 * foi desenhada do zero.
 *
 * O mapa e um iframe do Google Maps sem chave de API (`?q=...&output=embed`),
 * visivel desde o inicio, com `loading="lazy"`.
 *
 * Ja existiu aqui uma fachada de clique, que so montava o iframe depois que a
 * pessoa clicasse. Foi desfeita: o `loading="lazy"` sozinho ja mantem o peso do
 * Google fora do carregamento inicial, porque a secao fica bem abaixo da dobra.
 * A fachada nao economizava nada alem disso e custava o visual do mapa, que
 * nesta pagina e o que mostra a localizacao de relance.
 */
export function ContatoLocal() {
  const { endereco } = negocio;

  return (
    <section id="contato" className="secao border-t border-claro/12">
      <div className="container-conteudo">
        <TituloSecao
          eyebrow="Onde nos achar"
          inicio="Local &"
          destaque="horários."
          apoio="Atendimento com hora marcada. Chegue cinco minutos antes e a cadeira já está livre."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* --- Coluna de dados --------------------------------------------- */}
          <Revelar className="flex flex-col gap-8">
            <div>
              <h3 className="eyebrow flex items-center gap-2">
                <IconePin className="size-3.5" />
                Endereço
              </h3>
              {/* Rua e CEP so aparecem se existirem em conteudo.ts. Hoje nao
                  existem: a localizacao divulgada e de bairro. */}
              <address className="mt-3 text-h3 font-normal not-italic text-claro">
                {endereco.rua && (
                  <>
                    {endereco.rua}
                    <br />
                  </>
                )}
                {endereco.bairro}
                <br />
                <span className="text-claro/65">
                  {endereco.cidade} · {endereco.uf}
                </span>
                {endereco.cep && (
                  <>
                    <br />
                    <span className="text-meta text-claro/56">
                      CEP {endereco.cep}
                    </span>
                  </>
                )}
              </address>
            </div>

            <div>
              <h3 className="eyebrow flex items-center gap-2">
                <IconeRelogio />
                Horários
              </h3>
              <dl className="mt-3">
                {horarios.map((horario) => (
                  <div
                    key={horario.dias}
                    className="flex items-baseline justify-between gap-4 border-b border-claro/10 py-3 last:border-0"
                  >
                    <dt
                      className={horario.fechado ? "text-claro/56" : "text-claro"}
                    >
                      {horario.dias}
                    </dt>
                    <dd
                      className={`tabular-nums ${horario.fechado ? "text-claro/56" : "text-claro/80"}`}
                    >
                      {horario.faixa}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="eyebrow flex items-center gap-2">
                <IconeTelefone className="size-3.5" />
                Contato
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                {/* TODO: substituir pelo telefone real da Elliot */}
                <a
                  href={`tel:${negocio.telefoneLink}`}
                  className="w-fit text-h3 text-claro transition-colors hover:text-ouro"
                >
                  {negocio.telefoneExibicao}
                </a>
                <a
                  href={negocio.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-2 text-meta text-claro/65 transition-colors hover:text-claro"
                >
                  <IconeWhatsapp className="size-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <a
              href={negocio.mapaRotaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-fit"
            >
              Ver rota
              <IconeSeta className="size-3.5" />
            </a>
          </Revelar>

          {/* --- Mapa --------------------------------------------------------- */}
          <Revelar atraso={0.08} className="h-full">
            <div className="relative h-full min-h-88 overflow-hidden rounded-card border border-claro/12">
              <iframe
                /* A consulta sai de negocio.mapaConsulta: quando o endereco
                   mudar la, o mapa acompanha sozinho. */
                data-mapa
                title={`Mapa com a localização da ${negocio.nome}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(negocio.mapaConsulta)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                width={800}
                height={520}
                /* O embed do Google Maps so vem em tema claro. Um retangulo
                   branco no meio de uma pagina preta quebra a paleta inteira,
                   entao ele e escurecido por filtro: inverte, gira a matiz de
                   volta (senao a agua fica laranja) e baixa a saturacao.
                   No hover volta ao normal, para quem precisar ler o mapa. */
                className="size-full min-h-88 border-0 filter-[invert(0.9)_hue-rotate(180deg)_saturate(0.55)_brightness(0.95)] transition-[filter] duration-500 hover:filter-none"
              />
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
