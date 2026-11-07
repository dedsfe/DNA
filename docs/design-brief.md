# Brief de design: site novo da DNA

O que o André foi passando, do jeito que ele falou. Não é proposta: é o registro do que ele quer.

## Direção geral
- 3D + 2D + motion, com animações e iluminação bonita.
- Página desconstruída.
- Não pode prender o usuário no arrasto do site: a rolagem tem que continuar livre.
- Mobile first: 90% do tráfego.

## Retrato dos sócios
- André e a sócia precisam de um retrato 2D/3D.
- Definir como vai ser antes de qualquer outra coisa.
- Referência: https://www.poulo.site
  - O retrato é um boneco 2D de traço (SVG), preto e branco, com a cabeça e os olhos seguindo o mouse.
  - Atrás roda uma cena em canvas/WebGL com partículas tipo neve e nuvens desfocadas.
  - A navegação fica numa pílula de ícones no topo, com um botão "Book a Call" ao lado.

## Referências
| Link | O que chamou atenção |
|---|---|
| https://www.poulo.site | Retrato 2D que reage ao mouse, partículas e nuvens ao fundo |
| https://www.sebg.ch | O que o André mais curtiu: "algo sério, mas bonito que mistura um 3D com iluminação". Personagem 3D em canvas com acabamento de retícula, fundo azul, balão de fala guiando a rolagem e botões que fazem o boneco reagir (Dance, Sneeze, Do a trick...) |
| https://two26.studio | Passada sem comentário. Estúdio boutique, título enorme com humor ("Looking suspiciously good"), GSAP + Lenis + Three.js |
| https://allanleone.com/time-machine/ | Passada sem comentário. Arquivo navegável de 20 anos do portfólio dele, ano a ano |

## Estrutura do site
André escolheu a estrutura de https://dovvstudio.com, nesta ordem:
1. Hero: selo "disponível para projetos", título, 2 CTAs (começar projeto / ver trabalhos)
2. Nota de avaliação e logos de clientes
3. Projetos
4. Depoimentos de clientes
5. Como funciona: Discovery, Design, Build, Launch
6. Preços abertos: Landing page, Website, Care plan, cada um com "Book a call"
7. Fechamento: e-mail + "Book a 15 min call"

Em cima dessa estrutura, que o André vê como "uma estrutura real de venda, mas muito linda", ele quer melhorar a parte comercial:
- Mais gatilhos mentais.
- Mais produtos. Catálogo que o André passou: LP, LP + Blog, CRM, Softwares, "e etc" (lista ainda aberta).
- Bônus na oferta.

## Header
Protótipo em `docs/prototipos/header.html`, ainda fora do Astro. O André pediu pra basear nas referências, então a hélice saiu e entraram ele e a Danyelle como bonecos 3D com retícula sobre o azul #245ba1 (sebg.ch), virando a cabeça pro cursor ou inclinação do celular (poulo.site). Eles piscam, se olham, pulam ao toque e o balão responde. Abaixo dos CTAs entra a prova do dovvstudio.com, com os números do site atual (15 projetos, 10 clientes).

Pendente: os bonecos são genéricos. A Danyelle usa `assets/danyelle-img.png` só como guia de cabelo; do André não há foto no repo. O botão de menu do celular não abre nada ainda.

## Dúvida do André
"Até onde converte?" o visual do sebg.ch. Nenhum dos sites publica dado de conversão. O que dá pra ver: o sebg.ch é uma vitrine com um único CTA, sem processo nem preço. Quem carrega a venda é a estrutura do dovvstudio.com; o 3D fica como gancho no hero (ver `docs/conhecimento/02-awwwards-vs-converter.md`).

## Conhecimento dos vídeos
8 vídeos processados (Awwwards, motion, 3D). O resumo geral está em `docs/conhecimento/README.md` e o detalhe de cada vídeo em `docs/conhecimento/0X-*.md`.
