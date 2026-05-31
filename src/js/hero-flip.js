/* ===== HERO SLIDESHOW — cross-fade ===== */

export function initHeroFlip() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  const dots    = document.querySelectorAll('.hero-dot');
  let current   = 0;
  let animating = false;

  /* Blurred background fill — та же картина размытая заполняет бока */
  slides.forEach(slide => {
    const img = slide.querySelector('.hero-slide-img');
    if (!img) return;
    const src = img.currentSrc || img.src;
    if (src) slide.style.backgroundImage = `url(${src})`;
  });

  /* Начальное состояние: первый слайд видим, остальные прозрачны */
  slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));
  _updateDots(0, dots);

  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    gsap.to(slides[current], { opacity: 0, duration: 0.85, ease: 'power2.inOut' });
    gsap.to(slides[next], {
      opacity: 1,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        current   = next;
        animating = false;
        _updateDots(current, dots);
      }
    });
  }

  /* Автопереключение каждые 4.5s */
  let timer = setInterval(() => goTo((current + 1) % slides.length), 4500);

  /* Клик по точкам */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(() => goTo((current + 1) % slides.length), 4500);
    });
  });
}

function _updateDots(idx, dots) {
  dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
}
