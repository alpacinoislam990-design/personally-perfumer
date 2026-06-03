/* ===== SMART NAV — всегда видим, компактнее при скролле ===== */
export function initNavSmart() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  }, { passive: true });
}
