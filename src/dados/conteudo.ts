import type {
  Avaliacao,
  Categoria,
  Horario,
  ItemGaleria,
  LinkNav,
  Negocio,
  RedeSocial,
  Servico,
  // Extensao explicita: este arquivo tambem e lido pelo vite.config.ts, fora
  // do bundler. Veja o comentario la.
} from "../tipos.ts";

/* ============================================================================
   ARQUIVO UNICO DE CONTEUDO DA BARBEARIA ELLIOT

   Tudo que aparece escrito no site sai daqui. Para trocar por dados reais,
   edite este arquivo e mais nenhum outro. Os componentes so leem.

   >>> TODO: substituir por dados reais da Elliot <<<
   Nada abaixo foi confirmado pelo cliente. Nomes, precos, enderecos, horarios
   e depoimentos sao placeholders de template. Antes de publicar, percorra os
   blocos marcados com TODO e troque um por um.
   ========================================================================= */

/* --------------------------------------------------------------------------
   1. NEGOCIO
   TODO: substituir por dados reais da Elliot (telefone, WhatsApp).
   -------------------------------------------------------------------------- */

/**
 * Numero unico do WhatsApp, so digitos, com codigo do pais. `telefoneLink` e
 * todo link de conversa saem daqui: o numero aparecia escrito em dois lugares e
 * trocar um e esquecer o outro era questao de tempo.
 */
const whatsappNumero = "5541900000000";

/**
 * Monta um link de WhatsApp com a mensagem ja escrita na caixa de texto.
 *
 * Usado tambem por servico, na lista de precos: quando a pessoa clica em "Pedir
 * horario", a conversa ja abre dizendo qual servico ela quer. Poupa a pergunta
 * de volta e faz o botao ter destino de verdade, em vez de nao levar a lugar
 * nenhum.
 */
export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

export const negocio: Negocio = {
  nome: "Barbearia Elliot",
  nomeCurto: "Elliot",
  tagline: "Corte perfeito, barba alinhada.",
  descricaoCurta:
    "Barbearia com foco em corte masculino, barba na navalha e acabamento fino.",
  // TODO: numero real da Elliot.
  // O numero e ficticio, mas bem formado: DDD de Curitiba e cinco zeros no
  // final. Bem formado porque o site vai ser apresentado, e uma sequencia de
  // zeros na secao de contato faz a pagina inteira parecer inacabada. Ficticio
  // porque numero real de terceiro num site publico e problema de outra ordem.
  telefoneExibicao: "(41) 90000-0000",
  telefoneLink: `+${whatsappNumero}`,
  whatsappUrl: linkWhatsApp("Olá! Vim pelo site e quero agendar um horário."),
  // Localizacao no nivel de bairro, sem rua e sem numero. Bairro e cidade sao
  // reais para o mapa mostrar algo reconhecivel; rua e CEP ficam de fora
  // porque endereco de porta inventado e o tipo de dado falso que engana de
  // verdade. Os dois campos sao opcionais no tipo, entao e so preencher quando
  // houver endereco confirmado.
  endereco: {
    bairro: "Batel",
    cidade: "Curitiba",
    uf: "PR",
  },
  mapaConsulta: "Batel, Curitiba, PR",
  mapaRotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("Batel, Curitiba, PR"),
  // Vale so rodando local. Em producao a URL vem da Vercel no momento do build,
  // e um dominio proprio entra pela variavel SITE_URL. Ver `resolverUrlDoSite()`
  // no vite.config.ts.
  site: "http://localhost:5173",
};

/* --------------------------------------------------------------------------
   2. NAVEGACAO
   A ordem aqui e a ordem das seccoes na pagina. Mexeu aqui, mexeu no menu.
   -------------------------------------------------------------------------- */
export const navegacao: LinkNav[] = [
  { href: "#servicos", rotulo: "Serviços" },
  { href: "#avaliacoes", rotulo: "Avaliações" },
  { href: "#galeria", rotulo: "Galeria" },
  { href: "#contato", rotulo: "Contato" },
];

/* --------------------------------------------------------------------------
   3. MARQUEE DE CONFIANCA (faixa que corre sob a hero)
   Regra: nenhum item aqui pode ser um numero inventado. Nota de avaliacao e
   contagem de clientes so entram quando a Elliot passar o dado real.
   TODO: quando houver perfil no Google, trocar dois itens por "4,X no Google".
   -------------------------------------------------------------------------- */
export const indicadores: string[] = [
  "Agendamento online",
  "Barba na navalha com toalha quente",
  "12 serviços no cardápio",
  "Ter a Sáb, com hora marcada", // TODO: confirmar dias de funcionamento
  "Batel, Curitiba · PR",
  "Corte, barba e acabamento",
];

/* --------------------------------------------------------------------------
   4. SERVICOS
   Os chips de filtro sao gerados a partir de `categorias`. 12 servicos em 4
   categorias justificam o filtro; abaixo de ~8 ele so atrapalharia.

   TODO: substituir nomes, duracoes e precos pelos reais da Elliot.

   Sobre `agendamento`: hoje so "Barba na Navalha" tem agenda online de verdade
   (Cal.com). Os outros usam { tipo: "whatsapp" }, e o botao deles abre uma
   conversa com o nome do servico ja escrito. Nao apontam para agenda inventada,
   e tambem nao ficam sem destino: botao que nao faz nada parece site quebrado.
   Quando um servico ganhar agenda propria, troque o objeto por { tipo: "cal" }.
   -------------------------------------------------------------------------- */
export const categorias: Categoria[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "corte", rotulo: "Corte" },
  { id: "barba", rotulo: "Barba" },
  { id: "combos", rotulo: "Combos" },
  { id: "outros", rotulo: "Outros" },
];

export const servicos: Servico[] = [
  {
    id: "corte-masculino",
    nome: "Corte Masculino",
    detalhe: "Máquina, tesoura e acabamento",
    duracaoMin: 40,
    precoBRL: 45,
    categoria: "corte",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "corte-navalhado",
    nome: "Corte Navalhado",
    detalhe: "Degradê com acabamento na navalha",
    duracaoMin: 45,
    precoBRL: 55,
    categoria: "corte",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "corte-infantil",
    nome: "Corte Infantil",
    detalhe: "Até 10 anos",
    duracaoMin: 30,
    precoBRL: 35,
    categoria: "corte",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "acabamento",
    nome: "Acabamento (pezinho)",
    duracaoMin: 15,
    precoBRL: 20,
    categoria: "corte",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "barba-navalha",
    nome: "Barba na Navalha",
    detalhe: "Toalha quente, óleo e pós-barba",
    // ATENCAO: estes dois valores NAO sao placeholder. Foram copiados do evento
    // real no Cal.com ("Corte de Barba na Navalha", 50m, R$32,00). Se mudarem
    // la, mudam aqui tambem: a linha da lista e o modal precisam dizer a mesma
    // coisa, senao o visitante ve um preco e paga outro.
    duracaoMin: 50,
    precoBRL: 32,
    categoria: "barba",
    // Unico servico com agenda online real hoje.
    agendamento: {
      tipo: "cal",
      namespace: "barbanavalha",
      link: "joao-vittor-l0wth7/barbanavalha",
    },
  },
  {
    id: "barba-simples",
    nome: "Barba Simples",
    detalhe: "Máquina e contorno",
    duracaoMin: 20,
    precoBRL: 30,
    categoria: "barba",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "design-barba",
    nome: "Design de Barba",
    detalhe: "Desenho e alinhamento do contorno",
    duracaoMin: 30,
    precoBRL: 45,
    categoria: "barba",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "combo-corte-barba",
    nome: "Corte + Barba",
    duracaoMin: 70,
    precoBRL: 75,
    categoria: "combos",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "combo-completo",
    nome: "Corte + Barba na Navalha",
    detalhe: "O combo completo da casa",
    duracaoMin: 80,
    precoBRL: 85,
    categoria: "combos",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "combo-pai-filho",
    nome: "Pai e Filho",
    detalhe: "Dois cortes na mesma sessão",
    duracaoMin: 60,
    precoBRL: 70,
    categoria: "combos",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "sobrancelha",
    nome: "Design de Sobrancelha",
    detalhe: "Na navalha",
    duracaoMin: 15,
    precoBRL: 20,
    categoria: "outros",
    agendamento: { tipo: "whatsapp" },
  },
  {
    id: "hidratacao",
    nome: "Hidratação Capilar",
    duracaoMin: 30,
    precoBRL: 40,
    categoria: "outros",
    agendamento: { tipo: "whatsapp" },
  },
];

/* --------------------------------------------------------------------------
   5. AVALIACOES
   TODO: substituir por depoimentos REAIS da Elliot.

   Os textos abaixo descrevem a si mesmos de proposito e os autores sao
   "Cliente 01..06". Nenhum nome de pessoa foi inventado: depoimento falso com
   nome falso e o tipo de coisa que derruba a confianca quando alguem percebe.
   Ao trazer os reais, copie o texto como o cliente escreveu e mantenha a fonte.
   -------------------------------------------------------------------------- */
export const avaliacoes: Avaliacao[] = [
  {
    id: "av-01",
    texto:
      "Espaço para o depoimento do cliente. Duas ou três linhas funcionam melhor do que um parágrafo longo: o visitante lê todos os cards, não só o primeiro.",
    autor: "Cliente 01",
    fonte: "Google",
    nota: 5,
  },
  {
    id: "av-02",
    texto:
      "Depoimentos que citam um serviço específico convencem mais do que elogios genéricos. Prefira os que mencionam o corte, a barba ou o atendimento pelo nome.",
    autor: "Cliente 02",
    fonte: "Booksy",
    nota: 5,
  },
  {
    id: "av-03",
    texto:
      "Copie o texto exatamente como o cliente escreveu, sem corrigir nem enfeitar. A linguagem real é justamente o que faz a avaliação parecer verdadeira.",
    autor: "Cliente 03",
    fonte: "Google",
    nota: 5,
  },
  {
    id: "av-04",
    texto:
      "Mantenha sempre a plataforma de origem. Avaliação atribuída pesa, avaliação anônima não pesa nada.",
    autor: "Cliente 04",
    fonte: "Instagram",
    nota: 5,
  },
  {
    id: "av-05",
    texto:
      "Seis depoimentos é um bom número: enche a grade em três colunas e ainda cabe no scroll do celular sem cansar.",
    autor: "Cliente 05",
    fonte: "Booksy",
    nota: 5,
  },
  {
    id: "av-06",
    texto:
      "Se um depoimento passar de quatro linhas, corte. O card fica desalinhado e ninguém termina de ler.",
    autor: "Cliente 06",
    fonte: "Google",
    nota: 5,
  },
];

/* --------------------------------------------------------------------------
   6. GALERIA
   TODO: trocar as imagens PLACEHOLDER-* por fotos reais da Elliot.
   Mantenha a proporcao 4:5 (800x1000) para o carrossel nao pular de altura.
   Ao trocar, gere tambem a versao .webp e preencha `srcWebp`.
   Veja public/imagens/LEIA-ME.md.
   -------------------------------------------------------------------------- */
export const galeria: ItemGaleria[] = [
  {
    src: "/imagens/PLACEHOLDER-galeria-01-corte-degrade-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-01-corte-degrade-480x600.webp",
    alt: "Corte degradê masculino finalizado",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-02-barba-navalha-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-02-barba-navalha-480x600.webp",
    alt: "Barba feita na navalha com toalha quente",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-03-cadeira-barbeiro-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-03-cadeira-barbeiro-480x600.webp",
    alt: "Cadeira de barbeiro no salão da Elliot",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-04-acabamento-pezinho-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-04-acabamento-pezinho-480x600.webp",
    alt: "Acabamento do pezinho na máquina",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-05-ambiente-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-05-ambiente-480x600.webp",
    alt: "Ambiente interno da barbearia",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-06-corte-tesoura-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-06-corte-tesoura-480x600.webp",
    alt: "Corte na tesoura em andamento",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-07-ferramentas-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-07-ferramentas-480x600.webp",
    alt: "Máquinas, navalha e pente na bancada",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-08-barba-finalizada-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-08-barba-finalizada-480x600.webp",
    alt: "Barba completa finalizada",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-09-recepcao-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-09-recepcao-480x600.webp",
    alt: "Recepção e espera da barbearia",
    largura: 800,
    altura: 1000,
  },
  {
    src: "/imagens/PLACEHOLDER-galeria-10-corte-social-800x1000.webp",
    srcMenor: "/imagens/PLACEHOLDER-galeria-10-corte-social-480x600.webp",
    alt: "Corte social com acabamento fino",
    largura: 800,
    altura: 1000,
  },
];

/* --------------------------------------------------------------------------
   7. HORARIOS
   TODO: confirmar com a Elliot.
   Sem travessao no texto: usar "a" ou virgula. ("Ter a Sex", nao "Ter-Sex".)
   -------------------------------------------------------------------------- */
export const horarios: Horario[] = [
  {
    dias: "Terça a Sexta",
    faixa: "09h às 20h",
    diasSchema: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    abre: "09:00",
    fecha: "20:00",
  },
  {
    dias: "Sábado",
    faixa: "08h às 18h",
    diasSchema: ["Saturday"],
    abre: "08:00",
    fecha: "18:00",
  },
  { dias: "Domingo e Segunda", faixa: "Fechado", fechado: true },
];

/* --------------------------------------------------------------------------
   8. REDES SOCIAIS
   TODO: substituir pelos perfis reais da Elliot.
   -------------------------------------------------------------------------- */
export const redes: RedeSocial[] = [
  {
    rotulo: "WhatsApp",
    href: negocio.whatsappUrl,
    icone: "whatsapp",
  },
  {
    rotulo: "Instagram",
    href: "https://instagram.com/", // TODO: perfil real
    icone: "instagram",
  },
  {
    rotulo: "Facebook",
    href: "https://facebook.com/", // TODO: perfil real
    icone: "facebook",
  },
];

/* --------------------------------------------------------------------------
   9. AGENDAMENTO PRINCIPAL
   O CTA da hero e o botao do header apontam para o mesmo lugar: a unica agenda
   online que existe hoje. Trocar aqui muda os dois de uma vez.
   -------------------------------------------------------------------------- */
export const agendamentoPrincipal = {
  namespace: "barbanavalha",
  link: "joao-vittor-l0wth7/barbanavalha",
} as const;
