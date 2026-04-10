const hero = document.querySelector(".hero");
const page = document.querySelector(".page");
const animatedWords = document.querySelectorAll("[data-words]");
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

if (animatedWords.length) {
  const lowerAlphabet = "abcdefghijklmnopqrstuvwxyzçáãâàéêíóôõú";
  const upperAlphabet = lowerAlphabet.toUpperCase();

  const buildSequence = (char) => {
    if (char === " ") {
      return [" "];
    }

    const isUppercase = char === char.toUpperCase() && char !== char.toLowerCase();
    const alphabet = isUppercase ? upperAlphabet : lowerAlphabet;
    const targetIndex = alphabet.indexOf(char);

    if (targetIndex === -1) {
      return [char];
    }

    return [...alphabet.slice(0, targetIndex + 1)];
  };

  const renderWord = (element, chars) => {
    const fragment = document.createDocumentFragment();

    chars.forEach((char) => {
      const span = document.createElement("span");

      span.className = char === " "
        ? "hero__nav-label-char hero__nav-label-char--space"
        : "hero__nav-label-char";
      span.textContent = char === " " ? "\u00A0" : char;
      fragment.append(span);
    });

    element.replaceChildren(fragment);
  };

  const animateWord = (element, words, wordIndex = 0) => {
    const targetWord = words[wordIndex];
    const sequences = [...targetWord].map(buildSequence);
    const delays = sequences.map((_, index) => index * 2);
    const totalTicks = Math.max(
      ...sequences.map((sequence, index) => sequence.length + delays[index]),
      0,
    );
    let tick = 0;

    const intervalId = window.setInterval(() => {
      const chars = sequences.map((sequence, index) => {
        if (sequence[0] === " ") {
          return " ";
        }

        const localTick = tick - delays[index];

        if (localTick < 0) {
          return " ";
        }

        if (localTick >= sequence.length) {
          return targetWord[index];
        }

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
    const words = element.dataset.words
      .split("|")
      .map((word) => word.trim())
      .filter(Boolean);

    if (!words.length) {
      return;
    }

    animateWord(element, words);
  });
}

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
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
}
