import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:4777';
const OUT = process.env.OUT || 'shots';
fs.mkdirSync(OUT, { recursive: true });
const axeSource = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

const pages = (process.env.PAGES || '/,/products/luna,/products/vera?avail=1,/products/aurea,/products/isaure,/collections/lelon,/collections/signature,/pages/faq,/pages/contact,/pages/notre-histoire,/pages/livraison-retours,/pages/mentions-legales,/pages/politique-de-cookies,/pages/landing,/cart?cart=1&avail=1,/search?q=a,/account,/page-introuvable').split(',');
const widths = (process.env.WIDTHS || '320,375,390,393,430,768,1024,1280,1440,1920').split(',').map(Number);
const fullPage = process.env.FULL !== '0';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined }).catch(() => chromium.launch());
const report = [];
for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    try { sessionStorage.setItem('lelon-opening', '1'); localStorage.setItem('lelon-consent', '{"analytics":false,"marketing":false,"preferences":false}'); } catch {}
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  for (const url of pages) {
    errors.length = 0;
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);
    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [];
      const scrollable = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (/(auto|scroll|hidden|clip)/.test(s.overflowX) && p !== document.body && p !== document.documentElement) return true;
        }
        return false;
      };
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > vw + 1 || r.left < -1) && !scrollable(el) && getComputedStyle(el).position !== 'fixed' && !el.closest('dialog:not([open])')) {
          offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} (${Math.round(r.left)}→${Math.round(r.right)})`);
        }
      });
      return { scrollWidth: document.documentElement.scrollWidth, vw, offenders: [...new Set(offenders)].slice(0, 8) };
    });
    await page.addScriptTag({ content: axeSource });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] }, resultTypes: ['violations'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, target: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
    });
    const name = `${String(width).padStart(4, '0')}${url.replace(/[^a-z0-9]+/gi, '_')}`;
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
    report.push({ width, url, overflow: overflow.scrollWidth > overflow.vw ? overflow : null, axe, errors: [...errors] });
    console.log(width, url, overflow.scrollWidth > overflow.vw ? `OVERFLOW ${overflow.scrollWidth}>${overflow.vw} ${overflow.offenders.join(' | ')}` : 'no-overflow', `axe:${axe.map((a) => `${a.id}(${a.n})`).join(',') || 'clean'}`, errors.length ? `JS:${errors.join(' / ')}` : '');
  }
  await context.close();
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
