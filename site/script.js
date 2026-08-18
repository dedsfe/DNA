/* Navbar dynamic island
   - desktop: abre no hover (CSS)
   - mobile:  abre no toque, alternando .is-open           */
(function () {
  var island  = document.getElementById('island');
  var content = document.getElementById('islandContent');
  var toggle  = document.getElementById('islandToggle');
  if (!island || !content || !toggle) return;

  /* ---- largura da ilha aberta no desktop ----
     a gota precisa ser ~112px mais larga que os links pra que
     as curvas laterais não comam o texto das pontas */
  var PAD = 112;

  function sizeIsland() {
    var w = 0, kids = content.children;
    for (var i = 0; i < kids.length; i++) w += kids[i].getBoundingClientRect().width;
    island.style.setProperty('--island-open', Math.round(w + PAD) + 'px');
  }

  /* mede com o layout desktop, mesmo se a tela for pequena */
  function measure() {
    if (window.matchMedia('(max-width:768px)').matches) return;
    sizeIsland();
  }

  measure();
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  /* ---- toque (mobile) ---- */
  var isTouch = window.matchMedia('(hover:none)');

  function setOpen(open) {
    island.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  toggle.addEventListener('click', function (e) {
    if (!isTouch.matches) return;
    e.preventDefault();
    setOpen(!island.classList.contains('is-open'));
  });

  /* fecha ao escolher um link, ao tocar fora ou no Esc */
  content.addEventListener('click', function (e) {
    if (e.target.closest('.island__link')) setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (!island.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();


/* Reveal de texto
   - [data-split]  : quebra em palavras e faz cada uma entrar com atraso
   - [data-reveal] : o bloco inteiro entra de uma vez
   As palavras viram <span class="w">, preservando as tags internas (<em>). */
(function () {
  function splitWords(root) {
    var i = 0;

    (function walk(node) {
      var kids = Array.prototype.slice.call(node.childNodes);

      kids.forEach(function (child) {
        if (child.nodeType === 3) {                       // nó de texto
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();

          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
            } else {
              var w = document.createElement('span');
              w.className = 'w';
              w.style.setProperty('--i', i++);
              w.textContent = part;
              frag.appendChild(w);
            }
          });

          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(root);

    return i;
  }

  var splits = document.querySelectorAll('[data-split]');
  Array.prototype.forEach.call(splits, splitWords);

  var targets = document.querySelectorAll('[data-split], [data-reveal]');

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
