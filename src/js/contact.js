/* ===== КОНТАКТНАЯ ФОРМА ===== */

const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

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
    return true;
  }
}

let itiInstance = null;

export function initContact() {
  const form       = document.getElementById('contact-form');
  const status     = document.getElementById('form-status');
  const messengers = document.getElementById('form-messengers');
  if (!form) return;

  const phoneInput = document.getElementById('f-phone');

  /* Инициализируем intl-tel-input после загрузки библиотеки */
  function _initITI() {
    if (!window.intlTelInput || !phoneInput || itiInstance) return;
    itiInstance = window.intlTelInput(phoneInput, {
      initialCountry: 'auto',
      geoIpLookup: cb => fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(d => cb(d.country_code))
        .catch(() => cb('ae')),
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.1/build/js/utils.js',
      separateDialCode: true,
    });
  }

  /* intl-tel-input грузится defer — ждём */
  if (window.intlTelInput) {
    _initITI();
  } else {
    window.addEventListener('load', _initITI, { once: true });
  }

  /* Блокируем scroll страницы когда курсор/палец внутри дропдауна стран */
  document.addEventListener('wheel', e => {
    if (e.target.closest('.iti__country-list')) e.stopPropagation();
  }, { capture: true, passive: true });

  document.addEventListener('touchmove', e => {
    if (e.target.closest('.iti__country-list')) e.stopPropagation();
  }, { capture: true, passive: false });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = sanitize(form.querySelector('#f-name').value.trim());
    const phone = sanitize(itiInstance
      ? itiInstance.getNumber()
      : phoneInput.value.trim());

    if (name.length > 100 || phone.length > 60) {
      _showStatus(status, 'Слишком длинный ввод.', true);
      return;
    }

    if (!name || !phone) {
      _showStatus(status, form.dataset.errRequired || 'Заполните имя и телефон.', true);
      return;
    }

    if (itiInstance && !itiInstance.isValidNumber()) {
      _showStatus(status, 'Введите корректный номер телефона.', true);
      return;
    }

    if (!checkRateLimit()) {
      _showStatus(status, 'Слишком много заявок. Попробуйте через 10 минут.', true);
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, phone })
      });

      if (res.ok) {
        _showStatus(status, form.dataset.ok || 'Спасибо! Свяжусь в ближайшее время.', false);
        form.reset();
        if (itiInstance) itiInstance.setCountry('ae');
        if (messengers) messengers.hidden = false;
      } else {
        throw new Error('server');
      }
    } catch {
      _showStatus(status, form.dataset.err || 'Ошибка. Напишите в WhatsApp или Telegram.', true);
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      btn.setAttribute('aria-busy', 'false');
    }
  });
}

function _showStatus(el, msg, isError) {
  el.textContent = msg;
  el.classList.toggle('is-error', isError);
  el.classList.add('is-visible');
  setTimeout(() => el.classList.remove('is-visible'), 6000);
}

function sanitize(str) {
  return str.replace(/<[^>]*>/g, '').trim();
}
