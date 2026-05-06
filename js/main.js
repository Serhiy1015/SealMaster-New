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
      const hashId = location.hash.slice(1);

      // Визначаємо початкову групу і дочірній елемент з хешу
      let activeGroup = subcats[0];
      let activeChild = subcats[0].children[0]?.id;
      for (const group of subcats) {
        if (group.id === hashId) { activeGroup = group; activeChild = group.children[0]?.id; break; }
        const child = group.children?.find(c => c.id === hashId);
        if (child) { activeGroup = group; activeChild = hashId; break; }
      }

      const l1Label = document.createElement('div');
      l1Label.className = 'subtype-l1-label';
      gridEl.parentNode.insertBefore(l1Label, gridEl);

      const l2Bar = document.createElement('div');
      l2Bar.className = 'subtype-tabs subtype-tabs--l2';
      gridEl.parentNode.insertBefore(l2Bar, gridEl);

      const renderL1 = () => {
        l1Label.textContent = activeGroup.name;
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
            renderL2(); renderProducts();
          });
          l2Bar.appendChild(btn);
        });
      };

      gridEl.className = 'catalog__grid catalog__grid--list';
      renderL1(); renderL2(); renderProducts();

      function renderProducts() {
        const filtered = products.filter(p => p.categoryId === catId && p.subtype === activeChild);
        renderGrid(filtered);
      }

      window.addEventListener('hashchange', () => {
        const h = location.hash.slice(1);
        for (const group of subcats) {
          if (group.id === h) { activeGroup = group; activeChild = group.children[0]?.id; break; }
          const child = group.children?.find(c => c.id === h);
          if (child) { activeGroup = group; activeChild = h; break; }
        }
        renderL1(); renderL2(); renderProducts();
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

    gridEl.querySelectorAll('.product-card__add[data-id]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const product = products.find(p => p.id === parseInt(btn.dataset.id, 10));
        if (product && typeof cartAdd === 'function') cartAdd(product);
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
        ${p.desc ? `<p class="product-card__desc">${escHtml(p.desc)}</p>` : ''}
        <div class="product-card__footer">
          ${price}
          <button class="product-card__add" data-id="${p.id}">В кошик</button>
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
