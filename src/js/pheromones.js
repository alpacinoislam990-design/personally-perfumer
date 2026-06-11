/* ===== PHEROMONES COLLECTION — флип-карточки + горизонтальная лента ===== */

export function initPheromones() {
  _initFlip();
  _initTrackNav();

  if (window.matchMedia('(min-width: 1024px)').matches) {
    _initDesktopParallax();
  }
}

/* Флип карточки по клику/тапу + клавиатуре (Enter/Space) */
function _initFlip() {
  document.querySelectorAll('.pher-card').forEach(card => {
    const toggle = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* Стрелки prev/next — прокрутка ленты на ширину карточки + gap (десктоп) */
function _initTrackNav() {
  const wrap  = document.querySelector('.pher-track-wrap');
  const track = document.querySelector('.pher-track');
  const prev  = document.querySelector('.pher-arrow--prev');
  const next  = document.querySelector('.pher-arrow--next');
  if (!wrap || !track || !prev || !next) return;

  const cards = Array.from(track.querySelectorAll('.pher-card'));
  if (!cards.length) return;

  function step() {
    const gap = parseFloat(getComputedStyle(track).columnGap || '0');
    return cards[0].getBoundingClientRect().width + gap;
  }

  function updateArrows() {
    const max = wrap.scrollWidth - wrap.clientWidth;
    prev.disabled = wrap.scrollLeft <= 1;
    next.disabled = wrap.scrollLeft >= max - 1;
  }

  prev.addEventListener('click', () => wrap.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => wrap.scrollBy({ left: step(), behavior: 'smooth' }));

  wrap.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
}

/* Параллакс флакона на hover — только десктоп ≥1024px (hover:hover + pointer:fine) */
function _initDesktopParallax() {
  if (typeof gsap === 'undefined') return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let ease = 'power2.out';
  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('pheromoneSpring', 'M0,0,C0.175,0.885,0.32,1.275,1,1');
    ease = 'pheromoneSpring';
  }

  document.querySelectorAll('.pher-card').forEach(card => {
    const bottle = card.querySelector('.pher-card-bottle-wrap');
    if (!bottle) return;

    card.addEventListener('mouseenter', () => {
      if (card.classList.contains('is-flipped')) return;
      gsap.to(bottle, {
        y: -7, scale: 1.02, rotateX: 6,
        transformPerspective: 800,
        duration: 0.6, ease
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(bottle, { y: 0, scale: 1, rotateX: 0, duration: 0.6, ease });
    });
  });
}
