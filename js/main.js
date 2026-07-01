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
    cta.innerHTML = '<a href="tel:+380685740961" class="btn btn--primary btn--lg" style="width:100%;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.18 6.18l.77-.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Зателефонувати</a>';
    footerInner.prepend(cta);
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Burger / mobile nav ---------- */
  initMobileNav();

  /* ---------- Search icon in nav ---------- */
  const navList = document.querySelector('.nav__list');
  if (navList) {
    const li = document.createElement('li');
    li.innerHTML = `<button class="nav__search-btn" aria-label="Пошук за розміром"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>`;
    navList.appendChild(li);
    li.querySelector('button').addEventListener('click', () => {
      const target = document.querySelector('.dim-filter') || document.querySelector('#dim-search');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        const center = top - window.innerHeight / 2 + target.offsetHeight / 2;
        window.scrollTo({ top: center, behavior: 'smooth' });
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
      if (heroImg.src && heroImg.src !== window.location.href) heroImg.style.display = 'none';
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

  startHeroSlideshow();

  /* ---------- Load products once → category cards + catalog + hero ---------- */
  loadProducts().then(products => {
    buildCategoryCards(products);
    buildCatalog(products);
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
   MOBILE NAV (акордеон, тільки ≤900px)
   ============================================================ */
function initMobileNav() {
  const burger = document.getElementById('burger');
  if (!burger || typeof CATEGORIES === 'undefined') return;

  const activeCat = typeof CATALOG_CATEGORY !== 'undefined' ? CATALOG_CATEGORY : null;

  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav';
  overlay.id = 'mobileNav';
  overlay.setAttribute('aria-hidden', 'true');

  const chevronSvg = (cls = '') =>
    `<svg class="mnav-chevron${cls ? ' ' + cls : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

  const catsHTML = CATEGORIES.map(cat => {
    const subs = (typeof SUBCATEGORIES !== 'undefined' && SUBCATEGORIES[cat.id]) || null;
    const isTwoLevel = subs && subs[0] && subs[0].children;
    const isActive = activeCat === cat.id;

    if (!subs || !subs.length) {
      return `<li class="mnav-cat${isActive ? ' mnav-cat--active' : ''}">
        <a href="${cat.page}" class="mnav-cat__link">${escHtml(cat.name)}</a>
      </li>`;
    }

    const subsHTML = (isTwoLevel ? subs : subs).map(sub =>
      `<li><a href="${cat.page}#${sub.id}" class="mnav-sub__link">${escHtml(sub.name)}</a></li>`
    ).join('');

    return `<li class="mnav-cat mnav-cat--has-sub${isActive ? ' mnav-cat--active open' : ''}">
      <div class="mnav-cat__row">
        <a href="${cat.page}" class="mnav-cat__link">${escHtml(cat.name)}</a>
        <button class="mnav-cat__toggle" aria-label="Розкрити">${chevronSvg()}</button>
      </div>
      <ul class="mnav-subs">${subsHTML}</ul>
    </li>`;
  }).join('');

  const catalogOpen = !!activeCat;
  overlay.innerHTML = `<ul class="mnav-list">
    <li class="mnav-section${catalogOpen ? ' open' : ''}">
      <button class="mnav-section__btn" aria-expanded="${catalogOpen}">
        <span>Каталог</span>${chevronSvg()}
      </button>
      <ul class="mnav-cats">${catsHTML}</ul>
    </li>
    <li><a href="#delivery" class="mnav-link">Доставка</a></li>
    <li><a href="#contacts" class="mnav-link">Контакти</a></li>
    <li><a href="blog.html" class="mnav-link">Статті</a></li>
  </ul>`;

  document.body.appendChild(overlay);

  const sectionBtn = overlay.querySelector('.mnav-section__btn');
  const sectionLi  = overlay.querySelector('.mnav-section');
  sectionBtn.addEventListener('click', () => {
    const open = sectionLi.classList.toggle('open');
    sectionBtn.setAttribute('aria-expanded', open);
  });

  overlay.querySelectorAll('.mnav-cat__toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.closest('.mnav-cat--has-sub').classList.toggle('open');
    });
  });

  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  burger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = overlay.classList.toggle('open');
    overlay.setAttribute('aria-hidden', !isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('click', e => {
    if (overlay.classList.contains('open') && !overlay.contains(e.target) && !burger.contains(e.target)) {
      close();
    }
  });
}

/* ============================================================
   CATEGORY CARDS (головна сторінка)
   ============================================================ */
function buildCategoryCards(products = []) {
  const gridEl = document.getElementById('categoryGrid');
  if (!gridEl || typeof CATEGORIES === 'undefined') return;

  gridEl.innerHTML = CATEGORIES.map(cat => {
    let img = cat.image || '';
    if (!img && typeof SUBCATEGORIES !== 'undefined') {
      const subs = SUBCATEGORIES[cat.id] || [];
      for (const sub of subs) {
        if (sub.image) { img = sub.image.trim(); break; }
        if (sub.children) {
          const child = sub.children.find(c => c.image);
          if (child) { img = child.image.trim(); break; }
        }
      }
    }
    if (!img) img = (products.find(p => p.categoryId === cat.id && p.image) || {}).image || '';
    return `
      <a href="${cat.page || '#'}" class="cat-card">
        <div class="cat-card__preview">
          ${img ? `<img class="cat-card__img" src="${escHtml(img)}" alt="${escHtml(cat.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />` : ''}
          <div class="cat-card__icon" style="${img ? 'display:none' : 'display:flex'}">${CAT_ICONS[cat.id] || ''}</div>
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
      if (obj.name) obj.name = obj.name.replace(/\bMM\b/g, 'мм');
      if (obj.image && !obj.image.startsWith('http')) {
        obj.image = `https://drive.google.com/thumbnail?id=${obj.image}&sz=w800`;
      }
      return obj;
    });
}

async function loadProducts() {
  const url = typeof SHEETS_CSV_URL !== 'undefined' ? SHEETS_CSV_URL : '';
  if (!url) return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];

  const CACHE_KEY = 'products_csv_v3';
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 години

  // Спробуємо взяти з localStorage
  try {
    const cached = localStorage.getItem(CACHE_KEY);
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
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), text })); } catch (e) {}
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

function parseRingDims(name) {
  // Matches names like "10×2.5 NBR" — exactly 2 dimensions, no 3rd
  if (/(\d+(?:[.,]\d+)?)\s*[*×xX]\s*(\d+(?:[.,]\d+)?)\s*[*×xX]/.test(name)) return null;
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*[*×xX]\s*(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return {
    d: parseFloat(m[1].replace(',', '.')),
    s: parseFloat(m[2].replace(',', '.')),
  };
}

function parseCordSection(name) {
  // Шнури: перше число в назві — це січення (наприклад "4 NBR", "5.5 EPDM")
  const m = name.match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1].replace(',', '.'));
}

/* Build flat map: subtypeId → image from SUBCATEGORIES */
function buildSubcatImageMap() {
  const map = {};
  if (typeof CATEGORIES !== 'undefined') {
    for (const cat of CATEGORIES) {
      if (cat.image) map[cat.id] = cat.image;
    }
  }
  if (typeof SUBCATEGORIES === 'undefined') return map;
  for (const groups of Object.values(SUBCATEGORIES)) {
    for (const group of groups) {
      if (group.image) map[group.id] = group.image;
      if (group.children) {
        for (const child of group.children) {
          if (child.image) map[child.id] = child.image;
          else if (group.image) map[child.id] = group.image;
        }
      }
    }
  }
  return map;
}

function sortByInnerD(arr) {
  return [...arr].sort((a, b) => {
    const d = n => { const m = String(n.name).match(/\d+[,.]?\d*/); return m ? parseFloat(m[0].replace(',', '.')) : Infinity; };
    return d(a) - d(b);
  });
}

function renderSearchRows(listEl, filtered, allProducts, dims = {}) {
  filtered = sortByInnerD(filtered);
  listEl.innerHTML = '';
  listEl.className = 'search-rows';

  const imgMap = buildSubcatImageMap();

  const qs = (() => {
    const p = new URLSearchParams();
    if (!isNaN(dims.d)) p.set('d', dims.d);
    if (!isNaN(dims.D)) p.set('D', dims.D);
    if (!isNaN(dims.h)) p.set('h', dims.h);
    if (!isNaN(dims.s)) p.set('s', dims.s);
    const s = p.toString();
    return s ? '?' + s : '';
  })();

  filtered.forEach(p => {
    const subImg = imgMap[p.subtype] || imgMap[p.categoryId] || '';
    const cat = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === p.categoryId) : null;
    const catName = cat ? cat.name : '';
    const priceRaw = (p.price && p.categoryId !== 'kilcia') ? p.price : null;
    const price = priceRaw ? `<span class="search-row__price">${formatPrice(priceRaw)}</span>` : '<span class="search-row__price search-row__price--ask">Ціна за запитом</span>';

    const href = `product.html?id=${p.id}`;

    const row = document.createElement('a');
    row.className = 'search-row';
    row.href = href;
    row.innerHTML = `
      ${subImg
        ? `<img class="search-row__img" src="${escHtml(subImg)}" alt="${escHtml(p.name)}" loading="lazy">`
        : `<div class="search-row__img-ph"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
      }
      <div class="search-row__body">
        <span class="search-row__cat">${escHtml(catName)}</span>
        <span class="search-row__name">${escHtml(p.name)}</span>
      </div>
      <div class="search-row__end">
        ${price}
        <button class="product-card__add search-row__add" data-id="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span>В кошик</span>
        </button>
      </div>`;

    listEl.appendChild(row);
  });

  listEl.querySelectorAll('.search-row__add[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
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

function renderProductGrid(gridEl, filtered, allProducts, noImage = false) {
  const subcatImgMap = buildSubcatImageMap();
  filtered = sortByInnerD(filtered);
  if (!filtered.length) {
    gridEl.innerHTML = '<p class="catalog__loading">Товарів не знайдено.</p>';
    return;
  }

  gridEl.innerHTML = filtered.map(p => productCardHTML(p, noImage, subcatImgMap)).join('');

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

  gridEl.querySelectorAll('.product-card[data-href]').forEach(card => {
    card.addEventListener('click', e => {
      if (!e.target.closest('button, input')) window.location.href = card.dataset.href;
    });
  });

  gridEl.querySelectorAll('.product-card__qty-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const valEl = btn.closest('.product-card__qty-wrap')?.querySelector('.product-card__qty-val');
      if (!valEl) return;
      const cur = parseInt(valEl.value, 10) || 1;
      valEl.value = btn.dataset.action === 'inc' ? cur + 1 : Math.max(1, cur - 1);
    });
  });

  gridEl.querySelectorAll('.product-card__qty-val').forEach(input => {
    input.addEventListener('input', e => { e.stopPropagation(); });
    input.addEventListener('blur', () => {
      input.value = Math.max(1, parseInt(input.value, 10) || 1);
    });
    input.addEventListener('click', e => e.stopPropagation());
  });

  gridEl.querySelectorAll('.product-card__add[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(btn.dataset.id, 10);
      if (btn.classList.contains('product-card__add--done')) {
        if (typeof cartRemove === 'function') cartRemove(id);
      } else {
        const product = allProducts.find(p => p.id === id);
        if (product && typeof cartAdd === 'function') {
          const qtyEl = btn.closest('.product-card__footer')?.querySelector('.product-card__qty-val');
          const qty = qtyEl ? (Math.max(1, parseInt(qtyEl.value, 10) || 1)) : 1;
          cartAdd(product, qty);
        }
      }
    });
  });

  if (typeof cartUpdateButtons === 'function') cartUpdateButtons();
}

/* ============================================================
   HOME DIM SEARCH
   ============================================================ */
function initHomeDimSearch(allProducts) {
  initSealSearch(allProducts);
  initRingSearch(allProducts);
}

function initSealSearch(allProducts) {
  const filterEl = document.getElementById('homeDimFilterSeal');
  const gridEl   = document.getElementById('homeDimGridSeal');
  const hintEl   = document.getElementById('homeDimHintSeal');
  if (!filterEl || !gridEl) return;

  filterEl.innerHTML = `
    <div class="dim-filter__left"><span class="dim-filter__title">Розмір</span></div>
    <div class="dim-filter__pills">
      <label class="dim-pill">
        <span class="dim-pill__key">d</span>
        <span class="dim-pill__name">внутр</span>
        <input class="dim-pill__input" id="sDimFd" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
      <label class="dim-pill">
        <span class="dim-pill__key">D</span>
        <span class="dim-pill__name">зовн</span>
        <input class="dim-pill__input" id="sDimFD" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
      <label class="dim-pill">
        <span class="dim-pill__key">h</span>
        <span class="dim-pill__name">висота</span>
        <input class="dim-pill__input" id="sDimFh" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
    </div>
    <div class="dim-filter__count">
      <span class="dim-filter__count-label">Знайдено</span>
      <span class="dim-filter__count-num" id="sDimCount">—</span>
    </div>
    <button class="dim-filter__reset" id="sDimReset" title="Скинути">✕</button>`;

  const run = () => {
    const d = parseFloat(document.getElementById('sDimFd').value);
    const D = parseFloat(document.getElementById('sDimFD').value);
    const h = parseFloat(document.getElementById('sDimFh').value);
    const countEl = document.getElementById('sDimCount');

    filterEl.querySelectorAll('.dim-pill__input').forEach(inp =>
      inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== ''));

    if (isNaN(d) && isNaN(D) && isNaN(h)) {
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
      gridEl.innerHTML = '<p class="catalog__loading">Нічого не знайдено. <a href="tel:+380685740961">Зателефонуйте нам</a> — підберемо індивідуально.</p>';
      return;
    }
    renderSearchRows(gridEl, filtered, allProducts, {d, D, h});
  };

  const reset = () => {
    filterEl.querySelectorAll('.dim-pill__input').forEach(inp => inp.value = '');
    run();
  };

  filterEl.addEventListener('input', run);
  document.getElementById('sDimReset')?.addEventListener('click', reset);
}

function initRingSearch(allProducts) {
  const filterEl = document.getElementById('homeDimFilterRing');
  const gridEl   = document.getElementById('homeDimGridRing');
  const hintEl   = document.getElementById('homeDimHintRing');
  if (!filterEl || !gridEl) return;

  filterEl.innerHTML = `
    <div class="dim-filter__left"><span class="dim-filter__title">Розмір</span></div>
    <div class="dim-filter__pills">
      <label class="dim-pill">
        <span class="dim-pill__key">d</span>
        <span class="dim-pill__name">внутр. діам</span>
        <input class="dim-pill__input" id="rDimFd" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
      <label class="dim-pill">
        <span class="dim-pill__key">s</span>
        <span class="dim-pill__name">січення</span>
        <input class="dim-pill__input" id="rDimFs" type="number" min="0" step="0.1" placeholder="—">
        <span class="dim-pill__unit">мм</span>
      </label>
    </div>
    <div class="dim-filter__count">
      <span class="dim-filter__count-label">Знайдено</span>
      <span class="dim-filter__count-num" id="rDimCount">—</span>
    </div>
    <button class="dim-filter__reset" id="rDimReset" title="Скинути">✕</button>`;

  const run = () => {
    const d = parseFloat(document.getElementById('rDimFd').value);
    const s = parseFloat(document.getElementById('rDimFs').value);
    const countEl = document.getElementById('rDimCount');

    filterEl.querySelectorAll('.dim-pill__input').forEach(inp =>
      inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== ''));

    if (isNaN(d) && isNaN(s)) {
      gridEl.hidden = true;
      if (hintEl) hintEl.hidden = false;
      if (countEl) countEl.textContent = '—';
      return;
    }

    const filtered = allProducts.filter(p => {
      if (p.categoryId !== 'kilcia') return false;
      const dims = parseRingDims(p.name);
      if (!dims) return false;
      if (!isNaN(d) && dims.d !== d) return false;
      if (!isNaN(s) && dims.s !== s) return false;
      return true;
    });

    if (countEl) countEl.textContent = filtered.length;
    if (hintEl) hintEl.hidden = true;
    gridEl.hidden = false;
    if (!filtered.length) {
      gridEl.innerHTML = '<p class="catalog__loading">Нічого не знайдено. <a href="tel:+380685740961">Зателефонуйте нам</a> — підберемо індивідуально.</p>';
      return;
    }
    renderSearchRows(gridEl, filtered, allProducts, {d, s});
  };

  const reset = () => {
    filterEl.querySelectorAll('.dim-pill__input').forEach(inp => inp.value = '');
    run();
  };

  filterEl.addEventListener('input', run);
  document.getElementById('rDimReset')?.addEventListener('click', reset);
}

function applyUrlDims(mapping) {
  const params = new URLSearchParams(window.location.search);
  let any = false;
  for (const [key, id] of Object.entries(mapping)) {
    const val = params.get(key);
    if (val) { const el = document.getElementById(id); if (el) { el.value = val; any = true; } }
  }
  return any;
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
  const _subcatImgMap = buildSubcatImageMap();
  const _withImg = p => ({ ...p, image: p.image || _subcatImgMap[p.subtype] || _subcatImgMap[p.categoryId] || '' });
  const featuredCategories = !catId ? buildFeaturedCategories() : null;

  // ── Сторінка з підтипами ───────────────────────────────────────────
  if (subcats) {
    const isTwoLevel = subcats[0] && subcats[0].children;

    if (isTwoLevel) {
      // ── Два яруси (наприклад gidro.html) ──────────────────────────
      let activeGroup = null;
      let activeChild = null;

      // Знаходимо h1 і вбудовуємо його у flex-обгортку разом з фото
      const containerEl = gridEl.closest('.container');
      const pageTitleEl = containerEl?.querySelector('.catalog-page__title');

      const pageHeroEl = document.createElement('div');
      pageHeroEl.className = 'page-hero';

      const pageHeroTextEl = document.createElement('div');
      pageHeroTextEl.className = 'page-hero__text';

      const l1Label = document.createElement('div');
      l1Label.className = 'subtype-l1-label';
      l1Label.hidden = true;

      const bannerWrapEl = document.createElement('div');
      bannerWrapEl.className = 'page-hero__banner';
      bannerWrapEl.hidden = true;

      const bannerEl = document.createElement('img');
      bannerEl.className = 'subcat-banner';
      bannerEl.alt = '';
      bannerEl.style.cursor = 'zoom-in';
      bannerEl.addEventListener('click', () => { if (bannerEl.src) window.openLightbox(bannerEl.src, bannerEl.alt); });
      bannerWrapEl.appendChild(bannerEl);

      pageHeroTextEl.appendChild(l1Label);
      pageHeroEl.appendChild(pageHeroTextEl);

      if (pageTitleEl) {
        pageTitleEl.parentNode.insertBefore(pageHeroEl, pageTitleEl);
        pageHeroTextEl.insertBefore(pageTitleEl, l1Label);
      } else {
        gridEl.parentNode.insertBefore(pageHeroEl, gridEl);
      }

      const l2Bar = document.createElement('div');
      l2Bar.className = 'subtype-tabs subtype-tabs--l2';
      pageHeroTextEl.appendChild(l2Bar);
      pageHeroTextEl.insertBefore(bannerWrapEl, l2Bar);

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
        <button class="dim-filter__reset" id="dimReset" title="Скинути">✕</button>`;
      pageHeroTextEl.appendChild(filterEl);

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
      applyUrlDims({d: 'dimFd', D: 'dimFD', h: 'dimFh'});

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
        bannerWrapEl.hidden = true;
        l2Bar.hidden = true;
        resultsBarEl.hidden = true;
        filterEl.hidden = true;
        resetDimFilter();
        const l1Sep = document.getElementById('breadcrumbL1Sep');
        const l1Bc  = document.getElementById('breadcrumbL1');
        if (l1Sep) l1Sep.hidden = true;
        if (l1Bc)  l1Bc.textContent = '';
        bannerWrapEl.hidden = true;
        gridEl.className = 'catalog__grid catalog__grid--l1groups';
        gridEl.innerHTML = subcats.map(group => {
          const img = group.image || (group.children || []).find(c => c.image)?.image || '';
          return `
          <a href="#${group.id}" class="l1-group-card">
            ${img ? `<img class="l1-group-card__img" src="${escHtml(img)}" alt="${escHtml(group.name)}" loading="lazy">` : ''}
            <span class="l1-group-card__name">${escHtml(group.name)}</span>
          </a>`;
        }).join('');
      };

      const updateBanner = () => {
        const child = (activeGroup.children || []).find(c => c.id === activeChild);
        const img = ((child && child.image) || activeGroup.image || '').trim();
        if (img) { bannerEl.src = img; bannerWrapEl.hidden = false; }
        else      { bannerWrapEl.hidden = true; }
      };

      const showGroup = () => {
        l1Label.hidden = false;
        l2Bar.hidden = false;
        filterEl.hidden = false;
        resultsBarEl.hidden = false;
        l1Label.textContent = activeGroup.name;
        const l1Sep = document.getElementById('breadcrumbL1Sep');
        const l1Bc  = document.getElementById('breadcrumbL1');
        if (l1Sep) l1Sep.hidden = false;
        if (l1Bc)  l1Bc.textContent = activeGroup.name;
        gridEl.className = 'catalog__grid catalog__grid--list';
        updateBanner();
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
            btn.blur();
            activeChild = child.id;
            resetDimFilter();
            updateBanner();
            renderL2(); renderProducts();
          });
          l2Bar.appendChild(btn);
        });
      };

      const resultsBarEl = document.createElement('div');
      resultsBarEl.className = 'results-bar';
      resultsBarEl.hidden = true;
      pageHeroTextEl.appendChild(resultsBarEl);

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
        ['dimFd', 'dimFD', 'dimFh'].forEach(id => {
          const inp = document.getElementById(id);
          if (inp) inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== '');
        });
        resultsBarEl.innerHTML = `<span class="results-bar__num">${filtered.length}</span><span class="results-bar__label">${hasFilter ? 'знайдено' : 'позицій'}</span>`;
        renderProductGrid(gridEl, filtered, products, true);
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

    // ── Один ярус (наприклад kilcia.html, pnevmo.html) ─────────────
    const containerEl1   = gridEl.closest('.container');
    const pageTitleEl1   = containerEl1?.querySelector('.catalog-page__title');

    const pageHeroEl1    = document.createElement('div');
    pageHeroEl1.className = 'page-hero';

    const pageHeroTextEl1 = document.createElement('div');
    pageHeroTextEl1.className = 'page-hero__text';

    const bannerWrapEl1 = document.createElement('div');
    bannerWrapEl1.className = 'page-hero__banner';
    bannerWrapEl1.hidden = true;

    const bannerEl1 = document.createElement('img');
    bannerEl1.className = 'subcat-banner';
    bannerEl1.alt = '';
    bannerEl1.style.cursor = 'zoom-in';
    bannerEl1.addEventListener('click', () => { if (bannerEl1.src) window.openLightbox(bannerEl1.src, bannerEl1.alt); });
    bannerWrapEl1.appendChild(bannerEl1);

    pageHeroEl1.appendChild(pageHeroTextEl1);

    if (pageTitleEl1) {
      pageTitleEl1.parentNode.insertBefore(pageHeroEl1, pageTitleEl1);
      pageHeroTextEl1.appendChild(pageTitleEl1);
    } else {
      gridEl.parentNode.insertBefore(pageHeroEl1, gridEl);
    }

    const catObj1 = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === catId) : null;
    if (catObj1 && catObj1.desc) {
      const descEl = document.createElement('p');
      descEl.className = 'catalog-page__desc';
      descEl.textContent = catObj1.desc;
      pageHeroTextEl1.appendChild(descEl);
    }

    const tabsBar = document.createElement('div');
    tabsBar.className = 'subtype-tabs subtype-tabs--l2';
    pageHeroTextEl1.appendChild(tabsBar);
    pageHeroTextEl1.insertBefore(bannerWrapEl1, tabsBar);

    const hashId = location.hash.slice(1);
    let activeSubtype = subcats.find(s => s.id === hashId) ? hashId : subcats[0].id;

    const updateBanner1 = (sub) => {
      if (sub && sub.image) {
        bannerEl1.src = sub.image;
        bannerWrapEl1.hidden = false;
      } else {
        bannerWrapEl1.hidden = true;
      }
    };

    subcats.forEach(sub => {
      const btn = document.createElement('button');
      btn.className = 'subtype-tab' + (sub.id === activeSubtype ? ' subtype-tab--active' : '');
      btn.dataset.subtype = sub.id;
      btn.textContent = sub.short || sub.name;
      btn.addEventListener('click', () => {
        btn.blur();
        tabsBar.querySelectorAll('.subtype-tab').forEach(b => b.classList.remove('subtype-tab--active'));
        btn.classList.add('subtype-tab--active');
        activeSubtype = sub.id;
        resetSubFilter();
        updateSubFilterUI();
        updateBanner1(sub);
        renderProducts();
      });
      tabsBar.appendChild(btn);
    });

    const dimFilterEl = document.createElement('div');
    dimFilterEl.className = 'dim-filter';
    const noFilter = ['remkomplekty', 'komplektuiuchi'].includes(catId);
    if (!noFilter) pageHeroTextEl1.appendChild(dimFilterEl);

    const isKilcia = catId === 'kilcia';
    const isCords  = () => activeSubtype === 'shnury';

    const buildFilterHTML = () => {
      if (isKilcia) {
        return `
          <div class="dim-filter__left"><span class="dim-filter__title">Розмір</span></div>
          <div class="dim-filter__pills">
            <label class="dim-pill">
              <span class="dim-pill__key">d</span>
              <span class="dim-pill__name">внутр. діам</span>
              <input class="dim-pill__input" id="ringFd" type="number" min="0" step="0.1" placeholder="—">
              <span class="dim-pill__unit">мм</span>
            </label>
            <label class="dim-pill">
              <span class="dim-pill__key">s</span>
              <span class="dim-pill__name">січення</span>
              <input class="dim-pill__input" id="ringFs" type="number" min="0" step="0.1" placeholder="—">
              <span class="dim-pill__unit">мм</span>
            </label>
          </div>
          <button class="dim-filter__reset" id="subDimReset" title="Скинути">✕</button>`;
      }
      return `
        <div class="dim-filter__left"><span class="dim-filter__title">Розмір</span></div>
        <div class="dim-filter__pills">
          <label class="dim-pill">
            <span class="dim-pill__key">d</span>
            <span class="dim-pill__name">внутр</span>
            <input class="dim-pill__input" id="subFd" type="number" min="0" step="0.1" placeholder="—">
            <span class="dim-pill__unit">мм</span>
          </label>
          <label class="dim-pill">
            <span class="dim-pill__key">D</span>
            <span class="dim-pill__name">зовн</span>
            <input class="dim-pill__input" id="subFD" type="number" min="0" step="0.1" placeholder="—">
            <span class="dim-pill__unit">мм</span>
          </label>
          <label class="dim-pill">
            <span class="dim-pill__key">h</span>
            <span class="dim-pill__name">висота</span>
            <input class="dim-pill__input" id="subFh" type="number" min="0" step="0.1" placeholder="—">
            <span class="dim-pill__unit">мм</span>
          </label>
        </div>
        <button class="dim-filter__reset" id="subDimReset" title="Скинути">✕</button>`;
    };

    dimFilterEl.innerHTML = buildFilterHTML();

    const updateSubFilterUI = () => {
      if (isKilcia) {
        const dPill = document.getElementById('ringFd')?.closest('.dim-pill');
        if (dPill) dPill.hidden = isCords();
      }
    };

    const resetSubFilter = () => {
      dimFilterEl.querySelectorAll('.dim-pill__input').forEach(inp => inp.value = '');
      dimFilterEl.querySelectorAll('.dim-pill').forEach(p => p.classList.remove('dim-pill--active'));
      const countEl = document.getElementById('subDimCount');
      if (countEl) countEl.textContent = '—';
    };

    const resultsBarEl = document.createElement('div');
    resultsBarEl.className = 'results-bar';
    pageHeroTextEl1.appendChild(resultsBarEl);

    gridEl.className = 'catalog__grid catalog__grid--list';
    updateBanner1(subcats.find(s => s.id === activeSubtype));
    updateSubFilterUI();
    if (isKilcia) applyUrlDims({d: 'ringFd', s: 'ringFs'});
    else applyUrlDims({d: 'subFd', D: 'subFD', h: 'subFh'});
    renderProducts();

    function renderProducts() {
      dimFilterEl.querySelectorAll('.dim-pill__input').forEach(inp =>
        inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== ''));

      let filtered = products.filter(p => p.categoryId === catId && p.subtype === activeSubtype);
      let hasFilter = false;

      if (isKilcia) {
        const d = parseFloat(document.getElementById('ringFd')?.value);
        const s = parseFloat(document.getElementById('ringFs')?.value);
        hasFilter = isCords() ? !isNaN(s) : (!isNaN(d) || !isNaN(s));
        if (hasFilter) {
          filtered = filtered.filter(p => {
            if (isCords()) {
              const sec = parseCordSection(p.name);
              return sec !== null && !isNaN(s) && sec === s;
            }
            const dims = parseRingDims(p.name);
            if (!dims) return false;
            if (!isNaN(d) && dims.d !== d) return false;
            if (!isNaN(s) && dims.s !== s) return false;
            return true;
          });
        }
      } else {
        const d = parseFloat(document.getElementById('subFd')?.value);
        const D = parseFloat(document.getElementById('subFD')?.value);
        const h = parseFloat(document.getElementById('subFh')?.value);
        hasFilter = !isNaN(d) || !isNaN(D) || !isNaN(h);
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
      }

      resultsBarEl.innerHTML = `<span class="results-bar__num">${filtered.length}</span><span class="results-bar__label">${hasFilter ? 'знайдено' : 'позицій'}</span>`;

      renderProductGrid(gridEl, filtered, products, true);
    }

    dimFilterEl.addEventListener('input', renderProducts);
    document.getElementById('subDimReset')?.addEventListener('click', () => { resetSubFilter(); renderProducts(); });

    window.addEventListener('hashchange', () => {
      const newHash = location.hash.slice(1);
      const sub = subcats.find(s => s.id === newHash);
      if (!sub) return;
      tabsBar.querySelectorAll('.subtype-tab').forEach(b => b.classList.remove('subtype-tab--active'));
      tabsBar.querySelector(`[data-subtype="${newHash}"]`)?.classList.add('subtype-tab--active');
      activeSubtype = newHash;
      resetSubFilter();
      updateSubFilterUI();
      updateBanner1(sub);
      renderProducts();
    });

    return;
  }

  // ── Категорія без підкатегорій (список + dim-filter d×D×h) ──────────
  if (catId) {
    gridEl.className = 'catalog__grid catalog__grid--list';

    const catObj = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === catId) : null;
    const catImg = catObj && catObj.image;

    // page-hero з фото (якщо є)
    const containerElCat  = gridEl.closest('.container');
    const pageTitleElCat  = containerElCat?.querySelector('.catalog-page__title');
    const pageHeroElCat   = document.createElement('div');
    pageHeroElCat.className = 'page-hero page-hero--simple';
    const pageHeroTextElCat = document.createElement('div');
    pageHeroTextElCat.className = 'page-hero__text';

    if (catImg) {
      const bannerWrapCat = document.createElement('div');
      bannerWrapCat.className = 'page-hero__banner';
      const bannerImgCat = document.createElement('img');
      bannerImgCat.className = 'subcat-banner';
      bannerImgCat.src = catImg;
      bannerImgCat.alt = catObj.name || '';
      bannerImgCat.style.cursor = 'zoom-in';
      bannerImgCat.addEventListener('click', () => window.openLightbox(catImg, bannerImgCat.alt));
      bannerWrapCat.appendChild(bannerImgCat);
      pageHeroElCat.appendChild(pageHeroTextElCat);
      pageHeroTextElCat.appendChild(bannerWrapCat);
    } else {
      pageHeroElCat.appendChild(pageHeroTextElCat);
    }

    if (pageTitleElCat) {
      pageTitleElCat.parentNode.insertBefore(pageHeroElCat, pageTitleElCat);
      pageHeroTextElCat.appendChild(pageTitleElCat);
    } else {
      gridEl.parentNode.insertBefore(pageHeroElCat, gridEl);
    }

    const dimFilterEl = document.createElement('div');
    dimFilterEl.className = 'dim-filter';
    dimFilterEl.innerHTML = `
      <div class="dim-filter__left"><span class="dim-filter__title">Розмір</span></div>
      <div class="dim-filter__pills">
        <label class="dim-pill">
          <span class="dim-pill__key">d</span>
          <span class="dim-pill__name">внутр</span>
          <input class="dim-pill__input" id="catFd" type="number" min="0" step="0.1" placeholder="—">
          <span class="dim-pill__unit">мм</span>
        </label>
        <label class="dim-pill">
          <span class="dim-pill__key">D</span>
          <span class="dim-pill__name">зовн</span>
          <input class="dim-pill__input" id="catFD" type="number" min="0" step="0.1" placeholder="—">
          <span class="dim-pill__unit">мм</span>
        </label>
        <label class="dim-pill">
          <span class="dim-pill__key">h</span>
          <span class="dim-pill__name">висота</span>
          <input class="dim-pill__input" id="catFh" type="number" min="0" step="0.1" placeholder="—">
          <span class="dim-pill__unit">мм</span>
        </label>
      </div>
      <button class="dim-filter__reset" id="catDimReset" title="Скинути">✕</button>`;
    pageHeroTextElCat.appendChild(dimFilterEl);

    const catResultsBar = document.createElement('div');
    catResultsBar.className = 'results-bar';
    pageHeroTextElCat.appendChild(catResultsBar);

    const getCatDims = () => ({
      d: parseFloat(document.getElementById('catFd').value),
      D: parseFloat(document.getElementById('catFD').value),
      h: parseFloat(document.getElementById('catFh').value),
    });

    const resetCatFilter = () => {
      ['catFd','catFD','catFh'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      dimFilterEl.querySelectorAll('.dim-pill').forEach(p => p.classList.remove('dim-pill--active'));
      document.getElementById('catDimCount').textContent = '—';
    };

    const renderCatProducts = () => {
      const { d, D, h } = getCatDims();
      const hasDim = !isNaN(d) || !isNaN(D) || !isNaN(h);

      dimFilterEl.querySelectorAll('.dim-pill__input').forEach(inp =>
        inp.closest('.dim-pill')?.classList.toggle('dim-pill--active', inp.value !== ''));

      let filtered = products.filter(p => p.categoryId === catId);

      if (hasDim) {
        filtered = filtered.filter(p => {
          const dims = parseDims(p.name);
          if (!dims) return false;
          if (!isNaN(d) && dims.d !== d) return false;
          if (!isNaN(D) && dims.D !== D) return false;
          if (!isNaN(h) && dims.h !== h) return false;
          return true;
        });
      }

      catResultsBar.innerHTML = `<span class="results-bar__num">${filtered.length}</span><span class="results-bar__label">${hasDim ? 'знайдено' : 'позицій'}</span>`;

      renderProductGrid(gridEl, filtered, products, true);
    };

    dimFilterEl.addEventListener('input', renderCatProducts);
    document.getElementById('catDimReset')?.addEventListener('click', () => { resetCatFilter(); renderCatProducts(); });

    applyUrlDims({d: 'catFd', D: 'catFD', h: 'catFh'});
    renderCatProducts();
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
    if (featuredCategories) {
      gridEl.innerHTML = featuredCategories.map(catCardHTML).join('');
      gridEl.querySelectorAll('.cat-card__img[data-src]').forEach(img => {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.src = el.dataset.src;
            el.addEventListener('load', () => {
              el.classList.add('loaded');
              const ph = el.closest('.cat-card__img-wrap')?.querySelector('.product-card__placeholder');
              if (ph) ph.style.display = 'none';
            }, { once: true });
            el.addEventListener('error', () => { el.style.display = 'none'; }, { once: true });
            obs.unobserve(el);
          });
        }, { rootMargin: '200px' });
        observer.observe(img);
      });
      return;
    }
    const filtered = activeFilter === 'all'
      ? products
      : products.filter(p => p.categoryId === activeFilter);
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

function productCardHTML(p, noImage = false, imgMap = {}) {
  const cat  = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === p.categoryId) : null;
  const catName = cat ? cat.name : '';
  const priceVal = (p.price && p.categoryId !== 'kilcia') ? p.price : null;
  const price = priceVal ? `<span class="product-card__price" data-unit-price="${escHtml(priceVal)}">${formatPrice(priceVal)}</span>` : '<span class="product-card__price product-card__price--ask">Ціна за запитом</span>';
  const badge = p.badge ? `<span class="product-card__badge">${p.badge}</span>` : '';
  const productUrl = `product.html?id=${p.id}`;

  const imgHtml = noImage ? '' : `
      <div class="product-card__img-wrap">
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
      </div>`;

  const hrefAttr = productUrl ? ` data-href="${escHtml(productUrl)}"` : '';

  return `
    <div class="product-card"${hrefAttr}>
      ${imgHtml}
      <div class="product-card__body">
        <p class="product-card__cat">${escHtml(catName)}</p>
        ${(()=>{ const t = imgMap[p.subtype] || imgMap[p.categoryId] || p.image || ''; return t ? `<div class="product-card__thumb"><img src="${escHtml(t)}" alt="${escHtml(p.name)}" loading="lazy"></div>` : '<div class="product-card__thumb product-card__thumb--empty"></div>'; })()}
        <h3 class="product-card__name">${escHtml(p.name)}</h3>
        ${p.desc ? `<p class="product-card__desc">${escHtml(p.desc)}</p>` : ''}
        <span class="product-card__leader" aria-hidden="true"></span>
        ${price}
        <div class="product-card__footer">
          <div class="product-card__qty-wrap">
            <button class="product-card__qty-btn" data-action="dec" data-id="${p.id}" type="button">−</button>
            <input type="number" class="product-card__qty-val" value="1" min="1">
            <button class="product-card__qty-btn" data-action="inc" data-id="${p.id}" type="button">+</button>
          </div>
          <button class="product-card__add" data-id="${p.id}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><span>В кошик</span></button>
        </div>
      </div>
    </div>
  `;
}

function buildFeaturedCategories() {
  if (typeof CATEGORIES === 'undefined' || typeof SUBCATEGORIES === 'undefined') return [];
  const entries = [];
  CATEGORIES.forEach(cat => {
    const subs = SUBCATEGORIES[cat.id];
    if (!subs) {
      if (cat.image) entries.push({ name: cat.name, parentName: '', image: cat.image, url: cat.page });
    } else if (subs[0] && subs[0].children) {
      subs.forEach(group => {
        const img = group.image || (group.children || []).find(c => c.image)?.image;
        if (img) entries.push({ name: group.name, parentName: cat.name, image: img.trim(), url: `${cat.page}#${group.id}` });
        (group.children || []).forEach(child => {
          if (child.image) entries.push({ name: child.name, parentName: group.name, image: child.image.trim(), url: `${cat.page}#${child.id}` });
        });
      });
    } else {
      subs.forEach(sub => {
        if (sub.image) entries.push({ name: sub.name, parentName: cat.name, image: sub.image.trim(), url: `${cat.page}#${sub.id}` });
      });
    }
  });
  return shuffleArray(entries).slice(0, 8);
}

function catCardHTML(entry) {
  const placeholder = `<div class="product-card__placeholder" aria-hidden="true">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    <span>Фото<br>незабаром</span></div>`;
  return `<a href="${escHtml(entry.url)}" class="cat-card">
    <div class="cat-card__img-wrap">
      <img class="cat-card__img" data-src="${escHtml(entry.image)}" src="" alt="${escHtml(entry.name)}" loading="lazy" width="400" height="400" />
      ${placeholder}
    </div>
    <div class="cat-card__body">
      ${entry.parentName ? `<p class="cat-card__parent">${escHtml(entry.parentName)}</p>` : ''}
      <h3 class="cat-card__name">${escHtml(entry.name)}</h3>
    </div>
  </a>`;
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
  if (priceEl) priceEl.textContent = (product.price && product.categoryId !== 'kilcia') ? formatPrice(product.price) : 'Ціна за запитом';

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
function startHeroSlideshow() {
  const img = document.querySelector('.hero__img');
  if (!img) return;

  const imageSet = new Set();
  if (typeof CATEGORIES !== 'undefined') {
    CATEGORIES.forEach(cat => { if (cat.image) imageSet.add(cat.image.trim()); });
  }
  if (typeof SUBCATEGORIES !== 'undefined') {
    Object.values(SUBCATEGORIES).forEach(subs => {
      subs.forEach(sub => {
        if (sub.image) imageSet.add(sub.image.trim());
        (sub.children || []).forEach(child => { if (child.image) imageSet.add(child.image.trim()); });
      });
    });
  }
  const srcs = shuffleArray([...imageSet]);
  if (!srcs.length) return;

  const placeholder = document.querySelector('.hero__img-placeholder');
  if (placeholder) placeholder.style.display = 'none';

  let idx = 0;
  let timer = null;

  const switchTo = (src) => {
    img.style.opacity = '0';
    setTimeout(() => {
      img.onload  = () => { img.style.opacity = '1'; };
      img.onerror = () => { advance(); };
      img.src = src;
      if (img.complete && img.naturalWidth > 0) img.style.opacity = '1';
    }, 600);
  };

  const advance = () => {
    idx = (idx + 1) % srcs.length;
    switchTo(srcs[idx]);
  };

  switchTo(srcs[0]);
  timer = setInterval(advance, 5500);

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

  let scale = 1, tx = 0, ty = 0;
  let dragging = false, dragStartX = 0, dragStartY = 0, dragTx = 0, dragTy = 0;

  const MIN_SCALE = 1, MAX_SCALE = 5;

  const applyTransform = () => {
    lbImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    lbImg.style.cursor = scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default';
  };

  const clampTranslate = () => {
    const hw = (lbImg.offsetWidth  * (scale - 1)) / 2;
    const hh = (lbImg.offsetHeight * (scale - 1)) / 2;
    tx = Math.max(-hw, Math.min(hw, tx));
    ty = Math.max(-hh, Math.min(hh, ty));
  };

  const resetTransform = () => { scale = 1; tx = 0; ty = 0; applyTransform(); };

  window.openLightbox = (src, caption = '') => {
    resetTransform();
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
    resetTransform();
  };

  // Zoom by wheel
  lbImg.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const rect = lbImg.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width  / 2;
    const oy = e.clientY - rect.top  - rect.height / 2;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * delta));
    tx += ox * (1 - newScale / scale);
    ty += oy * (1 - newScale / scale);
    scale = newScale;
    clampTranslate();
    applyTransform();
  }, { passive: false });

  // Drag/pan
  lbImg.addEventListener('mousedown', e => {
    if (scale <= 1) return;
    dragging = true;
    dragStartX = e.clientX; dragStartY = e.clientY;
    dragTx = tx; dragTy = ty;
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    tx = dragTx + (e.clientX - dragStartX);
    ty = dragTy + (e.clientY - dragStartY);
    clampTranslate();
    applyTransform();
  });
  window.addEventListener('mouseup', () => { dragging = false; applyTransform(); });

  // Double-click: reset zoom
  lbImg.addEventListener('dblclick', resetTransform);

  // Touch pinch-to-zoom
  let lastDist = 0;
  lbImg.addEventListener('touchstart', e => {
    if (e.touches.length === 2) lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  }, { passive: true });
  lbImg.addEventListener('touchmove', e => {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (dist / lastDist)));
    lastDist = dist;
    clampTranslate();
    applyTransform();
  }, { passive: false });

  lbClose?.addEventListener('click', closeLightbox);
  lbBackdrop?.addEventListener('click', e => { if (!dragging) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === '0') resetTransform();
  });
}
