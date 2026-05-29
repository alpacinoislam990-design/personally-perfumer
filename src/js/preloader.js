/* ===== PRELOADER — GSAP Timeline ===== */

export function runPreloader(onComplete) {
  const el         = document.getElementById('preloader');
  const arabic     = el.querySelector('.preloader-arabic');
  const letters    = el.querySelectorAll('.preloader-letter');
  const uae        = el.querySelector('.preloader-uae');
  const lineWrap   = el.querySelector('.preloader-line-wrap');
  const lineFill   = el.querySelector('.preloader-line-fill');
  const topHalf    = document.getElementById('preloader-top');
  const botHalf    = document.getElementById('preloader-bottom');

  const isMobile = window.matchMedia('(pointer: coarse)').matches;

  /* CustomEase для split-exit */
  gsap.registerPlugin(CustomEase);
  CustomEase.create('splitExit', 'M0,0 C0.22,0 0.1,1 1,1');

  const tl = gsap.timeline({ onComplete });

  /* 1. Арабское шукран */
  tl.to(arabic, {
    opacity: 1, y: 0,
    duration: 0.5, ease: 'power2.out'
  }, 0.1);

  /* 2. Буквы SHUKRAN stagger */
  tl.to(letters, {
    opacity: 1, y: 0,
    duration: 0.5, ease: 'power2.out',
    stagger: 0.07
  }, 0.4);

  /* 3. UAE */
  tl.to(uae, {
    opacity: 1,
    duration: 0.3, ease: 'power2.out'
  }, 1.15);

  /* 4. Линия появляется */
  tl.to(lineWrap, {
    opacity: 1,
    duration: 0.2
  }, 1.45);

  /* 5. Линия заполняется */
  tl.to(lineFill, {
    width: '100%',
    duration: 1.2, ease: 'none'
  }, 1.5);

  /* 6. Fade out контента */
  tl.to(el.querySelector('.preloader-content'), {
    opacity: 0,
    duration: 0.3
  }, 3.0);

  /* 7. Split exit — десктоп: верх/низ уезжают */
  if (!isMobile) {
    tl.to(topHalf, {
      y: '-100%',
      duration: 0.8, ease: 'splitExit'
    }, 3.2);
    tl.to(botHalf, {
      y: '100%',
      duration: 0.8, ease: 'splitExit'
    }, 3.2);
  } else {
    /* Мобиль: просто fade up */
    tl.to(el, {
      y: '-100%',
      opacity: 0,
      duration: 0.6, ease: 'power3.in'
    }, 3.2);
  }

  /* 8. Скрыть preloader */
  tl.call(() => {
    el.style.display = 'none';
  }, null, 4.1);
}
