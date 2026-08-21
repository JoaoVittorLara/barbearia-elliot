/**
 * Formato dos dados do site. Quem edita conteudo mexe em src/dados/conteudo.ts,
 * nunca aqui. Este arquivo so existe para o TypeScript avisar quando faltar
 * um campo ou quando uma categoria for escrita errada.
 */

/**
 * Para onde o botao de reserva leva. Nao existe variante sem destino: botao que
 * responde ao hover e ao clique e depois nao faz nada promete uma resposta que
 * nao vem, e quem testa conclui que o site esta quebrado.
 */
export type TipoAgendamento =
  /** Abre o modal do Cal.com. So o servico que ja tem agenda online de verdade. */
  | { tipo: "cal"; namespace: string; link: string }
  /**
   * Abre o WhatsApp. `url` carrega a mensagem pronta quando quem renderiza sabe
   * do que se trata; sem ela, cai na mensagem geral do site.
   */
  | { tipo: "whatsapp"; url?: string };

export type CategoriaId = "corte" | "barba" | "combos" | "outros";

export interface Categoria {
  id: CategoriaId | "todos";
  rotulo: string;
}

export interface Servico {
  id: string;
  nome: string;
  /** Linha curta de apoio. Opcional: nem todo servico precisa explicar. */
  detalhe?: string;
  duracaoMin: number;
  precoBRL: number;
  categoria: CategoriaId;
  agendamento: TipoAgendamento;
}

/** Plataforma de origem da avaliacao. Avaliacao sem fonte nao vale como prova. */
export type FonteAvaliacao = "Google" | "Booksy" | "Instagram";

export interface Avaliacao {
  id: string;
  texto: string;
  autor: string;
  fonte: FonteAvaliacao;
  /** 1 a 5. */
  nota: number;
}

export interface ItemGaleria {
  /** Versao grande (800x1000). E a que vale em tela retina. */
  src: string;
  /**
   * Versao 480x600 da mesma foto. O browser escolhe esta em tela comum, onde o
   * card tem uns 350px: mandar 800px ali e quase 4x mais pixel do que a tela
   * mostra. Gerada automaticamente por `npm run imagens`.
   */
  srcMenor?: string;
  /** Versao WebP. Sem ela o componente Imagem cai para um <img> simples. */
  srcWebp?: string;
  alt: string;
  largura: number;
  altura: number;
}

export interface LinkNav {
  href: string;
  rotulo: string;
}

export interface Horario {
  /** Como aparece na tela. Ex.: "Terça a Sexta". */
  dias: string;
  /** Como aparece na tela. Ex.: "09h às 20h". */
  faixa: string;
  /** Dia fechado ganha tratamento visual mais apagado. */
  fechado?: boolean;
  /**
   * Os mesmos dias em ingles, do jeito que o schema.org espera. Existe para o
   * JSON-LD sair daqui em vez de alguem ter que manter os horarios em dois
   * lugares. Dia fechado deixa vazio.
   */
  diasSchema?: string[];
  /** Formato 24h, ex.: "09:00". */
  abre?: string;
  fecha?: string;
}

export interface RedeSocial {
  rotulo: string;
  href: string;
  /** Chave do icone em componentes/Icones.tsx. */
  icone: "instagram" | "whatsapp" | "facebook";
}

export interface Negocio {
  nome: string;
  nomeCurto: string;
  tagline: string;
  descricaoCurta: string;
  telefoneExibicao: string;
  telefoneLink: string;
  whatsappUrl: string;
  endereco: {
    /**
     * Rua e CEP sao opcionais de proposito. Hoje o site divulga a localizacao
     * no nivel de bairro, sem numero. Quando existir endereco de rua confirmado
     * e so preencher: o componente e o JSON-LD ja mostram os campos quando eles
     * aparecem, e omitem quando nao.
     */
    rua?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep?: string;
  };
  /** Consulta do embed do Google Maps. Sem chave de API. */
  mapaConsulta: string;
  /** Destino do botao "Ver rota". */
  mapaRotaUrl: string;
  site: string;
}
