# Imagens da Barbearia Elliot

Tudo aqui que começa com `PLACEHOLDER-` é provisório e precisa virar foto real
da Elliot antes de publicar. O prefixo existe justamente para nenhum arquivo
provisório passar despercebido: procure por `PLACEHOLDER` no projeto e você
acha todos de uma vez.

## De onde vieram os placeholders

Série "Barbershop Ritual", de Alvinategyeka, no Wikimedia Commons.
Licença CC0 (domínio público), sem exigência de atribuição.
Ficam aqui só para o site não ter buracos enquanto as fotos reais não chegam.

## O que cada arquivo deve virar

| Arquivo | Tamanho | O que precisa ser |
|---|---|---|
| `PLACEHOLDER-hero-salao-1920x1080.webp` | 1920x1080 | Foto de abertura, no desktop. O salão em plano aberto, de preferência com pouca luz e uma fonte de luz forte, porque o texto fica por cima. |
| `PLACEHOLDER-hero-salao-960x1280.webp` | 960x1280 | A mesma cena em retrato, para celular. |
| `PLACEHOLDER-galeria-01-corte-degrade` | 800x1000 | Corte degradê finalizado |
| `PLACEHOLDER-galeria-02-barba-navalha` | 800x1000 | Barba feita na navalha, com toalha quente |
| `PLACEHOLDER-galeria-03-cadeira-barbeiro` | 800x1000 | A cadeira e a bancada |
| `PLACEHOLDER-galeria-04-acabamento-pezinho` | 800x1000 | Acabamento do pezinho, em close |
| `PLACEHOLDER-galeria-05-ambiente` | 800x1000 | Ambiente interno, plano aberto |
| `PLACEHOLDER-galeria-06-corte-tesoura` | 800x1000 | Corte na tesoura em andamento |
| `PLACEHOLDER-galeria-07-ferramentas` | 800x1000 | Máquina, navalha e pente na bancada |
| `PLACEHOLDER-galeria-08-barba-finalizada` | 800x1000 | Barba completa, resultado final |
| `PLACEHOLDER-galeria-09-recepcao` | 800x1000 | Recepção e espera |
| `PLACEHOLDER-galeria-10-corte-social` | 800x1000 | Corte social com acabamento fino |
| `PLACEHOLDER-og-1200x630.jpg` | 1200x630 | Imagem que aparece quando alguém compartilha o link no WhatsApp ou nas redes. JPEG de propósito: alguns leitores de Open Graph ainda tropeçam em WebP. |

Cada foto da galeria também tem uma versão `-480x600.webp`, gerada
automaticamente. Ela é a que o celular baixa. Você não precisa criar essas à
mão.

## Como trocar pelas fotos reais

1. Crie a pasta `fotos-originais/` na raiz do projeto e jogue os arquivos
   originais lá (JPEG grande direto da câmera serve, não precisa tratar).
2. Abra `scripts/preparar-imagens.mjs` e, em cada item da lista:
   - troque `origem` pelo nome do arquivo dentro de `fotos-originais/`;
   - tire o `PLACEHOLDER-` do `saida`.
3. Rode:

   ```bash
   npm run imagens
   ```

   O script corta no tamanho certo, converte para WebP e gera as versões
   pequenas da galeria sozinho.
4. Atualize os caminhos e os textos `alt` em `src/dados/conteudo.ts`.

**Não pule o `alt`.** É ele que descreve a foto para quem usa leitor de tela e
para o Google. Descreva o que aparece, não o nome do arquivo:
"Corte degradê finalizado, visto de perfil" é útil; "foto 1" não é.

## Proporções, e por que elas importam

A galeria é 4:5 (800x1000) em todas as fotos. Se uma vier em outra proporção, o
CSS corta o que sobra pelo centro (`object-fit: cover`), então nada distorce,
mas você pode perder a parte importante da imagem. Se a foto tiver um
enquadramento que não pode ser cortado, refaça o corte à mão antes.
