# BRAIN — Barbearia Elliot

## ❌ Não repetir

- [2026-08-21] Botão com `whileHover`/`whileTap` e sem destino. Foi o que
  existiu em 11 dos 12 serviços: `<button>` com `onClick` undefined, mas
  levantando com o mouse e afundando no clique. Quem testa não conclui "este
  serviço não tem agenda", conclui "o site está quebrado", e num portfólio essa
  é a leitura cara. Affordance é promessa: se o elemento reage ao ponteiro, ele
  se comprometeu. Havia um texto de apoio explicando o arranjo, mas ficava
  depois de doze linhas, ou seja, depois do clique. Explicação embaixo do
  controle não conserta controle.
- [2026-08-21] Resolver sobreposição de elemento fixo mexendo só na posição. O
  FAB e as setas do carrossel ocupam a mesma coluna da direita (setas de 24px a
  68px da borda, FAB de 20px a 76px), e a rolagem é contínua: qualquer `bottom`
  novo só muda a altura em que eles se encontram. Medido com `elementFromPoint`
  no centro da seta, com o FAB forçado visível: ele rouba o clique em `bottom-5`
  e em `bottom-8` igualmente. O que fecha é o elemento fixo ceder o lugar.
- [2026-08-19] `-z-10` no fundo da hero fez a foto sumir por completo. Com
  `html` E `body` tendo `background-color`, o background do body pinta DEPOIS
  dos filhos de z-index negativo, então o preto opaco cobria a imagem. Não usar
  z-index negativo para camada de fundo: posicionar o fundo antes no DOM e dar
  `position: relative` ao conteúdo resolve pela ordem natural de pintura.
- [2026-08-19] Passar `offset: -(alturaHeader + 24)` para `lenis.scrollTo` fez
  a âncora parar 92px baixo demais. O Lenis já respeita o `scroll-margin-top`
  do CSS; o offset em JS somava o desconto duas vezes. Deixar só o CSS mandar.
- [2026-08-19] Baixar do Wikimedia com User-Agent sem contato devolve HTTP 429
  em tudo. A política deles exige nome do cliente + forma de contato no UA. Os
  thumbs grandes (`/thumb/.../2560px-...`) também devolvem 400: usar o arquivo
  original e redimensionar localmente.
- [2026-08-19] `focus:not-sr-only` do Tailwind não desfaz classe própria
  (`.apenas-leitor-tela`). O par esconder/mostrar do link "pular para o
  conteúdo" tem que morar inteiro no CSS, como `.link-pular`.
- [2026-08-19] Linha de serviço com `flex-1` no nome quebra em 375px: o nome
  ficava com 5px e o texto vazava da tela. Nome precisa de `w-full` no mobile e
  `sm:flex-1` só a partir de 640px.
- [2026-08-19] `theme: "dark"` só no `cal("ui", ...)` não escureceu o modal do
  Cal: a preferência de aparência do evento no Cal venceu e ele abria claro no
  meio da página preta. Tem que ir também no `config` do `cal("modal", ...)`,
  como `theme: "dark"` + `"ui.color-scheme": "dark"`.
- [2026-08-19] Medir Lighthouse com outro Chromium aberto deu 78 de performance
  mobile, contra 96 com ele fechado. A máquina disputando CPU distorce LCP e
  TBT. Antes de acreditar numa queda, feche os outros browsers e rode três
  vezes: vale a mediana, não a pior.
- [2026-08-19] Medir contra `http://localhost:5184` depois de subir o preview
  com `--host 0.0.0.0` derrubou a performance mobile de 96 para 83, e o desktop
  de 100 para 73. Causa: com o servidor escutando em IPv4 e IPv6, o Chrome
  tenta `::1` primeiro e cai para IPv4, somando ~300ms fixos ao documento
  (curl direto respondia em 14ms). Medir sempre em `http://127.0.0.1:PORTA`.
  Diagnóstico que fechou o caso: o `network-requests` mostrava o documento indo
  de 28ms para 305ms enquanto bootup e main thread MELHORAVAM. Quando a
  regressão está só no Load Delay e o JS ficou mais rápido, o problema não é o
  código.
- [2026-08-19] `aria-label` no link do logo reprovou em WCAG 2.5.3
  (`label-content-name-mismatch`): os dois spans do wordmark concatenam sem
  espaço ("ElliotBarbearia") e não batiam com o rótulo. Não usar `aria-label`
  em link cujo conteúdo já é texto visível; complemento vai num span só para
  leitor de tela, depois da marca.

- [2026-08-19] `filter: drop-shadow()` nas 24 setas do loader derrubou a
  performance mobile de 98 para **61**, com TBT de 200ms para **2780ms** e FCP
  de 1,5s para 3,0s. Cada seta virava um desfoque próprio por quadro, tudo no
  mesmo instante em que o navegador interpretava os 300 KB do bundle numa CPU
  4x mais lenta. Mover o `drop-shadow` para o contêiner `.carregando-grade`
  (um desfoque em vez de 24) devolveu 92. **Halo em grupo de elementos vizinhos
  vai no pai, nunca em cada filho.**
- [2026-08-19] `animation: ... both` com `from { opacity: 0 }` na grade do
  loader adiava a primeira pintura: no quadro inicial o conteúdo estava em
  opacidade zero. Fade de entrada só faz sentido no que pode chegar atrasado
  (a logo, que vem de requisição); em conteúdo que já é CSS puro, ele só atrasa.

## ✅ Funcionou

- [2026-08-19] Loader de abertura com CSS embutido no `<head>` do `index.html`:
  pinta em 47ms, sem uma requisição de rede sequer. Se o CSS viesse na folha do
  bundle, o navegador mostraria tela vazia até ela chegar, que é exatamente o
  intervalo que o loader deveria cobrir. Custo: +2,7 KB gzip no documento.
- [2026-08-19] Três redes de proteção no loader, todas justificadas por um
  jeito diferente de travar: (a) `setTimeout` de 5s no `<script>` inline do
  próprio HTML, para bundle que não carrega (testado renomeando o `.js`: sai em
  5,7s e destrava a rolagem); (b) `Promise.race` com teto de 2,5s na espera do
  `decode()` da foto, para imagem quebrada; (c) `setTimeout` ao lado do
  `transitionend`, porque com movimento reduzido a transição dura 0,01ms e o
  evento pode passar despercebido, deixando o nó para sempre no DOM.
- [2026-08-19] `#root` nasce com `inert` no HTML e perde o atributo junto com o
  loader. Sem isso dá para tabular para dentro do conteúdo coberto durante o
  ~1s em que o loader está na tela.
- [2026-08-19] `chrome --headless --force-prefers-reduced-motion --screenshot`
  testa movimento reduzido de verdade. Por CDP não dá: `Emulation.setEmulatedMedia`
  fica fora do alcance, então a flag na linha de comando é o caminho.
- [2026-08-19] O retângulo cinza atrás do modal do Cal era o fundo da PÁGINA do
  Cal dentro do iframe, que ocupa a largura inteira da tela e não só a do card.
  `cssVarsPerTheme.dark["cal-bg"] = "transparent"` resolve. Pintar de `#0D0D0D`
  também tira a placa, mas aí a área do iframe fica mais CLARA que o resto,
  porque o escurecimento do modal não se aplica a ela. Só transparente casa em
  toda a tela.
- [2026-08-19] Prerender do Cal na PRIMEIRA interação qualquer (pointermove,
  scroll, keydown, touchstart no window, `once`) em vez de no hover do botão:
  o modal abre instantâneo porque o iframe já foi montado, e o Lighthouse
  continua em 100 de Best Practices porque ele não interage com a página.
  `cal("preload", { calLink, type: "modal" })` monta o iframe escondido.
- [2026-08-19] Logo original vinha para fundo claro: retângulo creme chapado
  cobrindo a arte, traço `#0A080B` e o miolo do "O" pintado de creme (não é
  furo de verdade). Adaptação para o escuro: remover o retângulo, traço para
  `currentColor` e miolo para `#0D0D0D`. Dentro de um `<img>` o SVG é documento
  isolado e `currentColor` cai para preto, então precisa de `color="#E5E5E5"`
  na raiz do SVG. Como é atributo de apresentação, o CSS ainda sobrescreve se
  a logo for embutida inline um dia.

- [2026-08-19] Mover a foto da hero para o `index.html` estático (fora do
  `#root`) derrubou o LCP mobile de 4,1s para 2,0s. O gargalo era Render Delay
  de 3,3s: dentro do React nada pinta antes do bundle executar. Estilo ficou em
  `src/index.css` (`#hero-fundo`), então o design continua num lugar só.
- [2026-08-19] Carregar o `embed.js` do Cal só na intenção (pointerenter,
  focusin, touchstart no botão) levou Best Practices de 78 para 100 e o TBT
  desktop de 300ms para 20ms. Ele era a causa única dos dois problemas: bloqueio
  de thread e cookie de terceiro `__cf_bm`. O clique usa `cal("modal", {...})`
  em vez dos atributos `data-cal-*`, e espera a promessa memorizada, então
  clique antes do download terminar não se perde.
- [2026-08-19] `LazyMotion` + `m` com `domAnimation`: bundle de 116kB para 98kB
  gzip. Custo: perder a prop `layout` na lista de serviços, que a animação de
  entrada e saída já cobre.
- [2026-08-19] Plugin `transformIndexHtml` no `vite.config.ts` importando
  `src/dados/seo.ts` gera meta tags e JSON-LD a partir do arquivo de conteúdo.
  Zero custo em runtime e o endereço não existe em dois lugares. Exige extensão
  `.ts` explícita nessa cadeia de imports: o carregador nativo de config do Vite
  lê esses arquivos fora do bundler.
- [2026-08-19] Embed do Google Maps escurecido com
  `invert(0.9) hue-rotate(180deg) saturate(0.55)`. Sem o hue-rotate a água fica
  laranja. Volta ao normal no hover.
## Decisões

- [2026-08-20] **Fachada de clique do mapa: revertida.** Ela existia para tirar
  o embed do Google do carregamento inicial, mas fui conferir a auditoria
  original e o iframe já estava com `loading="lazy"`: como a seção fica bem
  abaixo da dobra, o Lighthouse nunca chegava a buscá-lo, e os cookies de
  terceiro daquela medição vinham todos de `app.cal.com/embed/embed.js`. A
  fachada resolvia um problema que o lazy já resolvia, e cobrava o visual do
  mapa. Medido depois de reverter: Best Practices seguiu em 100 e nenhum cookie
  de terceiro apareceu. **Lição: antes de construir a mitigação, confirmar no
  relatório qual recurso é o culpado.** Eu tinha atribuído ao mapa um custo que
  era do Cal.
- [2026-08-20] Localização divulgada no nível de bairro: `Batel, Curitiba, PR`,
  sem rua e sem número. Bairro e cidade reais para o mapa mostrar algo
  reconhecível; rua e CEP ficam de fora porque endereço de porta inventado é o
  tipo de dado falso que engana de verdade. `rua` e `cep` viraram opcionais em
  `Negocio.endereco`, e tanto o `<address>` quanto o `PostalAddress` do JSON-LD
  omitem o campo quando ele não existe (campo vazio no JSON-LD é pior que campo
  ausente).
- [2026-08-20] Telefone fictício mas bem formado, `(41) 90000-0000`. A versão
  anterior, `(00) 00000-0000`, fazia a seção de contato parecer inacabada ao
  lado de um bairro real, e o site vai ser apresentado para contratação. Zeros
  no final continuam entregando que é demo para quem olhar de perto.
- [2026-08-20] Licença trocada de MIT para licença de visualização própria:
  leitura e análise liberadas, cópia e redistribuição não. A licença declara
  duas ressalvas, sem as quais ela mentiria: as dependências mantêm as licenças
  delas, e em repositório público o ToS do GitHub já concede ver e forkar
  dentro da plataforma.

- [2026-08-19] Paleta do briefing (`#0D0D0D`/`#E5E5E5`/`#E8B004`) no lugar do
  dourado quente do Figma. E o dourado da referência foi reduzido: lá todo preço
  e todo botão da lista eram dourados, uns 20 destaques numa seção. Aqui preço é
  claro e botão de linha é ghost que só vira ouro no hover.
- [2026-08-19] Header CTA é ghost enquanto a hero está visível e vira ouro
  depois do scroll. Garante exatamente um CTA dourado por dobra.
- [2026-08-19] Escala tipográfica normalizada em `clamp()`, em vez de copiar os
  valores fracionados do Figma (12.48px, 57.6px, 136px), que vieram da captura
  em escala e não são uma escala real.
- [2026-08-19] Sem GSAP. A hero é reveal + stagger; Motion resolve, economiza
  ~50kb e evita amarrar ScrollTrigger ao raf do Lenis.
- [2026-08-19] Avaliações em grade de 3 colunas no desktop e scroll-snap no
  mobile, mesmo DOM. Carrossel esconde prova social atrás de uma seta que quase
  ninguém clica.
- [2026-08-19] Galeria com scroll nativo + scroll-snap, indicador ativo por
  IntersectionObserver (nunca por conta de `scrollLeft`, que erra com scroll
  suave e zoom). No mobile os 10 dots viram um contador "3 / 10": dots mais
  setas não cabem em 375px.
- [2026-08-19] FAB do WhatsApp é dourado com glifo preto, não verde da marca
  WhatsApp. Verde seria uma quarta cor na paleta, e como só existe um FAB por
  vez ele não disputa espaço com o CTA da hero.
- [2026-08-19] Depoimentos placeholder assinam "Cliente 01..06" e o texto
  descreve a si mesmo. Nenhum nome de pessoa inventado, nenhuma nota agregada no
  JSON-LD enquanto não houver avaliação real.
- [2026-08-19] Loader fica no mínimo 600ms e sai quando o React pintou E a foto
  da hero decodificou. Sem mínimo ele apareceria por ~150ms no desktop, o que lê
  como falha de renderização em vez de loader. O custo aceito é de 6 pontos de
  Lighthouse mobile (98 → 92), todos em Speed Index. Alternativas rejeitadas:
  1s de mínimo (impõe 400ms de espera real) e nenhum mínimo (o piscão).
- [2026-08-19] O snippet do loader veio em SCSS com `main{100vw/100vh}` e a
  classe `dank-ass-loader`. O seletor `main` foi trocado por `#carregando`
  porque o site tem um `<main>` de verdade e aquilo destruiria o layout inteiro;
  `100vw` virou `inset: 0` porque com barra de rolagem `100vw` gera scroll
  horizontal; os `@for` do SCSS viraram `calc()` com `--i`, com a fórmula do
  atraso escrita uma vez só. Nomes em PT-BR, como o resto do projeto.
- [2026-08-19] O dourado da marca (`#EDB203`, extraído da logo) foi mapeado para
  o `#E8B004` do sistema. A diferença é imperceptível sozinha, mas dois dourados
  quase iguais lado a lado (logo no header e botão "Agendar") pareceriam erro.
  Se o operador preferir a marca mandando, o caminho é o inverso: trocar o token
  em `index.css` para `#EDB203` e devolver a cor original na logo.
- [2026-08-19] `mapaConsulta` aponta para "Curitiba, PR, Brasil" e não para o
  endereço fictício: endereço que não geocodifica faz o embed mostrar o globo
  inteiro e o site parece quebrado. Nível de cidade, sem pin de rua.
- [2026-08-21] A URL pública deixou de ser constante e passou a ser resolvida no
  build (`resolverUrlDoSite()` no `vite.config.ts`): `SITE_URL` → URL de
  produção da Vercel → `negocio.site`. Motivo: ela alimenta seis lugares
  (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD, sitemap) e só é
  conhecida depois do primeiro deploy. Chumbada, o site sobe com `og:image`
  apontando para domínio inexistente, ou seja, o preview do link quebra no
  WhatsApp e no LinkedIn, que é exatamente por onde um portfólio circula. Como
  efeito colateral, `robots.txt` e `sitemap.xml` saíram de `public/` e passaram
  a ser gerados: eram a segunda e a terceira cópia do domínio.
  Custo: `@types/node` em devDependencies, e `"types": ["node"]` no
  `tsconfig.node.json` (só no do Vite, nunca no do browser).
- [2026-08-21] Os 11 serviços sem agenda online deixaram de ter botão morto e
  passaram a abrir o WhatsApp com o nome do serviço na mensagem. `TipoAgendamento`
  perdeu a variante `nenhum` e ganhou `whatsapp`; `BotaoAgendar` agora renderiza
  `m.a` ou `m.button` conforme o dado. A mensagem é montada em `Servicos.tsx`, e
  não em `conteudo.ts`, porque é lá que `servico.nome` existe: escrever o nome de
  novo no dado seria a mesma string duas vezes no mesmo objeto, esperando um
  rename para sair de sincronia.
- [2026-08-21] O FAB passou a observar uma lista de zonas
  (`ZONAS_DE_CONFLITO = ["hero", "galeria-controles"]`) em vez de só a hero, e
  subiu de `bottom-5` para `bottom-8`.

## Pendências

- Todo dado da Elliot é placeholder: endereço, telefone, WhatsApp, horários,
  avaliações, 11 dos 12 serviços. Só "Barba na Navalha" (50min, R$32) é real,
  copiado do evento do Cal.com.
- Fotos são placeholders CC0. Ver `public/imagens/LEIA-ME.md`.
- Projeto sem `git init`. README de portfólio pressupõe repositório, e sem ele
  não há o que a Vercel importe.
- Deploy não feito. O README tem um TODO destacado no topo esperando a URL.
