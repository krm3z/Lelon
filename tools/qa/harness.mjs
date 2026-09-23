// Local QA harness: renders the LELON theme with liquidjs + Shopify shims and real catalogue data.
// Not a Shopify replacement — used for layout / responsive / a11y checks only.
import { Liquid, Drop } from 'liquidjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const THEME = process.env.THEME || new URL('../../theme', import.meta.url).pathname;
const IMGS = process.env.IMGS; // dossier des photos produit (zip LELON-Images décompressé)
const PRODUCTS_JSON = process.env.PRODUCTS_JSON; // export Admin API : { data: { products: { nodes: [...] } } }
const PORT = Number(process.env.PORT || 4777);

const stripJsonComments = (s) => s.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
const readJson = (p) => JSON.parse(stripJsonComments(fs.readFileSync(p, 'utf8')));
const fr = readJson(path.join(THEME, 'locales/fr.json'));
const handleize = (s) =>
  String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------- Images from the uploaded zip ---------- */
let mediaSeq = 1000;
function sizeOf(file) {
  const buf = fs.readFileSync(file);
  if (buf[0] === 0x89) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return { width: 800, height: 800 };
}
class Img extends Drop {
  constructor(file, alt) {
    super();
    const { width, height } = sizeOf(file);
    this.id = mediaSeq++;
    this.src = '/img/' + path.relative(IMGS, file).split(path.sep).map(encodeURIComponent).join('/');
    this.width = width; this.height = height; this.aspect_ratio = width / height; this.alt = alt;
    this.media_type = 'image'; this.preview_image = this;
  }
  valueOf() { return this.src; }
}

/* ---------- Catalogue ---------- */
class OptionValue extends Drop {
  constructor(name) { super(); this.name = name; this.swatch = null; this.available = false; this.selected = false; }
  valueOf() { return this.name; }
}
const raw = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8')).data.products.nodes;
const folders = fs.readdirSync(IMGS);
const SHOPIFY_MEDIA = process.env.MEDIA_JSON
  ? Object.fromEntries(JSON.parse(fs.readFileSync(process.env.MEDIA_JSON, 'utf8')).data.products.nodes.map((n) => [n.handle, n.media.nodes]))
  : null;
let variantSeq = 1;

function buildProduct(p, simulateAvailable) {
  const folder = folders.find((f) => f.replace(/^\d+-/, '') === p.handle);
  const colorName = Object.fromEntries(p.options[0].values.map((v) => [handleize(v), v]));
  const media = [];
  if (folder) {
    for (const color of fs.readdirSync(path.join(IMGS, folder)).sort()) {
      const label = colorName[color] || color.charAt(0).toUpperCase() + color.slice(1);
      for (const file of fs.readdirSync(path.join(IMGS, folder, color)).sort()) {
        media.push(new Img(path.join(IMGS, folder, color, file), `${p.title} — ${label} — Vue ${media.length + 1}`));
      }
    }
  }
  /* MEDIA_JSON (Admin API export with media alts): mirror the real Shopify media list and alts, using a zip
     photo of the same color as stand-in file (or any photo of the model when that color has none). */
  if (SHOPIFY_MEDIA && folder) {
    const nodes = SHOPIFY_MEDIA[p.handle] || [];
    const pool = (color) => {
      const dir = fs.readdirSync(path.join(IMGS, folder)).find((c) => color && (handleize(color).startsWith(c) || c.startsWith(handleize(color).split('-')[0])));
      const base = dir ? path.join(IMGS, folder, dir) : path.join(IMGS, folder, fs.readdirSync(path.join(IMGS, folder))[0]);
      return fs.readdirSync(base).sort().map((f) => path.join(base, f));
    };
    media.length = 0;
    nodes.forEach((node, n) => {
      const color = p.options[0].values.find((v) => node.alt.includes(v) || node.alt.includes(v.replace(' & ', ' et ')));
      const files = pool(color);
      media.push(new Img(files[n % files.length], node.alt));
    });
    return finish(p, media, simulateAvailable);
  }
  /* Free alts used in Shopify for the existing worn photos ("LELON ÉLÉA Cognac porté par une mannequin"). */
  const wornAlts = { elea: 'Cognac', nova: 'Chocolat', solea: 'Beige et Cognac', velora: 'Ivoire' };
  if (process.env.SHOPIFY_ALTS && wornAlts[p.handle]) {
    const source = media.find((m) => m.alt.split(' — ')[1] === wornAlts[p.handle].replace(' et ', ' & '));
    if (source) media.push(new Img(path.join(IMGS, decodeURIComponent(source.src.slice(5))), `${p.title} ${wornAlts[p.handle]} porté par une mannequin`));
  }
  return finish(p, media, simulateAvailable);
}

function finish(p, media, simulateAvailable) {
  const folder = folders.find((f) => f.replace(/^\d+-/, '') === p.handle);
  /* Test-only worn photos for the lelon.lifestyle_media metafield (real zip photos, test alts). */
  const worn = [];
  if (process.env.WITH_WORN && p.handle === 'mira') {
    for (const [color, label] of [['noir', 'Noir'], ['taupe', 'Taupe']]) {
      const dir = path.join(IMGS, folder, color);
      fs.readdirSync(dir).sort().forEach((file, n) => worn.push(new Img(path.join(dir, file), `${p.title} — ${label} — Porté ${n + 1} (test)`)));
    }
  }
  const variants = p.variants.nodes.map((v, i) => {
    const options = v.selectedOptions.map((o) => o.value);
    const featured = media.find((m) => m.alt.split(' — ')[1] === options[0]) || null;
    const available = simulateAvailable ? i % 3 !== 2 : v.availableForSale;
    return { id: variantSeq++, title: v.title, options, option1: options[0], option2: options[1], available, price: Math.round(Number(v.price) * 100), compare_at_price: null, featured_media: featured, featured_image: featured, sku: v.sku };
  });
  const current = variants.find((v) => v.available) || variants[0];
  const options_with_values = p.options.map((o, idx) => {
    const values = o.values.map((name) => {
      const value = new OptionValue(name);
      const combo = current.options.slice(); combo[idx] = name;
      value.available = variants.some((v) => v.available && v.options.every((x, j) => x === combo[j]));
      value.selected = current.options[idx] === name;
      return value;
    });
    return { name: o.name, position: idx + 1, values, selected_value: current.options[idx] };
  });
  const prices = variants.map((v) => v.price);
  return {
    id: variantSeq++, handle: p.handle, title: p.title, type: p.productType, vendor: p.vendor, tags: p.tags,
    url: `/products/${p.handle}`, description: p.descriptionHtml, content: p.descriptionHtml,
    available: variants.some((v) => v.available), price: Math.min(...prices), price_varies: new Set(prices).size > 1, compare_at_price: null,
    options: p.options.map((o) => o.name), options_with_values, variants, selected_or_first_available_variant: current,
    has_only_default_variant: false, media, images: media, featured_image: media[0] || null, featured_media: media[0] || null,
    metafields: {
      global: { description_tag: { value: (p.metafields.nodes.find((m) => m.key === 'description_tag') || {}).value } },
      lelon: Object.assign(
        process.env.WITH_DIMENSIONS && p.handle === 'luna' ? { width_cm: { value: 14 }, height_cm: { value: 16 }, depth_cm: { value: 14 }, capacity: { value: ['Téléphone', 'Clés'] } } : {},
        worn.length ? { lifestyle_media: { value: worn } } : {}
      ),
      custom: {},
    },
  };
}
function catalogue(simulate) {
  variantSeq = 1; mediaSeq = 1000;
  const products = raw.map((p) => buildProduct(p, simulate));
  const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));
  const col = (handle, title, filter) => {
    const list = products.filter(filter);
    return { id: handle, handle, title, url: `/collections/${handle}`, description: '', products: list, products_count: list.length, filters: [], sort_options: [{ value: 'best-selling', name: 'Meilleures ventes' }, { value: 'price-ascending', name: 'Prix croissant' }, { value: 'price-descending', name: 'Prix décroissant' }], sort_by: 'best-selling', default_sort_by: 'best-selling' };
  };
  const collections = {
    lelon: col('lelon', 'LELON', (p) => p.tags.includes('lelon-main')),
    signature: col('signature', 'LELON Signature', (p) => p.tags.includes('lelon-signature')),
  };
  return { products, byHandle, collections };
}

/* ---------- Liquid engine ---------- */
const preprocess = (src) =>
  src
    .replace(/\{%-?\s*doc\s*-?%\}[\s\S]*?\{%-?\s*enddoc\s*-?%\}/g, '')
    .replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/g, '')
    .replace(/\{%-?\s*style\s*-?%\}/g, '<style>')
    .replace(/\{%-?\s*endstyle\s*-?%\}/g, '</style>')
    .replace(/posted_successfully\?/g, 'posted_successfully');

const engine = new Liquid({
  root: [path.join(THEME, 'snippets')],
  extname: '.liquid',
  strictFilters: true,
  fs: {
    exists: async (p) => fs.existsSync(p), existsSync: (p) => fs.existsSync(p),
    readFile: async (p) => preprocess(fs.readFileSync(p, 'utf8')), readFileSync: (p) => preprocess(fs.readFileSync(p, 'utf8')),
    resolve: (dir, file, ext) => path.resolve(dir, file.endsWith(ext) ? file : file + ext), contains: () => true, dirname: path.dirname, sep: '/',
  },
});

const kw = (args) => Object.fromEntries(args.filter(Array.isArray));
const pluck = (obj, key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
engine.registerFilter('t', (key, ...args) => {
  const vars = kw(args);
  let value = pluck(fr, key);
  if (value && typeof value === 'object') value = vars.count === 1 ? value.one : value.other;
  if (value == null) return `MISSING(${key})`;
  return String(value).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '');
});
const money = (c) => ((Number(c) || 0) / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
engine.registerFilter('money', money);
engine.registerFilter('money_without_currency', (c) => ((Number(c) || 0) / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }));
engine.registerFilter('asset_url', (f) => `/assets/${f}`);
engine.registerFilter('image_url', (img, ...args) => {
  if (!img) return '';
  const src = typeof img === 'string' ? img : img.src;
  return `${src}?width=${kw(args).width || 800}`;
});
engine.registerFilter('image_tag', function (url, ...args) {
  const o = kw(args);
  const img = this.context.getSync ? null : null;
  const attrs = [`src="${url}"`];
  if (o.widths) attrs.push(`srcset="${String(o.widths).split(',').map((w) => `${url.split('?')[0]}?width=${w.trim()} ${w.trim()}w`).join(', ')}"`);
  for (const k of ['sizes', 'loading', 'class', 'fetchpriority', 'style']) if (o[k] != null) attrs.push(`${k}="${o[k]}"`);
  attrs.push(`alt="${String(o.alt ?? '').replace(/"/g, '&quot;')}"`);
  attrs.push('width="800" height="800"');
  return `<img ${attrs.join(' ')}>`;
});
engine.registerFilter('stylesheet_tag', (u) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter('preload_tag', (u) => `<link rel="preload" href="${u}" as="font" crossorigin>`);
engine.registerFilter('placeholder_svg_tag', (n, cls) => `<svg class="${cls || ''}" viewBox="0 0 10 10"></svg>`);
engine.registerFilter('payment_type_svg_tag', (t) => `<svg viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#fff"/><text x="4" y="15" font-size="7">${t}</text></svg>`);
engine.registerFilter('default_errors', () => '<ul><li>Erreur</li></ul>');
engine.registerFilter('handleize', handleize);
engine.registerFilter('metafield_text', (m) => (m && m.value != null ? m.value : m));
engine.registerFilter('structured_data', (p) => JSON.stringify({ '@type': 'Product', name: p.title }));
engine.registerFilter('payment_button', () => '<button type="button" class="shopify-payment-button__button">Paiement accéléré</button>');
for (const f of ['video_tag', 'external_video_tag', 'model_viewer_tag']) engine.registerFilter(f, () => '<div>media</div>');

engine.registerTag('section', {
  parse(token) { this.name = token.args.replace(/['"]/g, '').trim(); },
  async render(ctx) { return renderSection(this.name, this.name, {}, [ctx.environments]); },
});
engine.registerTag('form', {
  parse(token, remain) {
    this.args = token.args;
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain);
    stream.on('tag:endform', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('unclosed form'); });
    stream.start();
  },
  * render(ctx, emitter) {
    const type = this.args.match(/^'(\w+)'/)[1];
    const attrs = [];
    for (const m of this.args.matchAll(/([\w-]+):\s*('[^']*'|[\w.]+)/g)) {
      const v = m[2].startsWith("'") ? m[2].slice(1, -1) : yield this.liquid.evalValue(m[2], ctx);
      attrs.push(v === '' ? m[1] : `${m[1]}="${v}"`);
    }
    const action = { product: '/cart/add', customer: '/contact#newsletter', contact: '/contact', storefront_password: '/password' }[type] || '/';
    ctx.push({ form: { posted_successfully: false, errors: null, email: '', body: '' } });
    emitter.write(`<form method="post" action="${action}" ${attrs.join(' ')}><input type="hidden" name="form_type" value="${type}">`);
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write('</form>');
    ctx.pop();
  },
});
engine.registerTag('paginate', {
  parse(token, remain) {
    this.expr = token.args.split(' by ')[0].trim();
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain);
    stream.on('tag:endpaginate', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('unclosed paginate'); });
    stream.start();
  },
  * render(ctx, emitter) {
    ctx.push({ paginate: { pages: 1, current_page: 1, parts: [], previous: null, next: null } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
  },
});

/* ---------- Sections ---------- */
function schemaOf(type) {
  const src = fs.readFileSync(path.join(THEME, 'sections', `${type}.liquid`), 'utf8');
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  return m ? JSON.parse(m[1]) : { settings: [] };
}
let DATA;
let GLOBALS = {};
const MANNEQUIN_STANDIN = { 'lelon-elea-cognac-02-mannequin.png': '12-elara/cognac', 'lelon-nova-chocolat-02-mannequin.png': '03-nova/chocolat', 'lelon-solea-beige-cognac-02-mannequin.png': '15-velora/camel', 'lelon-velora-ivoire-02-mannequin.png': '15-velora/camel' };
function resolveImage(ref) {
  const name = ref.replace('shopify://shop_images/', '');
  const [handle, color] = name.replace(/^lelon-/, '').split('-');
  if (MANNEQUIN_STANDIN[name]) {
    const dir = path.join(IMGS, MANNEQUIN_STANDIN[name]);
    return new Img(path.join(dir, fs.readdirSync(dir).sort()[0]), `STAND-IN for ${name}`);
  }
  const product = DATA.byHandle[handle];
  return product?.media.find((m) => handleize(m.alt).includes(color)) || product?.media[0] || null;
}
function resolveSetting(def, value) {
  if (value == null || value === '') return value;
  switch (def?.type) {
    case 'product': return DATA.byHandle[value] || null;
    case 'product_list': return value.map((h) => DATA.byHandle[h]).filter(Boolean);
    case 'collection': return DATA.collections[value] || null;
    case 'image_picker': return resolveImage(value);
    case 'url': return String(value).replace('shopify://collections/', '/collections/').replace('shopify://pages/', '/pages/').replace('shopify://products/', '/products/');
    case 'link_list': return value;
    default: return value;
  }
}
function settingsFor(defs, given = {}) {
  const out = {};
  for (const def of defs || []) {
    if (!def.id) continue;
    out[def.id] = resolveSetting(def, given[def.id] !== undefined ? given[def.id] : def.default);
  }
  return out;
}
async function renderSection(type, id, data, envs) {
  const schema = schemaOf(type);
  const section = { id, settings: settingsFor(schema.settings, data.settings), blocks: [] };
  for (const bid of data.block_order || []) {
    const b = data.blocks[bid];
    const def = (schema.blocks || []).find((d) => d.type === b.type) || {};
    section.blocks.push({ id: bid, type: b.type, settings: settingsFor(def.settings, b.settings), shopify_attributes: '' });
  }
  const scope = Object.assign({}, ...envs, { section });
  const html = await engine.renderFile(path.join(THEME, 'sections', `${type}.liquid`), scope, { globals: GLOBALS });
  return `<div id="shopify-section-${id}" class="shopify-section ${schema.class || ''}">${html}</div>`;
}

/* ---------- Pages ---------- */
async function renderPage(url) {
  const u = new URL(url, 'http://x');
  DATA = catalogue(u.searchParams.has('avail'));
  const schemaSettings = readJson(path.join(THEME, 'config/settings_schema.json')).flatMap((g) => g.settings || []);
  const settings = settingsFor(schemaSettings, readJson(path.join(THEME, 'config/settings_data.json')).current);
  const menu = { links: [['Collection', '/collections/lelon'], ['Signature', '/collections/signature'], ['Notre histoire', '/pages/notre-histoire'], ['Contact', '/pages/contact']].map(([title, url]) => ({ title, url, active: u.pathname === url })) };
  let cartItems = [];
  if (u.searchParams.has('cart')) {
    cartItems = [DATA.byHandle.luna, DATA.byHandle.celene].map((p, i) => {
      const v = p.variants[0];
      return { key: `k${i}`, url: p.url, image: p.featured_image, product: p, variant: v, quantity: i + 1, options_with_values: [{ name: 'Coloris', value: v.option1 }], properties: {}, line_level_discount_allocations: [], final_price: v.price, final_line_price: v.price * (i + 1), original_line_price: v.price * (i + 1), url_to_remove: '/cart/change?line=1&quantity=0' };
    });
  }
  const cart = { items: cartItems, item_count: cartItems.reduce((a, b) => a + b.quantity, 0), total_price: cartItems.reduce((a, b) => a + b.final_line_price, 0), cart_level_discount_applications: [], note: '', currency: { iso_code: 'EUR' } };
  const policies = [
    { title: 'Mentions légales', url: '/policies/legal-notice', body: '<p># MENTIONS LÉGALES</p>\n<p>**Dernière mise à jour : 23 septembre 2026**</p>\n<p>## 1. Éditeur du site</p>\n<p>Le site LELON est édité par :</p>\n<p>**Exemple — Éditeur du site**</p>\n<p>## 6. Médiation de la consommation</p>\n<p>**Médiateur de la consommation désigné par LELON : À COMPLÉTER APRÈS ADHÉSION**</p>' },
    { title: 'Expédition', url: '/policies/shipping-policy', body: '<p># POLITIQUE D’EXPÉDITION</p>\n<p>## 4. Frais de livraison</p>\n<p>- **Livraison standard : 0,99 €**<br>- **Livraison offerte à partir de 90 € d’achat**</p>' },
    { title: 'Politique de remboursement', url: '/policies/refund-policy', body: '<p># Politique de retour</p>\n<p>## 1. Droit de rétractation</p>\n<p>Vous disposez d’un délai de **14 jours**.</p>' },
    { title: 'Conditions générales de vente', url: '/policies/terms-of-sale', body: '<p>## 7. Livraison</p>\n<p>LELON livre actuellement en **France**.</p>' },
  ];
  const globals = {
    settings, shop: { name: 'Lelon', url: 'http://localhost:' + PORT, description: '', money_format: '{{amount_with_comma_separator}} €', policies, privacy_policy: { url: '/policies/privacy-policy' }, enabled_payment_types: ['visa', 'master', 'paypal'], password_message: '' },
    routes: { root_url: '/', cart_url: '/cart', search_url: '/search', account_url: '/account', account_login_url: '/account/login', all_products_collection_url: '/collections/all', predictive_search_url: '/search/suggest', product_recommendations_url: '/recommendations/products' },
    cart, linklists: { 'main-menu': menu }, request: { locale: { iso_code: 'fr' }, design_mode: false, page_type: 'index' },
    canonical_url: u.href, content_for_header: '', page_title: 'LELON', current_page: 1, template: { name: 'index', suffix: null }, customer: null,
  };

  GLOBALS = globals;
  let templateFile;
  const [, kind, handle] = u.pathname.split('/');
  if (!kind) templateFile = 'index.json';
  else if (kind === 'products') {
    const product = DATA.byHandle[handle];
    /* Deep link ?variant= selects that variant, like Shopify. */
    const requested = product.variants.find((v) => String(v.id) === u.searchParams.get('variant'));
    if (requested) {
      product.selected_or_first_available_variant = requested;
      product.options_with_values.forEach((option, idx) => {
        option.selected_value = requested.options[idx];
        option.values.forEach((value) => {
          value.selected = value.name === requested.options[idx];
          const combo = requested.options.slice(); combo[idx] = value.name;
          value.available = product.variants.some((v) => v.available && v.options.every((x, j) => x === combo[j]));
        });
      });
    }
    Object.assign(globals, { product, page_title: product.title, template: { name: 'product' } });
    globals.request.page_type = 'product'; templateFile = 'product.json';
  } else if (kind === 'collections') {
    Object.assign(globals, { collection: DATA.collections[handle], page_title: DATA.collections[handle].title, template: { name: 'collection' } });
    globals.request.page_type = 'collection'; templateFile = 'collection.json';
  } else if (kind === 'pages') {
    const suffix = fs.existsSync(path.join(THEME, `templates/page.${handle}.json`)) ? handle : null;
    Object.assign(globals, { page: { title: { 'notre-histoire': 'Notre histoire', contact: 'Contact', faq: 'FAQ', 'livraison-retours': 'Livraison & retours', 'mentions-legales': 'Mentions légales', 'politique-de-cookies': 'Politique de cookies', landing: 'LUNA' }[handle] || handle, content: '<p>Contenu de la page Shopify.</p>' }, page_title: handle, template: { name: 'page', suffix } });
    globals.request.page_type = 'page'; templateFile = suffix ? `page.${suffix}.json` : 'page.json';
  } else if (kind === 'cart') { globals.request.page_type = 'cart'; templateFile = 'cart.json'; }
  else if (kind === 'search') {
    const q = (u.searchParams.get('q') || '').toLowerCase();
    const results = DATA.products.filter((p) => p.title.toLowerCase().includes(q)).map((p) => Object.assign(p, { object_type: 'product' }));
    globals.search = { performed: !!q, terms: q, results, results_count: results.length };
    globals.request.page_type = 'search'; templateFile = 'search.json';
  } else if (kind === 'account') { templateFile = 'page.account.json'; globals.page = { title: 'Mon compte' }; }
  else templateFile = '404.json';

  const template = readJson(path.join(THEME, 'templates', templateFile));
  let content = '';
  for (const id of template.order) content += await renderSection(template.sections[id].type, id, template.sections[id], [globals]);
  return engine.renderFile(path.join(THEME, 'layout/theme.liquid'), { ...globals, content_for_layout: content }, { globals });
}

async function renderPredictive(q) {
  DATA = catalogue(false);
  const products = DATA.products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  const html = await engine.renderFile(path.join(THEME, 'sections/predictive-search.liquid'), { predictive_search: { performed: true, terms: q, resources: { products } }, routes: { search_url: '/search' } });
  return `<div id="shopify-section-predictive-search">${html}</div>`;
}

/* ---------- Server ---------- */
const types = { '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (u.pathname.startsWith('/assets/') || u.pathname.startsWith('/img/')) {
      const base = u.pathname.startsWith('/assets/') ? path.join(THEME, 'assets') : IMGS;
      const file = path.join(base, decodeURIComponent(u.pathname.replace(/^\/(assets|img)\//, '')));
      res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      return fs.createReadStream(file).pipe(res);
    }
    if (u.pathname === '/search/suggest') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(await renderPredictive(u.searchParams.get('q') || ''));
    }
    if (u.pathname === '/cart.js') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"item_count":1}'); }
    if (u.pathname === '/cart/change.js') {
      const html = await renderPage('/?cart=1&avail=1');
      const drawer = html.match(/<div id="shopify-section-lelon-cart-drawer"[\s\S]*?<\/dialog>\s*<\/div>/)?.[0] || '';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ item_count: 3, items: [], sections: { 'lelon-cart-drawer': drawer } }));
    }
    if (u.pathname === '/cart/add.js') {
      const html = await renderPage('/?cart=1&avail=1');
      const drawer = html.match(/<div id="shopify-section-lelon-cart-drawer"[\s\S]*?<\/dialog>\s*<\/div>/)?.[0] || '';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ items: [], sections: { 'lelon-cart-drawer': drawer } }));
    }
    const html = await renderPage(req.url);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    console.error(req.url, error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(String(error.stack || error));
  }
}).listen(PORT, () => console.log('harness on', PORT));
