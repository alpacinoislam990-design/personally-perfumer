/* ===== i18n — двуязычность EN/RU ===== */

const STRINGS = {
  en: {
    lang_subtitle:     'Choose your experience',
    lang_btn_en:       'EN',
    lang_btn_ru:       'RU',
    nav_heritage:      'Heritage',
    nav_catalog:       'Catalog',
    nav_contact:       'Contact',
    hero_arabic:       'شكراً — The Scent of Gratitude',
    hero_tagline:      'Ascent of Gratitude — You Wear',
    manifesto_heading: 'Ascent of Gratitude',
    manifesto_sub:     'You Wear',
    manifesto_quote:   'Born in the UAE. Worn by those who know.',
    notes_heading:     'The Scent Pyramid',
    notes_top_label:   'Top Notes',
    notes_top:         'Bergamot · Saffron',
    notes_heart_label: 'Heart Notes',
    notes_heart:       'Oud · Rose',
    notes_base_label:  'Base Notes',
    notes_base:        'Amber · Sandalwood · Musk',
    featured_brand:    'Shukran UAE',
    featured_name:     'N° 55',
    featured_notes:    'Oud · Amber · Sandalwood · Musk',
    tag_limited:       'Limited Edition',
    tag_handcrafted:   'Handcrafted in UAE',
    tag_units:         '55 units / batch',
    cta_wa:            'Order via WhatsApp',
    cta_tg:            'or contact us on Telegram',
    catalog_title:     'Our Collection',
    catalog_hint:      'Scroll to explore →',
    card_action:       'Inquire',
    heritage_label:    'Our Story',
    heritage_title:    'A Token of Gratitude',
    heritage_body:     'SHUKRAN — شكراً — means "thank you" in Arabic. Born in the UAE, our fragrances carry the weight of appreciation, the warmth of desert gold, and the spirit of a land that inspires gratitude.',
    heritage_sig:      'Dubai, UAE · Est. 2024',
    contact_label:     'Get in touch',
    contact_title:     'Reach Us',
    contact_wa:        'Order via WhatsApp',
    contact_or:        'or leave a message',
    form_name:         'Name',
    form_name_ph:      'Your name',
    form_phone:        'WhatsApp / Phone',
    form_phone_ph:     '+971 ...',
    form_message:      'Message (optional)',
    form_message_ph:   'I am interested in...',
    form_submit:       'Send Inquiry',
    form_ok:           'Message sent. We will contact you shortly.',
    form_err:          'Something went wrong. Please try WhatsApp.',
    footer_copy:       '© 2025 SHUKRAN UAE — شكراً — Ascent of Gratitude You Wear',
  },
  ru: {
    lang_subtitle:     'Выберите язык',
    lang_btn_en:       'EN',
    lang_btn_ru:       'RU',
    nav_heritage:      'История',
    nav_catalog:       'Каталог',
    nav_contact:       'Контакт',
    hero_arabic:       'شكراً — Аромат Благодарности',
    hero_tagline:      'Восхождение Благодарности — Которую Вы Носите',
    manifesto_heading: 'Восхождение Благодарности',
    manifesto_sub:     'Которую Вы Носите',
    manifesto_quote:   'Рождён в ОАЭ. Носят те, кто понимает.',
    notes_heading:     'Пирамида Аромата',
    notes_top_label:   'Верхние ноты',
    notes_top:         'Бергамот · Шафран',
    notes_heart_label: 'Сердечные ноты',
    notes_heart:       'Уд · Роза',
    notes_base_label:  'Базовые ноты',
    notes_base:        'Амбра · Сандал · Мускус',
    featured_brand:    'Shukran UAE',
    featured_name:     'N° 55',
    featured_notes:    'Уд · Амбра · Сандал · Мускус',
    tag_limited:       'Ограниченный выпуск',
    tag_handcrafted:   'Создан в ОАЭ',
    tag_units:         '55 флаконов / партия',
    cta_wa:            'Заказать в WhatsApp',
    cta_tg:            'или напишите в Telegram',
    catalog_title:     'Коллекция',
    catalog_hint:      'Листайте для просмотра →',
    card_action:       'Узнать цену',
    heritage_label:    'Наша история',
    heritage_title:    'Знак Благодарности',
    heritage_body:     'SHUKRAN — شكراً — означает «спасибо» по-арабски. Рождённый в ОАЭ, наш аромат несёт в себе тепло пустынного золота и дух земли, вдохновляющей на благодарность.',
    heritage_sig:      'Дубай, ОАЭ · Осн. 2024',
    contact_label:     'Свяжитесь с нами',
    contact_title:     'Написать нам',
    contact_wa:        'Заказать в WhatsApp',
    contact_or:        'или оставьте сообщение',
    form_name:         'Имя',
    form_name_ph:      'Ваше имя',
    form_phone:        'WhatsApp / Телефон',
    form_phone_ph:     '+7 / +971 ...',
    form_message:      'Сообщение (необязательно)',
    form_message_ph:   'Меня интересует...',
    form_submit:       'Отправить',
    form_ok:           'Сообщение отправлено. Мы свяжемся с вами.',
    form_err:          'Ошибка отправки. Напишите нам в WhatsApp.',
    footer_copy:       '© 2025 SHUKRAN UAE — شكراً — Восхождение Благодарности',
  }
};

export function getLang() {
  return localStorage.getItem('shukran_lang') || 'en';
}

export function setLang(lang) {
  localStorage.setItem('shukran_lang', lang);
}

/* Применяет язык: заполняет data-i18n элементы и html lang */
export function applyLang(lang) {
  const strings = STRINGS[lang] || STRINGS['en'];
  document.documentElement.lang = lang;

  /* data-i18n="key" — задаёт textContent */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] !== undefined) el.textContent = strings[key];
  });

  /* data-i18n-ph="key" — задаёт placeholder */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (strings[key] !== undefined) el.placeholder = strings[key];
  });

  /* Обновляем индикатор активного языка в nav */
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    const cur = btn.querySelector('.lang-current');
    if (cur) cur.textContent = lang.toUpperCase();
  });
}

export { STRINGS };
