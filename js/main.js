/* ============================================================
   MAIN.JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile footer CTA button ---------- */
  const footerInner = document.querySelector('.footer__inner');
  if (footerInner) {
    const cta = document.createElement('div');
    cta.className = 'footer__mobile-cta';
    cta.innerHTML = '<a href="tel:+380966852191" class="btn btn--primary btn--lg" style="width:100%;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.18 6.18l.77-.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Зателефонувати</a>';
    footerInner.prepend(cta);
  }

  /* ---------- Sticky header shadow + hide on scroll (mobile) ---------- */
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    if (window.innerWidth <= 768) {
      if (y > lastScrollY && y > 80) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
    }
    lastScrollY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Burger / mobile nav ---------- */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Back to top ---------- */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ---------- Hero image fallback ---------- */
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
    });
    heroImg.addEventListener('load', () => {
      const placeholder = document.querySelector('.hero__img-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    });
    // If already cached
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      const placeholder = document.querySelector('.hero__img-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    }
  }

  /* ---------- About image fallback ---------- */
  const aboutImg = document.querySelector('.about__img');
  if (aboutImg) {
    aboutImg.addEventListener('load', () => {
      const placeholder = document.querySelector('.about__img-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    });
    aboutImg.addEventListener('error', () => {
      aboutImg.style.display = 'none';
    });
    if (aboutImg.complete && aboutImg.naturalWidth > 0) {
      const placeholder = document.querySelector('.about__img-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    }
  }

  /* ---------- Dropdown nav ---------- */
  buildDropdown();
  initDropdown();

  /* ---------- Footer category links ---------- */
  buildFooterNav();

  /* ---------- Skeleton одразу ---------- */
  const gridEl = document.getElementById('productGrid');
  if (gridEl) {
    gridEl.innerHTML = Array.from({ length: 8 }, () => `
      <div class="product-card product-card--skeleton">
        <div class="skeleton-img"></div>
        <div class="product-card__body">
          <div class="skeleton-line skeleton-line--short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line--med"></div>
          <div class="skeleton-line skeleton-line--price"></div>
        </div>
      </div>`).join('');
  }

  const catGridEl = document.getElementById('categoryGrid');
  if (catGridEl) {
    catGridEl.innerHTML = Array.from({ length: 6 }, () => `
      <div class="cat-card cat-card--skeleton">
        <div class="skeleton-img"></div>
        <div class="skeleton-line skeleton-line--cat-name"></div>
      </div>`).join('');
  }

  /* ---------- Load products once → category cards + catalog + hero ---------- */
  loadProducts().then(products => {
    buildCategoryCards(products);
    buildCatalog(products);
    startHeroSlideshow(products);
    initHomeDimSearch(products);
  });

  /* ---------- Product Modal ---------- */
  initProductModal();

  /* ---------- Lightbox ---------- */
  initLightbox();

});

/* ============================================================
   DROPDOWN
   ============================================================ */
const CAT_ICONS = {
  kilcia:    `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="9"/></svg>`,
  manzhety:  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10h6v18a8 8 0 0016 0V10h6"/><line x1="10" y1="10" x2="38" y2="10"/></svg>`,
  vtulky:    `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><ellipse cx="24" cy="14" rx="13" ry="5"/><line x1="11" y1="14" x2="11" y2="34"/><line x1="37" y1="14" x2="37" y2="34"/><ellipse cx="24" cy="34" rx="13" ry="5"/></svg>`,
  salnyky:   `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><ellipse cx="24" cy="16" rx="16" ry="6"/><line x1="8" y1="16" x2="8" y2="32"/><line x1="40" y1="16" x2="40" y2="32"/><ellipse cx="24" cy="32" rx="16" ry="6"/><ellipse cx="24" cy="16" rx="6" ry="2.5" stroke-width="2"/></svg>`,
  prokladky: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="34" height="34" rx="4"/><rect x="17" y="17" width="14" height="14" rx="2"/></svg>`,
  inshi:     `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 5l17 9v20L24 43 7 34V14z"/><path d="M24 5v38M7 14l17 9 17-9"/></svg>`,
};

function buildDropdown() {
  const dropdownEl = document.getElementById('navDropdown');
  if (!dropdownEl || typeof CATEGORIES === 'undefined') return;

  const activeCat = typeof CATALOG_CATEGORY !== 'undefined' ? CATALOG_CATEGORY : null;

  dropdownEl.innerHTML = CATEGORIES.map(cat => {
    const subs = (typeof SUBCATEGORIES !== 'undefined' && SUBCATEGORIES[cat.id]) || null;
    const isTwoLevel = subs && subs[0] && subs[0].children;
    const isActive = activeCat === cat.id;

    const subHTML = subs ? `<ul class="nav__dropdown-sub">${subs.map(sub => {
      if (isTwoLevel && sub.children?.length) {
        return `<li class="nav__dropdown-sub-item nav__dropdown-sub-item--has-sub">
          <div class="nav__dropdown-sub-row">
            <a href="${cat.page}#${sub.id}" class="nav__dropdown-sub-link">${escHtml(sub.name)}</a>
            <button class="nav__sub2-toggle" aria-label="Розкрити">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <ul class="nav__dropdown-sub-sub">${sub.children.map(ch =>
            `<li><a href="${cat.page}#${ch.id}" class="nav__dropdown-sub-link nav__dropdown-sub-link--sm">${escHtml(ch.name)}</a></li>`
          ).join('')}</ul>
        </li>`;
      }
      return `<li><a href="${cat.page}#${sub.id}" class="nav__dropdown-sub-link">${escHtml(sub.name)}</a></li>`;
    }).join('')}</ul>` : '';

    return `
      <li class="nav__dropdown-item${subs ? ' nav__dropdown-item--has-sub' : ''}${isActive ? ' nav__dropdown-item--open' : ''}">
        <div class="nav__dropdown-row">
          <a href="${cat.page || '#'}" class="nav__dropdown-link${isActive ? ' nav__dropdown-link--active' : ''}">${escHtml(cat.name)}</a>
          ${subs ? `<button class="nav__sub-toggle" aria-label="Розкрити підкатегорії">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>` : ''}
        </div>
        ${subHTML}
      </li>`;
  }).join('');

  // Мобільний тогл L1 (клік на стрілку)
  dropdownEl.querySelectorAll('.nav__sub-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.closest('.nav__dropdown-item--has-sub').classList.toggle('nav__dropdown-item--open');
    });
  });

  // Мобільний тогл L2
  dropdownEl.querySelectorAll('.nav__sub2-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.closest('.nav__dropdown-sub-item--has-sub').classList.toggle('nav__dropdown-sub-item--open');
    });
  });

  // Десктоп: flyout без затримок
  // Відкривається при наведенні на елемент, закривається коли мишка виходить з панелі
  if (window.matchMedia('(min-width: 901px)').matches) {

    const fitFlyout = (panel, trigger) => {
      const triggerTop = trigger.getBoundingClientRect().top;
      const panelH = panel.offsetHeight;
      const vh = window.innerHeight;
      const margin = 8;

      let top = -6;
      if (triggerTop + top + panelH > vh - margin) {
        top = vh - margin - panelH - triggerTop;
      }
      if (triggerTop + top < margin) {
        top = margin - triggerTop;
      }

      panel.style.top    = top + 'px';
      panel.style.bottom = 'auto';
    };

    // L1: відкриваємо при наведенні, закриваємо всі при виході з dropdown
    dropdownEl.querySelectorAll('.nav__dropdown-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        dropdownEl.querySelectorAll('.nav__dropdown-item--has-sub').forEach(other => {
          other.classList.remove('flyout-open');
        });
        if (item.classList.contains('nav__dropdown-item--has-sub')) {
          const sub = item.querySelector('.nav__dropdown-sub');
          if (sub) fitFlyout(sub, item);
          item.classList.add('flyout-open');
        }
      });
    });
    dropdownEl.addEventListener('mouseleave', () => {
      dropdownEl.querySelectorAll('.nav__dropdown-item--has-sub').forEach(item => {
        item.classList.remove('flyout-open');
      });
    });

    // L2: те саме всередині кожної L1-панелі
    dropdownEl.querySelectorAll('.nav__dropdown-sub').forEach(sub => {
      sub.querySelectorAll('.nav__dropdown-sub-item--has-sub').forEach(subItem => {
        subItem.addEventListener('mouseenter', () => {
          sub.querySelectorAll('.nav__dropdown-sub-item--has-sub').forEach(other => {
            if (other !== subItem) other.classList.remove('flyout2-open');
          });
          const sub2 = subItem.querySelector('.nav__dropdown-sub-sub');
          if (sub2) fitFlyout(sub2, subItem);
          subItem.classList.add('flyout2-open');
        });
      });
      sub.addEventListener('mouseleave', () => {
        sub.querySelectorAll('.nav__dropdown-sub-item--has-sub').forEach(si => {
          si.classList.remove('flyout2-open');
        });
      });
    });

  }

  // Закриваємо всі рівні меню при кліку на будь-яку підкатегорію (L1 і L2)
  dropdownEl.querySelectorAll('.nav__dropdown-sub-link').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('nav');
      const burger = document.getElementById('burger');
      const catItem = document.getElementById('navCatalogItem');
      if (nav) nav.classList.remove('open');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
      if (catItem) catItem.classList.remove('open');
      dropdownEl.querySelectorAll('.flyout-open').forEach(el => el.classList.remove('flyout-open'));
      dropdownEl.querySelectorAll('.flyout2-open').forEach(el => el.classList.remove('flyout2-open'));
      dropdownEl.querySelectorAll('.nav__dropdown-item--open').forEach(el => el.classList.remove('nav__dropdown-item--open'));
      dropdownEl.querySelectorAll('.nav__dropdown-sub-item--open').forEach(el => el.classList.remove('nav__dropdown-sub-item--open'));
      document.body.style.overflow = '';
    });
  });

  if (activeCat) {
    document.getElementById('navCatalogItem')?.classList.add('nav__item--active');
  }
}

function initDropdown() {
  const toggle = document.getElementById('navCatalogToggle');
  const item   = document.getElementById('navCatalogItem');
  if (!toggle || !item) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = item.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Закрити при кліку поза дропдауном
  document.addEventListener('click', () => {
    item.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  // Закрити моб. drawer при переході на категорію або "Каталог"
  item.querySelectorAll('.nav__dropdown-link, .nav__dropdown-main').forEach(link => {
    link.addEventListener('click', () => {
      const nav    = document.getElementById('nav');
      const burger = document.getElementById('burger');
      if (nav)    nav.classList.remove('open');
      if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   CATEGORY CARDS (головна сторінка)
   ============================================================ */
function buildCategoryCards(products = []) {
  const gridEl = document.getElementById('categoryGrid');
  if (!gridEl || typeof CATEGORIES === 'undefined') return;

  gridEl.innerHTML = CATEGORIES.map(cat => {
    const firstImg = (products.find(p => p.categoryId === cat.id && p.image) || {}).image || '';
    return `
      <a href="${cat.page || '#'}" class="cat-card">
        <div class="cat-card__preview">
          ${firstImg ? `<img class="cat-card__img" src="${escHtml(firstImg)}" alt="${escHtml(cat.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />` : ''}
          <div class="cat-card__icon" style="${firstImg ? 'display:none' : 'display:flex'}">${CAT_ICONS[cat.id] || ''}</div>
        </div>
        <span class="cat-card__name">${escHtml(cat.name)}</span>
      </a>
    `;
  }).join('');
}

function buildFooterNav() {
  const el = document.getElementById('footerCatalogLinks');
  if (!el || typeof CATEGORIES === 'undefined') return;
  el.innerHTML = CATEGORIES.map(cat =>
    `<li><a href="${cat.page || '#'}">${escHtml(cat.name)}</a></li>`
  ).join('');
}

/* ============================================================
   CSV HELPERS (для Google Sheets)
   ============================================================ */
function parseCSVLine(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h => h.trim());
  return lines.slice(1)
    .map(line => {
      const vals = parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => obj[h] = (vals[i] || '').trim());
      return obj;
    })
    .filter(row => row.id)
    .map(row => {
      const obj = { ...row, id: parseInt(row.id, 10) || 0 };
      if (obj.image && !obj.image.startsWith('http')) {
        obj.image = `https://drive.google.com/thumbnail?id=${obj.image}&sz=w800`;
      }
      return obj;
    });
}

async function loadProducts() {
  const url = typeof SHEETS_CSV_URL !== 'undefined' ? SHEETS_CSV_URL : '';
  if (!url) return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];

  const CACHE_KEY = 'products_csv_v2';
  const CACHE_TTL = 2 * 60 * 1000; // 2 хвилини

  // Спробуємо взяти з sessionStorage
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, text } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) {
        const rows = parseCSV(text);
        if (rows.length) return rows;
      }
    }
  } catch (e) {}

  // Fetch свіжих даних
  try {
    const res = await fetch(url + '&t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), text })); } catch (e) {}
    const rows = parseCSV(text);
    if (rows.length) return rows;
  } catch (e) {
    console.warn('Google Sheets недоступний, використовую локальні дані:', e);
  }

  return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
}

/* ============================================================
   DIM HELPERS
   ============================================================ */
function parseDims(name) {
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*[*×xX]\s*(\d+(?:[.,]\d+)?)\s*[*×xX]\s*(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return {
    d: parseFloat(m[1].replace(',', '.')),
    D: parseFloat(m[2].replace(',', '.')),
    h: parseFloat(m[3].replace(',', '.')),
  };
}

function renderProductGrid(gridEl, filtered, allProducts) {
  if (!filtered.length) {
    gridEl.innerHTML = '<p class="catalog__loading">Товарів не знайдено.</p>';
    return;
  }

  gridEl.innerHTML = filtered.map(p => productCardHTML(p)).join('');

  gridEl.querySelectorAll('.product-card__img[data-src]').forEach(img => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.src = el.dataset.src;
          el.classList.add('loading');
          el.addEventListener('load', () => {
            el.classList.remove('loading');
            el.classList.add('loaded');
            const ph = el.closest('.product-card__img-wrap')?.querySelector('.product-card__placeholder');
            if (ph) ph.style.display = 'none';
          }, { once: true });
          el.addEventListener('error', () => { el.style.display = 'none'; }, { once: true });
          obs.unobserve(el);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(img);
  });

  gridEl.querySelectorAll('.product-card__cta[data-product-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = allProducts.find(p => p.id === parseInt(btn.dataset.productId, 10));
      if (product) openProductModal(product);
    });
  });

  gridEl.querySelectorAll('.product-card__add[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      if (btn.classList.contains('product-card__add--done')) {
        if (typeof cartRemove === 'function') cartRemove(id);
      } else {
        const product = allProducts.find(p => p.id === id);
        if (product && typeof cartAdd === 'function') cartAdd(product);
      }
    });
  });

  if (typeof cartUpdateButtons === 'function') cartUpdateButtons();
}

/* ============================================================
   HOME DIM SEARCH
   ============================================================ */
function initHomeDimSearch(allProducts) {
  const filterEl = document.getElementById('homeDimFilter');
  const gridEl   = document.getElementById('homeDimGrid');
  const hintEl   = document.getElementById('homeDimHint');
  if (!filterEl || !gridEl) return;

  filterEl.innerHTML = `
    <div class="dim-filter__left">
      <span class="dim-filter__title">Розмір</span>
    </div>
    <div class="dim-filter__pills">
      <label class="dim-pill">
        <span class="dim-pill__key">d</span>
        <span class="dim-pill__name">внутр</span>
        <input class="dim-pill__input" id="homeDimFd" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
      <label class="dim-pill">
        <span class="dim-pill__key">D</span>
        <span class="dim-pill__name">зовн</span>
        <input class="dim-pill__input" id="homeDimFD" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
      <label class="dim-pill">
        <span class="dim-pill__key">h</span>
        <span class="dim-pill__name">висота</span>
        <input class="dim-pill__input" id="homeDimFh" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
    </div>
    <div class="dim-filter__count">
      <span class="dim-filter__count-label">Знайдено</span>
      <span class="dim-filter__count-num" id="homeDimCount">—</span>
    </div>
    <button class="dim-filter__reset" id="homeDimReset" title="Скинути">✕</button>`;

  const getFilter = () => ({
    d: parseFloat(document.getElementById('homeDimFd')?.value),
    D: parseFloat(document.getElementById('homeDimFD')?.value),
    h: parseFloat(document.getElementById('homeDimFh')?.value),
  });

  const resetFilter = () => {
    ['homeDimFd', 'homeDimFD', 'homeDimFh'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  };

  const runSearch = () => {
    const { d, D, h } = getFilter();
    const hasFilter = !isNaN(d) || !isNaN(D) || !isNaN(h);

    ['homeDimFd', 'homeDimFD', 'homeDimFh'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== '');
    });

    const countEl = document.getElementById('homeDimCount');

    if (!hasFilter) {
      gridEl.hidden = true;
      if (hintEl) hintEl.hidden = false;
      if (countEl) countEl.textContent = '—';
      return;
    }

    const filtered = allProducts.filter(p => {
      const dims = parseDims(p.name);
      if (!dims) return false;
      if (!isNaN(d) && dims.d !== d) return false;
      if (!isNaN(D) && dims.D !== D) return false;
      if (!isNaN(h) && dims.h !== h) return false;
      return true;
    });

    if (countEl) countEl.textContent = filtered.length;
    if (hintEl) hintEl.hidden = true;
    gridEl.hidden = false;

    if (!filtered.length) {
      gridEl.innerHTML = '<p class="catalog__loading">Нічого не знайдено. <a href="tel:+380966852191">Зателефонуйте нам</a> — підберемо індивідуально.</p>';
      return;
    }

    renderProductGrid(gridEl, filtered, allProducts);
  };

  filterEl.addEventListener('input', runSearch);
  document.getElementById('homeDimReset')?.addEventListener('click', () => { resetFilter(); runSearch(); });
}

/* ============================================================
   BUILD CATALOG
   ============================================================ */
async function buildCatalog(preloadedProducts) {
  const gridEl = document.getElementById('productGrid');
  if (!gridEl) return;

  const products    = preloadedProducts !== undefined ? preloadedProducts : await loadProducts();
  const catId       = typeof CATALOG_CATEGORY !== 'undefined' ? CATALOG_CATEGORY : null;
  const _rawSubcats = (catId && typeof SUBCATEGORIES !== 'undefined') ? SUBCATEGORIES[catId] : null;
  const subcats     = (_rawSubcats && _rawSubcats.length) ? _rawSubcats : null;
  const filtersEl   = document.getElementById('catalogFilters');
  const featuredProducts = !catId ? shuffleArray(products).slice(0, 8) : null;

  // ── Сторінка з підтипами ───────────────────────────────────────────
  if (subcats) {
    const isTwoLevel = subcats[0] && subcats[0].children;

    if (isTwoLevel) {
      // ── Два яруси (наприклад gidro.html) ──────────────────────────
      let activeGroup = null;
      let activeChild = null;

      const l1Label = document.createElement('div');
      l1Label.className = 'subtype-l1-label';
      gridEl.parentNode.insertBefore(l1Label, gridEl);

      const l2Bar = document.createElement('div');
      l2Bar.className = 'subtype-tabs subtype-tabs--l2';
      gridEl.parentNode.insertBefore(l2Bar, gridEl);

      const filterEl = document.createElement('div');
      filterEl.className = 'dim-filter';
      filterEl.hidden = true;
      filterEl.innerHTML = `
        <div class="dim-filter__left">
          <span class="dim-filter__title">Розмір</span>
        </div>
        <div class="dim-filter__pills">
          <label class="dim-pill">
            <span class="dim-pill__key">d</span>
            <span class="dim-pill__name">внутр</span>
            <input class="dim-pill__input" id="dimFd" type="number" min="0" step="0.1" placeholder="—">
            <span class="dim-pill__unit">мм</span>
          </label>
          <label class="dim-pill">
            <span class="dim-pill__key">D</span>
            <span class="dim-pill__name">зовн</span>
            <input class="dim-pill__input" id="dimFD" type="number" min="0" step="0.1" placeholder="—">
            <span class="dim-pill__unit">мм</span>
          </label>
          <label class="dim-pill">
            <span class="dim-pill__key">h</span>
            <span class="dim-pill__name">висота</span>
            <input class="dim-pill__input" id="dimFh" type="number" min="0" step="0.1" placeholder="—">
            <span class="dim-pill__unit">мм</span>
          </label>
        </div>
        <div class="dim-filter__count">
          <span class="dim-filter__count-label">Знайдено</span>
          <span class="dim-filter__count-num" id="dimCount">—</span>
        </div>
        <button class="dim-filter__reset" id="dimReset" title="Скинути">✕</button>`;
      gridEl.parentNode.insertBefore(filterEl, gridEl);

      const getDimFilter = () => ({
        d: parseFloat(document.getElementById('dimFd')?.value),
        D: parseFloat(document.getElementById('dimFD')?.value),
        h: parseFloat(document.getElementById('dimFh')?.value),
      });

      const resetDimFilter = () => {
        ['dimFd', 'dimFD', 'dimFh'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      };

      filterEl.addEventListener('input', () => renderProducts());
      document.getElementById('dimReset') && document.getElementById('dimReset').addEventListener('click', () => {
        resetDimFilter(); renderProducts();
      });

      const resolveHash = (h) => {
        for (const group of subcats) {
          if (group.id === h) return { group, child: group.children[0]?.id };
          const child = group.children?.find(c => c.id === h);
          if (child) return { group, child: h };
        }
        return null;
      };

      const showL1Groups = () => {
        l1Label.hidden = true;
        l2Bar.hidden = true;
        filterEl.hidden = true;
        resetDimFilter();
        const l1Sep = document.getElementById('breadcrumbL1Sep');
        const l1Bc  = document.getElementById('breadcrumbL1');
        if (l1Sep) l1Sep.hidden = true;
        if (l1Bc)  l1Bc.textContent = '';
        gridEl.className = 'catalog__grid catalog__grid--l1groups';
        gridEl.innerHTML = subcats.map(group => `
          <a href="#${group.id}" class="l1-group-card">
            <span class="l1-group-card__name">${escHtml(group.name)}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>`).join('');
      };

      const showGroup = () => {
        l1Label.hidden = false;
        l2Bar.hidden = false;
        filterEl.hidden = false;
        l1Label.textContent = activeGroup.name;
        const l1Sep = document.getElementById('breadcrumbL1Sep');
        const l1Bc  = document.getElementById('breadcrumbL1');
        if (l1Sep) l1Sep.hidden = false;
        if (l1Bc)  l1Bc.textContent = activeGroup.name;
        gridEl.className = 'catalog__grid catalog__grid--list';
        renderL2();
        renderProducts();
      };

      const renderL2 = () => {
        l2Bar.innerHTML = '';
        (activeGroup.children || []).forEach(child => {
          const btn = document.createElement('button');
          btn.className = 'subtype-tab' + (child.id === activeChild ? ' subtype-tab--active' : '');
          btn.dataset.subtype = child.id;
          btn.textContent = child.short || child.name;
          btn.addEventListener('click', () => {
            activeChild = child.id;
            resetDimFilter();
            renderL2(); renderProducts();
          });
          l2Bar.appendChild(btn);
        });
      };

      function renderProducts() {
        let filtered = products.filter(p => p.categoryId === catId && p.subtype === activeChild);
        const { d, D, h } = getDimFilter();
        const hasFilter = !isNaN(d) || !isNaN(D) || !isNaN(h);
        if (hasFilter) {
          filtered = filtered.filter(p => {
            const dims = parseDims(p.name);
            if (!dims) return false;
            if (!isNaN(d) && dims.d !== d) return false;
            if (!isNaN(D) && dims.D !== D) return false;
            if (!isNaN(h) && dims.h !== h) return false;
            return true;
          });
        }
        const countEl = document.getElementById('dimCount');
        if (countEl) countEl.textContent = filtered.length;
        ['dimFd', 'dimFD', 'dimFh'].forEach(id => {
          const inp = document.getElementById(id);
          if (inp) inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== '');
        });
        renderGrid(filtered);
      }

      const hashId = location.hash.slice(1);
      const initial = hashId ? resolveHash(hashId) : null;
      if (initial) {
        activeGroup = initial.group;
        activeChild = initial.child;
        showGroup();
      } else {
        showL1Groups();
      }

      window.addEventListener('hashchange', () => {
        const h = location.hash.slice(1);
        if (!h) { activeGroup = null; activeChild = null; showL1Groups(); return; }
        const resolved = resolveHash(h);
        if (resolved) {
          activeGroup = resolved.group; activeChild = resolved.child;
          resetDimFilter();
          showGroup();
        }
      });

      return;
    }

    // ── Один ярус (наприклад kilcia.html) ─────────────────────────
    const tabsBar = document.createElement('div');
    tabsBar.className = 'subtype-tabs';
    gridEl.parentNode.insertBefore(tabsBar, gridEl);

    const hashId = location.hash.slice(1);
    let activeSubtype = subcats.find(s => s.id === hashId) ? hashId : subcats[0].id;

    subcats.forEach(sub => {
      const btn = document.createElement('button');
      btn.className = 'subtype-tab' + (sub.id === activeSubtype ? ' subtype-tab--active' : '');
      btn.dataset.subtype = sub.id;
      btn.textContent = sub.short || sub.name;
      btn.addEventListener('click', () => {
        tabsBar.querySelectorAll('.subtype-tab').forEach(b => b.classList.remove('subtype-tab--active'));
        btn.classList.add('subtype-tab--active');
        activeSubtype = sub.id;
        renderProducts();
      });
      tabsBar.appendChild(btn);
    });

    gridEl.className = 'catalog__grid';
    renderProducts();

    function renderProducts() {
      const filtered = products.filter(p => p.categoryId === catId && p.subtype === activeSubtype);
      renderGrid(filtered);
    }

    window.addEventListener('hashchange', () => {
      const newHash = location.hash.slice(1);
      const sub = subcats.find(s => s.id === newHash);
      if (!sub) return;
      tabsBar.querySelectorAll('.subtype-tab').forEach(b => b.classList.remove('subtype-tab--active'));
      tabsBar.querySelector(`[data-subtype="${newHash}"]`)?.classList.add('subtype-tab--active');
      activeSubtype = newHash;
      renderProducts();
    });

    return;
  }

  // ── Звичайний каталог ───────────────────────────────────────────────
  let activeFilter = catId || 'all';

  if (filtersEl && !catId) {
    filtersEl.innerHTML = '';
    filtersEl.appendChild(createFilterBtn('all', 'Всі товари', true));
    CATEGORIES.filter(cat => products.some(p => p.categoryId === cat.id))
      .forEach(cat => filtersEl.appendChild(createFilterBtn(cat.id, cat.name, false)));
    filtersEl.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      renderCatalog();
    });
  }

  renderCatalog();

  function renderCatalog() {
    const filtered = featuredProducts || (activeFilter === 'all'
      ? products
      : products.filter(p => p.categoryId === activeFilter));
    renderGrid(filtered);
  }

  // ── Спільна функція рендеру сітки товарів ──────────────────────────
  function renderGrid(filtered) {
    renderProductGrid(gridEl, filtered, products);
  }
}

function createFilterBtn(filter, label, active) {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (active ? ' filter-btn--active' : '');
  btn.dataset.filter = filter;
  btn.textContent = label;
  return btn;
}

function productCardHTML(p) {
  const cat  = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === p.categoryId) : null;
  const catName = cat ? cat.name : '';
  const price = p.price ? `<span class="product-card__price">${formatPrice(p.price)}</span>` : '<span class="product-card__price">Ціна за запитом</span>';
  const badge = p.badge ? `<span class="product-card__badge">${p.badge}</span>` : '';

  return `
    <article class="product-card">
      <div class="product-card__img-wrap" data-name="${escHtml(p.name)}" role="button" tabindex="0" aria-label="Збільшити фото: ${escHtml(p.name)}">
        <img
          class="product-card__img"
          data-src="${escHtml(p.image)}"
          src=""
          alt="${escHtml(p.name)}"
          width="400"
          height="300"
          loading="lazy"
        />
        <div class="product-card__placeholder" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Фото<br>незабаром</span>
        </div>
        ${badge}
      </div>
      <div class="product-card__body">
        ${cat && cat.page
          ? `<a href="${escHtml(cat.page)}" class="product-card__cat">${escHtml(catName)}</a>`
          : `<p class="product-card__cat">${escHtml(catName)}</p>`
        }
        <h3 class="product-card__name">${escHtml(p.name)}</h3>
        ${p.desc ? `<p class="product-card__desc">${escHtml(p.desc)}</p>` : ''}
        <div class="product-card__footer">
          ${price}
          <button class="product-card__add" data-id="${p.id}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><span>В кошик</span></button>
        </div>
      </div>
    </article>
  `;
}

function formatPrice(price) {
  if (!price) return 'Ціна за запитом';
  const s = String(price).trim();
  // Не додаємо грн якщо вже є позначення валюти
  if (/грн|₴|\$|€/.test(s)) return s;
  return s + ' грн';
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   PRODUCT MODAL
   ============================================================ */
function initProductModal() {
  const modal   = document.getElementById('productModal');
  const closeBtn = document.getElementById('productModalClose');
  const backdrop = document.getElementById('productModalBackdrop');
  if (!modal) return;

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (!modal.hidden && e.key === 'Escape') close();
  });
}

function openProductModal(product) {
  const modal     = document.getElementById('productModal');
  const img       = document.getElementById('pmodalImg');
  const imgPh     = document.getElementById('pmodalImgPlaceholder');
  const catEl     = document.getElementById('pmodalCat');
  const titleEl   = document.getElementById('pmodalTitle');
  const descEl    = document.getElementById('pmodalDesc');
  const priceEl   = document.getElementById('pmodalPrice');
  if (!modal) return;

  const cat = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === product.categoryId) : null;

  if (catEl)   catEl.textContent   = cat ? cat.name : '';
  if (titleEl) titleEl.textContent = product.name;
  if (descEl)  descEl.textContent  = (product.details || product.desc || '');
  if (priceEl) priceEl.textContent = product.price ? formatPrice(product.price) : 'Ціна за запитом';

  if (img) {
    img.alt = product.name;
    img.src = '';
    imgPh && (imgPh.style.display = 'flex');

    if (product.image) {
      img.src = product.image;
      img.onload  = () => { imgPh && (imgPh.style.display = 'none'); };
      img.onerror = () => { img.style.display = 'none'; };
    } else {
      img.style.display = 'none';
    }
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('productModalClose')?.focus();
}

/* ============================================================
   HERO SLIDESHOW
   ============================================================ */
function startHeroSlideshow(products) {
  const img = document.querySelector('.hero__img');
  if (!img) return;

  const srcs = shuffleArray(products.filter(p => p.image).map(p => p.image));
  if (!srcs.length) return;

  const placeholder = document.querySelector('.hero__img-placeholder');
  if (placeholder) placeholder.style.display = 'none';

  let idx = 0;
  let timer = null;

  const switchTo = (src) => {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = src;
      img.onload  = () => { img.style.opacity = '1'; };
      img.onerror = () => { advance(); };
    }, 350);
  };

  const advance = () => {
    idx = (idx + 1) % srcs.length;
    switchTo(srcs[idx]);
  };

  switchTo(srcs[0]);
  timer = setInterval(advance, 4500);

  // Зупиняємо при наведенні на hero-зображення
  img.addEventListener('mouseenter', () => clearInterval(timer));
  img.addEventListener('mouseleave', () => { timer = setInterval(advance, 4500); });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lb         = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbCaption  = document.getElementById('lightboxCaption');
  const lbClose    = document.getElementById('lightboxClose');
  const lbBackdrop = document.getElementById('lightboxBackdrop');
  if (!lb) return;

  window.openLightbox = (src, caption = '') => {
    lbImg.src = src;
    lbImg.alt = caption;
    if (lbCaption) lbCaption.textContent = caption;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  };

  const closeLightbox = () => {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
  };

  lbClose?.addEventListener('click', closeLightbox);
  lbBackdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (!lb.hidden && e.key === 'Escape') closeLightbox();
  });
}
