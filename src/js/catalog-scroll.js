/* ===== CATALOG — горизонтальный скролл + Swiper ===== */

export function initCatalog() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const isTablet  = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;

  if (isDesktop) {
    _initPinScroll();
    return;
  }

  /* Ждём load — Swiper CDN грузится defer, может быть ещё не готов */
  const doSwiper = () => {
    _initSwiper(isTablet ? 2.1 : 1.2);
    if (!isTablet) _initReviewsSwiper();
  };

  if (document.readyState === 'complete') {
    doSwiper();
  } else {
    window.addEventListener('load', doSwiper, { once: true });
  }
}

/* Горизонтальный pin-scroll + drag мышью (десктоп ≥1024px) */
function _initPinScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector('.catalog-section');
  const track   = document.querySelector('.catalog-track');
  if (!section || !track) return;

  /* Показываем track, скрываем swiper */
  track.style.display = 'flex';
  const swiperEl = document.querySelector('.catalog-swiper');
  if (swiperEl) swiperEl.style.display = 'none';

  const totalDrag = () => track.scrollWidth - window.innerWidth + 200;

  gsap.to(track, {
    x: () => -totalDrag(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      end: () => '+=' + totalDrag(),
      invalidateOnRefresh: true
    }
  });

  /* Drag мышью — конвертирует горизонтальный drag в вертикальный скролл */
  let dragStartX = null;
  let dragStartScrollY = 0;

  section.style.cursor = 'grab';

  section.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragStartX     = e.clientX;
    dragStartScrollY = window.scrollY;
    section.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (dragStartX === null) return;
    const dx    = dragStartX - e.clientX;
    const ratio = totalDrag() / window.innerWidth;
    window.scrollTo({ top: dragStartScrollY + dx * ratio * 0.9, behavior: 'instant' });
  });

  window.addEventListener('mouseup', () => {
    if (dragStartX === null) return;
    dragStartX = null;
    section.style.cursor = 'grab';
  });
}

/* Swiper для отзывов (только мобиль) */
function _initReviewsSwiper() {
  const el = document.querySelector('.reviews-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper(el, {
    slidesPerView: 1.1,
    spaceBetween: 16,
    grabCursor: true,
    pagination: { el: '.reviews-swiper .swiper-pagination', clickable: true },
    a11y: { enabled: true }
  });
}

/* Swiper (мобиль ≤767px и планшет 768-1023px) */
function _initSwiper(slidesPerView) {
  const track  = document.querySelector('.catalog-track');
  const swiper = document.querySelector('.catalog-swiper');
  if (!swiper) return;

  if (track) track.style.display = 'none';
  swiper.style.display = 'block';

  /* Динамическая загрузка Swiper из CDN уже подключена в HTML */
  if (typeof Swiper === 'undefined') return;

  new Swiper(swiper, {
    slidesPerView,
    spaceBetween: 20,
    freeMode: true,
    grabCursor: true,
    /* Доступность */
    a11y: { enabled: true }
  });
}
