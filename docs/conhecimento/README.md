# Conhecimento: design, motion e 3D

O que aprendemos com os vídeos que o André passou, num lugar só. O detalhe de cada vídeo fica no arquivo dele, e o texto completo em `transcripts/`.

## Regras que se repetem em todos
- Poucos ingredientes: 1 ou 2 fontes, 2 ou 3 cores e assets todos no mesmo estilo. (03)
- Tipografia faz o site: título enorme de 1 a 5 palavras ao lado de texto pequeno, com saltos de tamanho bem marcados. (01, 03)
- Layout de revista sobre um grid: parece solto, mas tudo se alinha. Usar a tela inteira. (01, 03)
- Variar a proporção de imagem, texto e cor entre as seções, pra não ficar repetitivo. (03)
- Abrir com uma coisa grande se mexendo, pra fisgar. Depois só detalhe pequeno. (03)
- Não animar tudo: a animação aponta o que importa. Se tirar uma animação por um dia e ninguém sentir falta, ela não volta. (03, 05)
- Motion é a linguagem corporal da marca: o mesmo easing, timing e direção no site inteiro. (04, 05)
- O site premiado e o que vende não são o mesmo. O alvo é design de alto nível com mensagem clara e CTA visível. (02, 05, 08)
- Fazer o que é certo pra marca, não o que está na moda. (03)

## Caixa de ferramentas técnica
- GSAP (gratuito) + ScrollTrigger + SplitText. Lenis pra rolagem suave. (01, 04)
- position: sticky, IntersectionObserver, easing, map e lerp: o 80/20 da animação. (04)
- Three.js / react-three-fiber pro 3D: a luz é que faz parecer real, e as texturas vão em sRGB. (07)
- Shaders pra efeitos únicos (deformação, ondulação). (04, 08)
- Referência de efeitos: madewithgsap.com.

## Retrato dos sócios (o que os vídeos dizem)
- Personagem parado que reage (segue o cursor ou a inclinação do celular): SVG + giroscópio. Fica nítido, leve e roda em código. (06, poulo.site)
- Personagem com movimento de corpo (pular, acenar): em código fica duro. O melhor é gerar como vídeo com IA (fundo verde, recortado e comprimido). (06)
- Camadas com parallax (frente, meio e fundo) dão profundidade sem 3D pesado. (08: Illusion, KPR)
- Card 3D com reflexo de luz que acompanha o cursor. (08: KPR, cards do time)

## Cuidados
- Split text e efeitos de rolagem quebram fácil no celular. Testar no celular desde o começo. (01)
- Sequestrar a rolagem só funciona quando parece natural (Mana). Quando vira comercial sem mensagem, afasta (Prometheus). (08)
- Nada de preloader falso nem de tudo aparecendo com fade. (05)

## Vídeos
| # | Vídeo | Arquivo |
|---|---|---|
| 01 | Designing an AWWWards website (in 1 day) | 01-awwwards-em-1-dia.md |
| 02 | Awwward Winning vs Practical — What Converts? | 02-awwwards-vs-converter.md |
| 03 | 5 keys to design AWWWARD winning websites | 03-5-chaves-awwwards.md |
| 04 | My Top 5 Techniques for Web Animation | 04-5-tecnicas-animacao.md |
| 05 | Web Animations That Make Clients Pay More | 05-animacao-que-cobra-mais.md |
| 06 | Vibe Code an Animated App with Claude | 06-personagem-animado-com-claude.md |
| 07 | Creative Frontend with React, Three.js & GSAP | 07-threejs-gsap-macbook.md |
| 08 | Impressive 2025 Website Design Inspiration | 08-inspiracao-sites-2025.md |
