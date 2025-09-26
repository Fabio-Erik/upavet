// Mostrar/esconder botão WhatsApp flutuante
const whatsappTop = document.getElementById("whatsapp-top");
const whatsappFloat = document.getElementById("whatsapp-float");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    whatsappTop.style.display = "none";
    whatsappFloat.classList.add("show");
  } else {
    whatsappTop.style.display = "inline-block";
    whatsappFloat.classList.remove("show");
  }
});

// Animação dos círculos de contagem
document.addEventListener("DOMContentLoaded", () => {
  const rings = document.querySelectorAll(".ring");
  rings.forEach(ring => {
    const length = ring.getTotalLength();
    ring.style.strokeDasharray = length;
    ring.style.strokeDashoffset = length;

    setTimeout(() => {
      ring.style.strokeDashoffset = 0;
    }, 500);
  });
});

// Modal para equipe/ambiente
const modal = document.getElementById("gallery-modal");
const modalContent = modal.querySelector(".modal-content");
const modalClose = modal.querySelector(".modal-close");
const modalGallery = modal.querySelector(".modal-gallery");
const modalText = modal.querySelector(".modal-text");

document.querySelectorAll("[data-gallery]").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-gallery");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    // Exemplo: carregar imagens e texto
    modalGallery.innerHTML = "";
    for (let i = 1; i <= 6; i++) {
      const img = document.createElement("img");
      img.src = `images/${type}/${i}.jpg`;
      img.alt = `${type} ${i}`;
      modalGallery.appendChild(img);
    }
    modalText.textContent = `Descrição detalhada sobre ${type}.`;
  });
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
});

// Fechar modal clicando fora
window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
});

// Carousel de procedimentos
const carousel = document.getElementById("procedures-carousel");
if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const items = carousel.querySelectorAll(".carousel-item");
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");

  let index = 0;

  function updateCarousel() {
    const width = items[0].offsetWidth + 20;
    track.style.transform = `translateX(-${index * width}px)`;
  }

  prevBtn.addEventListener("click", () => {
    index = Math.max(index - 1, 0);
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    index = Math.min(index + 1, items.length - 1);
    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);
}
// -----------------------------
// Animação de progress rings + contagem
// -----------------------------
(function () {
  // easing
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateRing(ring, textEl, targetValue, duration = 2000) {
    const r = ring.r.baseVal.value;
    const circumference = 2 * Math.PI * r;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;

    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const progressRaw = Math.min(elapsed / duration, 1);
      const progress = easeOutCubic(progressRaw);

      // stroke offset: from full (circumference) -> 0
      const offset = circumference * (1 - progress);
      ring.style.strokeDashoffset = offset;

      // contador: 0 -> targetValue
      const current = Math.floor(progress * targetValue);
      // exibindo com + prefix quando terminar ou durante
      if (progressRaw < 1) {
        textEl.textContent = current;
      } else {
        textEl.textContent = (targetValue >= 0 ? `+${targetValue}` : targetValue);
      }

      if (progressRaw < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  // Observador para animar quando entrar na tela (apenas uma vez)
  const options = { root: null, rootMargin: '0px', threshold: 0.5 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const svg = entry.target;
        const ring = svg.querySelector('.ring');
        const textEl = svg.querySelector('.ring-text');
        const target = parseInt(ring.getAttribute('data-target') || '0', 10);
        // evitar re-executar
        if (!svg.dataset.animated) {
          animateRing(ring, textEl, target, 2000);
          svg.dataset.animated = 'true';
        }
        // se quiser animar sempre que entrar, comente a linha acima e remova a marcação
      }
    });
  }, options);

  document.querySelectorAll('.progress-ring').forEach(svg => {
    // inicialmente deixar o texto em 0 (caso não esteja)
    const t = svg.querySelector('.ring-text');
    if (t) t.textContent = '0';
    observer.observe(svg);
  });
})(); (function () {
  const carousel = document.getElementById("procedures-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const items = Array.from(track.children);
  const itemWidth = items[0].offsetWidth + 10; // largura do item + gap
  let offset = 0; // deslocamento atual em px

  function moveNext() {
    offset += itemWidth;
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(-${offset}px)`;

    track.addEventListener("transitionend", () => {
      const first = track.firstElementChild;
      track.appendChild(first);
      offset -= itemWidth;
      track.style.transition = "none";
      track.style.transform = `translateX(-${offset}px)`;
    }, { once: true });
  }

  function movePrev() {
    // mover o último item para o início **antes** de animar
    const last = track.lastElementChild;
    track.insertBefore(last, track.firstElementChild);

    // atualizar offset para refletir a mudança
    offset += itemWidth;
    track.style.transition = "none";
    track.style.transform = `translateX(-${offset}px)`;

    // forçar reflow para que a transição funcione
    void track.offsetWidth;

    // animar para posição correta
    offset -= itemWidth;
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(-${offset}px)`;
  }

  // Botões
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");

  prevBtn.addEventListener("click", movePrev);
  nextBtn.addEventListener("click", moveNext);

})();


// === Gerador de bolhas nos cards translúcidos (em todo o card) ===
(function() {
  const bubbleContainers = document.querySelectorAll('[data-bubbles] .bubbles');

  if (!bubbleContainers.length) return;

  function createBubble(container) {
    const size = Math.round(Math.random() * 14) + 8; // 8-22px
    const left = Math.random() * 86 + 6; // posição horizontal aleatória
    const startBottom = Math.random() * 80; // posição vertical inicial aleatória (0-80% do card)
    const riseDistance = 80 + Math.random() * 20; // distância da animação
    const delay = Math.random() * 200; 
    const duration = 800 + Math.random() * 900; 

    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.bottom = `${startBottom}%`; // posição inicial aleatória

    container.appendChild(bubble);

    // animação da subida
    setTimeout(() => {
      bubble.style.transition = `transform ${duration}ms ease-out, opacity 400ms ease-out`;
      bubble.style.transform = `translateY(-${riseDistance}%)`; // sobe
      bubble.style.opacity = '0.05';

      // remover automaticamente depois da animação
      setTimeout(() => {
        if (bubble.parentElement) bubble.remove();
      }, duration + 500);
    }, delay);
  }

  function startBubbles() {
    bubbleContainers.forEach(container => {
      // bolhas iniciais
      for (let i = 0; i < 12; i++) createBubble(container);

      // bolhas contínuas
      setInterval(() => {
        if (container.children.length < 40) { // até 40 bolhas ao mesmo tempo
          createBubble(container);
        }
      }, 200 + Math.random() * 400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBubbles);
  } else {
    startBubbles();
  }
})();

(function () {
  const selectors = [
    '.logo',
    'nav.main-nav',
    '.cta-area',
    '#whatsapp-float',
    '.hero-left',
    '.hero-right',
    '.about-card',
    '.container',
    '.container.grooming-inner',
    '.card.card-services[data-bubbles]',
    '.card.card-plans[data-bubbles]',
    'a.btn.primary.btn-wpp',
    '.test-square',
    '.thanks'
  ];

  const directionMap = {
    '.logo': 'reveal--from-top',
    'nav.main-nav': 'reveal--from-top',
    '.cta-area': 'reveal--from-top',
    '#whatsapp-float': 'reveal--from-right',
    '.hero-left': 'reveal--from-left',
    '.hero-right': 'reveal--from-right',
    '.about-card': 'reveal--from-bottom',
    '.container': 'reveal--from-bottom',
    '.container.grooming-inner': 'reveal--from-bottom',
    '.card.card-services[data-bubbles]': 'reveal--from-bottom',
    '.card.card-plans[data-bubbles]': 'reveal--from-bottom',
    'a.btn.primary.btn-wpp': 'reveal--from-bottom',
    '.test-square': 'reveal--from-bottom',
    '.thanks': 'reveal--from-bottom'
  };

  const elementsSet = new Set();
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => elementsSet.add(el));
  });
  const elements = Array.from(elementsSet);

  if (!elements.length) return;

  elements.forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      for (const sel in directionMap) {
        if (el.matches(sel)) {
          el.classList.add(directionMap[sel]);
          break;
        }
      }
    }
  });

  // === IntersectionObserver mais "rápido" ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // só anima 1 vez
      }
    });
  }, {
    threshold: 0.01,          // basta 1% do elemento aparecer
    rootMargin: "0px 0px -5% 0px" // dispara quase imediatamente
  });

  elements.forEach(el => observer.observe(el));

  // Revela imediatamente os que já estão na tela no load
  window.addEventListener("DOMContentLoaded", () => {
    elements.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-visible");
      }
    });
  });
})();


function updateCarousel() {
    const width = items[0].offsetWidth + 10; // gap
    track.style.transform = `translateX(-${index * width}px)`;
}

// Ao redimensionar, resetar index e offset para mobile
window.addEventListener("resize", () => {
    index = 0;
    updateCarousel();
});
