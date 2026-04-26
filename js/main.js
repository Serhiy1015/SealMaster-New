/* ============================================================
   MAIN.JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  /* ---------- Load products once → category cards + catalog ---------- */
  loadProducts().then(products => {
    buildCategoryCards(products);
    buildCatalog(products);
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

  dropdownEl.innerHTML = CATEGORIES.map(cat => `
    <li class="nav__dropdown-item">
      <a href="${cat.page || '#'}" class="nav__dropdown-link${activeCat === cat.id ? ' nav__dropdown-link--active' : ''}">${escHtml(cat.name)}</a>
    </li>
  `).join('');

  // Підсвічуємо "Каталог" якщо ми на сторінці категорії
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
      // Якщо image — це просто Google Drive ID (без http), будуємо URL автоматично
      if (obj.image && !obj.image.startsWith('http')) {
        obj.image = `https://drive.google.com/thumbnail?id=${obj.image}&sz=w800`;
      }
      return obj;
    });
}

async function loadProducts() {
  const url = typeof SHEETS_CSV_URL !== 'undefined' ? SHEETS_CSV_URL : '';
  if (!url) return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];

  const CACHE_KEY = 'products_csv_v1';
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
   BUILD CATALOG
   ============================================================ */
async function buildCatalog(preloadedProducts) {
  const gridEl = document.getElementById('productGrid');
  if (!gridEl) return;

  const products    = preloadedProducts !== undefined ? preloadedProducts : await loadProducts();
  const catId       = typeof CATALOG_CATEGORY !== 'undefined' ? CATALOG_CATEGORY : null;
  const subcats     = (catId && typeof SUBCATEGORIES !== 'undefined') ? SUBCATEGORIES[catId] : null;
  const filtersEl   = document.getElementById('catalogFilters');
  const featuredProducts = !catId ? shuffleArray(products).slice(0, 8) : null;

  // ── Сторінка з підтипами (напр. kilcia.html) ───────────────────────
  if (subcats) {
    // Вставити рядок табів перед сіткою товарів
    const tabsBar = document.createElement('div');
    tabsBar.className = 'subtype-tabs';
    gridEl.parentNode.insertBefore(tabsBar, gridEl);

    let activeSubtype = subcats[0].id;

    subcats.forEach((sub, i) => {
      const btn = document.createElement('button');
      btn.className = 'subtype-tab' + (i === 0 ? ' subtype-tab--active' : '');
      btn.dataset.subtype = sub.id;
      btn.textContent = sub.name;
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
        const product = products.find(p => p.id === parseInt(btn.dataset.productId, 10));
        if (product) openProductModal(product);
      });
    });
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
        <p class="product-card__desc">${escHtml(p.desc)}</p>
        <div class="product-card__footer">
          ${price}
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
