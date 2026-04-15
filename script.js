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
// 10. TESTIMONIALS (Cinematic Scroll Experience)
// ═══════════════════════════════════════════════════

const tTrack = document.querySelector(".testimonials-track");
const tCinema = document.querySelector(".t-cinema");
const tScenes = document.querySelectorAll(".t-scene");
const tProgressBar = document.querySelector(".t-cinema__progress-bar");

if (tTrack && tCinema) {
  let tTicking = false;

  const updateCinema = () => {
    const rect = tTrack.getBoundingClientRect();
    const trackTop = rect.top;
    const trackHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Calculate progress (0 to 1) based on sticky container scrolling
    // It starts sticky when trackTop is 0, ends when trackTop is -(trackHeight - windowHeight)
    const scrollableDistance = trackHeight - windowHeight;
    let progress = 0;

    if (scrollableDistance > 0) {
      progress = clamp(-trackTop / scrollableDistance, 0, 1);
    }

    // Update progress bar
    if (tProgressBar) {
      tProgressBar.style.width = `${progress * 100}%`;
    }

    // Determine active scene
    let activeIndex = 0;
    if (progress > 0.66) {
      activeIndex = 2;
    } else if (progress > 0.33) {
      activeIndex = 1;
    }

    // Apply classes for scenes
    tScenes.forEach((scene, index) => {
      if (index === activeIndex) {
        scene.classList.add("is-active");
      } else {
        scene.classList.remove("is-active");
      }
    });

    tTicking = false;
  };

  const onCinemaScroll = () => {
    if (!tTicking) {
      tTicking = true;
      requestAnimationFrame(updateCinema);
    }
  };

  window.addEventListener("scroll", onCinemaScroll, { passive: true });
  updateCinema(); // Init on load

  // Spotlight follow cursor logic
  let spotlightX = "50%";
  let spotlightY = "50%";

  tCinema.addEventListener("mousemove", (e) => {
    const cinemaRect = tCinema.getBoundingClientRect();
    const x = e.clientX - cinemaRect.left;
    const y = e.clientY - cinemaRect.top;
    spotlightX = `${x}px`;
    spotlightY = `${y}px`;
    
    tCinema.style.setProperty("--mouse-x", spotlightX);
    tCinema.style.setProperty("--mouse-y", spotlightY);
  });

  tCinema.addEventListener("mouseleave", () => {
    tCinema.style.setProperty("--mouse-x", `50%`);
    tCinema.style.setProperty("--mouse-y", `50%`);
  });
}


// ═══════════════════════════════════════════════════
// 11. SOCIAL MEDIA (Cinematic 3D Tilt)
// ═══════════════════════════════════════════════════

const igShowcase = document.querySelector(".instagram-showcase");
const igCards = document.querySelectorAll(".instagram-showcase__card");

if (igShowcase && igCards.length > 0 && window.matchMedia("(hover: hover)").matches) {
  igShowcase.addEventListener("mousemove", (e) => {
    const rect = igShowcase.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Normalize coordinates from -1 to 1
    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;

    igCards.forEach((card, index) => {
      // Different multiplier based on card position (left, center, right)
      // Left = 0, Center = 1, Right = 2  (usually center responds less to X tilt)
      const multiplier = index === 1 ? -6 : (index === 0 ? -12 : -8);
      
      const tiltX = normalizedY * -10; // Tilt up/down
      const tiltY = normalizedX * multiplier; // Pan left/right

      card.style.setProperty("--tilt-x", `${tiltX}deg`);
      card.style.setProperty("--tilt-y", `${tiltY}deg`);
    });
  });

  igShowcase.addEventListener("mouseleave", () => {
    igCards.forEach(card => {
      card.style.setProperty("--tilt-x", `0deg`);
      card.style.setProperty("--tilt-y", `0deg`);
    });
  });
}

// ═══════════════════════════════════════════════════
// 12. THE PIPELINE — Scroll Reveal & Progress Line
// ═══════════════════════════════════════════════════
const pipelineSteps = document.querySelectorAll('.pipeline__step');
const pipelineLineFill = document.querySelector('.pipeline__line-fill');

if (pipelineSteps.length) {
  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.3 });

  pipelineSteps.forEach(step => pipelineObserver.observe(step));

  // Progress line fill based on scroll position
  if (pipelineLineFill) {
    const track = document.querySelector('.pipeline__track');
    window.addEventListener('scroll', () => {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const trackTop = rect.top;
      const trackHeight = rect.height;
      const viewH = window.innerHeight;
      
      // Calculate progress: 0% when track enters viewport, 100% when bottom reaches middle
      let progress = (viewH - trackTop) / (trackHeight + viewH * 0.5);
      progress = Math.max(0, Math.min(1, progress));
      pipelineLineFill.style.height = `${progress * 100}%`;
    }, { passive: true });
  }
}

// ═══════════════════════════════════════════════════
// 13. NAVBAR DYNAMIC ISLAND & CLOCK & MAGNETIC CTAs
// ═══════════════════════════════════════════════════
const heroNav = document.querySelector('.hero__nav');
const clockTime = document.querySelector('.nav-clock-time');

if(heroNav) {
  // A. Interactive DNA Widget Morphing Logic
  const islandConfig = {
    island: document.querySelector('.dynamic-island'),
    notchBtn: document.querySelector('.dynamic-island__notch'),
  };

  if (islandConfig.island && islandConfig.notchBtn) {
    // Toggle state on click notch
    islandConfig.notchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = islandConfig.island.classList.toggle('is-open');
      islandConfig.island.setAttribute('aria-expanded', isOpen);
    });

    // Close button logic
    const closeBtn = document.querySelector('.widget-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        islandConfig.island.classList.remove('is-open');
        islandConfig.island.setAttribute('aria-expanded', 'false');
      });
    }

    // Fechar se clicar fora
    document.addEventListener('click', (e) => {
      if (islandConfig.island.classList.contains('is-open') && !islandConfig.island.contains(e.target)) {
        islandConfig.island.classList.remove('is-open');
        islandConfig.island.setAttribute('aria-expanded', 'false');
      }
    });

    // Fechar ao rolar a página por mais de 50px de distância de segurança
    let lastScroll = window.scrollY;
    window.addEventListener('scroll', () => {
      if (islandConfig.island.classList.contains('is-open')) {
        if (Math.abs(window.scrollY - lastScroll) > 50) {
          islandConfig.island.classList.remove('is-open');
          islandConfig.island.setAttribute('aria-expanded', 'false');
        }
      } else {
        lastScroll = window.scrollY;
      }
    }, { passive: true });
  }

  // B. Realtime Clock Loop (Sao Paulo)
  if (clockTime) {
    setInterval(() => {
      const spTime = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false });
      clockTime.textContent = spTime;
    }, 1000);
  }
}

// C. Generic Magnetic Force on any element with data-magnetic
const magneticFields = document.querySelectorAll('[data-magnetic]');
if (window.matchMedia("(hover: hover)").matches) {
  magneticFields.forEach(navCta => {
    navCta.addEventListener('mousemove', (e) => {
      navCta.style.transition = 'none'; // remove CSS jitter constraint
      const rect = navCta.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      navCta.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px) scale(1.05)`;
    });
    
    navCta.addEventListener('mouseleave', () => {
      navCta.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      navCta.style.transform = `translate(0px, 0px) scale(1)`;
    });

    navCta.addEventListener('click', () => {
      navCta.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      navCta.style.transform = `translate(0px, 0px) scale(1)`;
    });
  });
}

// ═══════════════════════════════════════════════════
// 13. CINEMATIC PRELOADER
// ═══════════════════════════════════════════════════
const preloaderCount = document.getElementById('preloader-count');
if (preloaderCount) {
  let count = 0;
  // A non-linear increment logic to simulate rendering
  const interval = setInterval(() => {
    // Add random amounts so it doesn't look like a basic timer
    count += Math.floor(Math.random() * 8) + 1;
    if (count >= 100) {
      count = 100;
      preloaderCount.textContent = count;
      clearInterval(interval);
      
      // Delay before opening the curtain
      setTimeout(() => {
        document.body.classList.remove('is-loading');
      }, 400); 
    } else {
      preloaderCount.textContent = count;
    }
  }, 35);
} else {
  // Fallback if no preloader exists
  document.body.classList.remove('is-loading');
}

// ═══════════════════════════════════════════════════
// 14. FOOTER CLOCK E MAGNETIC CTA
// ═══════════════════════════════════════════════════
const footerClock = document.querySelector('.footer-clock-time');
if (footerClock) {
  setInterval(() => {
    const spTime = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false });
    footerClock.textContent = spTime;
  }, 1000);
}

const footerCta = document.querySelector('.curtain-footer__cta');
if (footerCta && window.matchMedia("(hover: hover)").matches) {
  footerCta.addEventListener('mousemove', (e) => {
    const rect = footerCta.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    footerCta.style.transform = `translate(${x * 0.4}px, ${y * 0.5}px) scale(1.05)`;
  });
  
  footerCta.addEventListener('mouseleave', () => {
    footerCta.style.transform = `translate(0px, 0px) scale(1)`;
  });
}

// ═══════════════════════════════════════════════════
// 15. CINEMATIC VIDEO REEL (Drag to Scroll + Lights Out)
// ═══════════════════════════════════════════════════

const videoReelTrackWrap = document.querySelector('.video-reel__track-wrap');
const videoReelItems = document.querySelectorAll('.video-reel__item');

if (videoReelTrackWrap && videoReelItems.length > 0) {
  let isDown = false;
  let startX;
  let scrollLeft;

  // Draggable slider logic
  videoReelTrackWrap.addEventListener('mousedown', (e) => {
    isDown = true;
    videoReelTrackWrap.style.cursor = 'grabbing';
    startX = e.pageX - videoReelTrackWrap.offsetLeft;
    scrollLeft = videoReelTrackWrap.scrollLeft;
  });

  videoReelTrackWrap.addEventListener('mouseleave', () => {
    isDown = false;
    videoReelTrackWrap.style.cursor = 'grab';
  });

  videoReelTrackWrap.addEventListener('mouseup', () => {
    isDown = false;
    videoReelTrackWrap.style.cursor = 'grab';
  });

  videoReelTrackWrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - videoReelTrackWrap.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    videoReelTrackWrap.scrollLeft = scrollLeft - walk;
  });

  // Expandable Video Modal Logic
  let activeModal = null;
  let modalOverlay = document.createElement('div');
  modalOverlay.className = 'video-modal-overlay';
  document.body.appendChild(modalOverlay);

  const closeVideoModal = () => {
    if (!activeModal) return;
    const { clone, originalItem, originalRect, videoElement } = activeModal;
    
    // Animate clone back to original position
    clone.classList.remove('is-expanded');
    clone.style.top = `${originalRect.top}px`;
    clone.style.left = `${originalRect.left}px`;
    clone.style.width = `${originalRect.width}px`;
    clone.style.height = `${originalRect.height}px`;
    clone.style.transform = `none`;
    
    modalOverlay.classList.remove('is-active');

    // Wait for transition to finish then cleanup
    setTimeout(() => {
      if (document.body.contains(clone)) clone.remove();
      originalItem.style.opacity = '1'; // Restore original
      originalItem.style.pointerEvents = 'auto';
    }, 600); // matches CSS transition time

    activeModal = null;
  };

  modalOverlay.addEventListener('click', closeVideoModal);

  videoReelItems.forEach(item => {
    const originalVideo = item.querySelector('video');

    item.addEventListener('click', (e) => {
      // Allow link clicking if we eventually add anchors inside
      if (e.target.tagName.toLowerCase() === 'a') return;
      if (activeModal) return; // Prevent double clicks

      const rect = item.getBoundingClientRect();
      item.style.opacity = '0'; // Hide original
      item.style.pointerEvents = 'none';

      // Create Clone
      const clone = document.createElement('div');
      clone.className = 'video-modal-clone';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;

      // Copy video
      const cloneVideo = document.createElement('video');
      cloneVideo.src = originalVideo.src;
      cloneVideo.loop = false; // We want it to end to auto-close
      cloneVideo.muted = false; // Start unmuted
      cloneVideo.playsInline = true;
      cloneVideo.setAttribute('crossorigin', 'anonymous');

      // Mute Toggle Button
      const muteBtn = document.createElement('div');
      muteBtn.className = 'video-modal-mute';
      // Icon: Speaker High
      muteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
      
      muteBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        cloneVideo.muted = !cloneVideo.muted;
        if (cloneVideo.muted) {
           muteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        } else {
           muteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
        }
      });

      // Auto close on finish
      cloneVideo.addEventListener('ended', () => {
        closeVideoModal();
      });

      clone.appendChild(cloneVideo);
      clone.appendChild(muteBtn);
      document.body.appendChild(clone);

      activeModal = {
        clone,
        originalItem: item,
        originalRect: rect,
        videoElement: cloneVideo
      };

      // Trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modalOverlay.classList.add('is-active');
          clone.classList.add('is-expanded');
          cloneVideo.play().catch(() => {
            // Browsers might block unmuted autoplay, so fallback to muted if error
            cloneVideo.muted = true;
            muteBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
            cloneVideo.play();
          });
        });
      });
    });
  });
}
