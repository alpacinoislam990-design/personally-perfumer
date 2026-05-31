/* ===== КОНТАКТНАЯ ФОРМА ===== */

/* Замените на реальный Formspree endpoint после получения от клиента */
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

/* Rate limiting: не более 3 отправок за 10 минут */
const RATE = { max: 3, window: 10 * 60 * 1000 };

function checkRateLimit() {
  try {
    const key  = 'pp_form_rl';
    const now  = Date.now();
    const data = JSON.parse(localStorage.getItem(key) || '{}');

    if (!data.reset || now > data.reset) {
      localStorage.setItem(key, JSON.stringify({ count: 1, reset: now + RATE.window }));
      return true;
    }

    if (data.count >= RATE.max) return false;

    data.count++;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return true; /* localStorage недоступен (приватный режим) — пропускаем лимит */
  }
}

/* Принимает телефон (+971...) или Telegram (@username / username) */
function isValidContact(val) {
  if (/^[\+\d\s\-\(\)]{6,20}$/.test(val)) return true;
  if (/^@?[a-zA-Z][a-zA-Z0-9_]{3,31}$/.test(val)) return true;
  return false;
}

export function initContact() {
  const form        = document.getElementById('contact-form');
  const status      = document.getElementById('form-status');
  const messengers  = document.getElementById('form-messengers');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name     = sanitize(form.querySelector('#f-name').value.trim());
    const phone    = sanitize(form.querySelector('#f-phone').value.trim());
    const interest = form.querySelector('#f-interest')?.value || '';
    const msg      = sanitize(form.querySelector('#f-message').value.trim());

    /* Валидация длины */
    if (name.length > 100 || phone.length > 60 || msg.length > 1000) {
      _showStatus(status, 'Слишком длинный ввод.', true);
      return;
    }

    /* Обязательные поля */
    if (!name || !phone) {
      _showStatus(status, form.dataset.errRequired || 'Заполните обязательные поля.', true);
      return;
    }

    /* Формат контакта */
    if (!isValidContact(phone)) {
      _showStatus(status, 'Введите корректный телефон или Telegram.', true);
      return;
    }

    /* Rate limiting */
    if (!checkRateLimit()) {
      _showStatus(status, 'Слишком много заявок. Попробуйте через 10 минут.', true);
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = '...';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, phone, interest, message: msg })
      });

      if (res.ok) {
        _showStatus(status, form.dataset.ok || 'Спасибо! Свяжусь в ближайшее время.', false);
        form.reset();
        /* Показать иконки мессенджеров */
        if (messengers) messengers.hidden = false;
      } else {
        throw new Error('server');
      }
    } catch {
      _showStatus(status, form.dataset.err || 'Ошибка. Напишите в WhatsApp или Telegram.', true);
    } finally {
      btn.disabled = false;
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
