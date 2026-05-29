/* ===== КОНТАКТНАЯ ФОРМА ===== */

/* Замените на реальный Formspree endpoint после получения от клиента */
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

export function initContact() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = sanitize(form.querySelector('#f-name').value.trim());
    const phone = sanitize(form.querySelector('#f-phone').value.trim());
    const msg   = sanitize(form.querySelector('#f-message').value.trim());

    /* Простая валидация */
    if (!name || !phone) {
      _showStatus(status, form.dataset.errRequired || 'Please fill in required fields.', true);
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = '...';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, phone, message: msg })
      });

      if (res.ok) {
        _showStatus(status, form.dataset.ok || 'Sent! We will contact you shortly.', false);
        form.reset();
      } else {
        throw new Error('server');
      }
    } catch {
      _showStatus(status, form.dataset.err || 'Error. Please use WhatsApp.', true);
    } finally {
      btn.disabled = false;
      /* Восстанавливаем текст кнопки из data-i18n */
      const key = btn.dataset.i18n;
      if (key) {
        const { getLang, STRINGS } = await import('./i18n.js');
        btn.textContent = STRINGS[getLang()]?.[key] || btn.textContent;
      }
    }
  });
}

function _showStatus(el, msg, isError) {
  el.textContent = msg;
  el.classList.toggle('is-error', isError);
  el.classList.add('is-visible');
  setTimeout(() => el.classList.remove('is-visible'), 6000);
}

/* Экранирует HTML для защиты от XSS */
function sanitize(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}
