import type {
  Avaliacao,
  Categoria,
  Horario,
  ItemGaleria,
  LinkNav,
  Negocio,
  Pergunta,
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

   Os textos abaixo sao depoimentos genericos de proposito: frases curtas que
   serviriam para qualquer barbearia, sem fato especifico inventado. Os
   autores sao "Cliente 01..06": nenhum nome de pessoa foi inventado, porque
   depoimento falso com nome falso e o tipo de coisa que derruba a confianca
   quando alguem percebe. A nota fica 5 uniforme em todas, pelo mesmo motivo
   que o JSON-LD nao tem aggregateRating: numero de avaliacao so entra quando
   for real. Ao trazer os depoimentos reais, copie o texto como o cliente
   escreveu e mantenha a fonte.
   -------------------------------------------------------------------------- */
export const avaliacoes: Avaliacao[] = [
  {
    id: "av-01",
    texto:
      "Atendimento atencioso do início ao fim. O resultado ficou exatamente como eu esperava, e o ambiente é muito agradável.",
    autor: "Cliente 01",
    fonte: "Google",
    nota: 5,
  },
  {
    id: "av-02",
    texto:
      "Corte bem-feito e caprichado, com atenção a cada detalhe. Um ambiente confortável, do tipo que dá vontade de voltar.",
    autor: "Cliente 02",
    fonte: "Booksy",
    nota: 5,
  },
  {
    id: "av-03",
    texto:
      "Profissionalismo do primeiro contato até o produto final. Recomendo para quem valoriza um bom acabamento.",
    autor: "Cliente 03",
    fonte: "Google",
    nota: 5,
  },
  {
    id: "av-04",
    texto:
      "Equipe simpática e atenciosa, e um resultado que superou o que eu esperava para o dia. Já virou parte da minha rotina.",
    autor: "Cliente 04",
    fonte: "Instagram",
    nota: 5,
  },
  {
    id: "av-05",
    texto:
      "Ambiente limpo e organizado, com um atendimento que faz diferença. Vale a experiência inteira, não só o corte.",
    autor: "Cliente 05",
    fonte: "Booksy",
    nota: 5,
  },
  {
    id: "av-06",
    texto:
      "Cada visita é tranquila e sem pressa, com um resultado que vale o tempo investido. Assim que eu gosto.",
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

/* --------------------------------------------------------------------------
   10. PERGUNTAS FREQUENTES (FAQ)
   Fonte unica para a secao visivel (Faq.tsx) e para o FAQPage do JSON-LD
   (seo.ts). Preco e horario citados aqui tem que continuar batendo com
   `negocio` e `servicos` acima: e o mesmo motivo pelo qual o resto deste
   arquivo existe, so que agora tambem lido por mecanismo de busca.
   -------------------------------------------------------------------------- */
export const perguntas: Pergunta[] = [
  {
    id: "faq-onde-fica",
    pergunta: "Onde fica a Barbearia Elliot?",
    resposta:
      "A Barbearia Elliot fica no Batel, em Curitiba. O bairro é central e de fácil acesso por quem vem do centro ou do Água Verde. O endereço completo e o mapa estão na seção de contato, no fim desta página.",
  },
  {
    id: "faq-agendamento",
    pergunta: "Precisa agendar ou atende por ordem de chegada?",
    resposta:
      "O atendimento é por agendamento, sem ordem de chegada. Para Barba na Navalha, você marca direto pelo site, escolhe o horário livre e recebe a confirmação na hora. Para os demais serviços, você combina o horário pelo WhatsApp, com resposta assim que o barbeiro vir a mensagem. Sem fila e sem espera. Encaixes no mesmo dia dependem da agenda do barbeiro.",
  },
  {
    id: "faq-preco-corte",
    pergunta: "Quanto custa um corte na Barbearia Elliot?",
    resposta:
      "O corte masculino custa R$ 45. O design de barba custa R$ 45 e o combo de corte com barba sai por R$ 75. Os valores de cada serviço estão listados na seção de serviços, acima.",
  },
  {
    id: "faq-tipos-corte",
    pergunta: "Quais tipos de corte vocês fazem?",
    resposta:
      "Fazemos corte social, degradê, corte navalhado e acabamento na navalha. O barbeiro conversa sobre o formato do rosto e o tipo de cabelo antes de começar, para chegar no corte que funciona pra você.",
  },
  {
    id: "faq-duracao",
    pergunta: "Quanto tempo demora um corte?",
    resposta:
      "Um corte leva em média 40 minutos. Corte com barba leva cerca de 1h10. Como o atendimento é agendado, o horário reservado é seu, sem espera.",
  },
  {
    id: "faq-horarios",
    pergunta: "Quais são os horários de funcionamento?",
    resposta:
      "De terça a sexta, das 09h às 20h. Aos sábados, das 08h às 18h. A barbearia não abre aos domingos e segundas.",
  },
  {
    id: "faq-pagamento",
    pergunta: "Quais formas de pagamento vocês aceitam?",
    resposta:
      "Aceitamos Pix, dinheiro, cartão de débito e cartão de crédito. O pagamento é feito no balcão, ao fim do atendimento.",
  },
  {
    id: "faq-pagar-antes",
    pergunta: "Preciso pagar antes para garantir o horário?",
    resposta:
      "Não. O agendamento online não cobra nada na hora de marcar. Você paga no balcão depois do atendimento.",
  },
];
