// @ts-check
const { test, expect } = require('@playwright/test');

/* Ждём загрузки preloader */
async function waitForSite(page) {
  await page.waitForFunction(() => {
    const pre = document.getElementById('preloader');
    return !pre || pre.style.display === 'none' || pre.style.opacity === '0' || getComputedStyle(pre).opacity === '0';
  }, { timeout: 10_000 });
  await page.waitForTimeout(400);
}

// ─── ЗАГРУЗКА ────────────────────────────────────────────────────────────────

test('страница грузится без JS-ошибок', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await waitForSite(page);
  expect(errors).toHaveLength(0);
});

test('title содержит "Personally Perfumer"', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Personally Perfumer/);
});

test('nav видим после загрузки', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);
  await expect(page.locator('#nav')).toBeVisible();
});

// ─── ABOUT HEADING (фикс SplitType) ─────────────────────────────────────────

test('about-heading при первой загрузке содержит целые строки', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const heading = page.locator('.about-heading');
  await expect(heading).toBeVisible();

  const text = await heading.textContent();
  // "архитектор парфюма" должны быть на одной строке, не разбиты
  expect(text).toMatch(/архитектор парфюма/);
  expect(text).toMatch(/и трансформаций/);
});

// ─── ЯЗЫК ────────────────────────────────────────────────────────────────────

/* Переключает язык через JS (работает и на мобиле без открытия гамбургера) */
async function switchLang(page) {
  await page.evaluate(() => {
    const btn = document.querySelector('.lang-toggle');
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
}

test('кнопка переключения языка RU→EN работает', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);

  await switchLang(page);

  await expect(page.locator('[data-i18n="nav_about"]').first()).toHaveText('About');
  await expect(page.locator('[data-i18n="nav_catalog"]').first()).toHaveText('Collection');
});

test('переключение EN→RU возвращает русский текст', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);

  await switchLang(page); // → EN
  await switchLang(page); // → RU

  await expect(page.locator('[data-i18n="nav_about"]').first()).toHaveText('О парфюмере');
});

test('about-heading корректен после RU→EN→RU', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);

  await switchLang(page); // → EN
  await switchLang(page); // → RU

  const text = await page.locator('.about-heading').textContent();
  expect(text).toMatch(/архитектор парфюма/);
});

// ─── НАВИГАЦИЯ ───────────────────────────────────────────────────────────────

test('клик по nav-ссылке "О парфюмере" скроллит страницу', async ({ page, isMobile }) => {
  await page.goto('/');
  await waitForSite(page);

  if (isMobile) {
    // На мобиле ссылки скрыты — открываем гамбургер
    await page.locator('.nav-burger').click();
    await page.waitForTimeout(300);
    await page.locator('.nav-overlay-link[href="#about"]').click();
  } else {
    await page.locator('a[href="#about"]').first().click();
  }
  await page.waitForTimeout(1000);

  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(50);
});

// ─── HERO СЛАЙДЕР ────────────────────────────────────────────────────────────

test('hero содержит 4 слайда', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-slide')).toHaveCount(4);
});

test('кнопка next hero-слайдера кликабельна', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);

  await page.locator('.hero-next').click();
  await page.waitForTimeout(1500);

  // Активная точка должна переключиться на индекс 1
  const dots = page.locator('.hero-dot');
  await expect(dots.nth(1)).toHaveClass(/is-active/);
});

// ─── ФОРМА ───────────────────────────────────────────────────────────────────

test('форма видима', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact-form')).toBeVisible();
});

test('отправка пустой формы — показывает ошибку', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);
  await page.locator('#contact').scrollIntoViewIfNeeded();

  await page.locator('.form-submit').click();
  await page.waitForTimeout(400);

  await expect(page.locator('#form-status')).toBeVisible({ timeout: 3000 });
});

test('некорректный телефон — ошибка валидации', async ({ page }) => {
  await page.goto('/');
  await waitForSite(page);
  await page.locator('#contact').scrollIntoViewIfNeeded();

  await page.fill('#f-name', 'Тест');
  await page.fill('#f-phone', 'abc!!!xyz');
  await page.locator('.form-submit').click();
  await page.waitForTimeout(400);

  const status = page.locator('#form-status');
  await expect(status).toBeVisible({ timeout: 3000 });
  expect(await status.textContent()).toMatch(/корректный|телефон|Telegram/i);
});

// ─── МОБИЛЬНОЕ МЕНЮ ──────────────────────────────────────────────────────────

test('[mobile] гамбургер открывает оверлей', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'только мобиль');

  await page.goto('/');
  await waitForSite(page);

  await page.locator('.nav-burger').click();
  await page.waitForTimeout(300);

  await expect(page.locator('#nav-overlay')).toHaveClass(/is-open/);
});

test('[mobile] клик по ссылке в оверлее закрывает меню', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'только мобиль');

  await page.goto('/');
  await waitForSite(page);

  await page.locator('.nav-burger').click();
  await page.waitForTimeout(300);
  await page.locator('.nav-overlay-link').first().click();
  await page.waitForTimeout(400);

  await expect(page.locator('#nav-overlay')).not.toHaveClass(/is-open/);
});

// ─── SECURITY HEADERS ────────────────────────────────────────────────────────

test('security headers присутствуют', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response.headers();

  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['strict-transport-security']).toBeTruthy();
  expect(headers['content-security-policy']).toBeTruthy();
});

// ─── ИЗОБРАЖЕНИЯ ─────────────────────────────────────────────────────────────

test('hero-изображение загружается', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-slide-img').first()).toBeVisible({ timeout: 8000 });
});

test('фото Мухаммада загружается (naturalWidth > 0)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#about').scrollIntoViewIfNeeded();
  const img = page.locator('.about-photo-img');
  await expect(img).toBeVisible({ timeout: 8000 });

  const naturalWidth = await img.evaluate(el => el.naturalWidth);
  expect(naturalWidth).toBeGreaterThan(0);
});
