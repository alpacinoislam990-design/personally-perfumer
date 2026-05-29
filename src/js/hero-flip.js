/* ===== HERO FLIP SLIDESHOW ===== */

export function initHeroFlip() {
  const cards = document.querySelectorAll('.hero-card');
  if (cards.length < 2) return;

  const [darkCard, lightCard] = cards;
  const dots = document.querySelectorAll('.hero-dot');
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const perspectivePx = isMobile ? '600px' : '1200px';

  document.getElementById('hero').style.perspective = perspectivePx;

  let current = 0;
  let animating = false;

  /* Начальное состояние */
  gsap.set(darkCard,  { rotateX: 0,   transformOrigin: 'bottom center', zIndex: 2 });
  gsap.set(lightCard, { rotateX: 90,  transformOrigin: 'top center',    zIndex: 1 });

  function flipTo(next) {
    if (animating) return;
    animating = true;

    const leaving  = current === 0 ? darkCard  : lightCard;
    const entering = current === 0 ? lightCard : darkCard;
    const nextIdx  = current === 0 ? 1 : 0;

    const dur = isMobile ? 0.7 : 0.9;

    const tl = gsap.timeline({
      onComplete: () => {
        current = nextIdx;
        animating = false;
        _updateDots(current, dots);
      }
    });

    /* Уходящая карточка — падает вперёд */
    tl.to(leaving, {
      rotateX: -90,
      transformOrigin: 'bottom center',
      duration: dur,
      ease: 'power3.in',
      zIndex: 1
    }, 0);

    /* Входящая карточка — поднимается снизу */
    tl.fromTo(entering,
      { rotateX: 90, transformOrigin: 'top center', zIndex: 2 },
      { rotateX: 0,  transformOrigin: 'top center', zIndex: 2,
        duration: dur, ease: 'power3.out' },
      dur * 0.45 /* небольшое перекрытие */
    );
  }

  /* Автопереключение каждые 4.5s */
  let timer = setInterval(flipTo, 4500);

  /* Клик по точкам */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (i !== current) {
        clearInterval(timer);
        flipTo();
        timer = setInterval(flipTo, 4500);
      }
    });
  });

  _updateDots(0, dots);
}

function _updateDots(idx, dots) {
  dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
}
