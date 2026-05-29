/* ===== MAIN — оркестратор всего ===== */
import { getLang, applyLang }    from './i18n.js';
import { initLanguageSelect }    from './language.js';
import { runPreloader }          from './preloader.js';
import { initHeroFlip }          from './hero-flip.js';
import { initScrollReveals }     from './scroll-reveals.js';
import { initCatalog }           from './catalog-scroll.js';
import { initCursor }            from './cursor.js';
import { initContact }           from './contact.js';

const isMobile  = window.matchMedia('(pointer: coarse)').matches;
const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Переключатель языка в nav --- */
document.querySelectorAll('.lang-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = getLang() === 'en' ? 'ru' : 'en';
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        import('./i18n.js').then(({ setLang, applyLang }) => {
          setLang(next);
          applyLang(next);
        });
      });
    } else {
      import('./i18n.js').then(({ setLang, applyLang }) => {
        setLang(next);
        applyLang(next);
      });
    }
  });
});

/* --- Гамбургер-меню --- */
const burger  = document.querySelector('.nav-burger');
const overlay = document.getElementById('nav-overlay');

if (burger && overlay) {
  burger.addEventListener('click', () => {
    const open = overlay.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Закрыть при клике по ссылке */
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('is-open');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Старт после preloader --- */
function startSite() {
  const site = document.getElementById('site');
  site.style.visibility = 'visible';

  /* Fade in site */
  gsap.to(site, { opacity: 1, duration: 0.4, ease: 'power2.out' });

  /* Lenis smooth scroll — только десктоп */
  if (!isMobile && !isReduced && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.6, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* Регистрируем плагины GSAP */
  gsap.registerPlugin(ScrollTrigger);

  /* Инициализация всех модулей */
  initHeroFlip();
  initScrollReveals();
  initCatalog();
  initCursor();
  initContact();

  /* Nav — анимация появления */
  gsap.from('#nav', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });

  /* Hero-контент появляется */
  gsap.to(['.hero-arabic', '.hero-tagline'], {
    opacity: 1,
    duration: 0.8, ease: 'power2.out',
    stagger: 0.15,
    delay: 0.3
  });

  /* Floating WA button появляется */
  gsap.from('#wa-float', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 1 });
}

/* --- Точка входа --- */
document.addEventListener('DOMContentLoaded', () => {
  /* 1. Применить сохранённый язык (если есть) */
  applyLang(getLang());

  /* 2. Показать Language Select или сразу Preloader */
  initLanguageSelect(() => {
    /* 3. Preloader */
    if (isReduced) {
      /* Пропустить preloader при prefers-reduced-motion */
      document.getElementById('preloader').style.display = 'none';
      startSite();
    } else {
      runPreloader(startSite);
    }
  });
});
