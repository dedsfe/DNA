const hero = document.querySelector(".hero");
const page = document.querySelector(".page");
const animatedWords = document.querySelectorAll("[data-words]");
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// 1. Lógica de Animação de Palavras (Efeito Matrix/Sequencial)
if (animatedWords.length) {
  const lowerAlphabet = "abcdefghijklmnopqrstuvwxyzçáãâàéêíóôõú";
  const upperAlphabet = lowerAlphabet.toUpperCase();

  const buildSequence = (char) => {
    if (char === " ") return [" "];
    const isUppercase = char === char.toUpperCase() && char !== char.toLowerCase();
    const alphabet = isUppercase ? upperAlphabet : lowerAlphabet;
    const targetIndex = alphabet.indexOf(char);
    if (targetIndex === -1) return [char];
    return [...alphabet.slice(0, targetIndex + 1)];
  };

  const renderWord = (element, chars) => {
    const fragment = document.createDocumentFragment();
    chars.forEach((char) => {
      const span = document.createElement("span");
      span.className = char === " " ? "hero__animated-char hero__animated-char--space" : "hero__animated-char";
      span.textContent = char === " " ? "\u00A0" : char;
      fragment.append(span);
    });
    element.replaceChildren(fragment);
  };

  const animateWord = (element, words, wordIndex = 0) => {
    const targetWord = words[wordIndex];
    const sequences = [...targetWord].map(buildSequence);
    const delays = sequences.map((_, index) => index * 2);
    const totalTicks = Math.max(...sequences.map((sequence, index) => sequence.length + delays[index]), 0);
    let tick = 0;

    const intervalId = window.setInterval(() => {
      const chars = sequences.map((sequence, index) => {
        if (sequence[0] === " ") return " ";
        const localTick = tick - delays[index];
        if (localTick < 0) return " ";
        if (localTick >= sequence.length) return targetWord[index];
        return sequence[localTick];
      });

      renderWord(element, chars);
      tick += 1;

      if (tick > totalTicks) {
        window.clearInterval(intervalId);
        renderWord(element, [...targetWord]);
        window.setTimeout(() => {
          animateWord(element, words, (wordIndex + 1) % words.length);
        }, 1200);
      }
    }, 34);
  };

  animatedWords.forEach((element) => {
    const words = element.dataset.words.split("|").map(w => w.trim()).filter(Boolean);
    if (words.length) animateWord(element, words);
  });
}

// 2. Parallax do Hero
if (hero && page) {
  let ticking = false;
  const updateParallax = () => {
    const rect = hero.getBoundingClientRect();
    const activeScroll = clamp(-rect.top, 0, window.innerHeight * 0.9);
    const bgOffset = activeScroll * -0.07;
    const bgScale = 1.1 + activeScroll * 0.00003;
    const cloudsOffset = activeScroll * 0.28;
    const cloudsScale = 1.01 + activeScroll * 0.00012;

    hero.style.setProperty("--bg-parallax-offset", `${bgOffset.toFixed(2)}px`);
    hero.style.setProperty("--bg-parallax-scale", bgScale.toFixed(3));
    hero.style.setProperty("--clouds-parallax-offset", `${cloudsOffset.toFixed(2)}px`);
    hero.style.setProperty("--clouds-parallax-scale", cloudsScale.toFixed(3));
    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  };

  updateParallax();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
}

// 3. Lógica de Scroll Awareness (Blur no Centro)
// Blur reseta apenas quando o user volta ao hero (primeira seção)
const serviceItems = document.querySelectorAll(".services__item");
if (serviceItems.length) {
  const handleServiceFocus = () => {
    const centerY = window.innerHeight / 2;
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const isBackAtHero = heroRect && heroRect.bottom > window.innerHeight * 0.5;

    serviceItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;

      if (isBackAtHero) {
        // Voltou pro hero — reseta todos os blurs
        item.classList.remove("is-focused");
      } else if (itemCenter <= centerY) {
        item.classList.add("is-focused");
      }
    });
  };
  window.addEventListener("scroll", handleServiceFocus, { passive: true });
  handleServiceFocus();
}

// 4. Efeito Magnético nos Serviços
serviceItems.forEach((item) => {
  const title = item.querySelector(".services__item-title");
  if (!title) return;

  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    title.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
  });

  item.addEventListener("mouseleave", () => {
    title.style.transform = `translate(0, 0)`;
  });
});

// 5. Lógica de Vídeo no Hover (Bento Grid)
const portfolioItems = document.querySelectorAll(".portfolio__item");
portfolioItems.forEach((item) => {
  const video = item.querySelector(".portfolio__video");
  if (!video) return;

  item.addEventListener("mouseenter", () => {
    video.play().catch(() => {});
  });

  item.addEventListener("mouseleave", () => {
    video.pause();
  });
});

// 6. Cursor Personalizado (Portfolio)
const customCursor = document.querySelector(".custom-cursor");
if (customCursor && window.matchMedia("(hover: hover)").matches) {
  let cursorX = 0, cursorY = 0;
  let targetX = 0, targetY = 0;
  let isCursorActive = false;
  let rafId = null;

  const lerp = (a, b, t) => a + (b - a) * t;

  const updateCursorPosition = () => {
    cursorX = lerp(cursorX, targetX, 0.15);
    cursorY = lerp(cursorY, targetY, 0.15);
    customCursor.style.left = `${cursorX}px`;
    customCursor.style.top = `${cursorY}px`;

    if (isCursorActive) {
      rafId = requestAnimationFrame(updateCursorPosition);
    }
  };

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const activateCursor = () => {
    isCursorActive = true;
    customCursor.classList.add("is-active");
    document.body.classList.add("cursor-active");
    rafId = requestAnimationFrame(updateCursorPosition);
  };

  const deactivateCursor = () => {
    isCursorActive = false;
    customCursor.classList.remove("is-active");
    customCursor.classList.remove("is-image-reveal");
    document.body.classList.remove("cursor-active");
    if (rafId) cancelAnimationFrame(rafId);
  };

  portfolioItems.forEach((item) => {
    item.addEventListener("mouseenter", activateCursor);
    item.addEventListener("mouseleave", deactivateCursor);
  });

  document.addEventListener("mousemove", (e) => {
    if (isCursorActive && !e.target.closest(".portfolio__item")) {
      deactivateCursor();
    }
  });

  document.addEventListener("mouseleave", deactivateCursor);
  window.addEventListener("blur", deactivateCursor);
}

// 7. Reveal Escalonado no Scroll (Portfolio)
portfolioItems.forEach((item, i) => {
  item.style.setProperty("--stagger", i);
});

const portfolioObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        portfolioObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

portfolioItems.forEach((item) => portfolioObserver.observe(item));

// 8. Modal Netflix-style (Detalhe de Projeto)
const modal = document.querySelector(".project-modal");
const modalBackdrop = modal?.querySelector(".project-modal__backdrop");
const modalClose = modal?.querySelector(".project-modal__close");
const modalVideo = modal?.querySelector(".project-modal__video");
const modalImage = modal?.querySelector(".project-modal__hero-image");
const modalTag = modal?.querySelector(".project-modal__tag");
const modalTitle = modal?.querySelector(".project-modal__title");
const modalDesc = modal?.querySelector(".project-modal__desc");
const modalLink = modal?.querySelector(".project-modal__btn--primary");

if (modal) {
  const openModal = (item) => {
    // Populate content from data attributes
    modalTag.textContent = item.dataset.modalTag || "";
    modalTitle.textContent = item.dataset.modalTitle || "";
    modalDesc.textContent = item.dataset.modalDesc || "";

    if (modalLink) {
      modalLink.href = item.dataset.modalLink || "#";
    }

    // Handle image or video
    const hasImage = item.dataset.modalImage;
    const hasVideo = item.dataset.modalVideo;

    if (hasImage && modalImage) {
      modalImage.src = hasImage;
      modalImage.alt = item.dataset.modalTitle || "";
      modalImage.classList.add("is-active");
      if (modalVideo) modalVideo.classList.add("is-hidden");
    }

    if (hasVideo && modalVideo) {
      modalVideo.src = hasVideo;
      modalVideo.play().catch(() => {});
      modalVideo.classList.remove("is-hidden");
      if (modalImage) modalImage.classList.remove("is-active");
    }

    // If only image (no video), hide video
    if (hasImage && !hasVideo && modalVideo) {
      modalVideo.classList.add("is-hidden");
    }

    // Open
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");

    // Hide custom cursor
    if (customCursor) customCursor.classList.remove("is-active");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    // Reset video
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.classList.remove("is-hidden");
    }

    // Reset image
    if (modalImage) {
      modalImage.classList.remove("is-active");
      modalImage.src = "";
    }
  };

  // Open on portfolio card click
  portfolioItems.forEach((item) => {
    item.addEventListener("click", () => openModal(item));
  });

  // Close on X button
  modalClose?.addEventListener("click", closeModal);

  // Close on backdrop click
  modalBackdrop?.addEventListener("click", closeModal);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

// ═══════════════════════════════════════════════════
// 9. SOBRE NÓS — Animações
// ═══════════════════════════════════════════════════

// 9a. Word-by-word scroll reveal (manifesto)
const aboutWords = document.querySelectorAll(".about__word");
if (aboutWords.length) {
  const manifesto = document.querySelector(".about__manifesto");

  const wordObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger reveal each word
          aboutWords.forEach((word, i) => {
            setTimeout(() => {
              word.classList.add("is-visible");
            }, i * 80);
          });
          wordObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (manifesto) wordObserver.observe(manifesto);
}

// 9b. Stat counter animation
const statNumbers = document.querySelectorAll(".about__stat-number");
if (statNumbers.length) {
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const statsSection = document.querySelector(".about__stats");
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statNumbers.forEach((num, i) => {
            setTimeout(() => animateCounter(num), i * 150);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  if (statsSection) statsObserver.observe(statsSection);
}

// 9c. 3D Tilt on team cards
const tiltCards = document.querySelectorAll("[data-tilt]");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(800px) rotateX(0) rotateY(0) scale(1)`;
  });
});

// ═══════════════════════════════════════════════════
// 10. TESTIMONIALS (Editorial Strip)
// ═══════════════════════════════════════════════════
// Sem lógica de scroll para evitar quebras no layout.
