/* ===== MAIN — оркестратор ===== */
import { getLang, applyLang }    from './i18n.js';
import { runPreloader }           from './preloader.js';
import { initHeroFlip }           from './hero-flip.js';
import { initScrollReveals }      from './scroll-reveals.js';
import { initCatalog }            from './catalog-scroll.js';
import { initContact }            from './contact.js';
import { initNavSmart }           from './nav-smart.js';
import { initReviewsSlider }      from './reviews-slider.js';

const isMobile  = window.matchMedia('(pointer: coarse)').matches;
const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Переключатель языка в nav и footer --- */
document.querySelectorAll('.lang-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = getLang() === 'ru' ? 'en' : 'ru';
    const apply = ({ setLang, applyLang }) => {
      setLang(next);
      applyLang(next);
      window._heroRefreshText?.();
    };
    if (document.startViewTransition) {
      document.startViewTransition(() => import('./i18n.js').then(apply));
    } else {
      import('./i18n.js').then(apply);
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
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}


/* --- Старт сайта после preloader --- */
function startSite() {
  const site = document.getElementById('site');
  site.style.visibility = 'visible';

  gsap.to(site, { opacity: 1, duration: 0.4, ease: 'power2.out' });

  /* Lenis smooth scroll — только десктоп */
  let lenis = null;
  if (!isMobile && !isReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.6,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: node => !!(node.closest?.('.iti__country-list')),
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* Плавный скролл по якорным ссылкам */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  initNavSmart();
  initHeroFlip();
  initScrollReveals();
  initCatalog();
  initReviewsSlider();
  /* initCursor() — отключено, используем стандартный курсор */
  initContact();

  /* Nav появляется */
  gsap.from('#nav', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });

  /* Hero текст — появляется после прелоадера */
  gsap.from('.hero-text-left', {
    opacity: 0, y: 20,
    duration: 0.8, ease: 'power2.out',
    delay: 0.4
  });

  /* Кнопка записаться появляется */
  gsap.from('#btn-zapisat', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 1 });
}

/* --- Точка входа --- */
document.addEventListener('DOMContentLoaded', () => {
  /* Применить сохранённый язык (по умолчанию — RU) */
  applyLang(getLang());

  /* Preloader → сайт */
  if (isReduced) {
    document.getElementById('preloader').style.display = 'none';
    startSite();
  } else {
    runPreloader(startSite);
  }
});
