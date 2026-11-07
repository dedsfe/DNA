# My Top 5 Techniques for Web Animation

Canal: Olivier Larose  
Vídeo: https://www.youtube.com/watch?v=9eHEOAn2FOA  
Transcript: transcripts/9eHEOAn2FOA.txt

## O que ele ensina
- Regra 80/20: quase toda animação premiada usa as mesmas poucas técnicas.
- 1. Acompanhar a rolagem (progresso de 0 a 1): GSAP ScrollTrigger ou useScroll do Framer Motion. Junto, rolagem suave com Lenis (ou Locomotive) pra não ficar travado na roda do mouse.
- 2. Detectar quando o elemento entra na tela (IntersectionObserver, ScrollTrigger ou useInView). Metade das animações nasce disso.
- 3. position: sticky. É nativo, não dá bug e está por trás de muitos efeitos.
- 4. Easing: é o que dá a "cara" do site (lento, rápido, elástico) e separa o amador do profissional.
- 5. Quebrar o texto em linhas, palavras ou letras (SplitText do GSAP ou SplitType). Cuidado com acessibilidade e com o resize da tela.
- Bônus: map (converter uma faixa de valores em outra), lerp (suavizar o cursor e as animações no requestAnimationFrame) e shaders (deformar o 3D, efeitos únicos).
