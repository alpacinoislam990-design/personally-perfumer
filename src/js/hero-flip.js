/* ===== HERO SLIDER — clip-path reveal (Kurkdjian style) ===== */

import { getLang } from './i18n.js';

const SLIDE_DATA = {
  ru: [
    { main: 'Разбуди инстинкты',  sub: 'Personally Perfumer' },
    { main: 'Твой аромат',        sub: 'Personal Fragrance'  },
    { main: 'Сделано для тебя',   sub: 'Made to Order'       },
    { main: 'Дубай · Эксклюзив',  sub: 'Dubai Exclusive'     },
  ],
  en: [
    { main: 'Awaken Your Instincts', sub: 'Personally Perfumer' },
    { main: 'Your Scent',            sub: 'Personal Fragrance'  },
    { main: 'Made for You',          sub: 'Made to Order'       },
    { main: 'Dubai · Exclusive',     sub: 'Dubai Exclusive'     },
  ],
};

function getSlides() {
  return SLIDE_DATA[getLang()] ?? SLIDE_DATA.ru;
}

export function initHeroFlip() {
  const slides      = document.querySelectorAll('.hero-slide');
  const textEl      = document.querySelector('.hero-text-left');
  const dotsWrap    = document.querySelector('.hero-dots');
  const prevBtn     = document.querySelector('.hero-prev');
  const nextBtn     = document.querySelector('.hero-next');

  if (!slides.length) return;

  let current   = 0;
  let animating = false;
  let timer     = null;

  /* Начальное состояние: первый слайд видим, остальные прозрачны */
  gsap.set(slides[0], { opacity: 1, zIndex: 1 });
  slides.forEach((s, i) => {
    if (i > 0) gsap.set(s, { opacity: 0, zIndex: 0 });
  });

  /* Построить точки */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  /* Первый текст — появляется после прелоадера (delay задаётся в main.js) */
  _setTextImmediate(0);

  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    const prev = current;
    current    = next;

    /* Cross-fade: новый плавно появляется поверх старого */
    gsap.set(slides[next], { opacity: 0, zIndex: 2 });
    gsap.set(slides[prev], { zIndex: 1 });

    gsap.to(slides[prev], { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
    gsap.to(slides[next], {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(slides[prev], { zIndex: 0 });
        animating = false;
      }
    });

    _animateText(next);
    _updateDots(next);
    resetTimer();
  }

  function _animateText(idx) {
    if (!textEl) return;
    const lines = textEl.querySelectorAll('.text-line');

    /* Старый текст: fade out вверх */
    gsap.to(lines, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        _setTextImmediate(idx);
        const newLines = textEl.querySelectorAll('.text-line');
        /* Новый текст: fade in снизу со stagger */
        gsap.fromTo(newLines,
          { opacity: 0, y: -40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }
        );
      }
    });
  }

  function _setTextImmediate(idx) {
    if (!textEl) return;
    const slides = getSlides();
    const data = slides[idx] ?? slides[0];
    /* XSS-safe: данные берутся только из SLIDE_DATA, не из DOM/пользователя */
    textEl.innerHTML = `
      <span class="text-line main">${data.main}</span>
      <span class="text-line sub">${data.sub}</span>
    `;
  }

  function _updateDots(next) {
    dotsWrap?.querySelectorAll('.hero-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === next);
    });
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo((current - 1 + slides.length) % slides.length));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo((current + 1) % slides.length));

  resetTimer();

  /* Обновляет текст текущего слайда при смене языка */
  window._heroRefreshText = () => _setTextImmediate(current);
}
