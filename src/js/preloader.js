/* ===== PRELOADER — GSAP Timeline ===== */

export function runPreloader(onComplete) {
  const el       = document.getElementById('preloader');
  const monogram = el.querySelector('.preloader-arabic'); /* P·P */
  const name     = el.querySelector('.preloader-uae');    /* Personally Perfumer */
  const lineWrap = el.querySelector('.preloader-line-wrap');
  const lineFill = el.querySelector('.preloader-line-fill');
  const topHalf  = document.getElementById('preloader-top');
  const botHalf  = document.getElementById('preloader-bottom');

  const isMobile = window.matchMedia('(pointer: coarse)').matches;

  gsap.registerPlugin(CustomEase);
  CustomEase.create('splitExit', 'M0,0 C0.22,0 0.1,1 1,1');

  const tl = gsap.timeline({ onComplete });

  /* 1. Монограмма P·P */
  tl.to(monogram, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1);

  /* 2. Название */
  tl.to(name, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.7);

  /* 3. Линия появляется */
  tl.to(lineWrap, { opacity: 1, duration: 0.2 }, 1.2);

  /* 4. Линия заполняется */
  tl.to(lineFill, { width: '100%', duration: 1.0, ease: 'none' }, 1.3);

  /* 5. Fade out контента */
  tl.to(el.querySelector('.preloader-content'), { opacity: 0, duration: 0.3 }, 2.6);

  /* 6. Split exit — десктоп: верх/низ уезжают */
  if (!isMobile) {
    tl.to(topHalf, { y: '-100%', duration: 0.8, ease: 'splitExit' }, 2.8);
    tl.to(botHalf, { y: '100%',  duration: 0.8, ease: 'splitExit' }, 2.8);
  } else {
    /* Мобиль: slide up */
    tl.to(el, { y: '-100%', opacity: 0, duration: 0.6, ease: 'power3.in' }, 2.8);
  }

  /* 7. Скрыть */
  tl.call(() => { el.style.display = 'none'; }, null, 3.7);
}
