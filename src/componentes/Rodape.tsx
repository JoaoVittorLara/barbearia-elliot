import { navegacao, negocio, redes } from "../dados/conteudo";
import { iconesRedes } from "./Icones";
import { Logo } from "./Logo";

/**
 * Rodape de proposito quieto: nenhum dourado, nenhum destaque. A conversao
 * acontece na hero, na lista de servicos e no botao flutuante. Se o rodape
 * competisse com eles, so dividiria a atencao no fim da pagina.
 */
export function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-claro/12">
      <div className="container-conteudo py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-[34ch]">
            <Logo tamanho="grande" />
            <p className="mt-5 text-meta text-claro/56 text-pretty">
              {negocio.descricaoCurta}
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="eyebrow">Navegar</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-meta text-claro/65 transition-colors hover:text-claro"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow">Redes</h2>
            <ul className="mt-4 flex gap-2">
              {redes.map((rede) => {
                const Icone = iconesRedes[rede.icone];
                return (
                  <li key={rede.rotulo}>
                    <a
                      href={rede.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${negocio.nome} no ${rede.rotulo}`}
                      className="grid size-11 place-items-center rounded-reto border border-claro/12 text-claro/65 transition-colors hover:border-claro/35 hover:text-claro"
                    >
                      <Icone />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-claro/10 pt-6 text-meta text-claro/56">
          © {ano} {negocio.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
