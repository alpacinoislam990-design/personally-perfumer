/* ===== CATALOG — горизонтальный скролл + Swiper ===== */

export function initCatalog() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const isTablet  = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
  const isMobile  = window.matchMedia('(max-width: 767px)').matches;

  if (isDesktop) {
    _initPinScroll();
  } else {
    _initSwiper(isTablet ? 2.1 : 1.2);
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
