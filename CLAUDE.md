# CLAUDE.md — SHUKRAN UAE

## Правила работы
- Перед каждым изменением показывай diff. НИКОГДА не авто-коммить.
- git commit перед началом каждой задачи.
- Дизайн-токены только из variables.css. Без Bootstrap, без Inter/Arial.
- Mobile-first: сначала 375px, потом планшет, потом десктоп.
- Комментарии в коде на русском.

## Стек
- Чистый HTML5 / CSS / Vanilla JS (ES modules)
- GSAP 3.12.5 + ScrollTrigger + CustomEase (CDN)
- Lenis 1.0.42 (CDN, только десктоп)
- SplitType 0.3.4 (CDN)
- Swiper 11 (CDN, только мобиль-каталог)
- View Transitions API (нативный, без библиотек)

## Архитектура
- src/css/variables.css — единственный источник токенов
- src/css/sections/ — стили по секциям
- src/js/*.js — один модуль = одна функция
- src/js/main.js — оркестратор, инициализирует всё
- src/js/i18n.js — EN/RU переключение через data-en/data-ru атрибуты

## Адаптив
- Cursor и магнитные кнопки: отключены на touch-устройствах
- Lenis: отключён на мобиле (нативный скролл iOS)
- Параллакс: отключён на мобиле
- Каталог: pin-scroll (≥1024px), Swiper (≤767px), 2 колонки (768–1023px)

## Bug fixes
(добавлять по ходу)

## Notes
(добавлять по ходу)
