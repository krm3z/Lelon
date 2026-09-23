/* LELON — storefront script. No dependencies, progressive enhancement. */

const config = (() => {
  try {
    return JSON.parse(document.getElementById('LelonConfig')?.textContent || '{}');
  } catch {
    return {};
  }
})();
const text = config.text || {};
const root = config.root || '/';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function announce(message) {
  const region = document.getElementById('LiveRegion');
  if (!region || !message) return;
  region.textContent = '';
  requestAnimationFrame(() => (region.textContent = message));
}

function storage(kind) {
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

/* ---------- Dialogs (menu, search, cart) ---------- */
const openers = new WeakMap();

function openDialog(dialog, opener) {
  if (!dialog || dialog.open) return;
  $$('dialog[open]').forEach((other) => other.close());
  openers.set(dialog, opener || document.activeElement);
  dialog.showModal();
  document.documentElement.classList.add('dialog-open');
  $$(`[aria-controls="${dialog.id}"]`).forEach((el) => el.setAttribute('aria-expanded', 'true'));
  const focusTarget = dialog.querySelector('[autofocus], input[type="search"], .drawer__title');
  focusTarget?.focus({ preventScroll: true });
}

function initDialogs() {
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-open]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.open);
      if (dialog?.showModal) {
        event.preventDefault();
        openDialog(dialog, opener);
      }
      return;
    }
    if (event.target.closest('[data-close]')) {
      event.target.closest('dialog')?.close();
      return;
    }
    if (event.target.tagName === 'DIALOG') {
      const rect = event.target.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) event.target.close();
    }
  });

  $$('dialog').forEach((dialog) => {
    dialog.addEventListener('close', () => {
      const stillOpen = !!$('dialog[open]');
      document.documentElement.classList.toggle('dialog-open', stillOpen);
      $$(`[aria-controls="${dialog.id}"]`).forEach((el) => el.setAttribute('aria-expanded', 'false'));
      const opener = openers.get(dialog);
      if (!stillOpen && opener?.isConnected) opener.focus({ preventScroll: true });
    });
  });

  $$('#MenuDrawer .menu-primary a').forEach((link) => link.addEventListener('click', () => $('#MenuDrawer')?.close()));
}

/* ---------- Motion ---------- */
function motionAllowed() {
  if (!config.motion || reducedMotion.matches) return false;
  return storage('local')?.getItem('lelon-motion') !== 'off';
}

let revealObserver;
function initReveal() {
  const html = document.documentElement;
  revealObserver?.disconnect();
  if (!motionAllowed() || !('IntersectionObserver' in window)) {
    html.classList.remove('motion-ok');
    $$('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  html.classList.add('motion-ok');
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  $$('[data-reveal]:not(.is-visible)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0) el.classList.add('is-visible');
    else revealObserver.observe(el);
  });
}

function initMotionToggle() {
  const buttons = $$('[data-motion-toggle]');
  const sync = () => {
    const off = storage('local')?.getItem('lelon-motion') === 'off';
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(off)));
  };
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const store = storage('local');
      const off = store?.getItem('lelon-motion') === 'off';
      store?.setItem('lelon-motion', off ? 'on' : 'off');
      sync();
      initReveal();
    })
  );
  sync();
  reducedMotion.addEventListener?.('change', initReveal);
}

/* ---------- Opening « Éclosion » ---------- */
function initOpening() {
  const opening = $('#Opening');
  const html = document.documentElement;
  if (!opening || !html.classList.contains('is-opening')) return;
  const onKey = (event) => event.key === 'Escape' && close();
  const finish = () => {
    html.classList.remove('is-opening');
    document.removeEventListener('keydown', onKey);
    opening.remove();
  };
  const close = () => {
    opening.classList.add('is-closing');
    opening.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 450);
  };
  opening.addEventListener('animationend', (event) => {
    if (event.target === opening && event.animationName === 'opening-out') finish();
  });
  $$('[data-opening-close]', opening).forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', onKey);
  setTimeout(finish, 4200);
}

/* ---------- Money ---------- */
function formatMoney(cents) {
  const format = config.moneyFormat || '{{amount_with_comma_separator}} €';
  const value = (Number(cents) || 0) / 100;
  const withComma = value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const noDecimals = value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  return format.replace(/\{\{\s*(\w+)\s*\}\}/, (_, key) => {
    if (key === 'amount_no_decimals' || key === 'amount_no_decimals_with_comma_separator') return noDecimals;
    if (key === 'amount') return value.toLocaleString('en-US', { minimumFractionDigits: 2 });
    return withComma;
  });
}

/* ---------- Cart ---------- */
const CART_SECTION = 'lelon-cart-drawer';
let cartBusy = false;

async function cartRequest(path, body) {
  const response = await fetch(`${root}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...body, sections: [CART_SECTION], sections_url: location.pathname }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.description || data.message || text.cartError);
    error.status = response.status;
    throw error;
  }
  return data;
}

function renderCartSection(html) {
  if (!html) return;
  const next = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-drawer-content]');
  const current = $('[data-cart-drawer-content]');
  if (next && current) current.replaceWith(next);
}

async function refreshCartCount() {
  try {
    const cart = await (await fetch(`${root}cart.js`, { headers: { Accept: 'application/json' } })).json();
    $$('[data-cart-count]').forEach((badge) => {
      badge.textContent = cart.item_count;
      badge.hidden = cart.item_count === 0;
    });
  } catch {
    /* Count stays as rendered by Liquid. */
  }
}

async function refreshCartDrawer() {
  try {
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('sections', CART_SECTION);
    const data = await (await fetch(url)).json();
    renderCartSection(data[CART_SECTION]);
  } catch {
    /* Drawer keeps its server-rendered content. */
  }
}

function initCart() {
  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-product-form]');
    if (!form) return;
    event.preventDefault();
    const scope = form.closest('[data-product-root]') || document;
    const buttons = $$('[data-buy-button]', scope);
    const error = $('[data-form-error]', form);
    /* form.id is clobbered by the associated <select name="id">: read the control through form.elements. */
    const idField = form.elements.namedItem('id');
    if (cartBusy || buttons[0]?.disabled || !idField?.value) return;

    cartBusy = true;
    buttons.forEach((button) => button.setAttribute('aria-busy', 'true'));
    if (error) error.hidden = true;
    try {
      const data = await cartRequest('cart/add.js', {
        items: [{ id: Number(idField.value), quantity: Number(form.querySelector('[name="quantity"]')?.value || 1) }],
      });
      renderCartSection(data.sections?.[CART_SECTION]);
      await refreshCartCount();
      openDialog($('#CartDrawer'), buttons[0]);
      announce(text.added);
    } catch (err) {
      const message = err.status ? err.message : text.networkError;
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }
      announce(message);
    } finally {
      cartBusy = false;
      buttons.forEach((button) => button.removeAttribute('aria-busy'));
    }
  });

  document.addEventListener('click', async (event) => {
    const control = event.target.closest('#CartDrawer [data-line-change]');
    if (!control || cartBusy) return;
    event.preventDefault();
    const line = control.closest('[data-cart-line]');
    cartBusy = true;
    line?.setAttribute('aria-busy', 'true');
    try {
      const data = await cartRequest('cart/change.js', { id: line.dataset.key, quantity: Number(control.dataset.quantity) });
      renderCartSection(data.sections?.[CART_SECTION]);
      $$('[data-cart-count]').forEach((badge) => {
        badge.textContent = data.item_count;
        badge.hidden = data.item_count === 0;
      });
      announce(text.updated);
      $('#CartDrawerTitle')?.focus({ preventScroll: true });
    } catch (err) {
      line?.removeAttribute('aria-busy');
      announce(err.status ? err.message : text.networkError);
    } finally {
      cartBusy = false;
    }
  });

  /* Cart page: quantity inputs submit the native form after a short pause. */
  const cartPage = $('[data-cart-page]');
  if (cartPage) {
    let timer;
    cartPage.addEventListener('change', (event) => {
      if (!event.target.matches('[data-line-input]')) return;
      clearTimeout(timer);
      timer = setTimeout(() => cartPage.querySelector('[name="update"]')?.click(), 500);
    });
  }

  /* Keep the drawer fresh when returning with the back button (bfcache). */
  addEventListener('pageshow', (event) => {
    if (event.persisted) {
      refreshCartDrawer();
      refreshCartCount();
    }
  });
}

/* ---------- Product ---------- */
function initProduct(rootEl) {
  if (rootEl.dataset.ready) return;
  rootEl.dataset.ready = 'true';
  let product;
  try {
    product = JSON.parse($('[data-product-json]', rootEl)?.textContent || 'null');
  } catch {
    product = null;
  }
  if (!product) return;

  const sectionId = rootEl.dataset.sectionId;
  const select = document.getElementById(`VariantSelect-${sectionId}`) || $(`[data-variant-select]`, rootEl);
  const fieldsets = $$('[data-option]', rootEl);
  const colorIndex = product.options.findIndex((name) => /^(coloris|couleur|colou?r)$/i.test(name));
  const gallery = initGallery($('[data-gallery]', rootEl));

  const selectedOptions = () =>
    fieldsets.map((fieldset) => fieldset.querySelector('[data-option-input]:checked')?.value ?? null);

  function stateOf(variant) {
    if (!variant) return 'unavailable';
    if (variant.available) return 'available';
    return config.prelaunch ? 'soon' : 'soldout';
  }

  function update(fromUser) {
    const options = selectedOptions();
    const variant = product.variants.find((v) => v.options.every((value, i) => value === options[i]));
    const state = stateOf(variant);

    if (variant && select) select.value = String(variant.id);

    fieldsets.forEach((fieldset, index) => {
      const label = $('[data-option-value]', fieldset);
      if (label) label.textContent = options[index] || '';
      $$('[data-option-input]', fieldset).forEach((input) => {
        const candidate = options.slice();
        candidate[index] = input.value;
        const available = product.variants.some((v) => v.available && v.options.every((value, i) => value === candidate[i]));
        input.nextElementSibling?.classList.toggle('chip--unavailable', !available);
      });
    });

    const labels = { available: text.add, soon: text.soon, soldout: text.soldout, unavailable: text.unavailable };
    const notes = { available: text.inStock, soon: text.soonNote, soldout: text.soldoutNote, unavailable: text.unavailableNote };
    $$('[data-buy-button]', rootEl).forEach((button) => {
      button.disabled = state !== 'available';
      const label = $('[data-buy-label]', button);
      if (label) label.textContent = labels[state];
    });
    const availability = $('[data-availability]', rootEl);
    if (availability) {
      availability.className = `availability availability--${state}`;
      const note = $('[data-availability-text]', availability);
      if (note) note.textContent = notes[state];
    }
    if (state !== 'available') $('[data-sticky-buy]', rootEl)?.classList.remove('is-visible');
    const dynamic = $('[data-dynamic-checkout]', rootEl);
    if (dynamic) dynamic.hidden = state !== 'available';

    if (variant) {
      $$('[data-price-wrap]', rootEl).forEach((wrap) => {
        const current = $('[data-price-current]', wrap);
        if (current) current.textContent = formatMoney(variant.price);
        const compare = $('[data-price-compare]', wrap);
        if (compare) {
          compare.hidden = !(variant.compare > variant.price);
          if (variant.compare > variant.price) compare.textContent = formatMoney(variant.compare);
        }
      });
    }

    if (gallery) {
      if (colorIndex > -1) gallery.filterByColor(options[colorIndex]);
      /* Worn-first galleries open on the worn photo of the color, not on the packshot. */
      if (fromUser && variant?.media && !gallery.wornFirst) gallery.goToMedia(variant.media);
    }

    if (fromUser && variant && !rootEl.hasAttribute('data-no-url-update')) {
      const url = new URL(location.href);
      url.searchParams.set('variant', variant.id);
      history.replaceState(history.state, '', url);
    }
    if (fromUser) announce(`${options.filter(Boolean).join(' · ')} — ${labels[state]}`);
  }

  rootEl.addEventListener('change', (event) => {
    if (event.target.matches('[data-option-input]')) update(true);
  });
  if (select?.tagName === 'SELECT') {
    select.addEventListener('change', () => {
      const variant = product.variants.find((v) => String(v.id) === select.value);
      if (!variant) return;
      fieldsets.forEach((fieldset, index) => {
        const input = $$('[data-option-input]', fieldset).find((el) => el.value === variant.options[index]);
        if (input) input.checked = true;
      });
      update(true);
    });
  }
  update(false);
  initStickyBuy(rootEl);
}

function initGallery(gallery) {
  if (!gallery) return null;
  const track = $('[data-gallery-track]', gallery);
  const slides = () => $$('[data-slide]:not([hidden])', gallery);
  const thumbs = $$('[data-thumb]', gallery);
  const indexEl = $('[data-gallery-index]', gallery);
  const totalEl = $('[data-gallery-total]', gallery);
  if (!track) return null;

  const currentIndex = () => {
    const width = track.clientWidth || 1;
    return Math.round(track.scrollLeft / width);
  };
  const goTo = (index, smooth = true) => {
    const list = slides();
    const target = list[Math.max(0, Math.min(index, list.length - 1))];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
  };
  const sync = () => {
    const list = slides();
    const index = Math.min(currentIndex(), list.length - 1);
    if (indexEl) indexEl.textContent = String(index + 1);
    if (totalEl) totalEl.textContent = String(list.length);
    const mediaId = list[index]?.dataset.mediaId;
    thumbs.forEach((thumb) => thumb.setAttribute('aria-current', String(thumb.dataset.mediaId === mediaId)));
  };

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      sync();
      ticking = false;
    });
  }, { passive: true });

  thumbs.forEach((thumb) =>
    thumb.addEventListener('click', () => {
      const index = slides().findIndex((slide) => slide.dataset.mediaId === thumb.dataset.mediaId);
      if (index > -1) goTo(index);
    })
  );
  $('[data-gallery-prev]', gallery)?.addEventListener('click', () => goTo(currentIndex() - 1));
  $('[data-gallery-next]', gallery)?.addEventListener('click', () => goTo(currentIndex() + 1));
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(currentIndex() + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(currentIndex() - 1); }
  });
  sync();

  return {
    goToMedia(mediaId) {
      const index = slides().findIndex((slide) => slide.dataset.mediaId === String(mediaId));
      if (index > -1) goTo(index);
    },
    wornFirst: gallery.hasAttribute('data-worn-first'),
    /* data-media-color is computed server-side from the media alt (snippet lelon-media-color). Media of another
       color are hidden, neutral media stay. No photo for the color: show everything and say so. */
    filterByColor(color) {
      if (!color) return;
      const key = color.toLowerCase();
      const all = $$('[data-slide]', gallery);
      const hasColor = all.some((el) => el.dataset.mediaColor === key);
      const hide = (el) => hasColor && Boolean(el.dataset.mediaColor) && el.dataset.mediaColor !== key;
      all.forEach((slide) => (slide.hidden = hide(slide)));
      thumbs.forEach((thumb) => (thumb.hidden = hide(thumb)));
      const note = $('[data-gallery-note]', gallery);
      if (note) {
        note.hidden = hasColor || !all.length;
        note.textContent = (note.dataset.template || '').replace('__COLOR__', color);
      }
      goTo(0, false);
      sync();
    },
  };
}

function initStickyBuy(rootEl) {
  const bar = $('[data-sticky-buy]', rootEl);
  const main = $('.pdp__buy [data-buy-button]', rootEl);
  if (!bar || !main || !('IntersectionObserver' in window)) return;
  bar.hidden = false;
  /* Only offered when the selected variant can actually be bought. */
  new IntersectionObserver(([entry]) => {
    bar.classList.toggle('is-visible', !main.disabled && !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }).observe(main);
}

/* ---------- Recommendations ---------- */
function initRecommendations() {
  $$('[data-recommendations]').forEach(async (section) => {
    if (section.children.length || !section.dataset.url) return;
    try {
      const html = await (await fetch(section.dataset.url)).text();
      const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-recommendations]');
      if (fresh?.innerHTML.trim()) {
        section.innerHTML = fresh.innerHTML;
        initReveal();
      }
    } catch {
      /* Recommendations are optional. */
    }
  });
}

/* ---------- Predictive search ---------- */
function initPredictiveSearch() {
  const form = $('[data-predictive-search]');
  if (!form) return;
  const input = $('input[type="search"]', form);
  const results = $('[data-predictive-results]', form);
  const status = $('[data-predictive-status]', form);
  let controller;
  let timer;
  let activeIndex = -1;

  const options = () => $$('[role="option"]', results);
  const setActive = (index) => {
    const list = options();
    activeIndex = list.length ? (index + list.length) % list.length : -1;
    list.forEach((option, i) => option.setAttribute('aria-selected', String(i === activeIndex)));
    const active = list[activeIndex];
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  };
  const close = () => {
    results.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const query = input.value.trim();
    if (query.length < 2) return close();
    timer = setTimeout(async () => {
      controller?.abort();
      controller = new AbortController();
      results.innerHTML = `<p class="predictive__state">${text.searchLoading}</p>`;
      try {
        const url = `${config.searchUrl || `${root}search/suggest`}?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=last&section_id=predictive-search`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(String(response.status));
        const html = await response.text();
        const panel = new DOMParser().parseFromString(html, 'text/html').querySelector('.predictive__panel');
        results.innerHTML = panel ? panel.outerHTML : '';
        input.setAttribute('aria-expanded', String(options().length > 0));
        activeIndex = -1;
        const count = Number(panel?.dataset.predictiveCount || 0);
        if (status) status.textContent = count ? `${text.searchSuggestions} : ${count}` : panel?.textContent.trim() || '';
      } catch (error) {
        if (error.name === 'AbortError') return;
        results.innerHTML = `<p class="predictive__state">${text.searchError}</p>`;
        input.setAttribute('aria-expanded', 'false');
      }
    }, 220);
  });

  input.addEventListener('keydown', (event) => {
    if (!options().length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(activeIndex + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive(activeIndex - 1); }
    if (event.key === 'Enter' && activeIndex > -1) {
      event.preventDefault();
      const link = options()[activeIndex]?.querySelector('a');
      if (link) location.href = link.href;
    }
  });
  $('#SearchDialog')?.addEventListener('close', () => {
    close();
    input.value = '';
  });
}

/* ---------- Collection ---------- */
function initCollection() {
  $$('[data-auto-submit]').forEach((field) =>
    field.addEventListener('change', () => field.form?.requestSubmit ? field.form.requestSubmit() : field.form?.submit())
  );
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = $('details[data-filters][open]');
    if (open) {
      open.open = false;
      open.querySelector('summary')?.focus();
    }
  });
}

/* ---------- Consent (Shopify Customer Privacy API) ---------- */
function loadPrivacyApi() {
  return new Promise((resolve) => {
    if (window.Shopify?.customerPrivacy) return resolve(window.Shopify.customerPrivacy);
    if (!window.Shopify?.loadFeatures) return resolve(null);
    window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], (error) =>
      resolve(error ? null : window.Shopify.customerPrivacy || null)
    );
  });
}

async function initConsent() {
  const banner = $('[data-consent]');
  if (!banner) return;
  const api = await loadPrivacyApi();
  const details = $('[data-consent-details]', banner);
  const status = $('[data-consent-status]', banner);
  const save = $('[data-consent-action="save"]', banner);
  const customize = $('[data-consent-action="customize"]', banner);
  const quick = $$('[data-consent-action="accept"], [data-consent-action="reject"], [data-consent-action="customize"]', banner);
  const boxes = Object.fromEntries($$('[data-consent-category]', banner).map((box) => [box.dataset.consentCategory, box]));
  const store = storage('local');

  const current = () => {
    const visitor = api?.currentVisitorConsent?.() || {};
    const stored = (() => {
      try { return JSON.parse(store?.getItem('lelon-consent') || 'null'); } catch { return null; }
    })();
    return { visitor, stored };
  };
  const decided = () => {
    const { visitor, stored } = current();
    if (stored) return true;
    return ['analytics', 'marketing', 'preferences'].some((key) => visitor[key] === 'yes' || visitor[key] === 'no');
  };
  const show = (withDetails = false) => {
    const { visitor, stored } = current();
    ['analytics', 'marketing', 'preferences'].forEach((key) => {
      if (boxes[key]) boxes[key].checked = stored ? !!stored[key] : visitor[key] === 'yes';
    });
    details.hidden = !withDetails;
    save.hidden = !withDetails;
    customize.setAttribute('aria-expanded', String(withDetails));
    banner.hidden = false;
    status.textContent = '';
  };
  const hide = () => (banner.hidden = true);

  const apply = (choice) =>
    new Promise((resolve) => {
      store?.setItem('lelon-consent', JSON.stringify(choice));
      if (!api?.setTrackingConsent) {
        status.textContent = text.consentUnavailable || '';
        return resolve(false);
      }
      api.setTrackingConsent(
        { analytics: choice.analytics, marketing: choice.marketing, preferences: choice.preferences, sale_of_data: choice.marketing },
        () => {
          document.dispatchEvent(new CustomEvent('lelon:consent', { detail: choice }));
          resolve(true);
        }
      );
    });

  banner.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-consent-action]')?.dataset.consentAction;
    if (!action) return;
    if (action === 'customize') return show(true);
    const choice =
      action === 'accept' ? { analytics: true, marketing: true, preferences: true }
      : action === 'reject' ? { analytics: false, marketing: false, preferences: false }
      : { analytics: !!boxes.analytics?.checked, marketing: !!boxes.marketing?.checked, preferences: !!boxes.preferences?.checked };
    if (await apply(choice)) hide();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-cookie-manage]')) return;
    show(true);
    quick[0]?.focus();
  });

  const shouldShow = api?.shouldShowBanner ? api.shouldShowBanner() : true;
  if (shouldShow && !decided()) show(false);
}

/* ---------- Referral ---------- */
function initReferral() {
  const block = $('[data-referral]');
  if (!block) return;
  const field = $('[data-referral-url]', block);
  $('[data-referral-copy]', block)?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(field.value);
    } catch {
      field.select();
      document.execCommand?.('copy');
    }
    announce(text.copied);
  });
  const share = $('[data-referral-share]', block);
  if (share && navigator.share) {
    share.hidden = false;
    share.addEventListener('click', () => navigator.share({ title: 'LELON', url: field.value }).catch(() => {}));
  }
}

/* ---------- Boot ---------- */
initDialogs();
initOpening();
initMotionToggle();
initReveal();
initCart();
$$('[data-product-root]').forEach(initProduct);
initRecommendations();
initPredictiveSearch();
initCollection();
initConsent();
initReferral();

document.addEventListener('shopify:section:load', (event) => {
  $$('[data-product-root]', event.target).forEach(initProduct);
  initReveal();
  initRecommendations();
});
