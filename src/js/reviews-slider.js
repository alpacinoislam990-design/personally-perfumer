/* ===== СЛАЙДЕР ОТЗЫВОВ ===== */
export function initReviewsSlider() {
  const slider   = document.getElementById('reviews-slider');
  if (!slider) return;

  const track    = slider.querySelector('.reviews-track');
  const viewport = slider.querySelector('.reviews-viewport');
  const prevBtn  = slider.querySelector('.rev-prev');
  const nextBtn  = slider.querySelector('.rev-next');
  const slides   = Array.from(track.querySelectorAll('.review-slide'));
  const dotsCont = document.getElementById('reviews-dots');
  const dots     = Array.from(dotsCont.querySelectorAll('.rev-dot'));

  const total   = slides.length;
  let current   = 0;
  let autoTimer = null;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* Ширина одного слайда = ширина viewport */
  function slideW() { return viewport.offsetWidth; }

  /* Перейти к слайду index */
  function goTo(index) {
    if (index === current) return;

    const prevIndex = current;
    current = index;

    const oldCard = slides[prevIndex].querySelector('.review-card');
    const newCard = slides[current].querySelector('.review-card');

    /* Сразу скрыть текст входящего слайда — до начала движения трека */
    gsap.set(
      [newCard.querySelector('.review-quote'), newCard.querySelector('.review-author')],
      { opacity: 0, y: 10 }
    );

    /* Текст уходящего слайда: вверх + прозрачность */
    gsap.to(
      [oldCard.querySelector('.review-quote'), oldCard.querySelector('.review-author')],
      { opacity: 0, y: -10, duration: 0.25, ease: 'power2.in' }
    );

    /* Сдвиг трека */
    gsap.to(track, {
      x: -slideW() * current,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete() {
        /* Текст входящего слайда появляется только после остановки */
        gsap.to(
          [newCard.querySelector('.review-quote'), newCard.querySelector('.review-author')],
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    });

    updateUI();
  }

  /* Синхронизировать точки и стрелки с текущим индексом */
  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    if (!isTouch) {
      prevBtn.classList.toggle('is-hidden', current === 0);
      nextBtn.classList.toggle('is-hidden', current === total - 1);
    }
  }

  /* Автолистание — запустить таймер заново */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current < total - 1 ? current + 1 : 0);
    }, 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  /* Стрелки */
  prevBtn.addEventListener('click', () => {
    if (current > 0) { goTo(current - 1); startAuto(); }
  });

  nextBtn.addEventListener('click', () => {
    if (current < total - 1) { goTo(current + 1); startAuto(); }
  });

  /* Точки */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  /* Hover — пауза автолистания */
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  /* Touch swipe */
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta > 50 && current > 0)               { goTo(current - 1); startAuto(); }
    else if (delta < -50 && current < total - 1) { goTo(current + 1); startAuto(); }
  });

  /* Пересчитать позицию при смене ширины окна (без анимации) */
  const ro = new ResizeObserver(() => {
    gsap.set(track, { x: -slideW() * current });
  });
  ro.observe(viewport);

  /* Скрыть текст всех слайдов кроме первого — убирает мигание при первом переходе */
  slides.forEach((slide, i) => {
    if (i === 0) return;
    const card = slide.querySelector('.review-card');
    gsap.set(
      [card.querySelector('.review-quote'), card.querySelector('.review-author')],
      { opacity: 0, y: 10 }
    );
  });

  /* Инициализация */
  updateUI();
  startAuto();
}
