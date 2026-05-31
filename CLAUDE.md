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
- src/js/i18n.js — EN/RU переключение через data-i18n атрибуты, ключ localStorage: `pp_lang`

## Секции (порядок в DOM)
1. #preloader — P·P монограмма + прогресс
2. #nav — фиксированная шапка + .nav-cta
3. #hero — cross-fade slideshow, 2 кнопки, TG+WA иконки
4. #about — фото Мухаммада (заглушка) + цитата + 3 цифры
5. #notes — пирамида аромата (оставлена)
6. #featured — N°55 (оставлена)
7. #catalog — Pheromones коллекция + Swiper мобиль
8. #services — 4 карточки услуг
9. #process — 3 шага процесса
10. #reviews — 6 отзывов, Swiper мобиль / сетка десктоп
11. #contact — форма с дропдауном
12. #footer

## Адаптив
- Cursor и магнитные кнопки: отключены на touch-устройствах
- Lenis: отключён на мобиле (нативный скролл iOS)
- Параллакс: отключён на мобиле
- Каталог: pin-scroll (≥1024px), Swiper (≤767px), 2 колонки (768–1023px)

## Bug fixes
(добавлять по ходу)

## Notes
(добавлять по ходу)
