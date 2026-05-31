/* ===== SMART NAV — duchessrex behaviour ===== */
export function initNavSmart() {
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero');
  if (!nav) return;

  let lastY    = 0;
  let isHidden = false;
  const heroH  = () => hero?.offsetHeight ?? window.innerHeight;

  const show = () => {
    gsap.to(nav, { y: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
    isHidden = false;
  };

  const hide = () => {
    gsap.to(nav, { y: '-100%', duration: 0.28, ease: 'power2.in', overwrite: true });
    isHidden = true;
  };

  window.addEventListener('scroll', () => {
    const y      = window.scrollY;
    const inHero = y < heroH();

    nav.classList.toggle('is-scrolled', y > 60);

    if (inHero) {
      /* Внутри hero — nav всегда виден, фон прозрачный */
      nav.classList.remove('is-past-hero');
      if (isHidden) show();
    } else {
      /* За пределами hero */
      nav.classList.add('is-past-hero');
      if (y > lastY + 8)      hide(); /* скролл вниз */
      else if (y < lastY - 5) show(); /* скролл вверх */
    }

    lastY = y;
  }, { passive: true });

  /* Мышь в верхней зоне — показываем скрытый nav */
  document.addEventListener('mousemove', e => {
    if (e.clientY < 80 && isHidden) show();
  });

  /* Hover на самом nav — показываем */
  nav.addEventListener('mouseenter', () => {
    if (isHidden) show();
  });
}
