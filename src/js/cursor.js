/* ===== КАСТОМНЫЙ КУРСОР (только pointer:fine — десктоп) ===== */

export function initCursor() {
  /* Не инициализировать на touch-устройствах */
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  document.body.classList.add('custom-cursor-active');

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* Плавное следование за курсором */
  function loop() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.transform = `translate(${curX - cursor.offsetWidth / 2}px, ${curY - cursor.offsetHeight / 2}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  /* Hover на интерактивных элементах */
  const hoverTargets = 'a, button, .catalog-card, .hero-dot, .lang-btn';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
    }
  });

  /* Скрыть при выходе из окна */
  document.addEventListener('mouseleave', () => cursor.classList.add('cursor--hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('cursor--hidden'));
}
