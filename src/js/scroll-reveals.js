/* ===== SCROLL REVEALS — SplitType + ScrollTrigger ===== */

export function initScrollReveals() {
  const isMobile = window.matchMedia('(pointer: coarse)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* Manifesto heading — split по словам */
  const manifestoH = document.querySelector('.manifesto-heading');
  if (manifestoH && typeof SplitType !== 'undefined') {
    const split = new SplitType(manifestoH, { types: 'words' });

    gsap.from(split.words, {
      opacity: 0,
      y: isMobile ? 20 : 40,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top 75%',
        once: true
      }
    });
  }

  /* Manifesto sub */
  const manifestoSub = document.querySelector('.manifesto-sub');
  if (manifestoSub) {
    gsap.from(manifestoSub, {
      opacity: 0, y: 20,
      duration: 0.6, ease: 'power2.out', delay: 0.5,
      scrollTrigger: { trigger: '#manifesto', start: 'top 70%', once: true }
    });
  }

  /* Manifesto line анимация */
  const manifestoLine = document.querySelector('.manifesto-line');
  if (manifestoLine) {
    gsap.to(manifestoLine, {
      scaleX: 1,
      duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#manifesto', start: 'top 65%', once: true }
    });
  }

  /* Manifesto цитата */
  const quote = document.querySelector('.manifesto-quote');
  if (quote) {
    gsap.to(quote, {
      opacity: 0.4, y: 0,
      duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '#manifesto', start: 'top 55%', once: true }
    });
  }

  /* Notes тиры — reveal при входе в экран */
  const tiers = document.querySelectorAll('.notes-tier');
  tiers.forEach((tier, i) => {
    gsap.to(tier, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power2.out',
      delay: i * 0.25,
      scrollTrigger: { trigger: '#notes', start: 'top 70%', once: true,
        onEnter: () => tier.classList.add('is-revealed')
      }
    });
  });

  /* Featured контент */
  const featuredContent = document.querySelector('.featured-content');
  if (featuredContent) {
    gsap.from(featuredContent.children, {
      opacity: 0, y: 30,
      duration: 0.7, ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '#featured', start: 'top 60%', once: true }
    });
  }

  /* Heritage текст */
  const heritageText = document.querySelector('.heritage-text');
  if (heritageText) {
    gsap.from(heritageText.children, {
      opacity: 0, x: -30,
      duration: 0.7, ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '#heritage', start: 'top 65%', once: true }
    });
  }

  /* Contact заголовок */
  const contactTitle = document.querySelector('.contact-title');
  if (contactTitle) {
    gsap.from(contactTitle, {
      opacity: 0, y: 30,
      duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '#contact', start: 'top 70%', once: true }
    });
  }

  /* Параллакс — только десктоп */
  if (!isMobile) {
    _initParallax();
  }
}

function _initParallax() {
  /* Featured — фото параллакс */
  const featImg = document.querySelector('.featured-img-wrap');
  if (featImg) {
    gsap.to(featImg, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#featured',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  /* Heritage — фото параллакс */
  const herImg = document.querySelector('.heritage-img-wrap');
  if (herImg) {
    gsap.to(herImg, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#heritage',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  /* Notes — число 55 медленно двигается */
  const notesBg = document.querySelector('.notes-bg-number');
  if (notesBg) {
    gsap.to(notesBg, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '#notes',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  }
}
