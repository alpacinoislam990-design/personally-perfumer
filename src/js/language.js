/* ===== LANGUAGE SELECT SCREEN ===== */
import { getLang, setLang, applyLang } from './i18n.js';

export function initLanguageSelect(onComplete) {
  const el = document.getElementById('language-select');
  if (!el) { onComplete(); return; }

  /* Если язык уже выбран — сразу скрыть экран */
  if (getLang() && localStorage.getItem('shukran_lang')) {
    el.style.display = 'none';
    applyLang(getLang());
    onComplete();
    return;
  }

  /* Показываем экран */
  el.style.display = 'flex';

  /* Кнопки */
  el.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      applyLang(lang);
      _hideAndContinue(el, onComplete);
    });
  });
}

function _hideAndContinue(el, onComplete) {
  /* View Transitions API если поддерживается */
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }).finished.then(() => {
      el.style.display = 'none';
      onComplete();
    });
  } else {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    setTimeout(() => {
      el.style.display = 'none';
      onComplete();
    }, 420);
  }
}
