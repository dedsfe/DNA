# Master Creative Frontend in 2 Hours with React, Three.js & GSAP

Canal: JavaScript Mastery  
Vídeo: https://www.youtube.com/watch?v=DEeaT6FxEws  
Transcript: transcripts/DEeaT6FxEws.txt

## O que ele ensina
- Tutorial de 2h20 recriando a landing do MacBook Pro da Apple: React + Tailwind + Three.js (react-three-fiber) + GSAP.
- Seções: hero com vídeo sincronizado à rolagem, modelo 3D do MacBook que dá pra girar e trocar cor/tamanho, vídeo com máscara (chip M4), bento grid e storytelling com ScrollTrigger.
- 3D: o modelo carregado é só metade. A luz é que faz parecer real (luz de estúdio + spotlights vindos de cima, de baixo e dos lados) e uma textura de tela em alta resolução.
- Usar sRGB nas texturas, senão a imagem fica lavada.
- Na rolagem o modelo gira 360° (rotation.y = 2π, ease power1.inOut) enquanto os blocos de texto aparecem e o vídeo da tela troca, tudo numa timeline GSAP.
- O estado (cor e escala do modelo) fica num store global (Zustand).
