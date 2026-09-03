# Decisões do projeto — Barbearia Elliot

Por que o projeto é do jeito que é.

O [README](README.md) conta o que ele faz e mostra os números medidos. Este
arquivo é a camada de baixo: as regras que o código assume em silêncio. Quase
todo item aqui existe porque alguma coisa deu errado uma vez, e mudar sem ler o
motivo costuma trazer o mesmo bug de volta.

O histórico datado do que deu errado no caminho está em
[`BRAIN/brain.md`](BRAIN/brain.md).

## O que é

Landing page de página única, scroll com âncoras. O trabalho dela é levar o
visitante ao agendamento. Toda seção ou constrói confiança ou empurra para a
reserva.

## Stack

Vite 8 + React 19 + TypeScript. Tailwind CSS v4 via `@tailwindcss/vite`.
Sem PostCSS e sem `tailwind.config.js`: os tokens vivem no bloco `@theme` de
`src/index.css`. Motion (`motion/react`) para reveals, hover e entradas.
Lenis para smooth scroll. Sem GSAP.

- Toda classe custom precisa estar dentro de um `@layer`. Fora dele o build v4
  quebra com "Missing opening {".
- Prefira a classe canônica do Tailwind à arbitrária (`w-22`, não `w-[5.5rem]`).
- Scaffold é manual. Nunca `npm create vite`: abre prompt interativo e trava.

## Cor: 60-30-10, medido

| Peso | Hex | Papel |
|---|---|---|
| 60% | `#0D0D0D` | superfície dominante |
| 30% | `#E5E5E5` | texto, superfícies secundárias, bordas |
| 10% | `#E8B004` | só ação |

Não invente tom intermediário. Superfície mais clara é `#E5E5E5` com alfa sobre
o preto, sempre por modificador do Tailwind. Alfas sancionadas e o contraste de
cada uma (todas documentadas no topo de `src/index.css`):

`text-claro` 15.2:1 · `text-claro/65` 6.5:1 · `text-claro/56` 4.7:1 (piso) ·
`border-claro/12` · `bg-claro/4` · `bg-claro/7` · `text-ouro` 9.6:1

**Inventário do ouro.** `#E8B004` aparece só em: CTA do header (sólido apenas
depois do scroll), CTA da hero, FAB do WhatsApp e seu pulso, chip de filtro
ativo, anel de foco, a metade itálica do display da hero, hover/focus do botão
ghost, a variável de marca do modal do Cal, as setas do loader de abertura e a
listra do poste na logo. Ouro fora dessa lista é bug de design. Nunca mais de um
CTA dourado por dobra de tela. A lista completa também vive no topo de
`src/index.css`; se mudar em um lugar, mudar no outro.

Loader e logo são as duas exceções ao "ouro é só ação", ambas momentos de marca:
o loader some em ~1s, antes de existir conteúdo com que competir, e a listra da
logo tem poucos pixels e lê como desenho, não como algo clicável. O card de
compartilhamento (`scripts/og-card.html`) herda o ouro da logo, mas vive fora da
página e não conta para a distribuição de nenhuma dobra.

## Estrutura da página

Ordem fixa: Hero, Serviços, Avaliações, Galeria, Contato & Local, Rodapé.
Header sticky com âncoras e CTA de agendamento permanente.

## Onde mora o quê

- **`src/dados/conteudo.ts`** — arquivo único de conteúdo. Texto, preços,
  horários, endereço, avaliações, galeria. Trocar dado real é aqui e em mais
  lugar nenhum. Os componentes só leem.
- **`src/dados/seo.ts`** — meta tags e JSON-LD, montados a partir de
  `conteudo.ts` e injetados no HTML pelo plugin em `vite.config.ts`. Não
  escreva conteúdo direto no `index.html`: vira a segunda cópia dos dados.
- **`robots.txt` e `sitemap.xml`** não existem em `public/`: são gerados no
  build por `vite.config.ts`, da mesma URL que alimenta canonical e Open Graph.
- **`src/tipos.ts`** — formato dos dados. Não é lugar de conteúdo.
- **`public/imagens/`** — assets. Tudo `PLACEHOLDER-*` é provisório; ver
  `public/imagens/LEIA-ME.md`.
- **`scripts/preparar-imagens.mjs`** — `npm run imagens` corta, redimensiona e
  converte para WebP, e gera as versões pequenas da galeria.

## Convenções

Nomes de variável, componente e comentário em PT-BR; termos técnicos em inglês.
Comentário só onde a decisão não é óbvia, e explicando o porquê.
Sem travessão (—) no conteúdo do site: usar vírgula ou `·`.
Cantos retos (2 a 3px); pill só em chip e FAB. Sem sombra, salvo o FAB.

## Decisões travadas

- **Agendamento.** Só "Barba na Navalha" tem agenda online real (Cal.com,
  namespace `barbanavalha`). Duração e preço dessa linha vêm do evento real, não
  são placeholder. Os outros usam `{ tipo: "whatsapp" }`: o botão abre a conversa
  com o serviço já escrito, rótulo "Pedir horário" e ícone do app. Link de agenda
  inventado é conteúdo falso apresentado como real; botão sem destino é pior
  ainda, porque a animação de hover e clique promete resposta e não entrega.
  **Não existe variante sem destino em `TipoAgendamento`, e é para continuar
  assim.** O número mora em `whatsappNumero`, uma constante só.
- **Cal.com carrega sob demanda.** O `embed.js` entra na primeira interação
  qualquer com a página (scroll, mouse, tecla, toque) e já prerenderiza o modal.
  Nunca no boot: ali custava 300ms de bloqueio e um cookie de terceiro para quem
  nem ia agendar. O modal é aberto por `cal("modal", …)`, não pelos atributos
  `data-cal-*`, e o tema escuro precisa ir no `ui` E no `config` do modal.
- **O FAB do WhatsApp cede o lugar.** `ZONAS_DE_CONFLITO` em `BotaoWhatsApp.tsx`
  lista os ids que ele não pode cobrir: `hero` e `galeria-controles`. Com
  qualquer um na tela, ele sai. As setas do carrossel ficam na mesma coluna da
  direita que o FAB, então sem isso a seta "próxima" fica embaixo dele. Subir o
  FAB não resolve, só muda a altura do encontro: medido, ele rouba o clique tanto
  em `bottom-5` quanto em `bottom-8`. Renomear o id na `Galeria` sem mexer na
  lista traz o bug de volta em silêncio.
- **A URL pública sai do ambiente, não do código.** `resolverUrlDoSite()` em
  `vite.config.ts`: `SITE_URL` → URL de produção da Vercel → `negocio.site`, que
  vale só no dev. Ela alimenta canonical, `og:url`, `og:image`, o JSON-LD, o
  `robots.txt` e o `sitemap.xml`. Não chumbe domínio em nenhum desses seis.
- **Logo:** `public/logo-elliot.svg`, adaptada do original em `IMGS/` para fundo
  escuro. O miolo do "O" é `#0D0D0D` fixo, não é furo: a logo só funciona sobre
  o preto do site. O dourado da marca (`#EDB203`) foi mapeado para o `#E8B004`
  do sistema, para não existirem dois dourados quase iguais na mesma tela.
- **Fundo da hero mora no `index.html`**, com estilo em `src/index.css`
  (`#hero-fundo`). Existe porque dentro do React a foto só pintava depois do
  bundle. A altura precisa continuar batendo com o `min-h-svh` do
  `<section id="hero">`.
- **Loader de abertura** (`#carregando`): marcação E CSS no `index.html`, a
  segunda e última exceção ao "tudo em componente". O CSS é embutido porque nem
  a folha do bundle pode chegar antes dele. Sai por `src/lib/carregando.ts`
  quando o React pinta, a foto da hero decodifica e passam 600ms, com rede de
  segurança de 5s no próprio HTML. `#root` nasce `inert`, o `<html>` nasce com
  `carregando-ativo`; os dois são revertidos na saída, pelos dois caminhos.
  **O brilho das setas fica no contêiner, nunca em cada seta.**
- **Mapa visível, com `loading="lazy"`.** Já existiu uma fachada de clique aqui
  e foi desfeita: a seção fica abaixo da dobra, então o lazy sozinho já mantém
  o embed fora do carregamento inicial e da auditoria. A fachada só custava o
  visual. Não reintroduzir sem medir antes.
- **Localização no nível de bairro.** `Batel, Curitiba, PR`, sem rua e sem
  número. `rua` e `cep` são opcionais em `Negocio.endereco`; o componente e o
  JSON-LD omitem os dois quando não existem. Endereço de porta inventado é
  dado falso que engana de verdade.
- **Sem GSAP.** A hero é reveal + stagger, não timeline coreografada. Motion
  resolve e evita sincronizar ScrollTrigger com o raf do Lenis.
- **`LazyMotion` + `m`**, nunca `motion`. O pacote é `domAnimation`, que não tem
  animação de layout: não use a prop `layout`.
- **Avaliações em grade**, não carrossel. Prova social atrás de seta não é prova.
- **Chips de filtro** se justificam com 12 serviços. Abaixo de ~8, tirar.
- **JSON-LD usa `HairSalon`**, subtipo de LocalBusiness, mais preciso para busca
  local. Sem `aggregateRating` enquanto não houver avaliação real.

## Conteúdo: a regra que não se quebra

Nada inventado pode ser apresentado como real. Sem depoimento com nome fictício,
sem nota de avaliação, sem endereço ou telefone falso passando por verdadeiro.
Placeholder existe, mas marcado com `// TODO: substituir por dados reais da
Elliot` e visivelmente genérico.

## Barra de qualidade

Lighthouse 90+ nas quatro categorias, em build de produção, mobile e desktop.

**Local** (2026-08-21, mediana de 5 rodadas mobile e 3 desktop, em
`http://127.0.0.1:PORTA`): desktop 100/100/100/100, mobile 93/100/100/100. Os
pontos que faltam no mobile são o custo do loader, todos em Speed Index
(1,9s → 2,8s): a tela fica coberta por ~1s e o progresso visual atrasa. É
esperado e aceito. Se um dia precisar recuperá-los, o dial é o `MINIMO_MS` em
`src/lib/carregando.ts`.

**Produção** (2026-09-03, commit [`b201116`](https://github.com/JoaoVittorLara/barbearia-elliot/commit/b201116431fcba3332c4e37088ac36f3fe892333),
mediana de 5 rodadas mobile e 3 desktop, contra
`https://barbearia-elliot.vercel.app/` de verdade, não localhost):
desktop 99/100/100/100, mobile 93/100/100/100. Métricas medianas — desktop:
FCP 0,9s, LCP 0,9s, TBT 10ms, CLS 0,015, SI 1,1s; mobile: FCP 1,5s, LCP 2,5s,
TBT 210ms, CLS 0, SI 2,4s. As 5 rodadas mobile foram 77/82/93/93/94: variação
grande, investigada antes de aceitar o número. Comparando a pior (77) com a
melhor (94), o tempo de download do `index.html` foi 249ms contra 72ms,
enquanto o trabalho de JS na tela foi igual ou pior na rodada "boa" — a
diferença é rede real até o edge da Vercel naquele instante, não regressão de
código. O preset mobile simula CPU 4x mais lenta, o que amplifica esse jitter.
**Vale a mediana, nunca a pior rodada isolada.**

**Meça em `http://127.0.0.1:PORTA`, nunca em `localhost`**, e sem outro browser
aberto disputando CPU. Em `localhost` o Chrome tenta IPv6 primeiro e soma ~300ms
fixos ao documento, o que sozinho derruba a nota em 15 a 25 pontos. Contra a
URL de produção essa regra não vale (é DNS e domínio de verdade), mas aí entra
a variação de rede documentada acima: rode pelo menos 5 vezes no mobile antes
de confiar num número.
Mobile-first. WCAG AA. Navegação por teclado em chips, carrossel e modal.
`prefers-reduced-motion` respeitado em três frentes: `MotionConfig
reducedMotion="user"`, o bloco `@media` no CSS, e o Lenis que nem é carregado.
