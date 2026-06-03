/* ===== HERO SLIDESHOW — cross-fade каждые 4с ===== */

export function initHeroFlip() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  let current   = 0;
  let animating = false;

  /* Начальное состояние: первый слайд видим, остальные прозрачны */
  slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));

  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    gsap.to(slides[current], { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
    gsap.to(slides[next], {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        current   = next;
        animating = false;
      }
    });
  }

  /* Автопереключение каждые 4с */
  setInterval(() => goTo((current + 1) % slides.length), 4000);
}
