/* ===== CATALOG — горизонтальный скролл + Swiper ===== */

export function initCatalog() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const isTablet  = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;

  if (isDesktop) {
    _initPinScroll();
  } else {
    _initSwiper(isTablet ? 2.1 : 1.2);
  }

  /* Swiper для отзывов на мобиле */
  if (!isDesktop && !isTablet) {
    _initReviewsSwiper();
  }
}

/* Горизонтальный pin-scroll (десктоп ≥1024px) */
function _initPinScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector('.catalog-section');
  const track   = document.querySelector('.catalog-track');
  if (!section || !track) return;

  /* Показываем track, скрываем swiper */
  track.style.display = 'flex';
  const swiper = document.querySelector('.catalog-swiper');
  if (swiper) swiper.style.display = 'none';

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth + 200),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      end: () => '+=' + (track.scrollWidth - window.innerWidth + 200),
      invalidateOnRefresh: true
    }
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
