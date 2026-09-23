import { chromium } from 'playwright-core';
import fs from 'node:fs';
const BASE = 'http://localhost:4777';
const OUT = 'inter';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const log = (...a) => console.log(...a);
const pick = async (p, v) => { const id = await p.getAttribute(`input[data-option-input][value="${v}"]`, 'id'); await p.click(`label[for="${id}"]`); };
const check = (name, ok, extra = '') => log(ok ? 'PASS' : 'FAIL', name, extra);

async function ctx(width, { seenOpening = true, consent = true } = {}) {
  const c = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 } });
  await c.addInitScript(([o, k]) => {
    try {
      if (o) sessionStorage.setItem('lelon-opening', '1');
      if (k) localStorage.setItem('lelon-consent', '{"analytics":false,"marketing":false,"preferences":false}');
    } catch {}
  }, [seenOpening, consent]);
  const p = await c.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  return { c, p, errors };
}

/* 1. PDP — all variants unavailable (real store state) */
{
  const { c, p, errors } = await ctx(390);
  await p.goto(BASE + '/products/luna', { waitUntil: 'networkidle' });
  const label = (await p.textContent('.pdp__buy [data-buy-label]')).trim();
  const disabled = await p.isDisabled('.pdp__buy [data-buy-button]');
  check('PDP unavailable → "Bientôt disponible" + disabled', label === 'Bientôt disponible' && disabled, `label="${label}" disabled=${disabled}`);
  const avail = (await p.textContent('[data-availability-text]')).trim();
  check('availability line reflects state', /Bientôt disponible/.test(avail), avail);
  const noPrelaunchSentence = !(await p.content()).includes('Collection en préparation. Bientôt disponible.');
  check('fixed description sentence removed', noPrelaunchSentence);
  const detailsHas = await p.locator('.specs--rte dt', { hasText: 'Dimensions' }).count();
  check('details accordion shows real description specs', detailsHas > 0);
  const dims = await p.locator('.dimensions').count();
  check('dimensions component hidden without metafields', dims === 0);
  await p.screenshot({ path: `${OUT}/pdp-luna-390.png`, fullPage: true });
  check('no JS errors', errors.length === 0, errors.join(' | '));
  await c.close();
}

/* 2. PDP — simulated availability: variant switch, CTA, gallery filter, add to cart, drawer */
{
  const { c, p, errors } = await ctx(390);
  await p.goto(BASE + '/products/vera?avail=1', { waitUntil: 'networkidle' });
  const first = (await p.textContent('.pdp__buy [data-buy-label]')).trim();
  check('available variant → "Ajouter au panier"', first === 'Ajouter au panier', first);
  // VERA: Caramel/M(0) Noir/M(1) Noir/L(2 → unavailable in simulation) Caramel/L(3) Rouge/M(4) Rouge/L(5 unavailable)
  await pick(p, 'Noir');
  await pick(p, 'L');
  const l2 = (await p.textContent('.pdp__buy [data-buy-label]')).trim();
  const d2 = await p.isDisabled('.pdp__buy [data-buy-button]');
  check('unavailable combination → disabled + not "Ajouter au panier"', l2 !== 'Ajouter au panier' && d2, `label="${l2}"`);
  const url = p.url();
  check('URL updated with ?variant=', /variant=\d+/.test(url), url);
  await pick(p, 'Caramel');
  const visibleSlides = await p.$$eval('[data-slide]', (s) => s.filter((x) => !x.hidden).map((x) => x.dataset.mediaColor));
  check('gallery shows only selected colour', visibleSlides.length > 0 && visibleSlides.every((c) => c === 'caramel' || c === ''), `${visibleSlides.length} slides`);
  await pick(p, 'M');
  const l3 = (await p.textContent('.pdp__buy [data-buy-label]')).trim();
  check('back to available → "Ajouter au panier"', l3 === 'Ajouter au panier', l3);
  await p.click('.pdp__buy [data-buy-button]');
  await p.waitForSelector('#CartDrawer[open]', { timeout: 4000 }).catch(() => {});
  const open = await p.$('#CartDrawer[open]');
  check('add to cart opens drawer', !!open);
  const lines = await p.$$eval('#CartDrawer .cart-line', (l) => l.length);
  check('drawer lists lines', lines > 0, `${lines} lines`);
  const ctas = await p.$$eval('#CartDrawer .cart-drawer__actions > *', (b) => b.map((x) => x.textContent.trim()));
  check('drawer CTAs: Commander + Voir le panier', ctas.join('|').includes('Commander') && ctas.join('|').includes('Voir le panier'), ctas.join(' | '));
  await p.waitForTimeout(700); await p.screenshot({ path: `${OUT}/drawer-390.png` });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  const closed = !(await p.$('#CartDrawer[open]'));
  check('Escape closes drawer', closed);
  const focused = await p.evaluate(() => document.activeElement?.matches('[data-buy-button]'));
  check('focus returns to trigger', focused);
  // sticky bar
  await p.evaluate(() => window.scrollTo(0, 2200));
  await p.waitForTimeout(700);
  const sticky = await p.$eval('[data-sticky-buy]', (b) => b.classList.contains('is-visible'));
  check('mobile sticky buy bar appears after scrolling past CTA', sticky);
  await p.screenshot({ path: `${OUT}/sticky-390.png` });
  check('no JS errors', errors.length === 0, errors.join(' | '));
  await c.close();
}

/* 3. Menu drawer + search (keyboard) */
{
  const { c, p, errors } = await ctx(390);
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.click('.header__menu-btn');
  await p.waitForTimeout(500);
  check('menu drawer opens', !!(await p.$('#MenuDrawer[open]')));
  const expanded = await p.getAttribute('.header__menu-btn', 'aria-expanded');
  check('menu button aria-expanded=true', expanded === 'true');
  await p.screenshot({ path: `${OUT}/menu-390.png` });
  const targets = await p.$$eval('#MenuDrawer a, #MenuDrawer button', (els) => els.map((e) => e.getBoundingClientRect()).filter((r) => r.height < 44 && r.width > 0).length);
  check('menu touch targets ≥ 44px tall', targets === 0, `${targets} small`);
  await p.keyboard.press('Escape');
  await p.click('.header__end [data-open="SearchDialog"]');
  await p.waitForTimeout(300);
  await p.keyboard.type('lu');
  await p.waitForSelector('.predictive__item', { timeout: 4000 }).catch(() => {});
  const items = await p.$$eval('.predictive__item', (i) => i.length);
  check('predictive search returns products', items > 0, `${items}`);
  await p.keyboard.press('ArrowDown');
  const sel = await p.getAttribute('#PredictiveSearchInput', 'aria-activedescendant');
  check('arrow key selects option (aria-activedescendant)', !!sel, sel);
  await p.screenshot({ path: `${OUT}/search-390.png` });
  await p.fill('#PredictiveSearchInput', 'zzzz');
  await p.waitForTimeout(700);
  const empty = await p.textContent('#PredictiveSearchResults');
  check('no-result state', /Aucun résultat/.test(empty), empty.trim().slice(0, 60));
  check('no JS errors', errors.length === 0, errors.join(' | '));
  await c.close();
}

/* 4. Consent banner (first visit) */
{
  const { c, p, errors } = await ctx(390, { consent: false });
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  const visible = await p.isVisible('[data-consent]');
  check('consent banner shown on first visit', visible);
  const buttons = await p.$$eval('[data-consent] .consent__actions .btn:not([hidden])', (b) => b.map((x) => [x.textContent.trim(), getComputedStyle(x).backgroundColor, x.getBoundingClientRect().height]));
  const sameStyle = new Set(buttons.map((b) => b[1])).size === 1;
  check('Accept / Refuse / Customize have equal visual weight', buttons.length === 3 && sameStyle, JSON.stringify(buttons));
  await p.screenshot({ path: `${OUT}/consent-390.png` });
  await p.click('[data-consent-action="customize"]');
  const boxes = await p.$$eval('[data-consent-category]', (b) => b.map((x) => x.checked));
  check('no category pre-checked', boxes.every((x) => !x), JSON.stringify(boxes));
  await p.click('[data-consent-action="reject"]').catch(() => {});
  await c.close();
}

/* 5. Opening */
{
  const { c, p } = await ctx(390, { seenOpening: false });
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1900);
  const shown = await p.isVisible('#Opening');
  await p.screenshot({ path: `${OUT}/opening-390.png` });
  await p.waitForTimeout(2600);
  const gone = !(await p.$('#Opening'));
  check('opening shows then removes itself within ~4.5 s', shown && gone, `shown=${shown} gone=${gone}`);
  await p.reload({ waitUntil: 'domcontentloaded' });
  check('opening not replayed in same session', !(await p.$('#Opening')));
  await c.close();
  const r = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const rp = await r.newPage();
  await rp.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  check('opening skipped with prefers-reduced-motion', !(await rp.$('#Opening')));
  await r.close();
}
/* 6. Gallery robustness (run the harness with MEDIA_JSON + WITH_WORN for the real Shopify media list) */
{
  const { c, p, errors } = await ctx(1440);
  const visible = () => p.$$eval('[data-slide]', (s) => s.filter((x) => !x.hidden).map((x) => x.dataset.mediaColor));
  const note = () => p.$eval('[data-gallery-note]', (n) => (n.hidden ? '' : n.textContent.trim())).catch(() => '');

  await p.goto(BASE + '/products/elea', { waitUntil: 'networkidle' });
  await pick(p, 'Noir');
  const elea = await visible();
  check('ÉLÉA Noir: worn Cognac photo not shown', elea.length > 0 && elea.every((x) => x === 'noir'), elea.join(','));

  await p.goto(BASE + '/products/aurea', { waitUntil: 'networkidle' });
  await pick(p, 'Beige Sable');
  const aurea = await visible();
  const aureaNote = await note();
  check('AURÉA Beige Sable (no photo): all photos + honest note', aurea.length > 1 && /Beige Sable/.test(aureaNote), `${aurea.join(',')} | ${aureaNote}`);
  await pick(p, 'Taupe / Greige');
  const aurea2 = await visible();
  check('AURÉA Taupe / Greige: only its photo, note hidden', aurea2.every((x) => x === 'taupe / greige') && !(await note()), aurea2.join(','));
  await p.screenshot({ path: `${OUT}/gallery-aurea-1440.png` });

  await p.goto(BASE + '/products/mira', { waitUntil: 'networkidle' });
  await pick(p, 'Noir');
  const firstAlt = await p.$eval('[data-slide]:not([hidden]) img', (i) => i.alt);
  const total = await p.textContent('[data-gallery-total]');
  check('MIRA Noir (worn first): first visible slide is a worn photo', /Porté/.test(firstAlt), `${firstAlt} · total ${total}`);
  const counterOk = Number(total) === (await visible()).length;
  check('counter matches visible slides', counterOk, total);

  for (let i = 0; i < 12; i++) await pick(p, ['Ivoire', 'Taupe', 'Noir'][i % 3]);
  const rapid = await visible();
  check('rapid colour switching ends consistent', rapid.every((x) => x === 'ivoire' || x === 'taupe' || x === 'noir') && new Set(rapid.filter(Boolean)).size === 1, rapid.join(','));

  await p.goto(BASE + '/products/vera', { waitUntil: 'networkidle' });
  const veraVariants = await p.$eval('script[data-product-json]', (s) => JSON.parse(s.textContent).variants);
  const noirL = veraVariants.find((v) => v.options.join('/') === 'Noir/L');
  await p.goto(BASE + '/products/vera?variant=' + noirL.id, { waitUntil: 'networkidle' });
  const checked = await p.$$eval('input[data-option-input]:checked', (i) => i.map((x) => x.value));
  const vera = await visible();
  check('deep link ?variant= (VERA Noir / L) restores options and gallery', checked.join('/') === 'Noir/L' && vera.every((x) => x === 'noir'), `${checked.join('/')} · ${vera.join(',')}`);

  await p.focus('[data-gallery-track]');
  const before = await p.textContent('[data-gallery-index]');
  await p.goto(BASE + '/products/nova', { waitUntil: 'networkidle' });
  await p.focus('[data-gallery-track]');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(600);
  const after = await p.textContent('[data-gallery-index]');
  check('keyboard ArrowRight moves the gallery', after === '2', `${before} → ${after}`);
  check('no JS errors', errors.length === 0, errors.join(' | '));
  await c.close();

  const nojs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const np = await nojs.newPage();
  await np.goto(BASE + '/products/elea', { waitUntil: 'load' });
  const shown = await np.$$eval('[data-slide]', (s) => s.filter((x) => !x.hidden).map((x) => x.dataset.mediaColor));
  check('no JS: gallery already filtered server-side', shown.length > 0 && shown.every((x) => x === 'cognac' || x === ''), shown.join(','));
  const form = await np.$eval('form[action="/cart/add"]', (f) => Boolean(f.elements.namedItem('id')?.value)).catch(() => false);
  check('no JS: product form still posts a variant id', form);
  await nojs.close();
}

/* 7. Cart races and failures */
{
  const { c, p, errors } = await ctx(390);
  const calls = { add: 0, change: 0 };
  p.on('request', (r) => {
    if (r.url().includes('/cart/add.js')) calls.add++;
    if (r.url().includes('/cart/change.js')) calls.change++;
  });
  await p.goto(BASE + '/products/vera?avail=1', { waitUntil: 'networkidle' });
  await p.dblclick('.pdp__buy [data-buy-button]');
  await p.waitForSelector('#CartDrawer[open]', { timeout: 4000 }).catch(() => {});
  check('double click on "Ajouter au panier" sends one request', calls.add === 1, `${calls.add} requests`);

  const plus = '#CartDrawer [data-line-change]';
  if (await p.$(plus)) {
    await p.click(plus, { clickCount: 1 });
    await p.click(plus, { clickCount: 1 }).catch(() => {});
    await p.click(plus, { clickCount: 1 }).catch(() => {});
    await p.waitForTimeout(800);
    const badge = await p.$eval('[data-cart-count]', (b) => b.textContent.trim()).catch(() => '');
    check('rapid quantity clicks: no error, count consistent', errors.length === 0 && /^\d+$/.test(badge), `${calls.change} change requests · badge ${badge}`);
  }
  await p.keyboard.press('Escape');

  await p.route('**/cart/add.js', (route) => route.abort('internetdisconnected'));
  await p.click('.pdp__buy [data-buy-button]');
  await p.waitForTimeout(500);
  const offline = await p.$eval('.pdp__buy [data-form-error]', (e) => (e.hidden ? '' : e.textContent.trim())).catch(() => '');
  const busy = await p.$eval('.pdp__buy [data-buy-button]', (b) => b.getAttribute('aria-busy'));
  check('network failure: message shown, button usable again', !!offline && busy === null, offline);
  await p.unroute('**/cart/add.js');

  await p.route('**/cart/add.js', (route) => route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, description: 'Stock insuffisant pour cette variante.' }) }));
  await p.click('.pdp__buy [data-buy-button]');
  await p.waitForTimeout(500);
  const refused = await p.$eval('.pdp__buy [data-form-error]', (e) => (e.hidden ? '' : e.textContent.trim())).catch(() => '');
  check('422 from Shopify: its message is shown', /Stock insuffisant/.test(refused), refused);
  check('no JS errors', errors.length === 0, errors.join(' | '));
  await c.close();
}

await browser.close();
