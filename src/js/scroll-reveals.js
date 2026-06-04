/* ===== SCROLL REVEALS — SplitType + ScrollTrigger ===== */

export function initScrollReveals() {
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* --- Clip-path reveal для заголовков секций --- */
  document.querySelectorAll(
    '.services-heading, .process-heading, .reviews-heading, .contact-title'
  ).forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(100% 0 0 0)',
      duration:  0.9,
      ease:      'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
  });

  /* --- "Разбуди инстинкты" — драматичный reveal по буквам --- */
  const tagline = document.querySelector('.about-tagline');
  if (tagline && typeof SplitType !== 'undefined') {
    const splitTag = new SplitType(tagline, { types: 'chars,words' });
    gsap.set(splitTag.chars, { overflow: 'hidden' });
    gsap.from(splitTag.chars, {
      yPercent: 110,
      opacity: 0,
      duration: isMobile ? 0.7 : 1.1,
      ease: 'power4.out',
      stagger: { amount: 0.5, from: 'start' },
      scrollTrigger: { trigger: tagline, start: 'top 88%', once: true }
    });
  }

  /* --- About label — fade up --- */
  gsap.from('.about-label', {
    opacity: 0, y: 16, duration: 0.5, ease: 'power2.out',
    scrollTrigger: { trigger: '#about', start: 'top 70%', once: true }
  });

  /* --- About — heading fade+slide (без SplitType — сохраняет \n переносы) --- */
  const aboutH = document.querySelector('.about-heading');
  if (aboutH) {
    gsap.from(aboutH, {
      opacity: 0, y: isMobile ? 15 : 40,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 70%', once: true }
    });
  }

  /* --- About — цитата и статистика --- */
  gsap.from(['.about-quote', '.about-stats'], {
    opacity: 0, y: 24,
    duration: 0.6, ease: 'power2.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '#about', start: 'top 60%', once: true }
  });

  /* --- About stats — counter 0→N --- */
  document.querySelectorAll('.about-stat-num').forEach(el => {
    const raw    = el.textContent.trim();
    const target = parseFloat(raw);
    const suffix = raw.replace(/[\d.]/g, ''); /* '+', '' и т.д. */
    if (isNaN(target)) return;

    const proxy = { val: 0 };
    gsap.to(proxy, {
      val:      target,
      duration: 1.6,
      ease:     'power2.out',
      onUpdate: () => { el.textContent = Math.round(proxy.val) + suffix; },
      scrollTrigger: { trigger: '#about', start: 'top 65%', once: true }
    });
  });

  /* --- Featured — контент --- */
  const featuredContent = document.querySelector('.featured-content');
  if (featuredContent) {
    gsap.from(featuredContent.children, {
      opacity: 0, y: 30,
      duration: 0.7, ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '#featured', start: 'top 60%', once: true }
    });
  }

  /* --- Services — карточки с выраженным stagger --- */
  gsap.from('.services-card', {
    opacity: 0, y: 50,
    duration: 0.7, ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '#services', start: 'top 72%', once: true }
  });

  /* --- Process — коннекторы scaleX 0→1 --- */
  gsap.from('.process-connector', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.8, ease: 'power2.out',
    stagger: 0.3,
    scrollTrigger: { trigger: '#process', start: 'top 70%', once: true }
  });

  /* --- Process — шаги --- */
  gsap.from('.process-step', {
    opacity: 0, y: 40,
    duration: 0.7, ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: { trigger: '#process', start: 'top 70%', once: true }
  });

  /* --- Reviews — карточки (только десктоп) --- */
  if (!isMobile) {
    gsap.from('.reviews-grid .review-card', {
      opacity: 0, y: 24,
      duration: 0.6, ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '#reviews', start: 'top 70%', once: true }
    });
  }

  /* --- Contact — заголовок через clip-path (уже обработан выше) --- */

  /* --- Параллакс — только десктоп --- */
  if (!isMobile) {
    _initParallax();
  }
}

function _initParallax() {
  /* Hero — изображение скроллится медленнее страницы (классический parallax) */
  const heroSlides = document.querySelector('.hero-slides');
  if (heroSlides) {
    gsap.to(heroSlides, {
      y: '25%', ease: 'none',
      scrollTrigger: {
        trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true
      }
    });
  }

  /* About — фото параллакс */
  const aboutPhoto = document.querySelector('.about-photo-img');
  if (aboutPhoto) {
    gsap.to(aboutPhoto, {
      y: 40, ease: 'none',
      scrollTrigger: {
        trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1.5
      }
    });
  }

  /* Featured — фото параллакс */
  const featImg = document.querySelector('.featured-img-wrap');
  if (featImg) {
    gsap.to(featImg, {
      y: 40, ease: 'none',
      scrollTrigger: {
        trigger: '#featured', start: 'top bottom', end: 'bottom top', scrub: 1.5
      }
    });
  }

}
