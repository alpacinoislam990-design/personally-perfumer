/* ===== SCROLL REVEALS — SplitType + ScrollTrigger ===== */

export function initScrollReveals() {
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* About — heading split по словам */
  const aboutH = document.querySelector('.about-heading');
  if (aboutH && typeof SplitType !== 'undefined') {
    const split = new SplitType(aboutH, { types: 'words' });
    gsap.from(split.words, {
      opacity: 0, y: isMobile ? 15 : 30,
      duration: 0.7, ease: 'power3.out',
      stagger: 0.06,
      scrollTrigger: { trigger: '#about', start: 'top 75%', once: true }
    });
  }

  /* About — цитата и статистика */
  gsap.from(['.about-quote', '.about-stats'], {
    opacity: 0, y: 20,
    duration: 0.6, ease: 'power2.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '#about', start: 'top 65%', once: true }
  });

  /* Notes — тиры */
  document.querySelectorAll('.notes-tier').forEach((tier, i) => {
    gsap.to(tier, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power2.out',
      delay: i * 0.25,
      scrollTrigger: {
        trigger: '#notes', start: 'top 70%', once: true,
        onEnter: () => tier.classList.add('is-revealed')
      }
    });
  });

  /* Featured — контент */
  const featuredContent = document.querySelector('.featured-content');
  if (featuredContent) {
    gsap.from(featuredContent.children, {
      opacity: 0, y: 30,
      duration: 0.7, ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '#featured', start: 'top 60%', once: true }
    });
  }

  /* Services — карточки */
  gsap.from('.services-card', {
    opacity: 0, y: 30,
    duration: 0.6, ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '#services', start: 'top 70%', once: true }
  });

  /* Process — шаги */
  gsap.from('.process-step', {
    opacity: 0, y: 30,
    duration: 0.7, ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: { trigger: '#process', start: 'top 70%', once: true }
  });

  /* Reviews — карточки (только десктоп, Swiper сам анимирует на мобиле) */
  if (!isMobile) {
    gsap.from('.reviews-grid .review-card', {
      opacity: 0, y: 20,
      duration: 0.6, ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '#reviews', start: 'top 70%', once: true }
    });
  }

  /* Contact — заголовок */
  gsap.from('.contact-title', {
    opacity: 0, y: 30,
    duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '#contact', start: 'top 70%', once: true }
  });

  /* Параллакс — только десктоп */
  if (!isMobile) {
    _initParallax();
  }
}

function _initParallax() {
  /* About — фото параллакс */
  const aboutPhoto = document.querySelector('.about-photo-placeholder');
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
      y: 60, ease: 'none',
      scrollTrigger: {
        trigger: '#featured', start: 'top bottom', end: 'bottom top', scrub: 1.5
      }
    });
  }

  /* Notes — число 55 медленно двигается */
  const notesBg = document.querySelector('.notes-bg-number');
  if (notesBg) {
    gsap.to(notesBg, {
      y: -40, ease: 'none',
      scrollTrigger: {
        trigger: '#notes', start: 'top bottom', end: 'bottom top', scrub: 2
      }
    });
  }
}
