// Гідро: L1-групи → тип у однині
const GROUP_TYPE_LABELS = {
  manzhety:       'Манжета гідравлічна',
  budoznymachi:   'Брудознімач',
  shtok:          'Ущільнення штока',
  porshni:        'Ущільнення поршня',
  napravliaiuchi: 'Направляюче кільце',
};

// Single-level підтипи → тип у однині
const SUBTYPE_LABELS = {
  // pnevmo
  k25: 'Поршень пневматичний',
  k30: 'Ущільнення', k50: 'Ущільнення', k52: 'Ущільнення', k53: 'Ущільнення',
  k54: 'Ущільнення', k55: 'Ущільнення', k56: 'Ущільнення', k57: 'Ущільнення',
  k58: 'Ущільнення', k59: 'Ущільнення', k62: 'Ущільнення', k63: 'Ущільнення',
  k64: 'Ущільнення', k65: 'Ущільнення', pnev_mpz: 'Ущільнення',
  // statychni
  st_k82: 'Статичне ущільнення', st_k83: 'Статичне ущільнення',
  st_k84: 'Статичне ущільнення', st_k85: 'Статичне ущільнення',
  st_k86: 'Статичне ущільнення',
  // kilcia
  nbr70: 'Кільце ущільнююче', nbr90: 'Кільце ущільнююче', xring: 'Кільце ущільнююче',
  fpm80: 'Кільце ущільнююче', epdm70: 'Кільце ущільнююче', vmq70: 'Кільце ущільнююче',
  shnury: 'Шнур ущільнюючий',
  // manzhety (armovani)
  manzh_asl: 'Манжета армована', manzh_bahd: 'Манжета армована',
  manzh_combi: 'Манжета армована', manzh_corteco: 'Манжета армована',
  manzh_dmhui: 'Манжета армована', manzh_sog: 'Манжета армована',
  manzh_kasety: 'Касета',
  // kompresory
  komp_usch: 'Ущільнення компресорне', brs: 'Втулка компресорна',
  // remkomplekty
  rem_hyva: 'Ремкомплект', rem_edbro: 'Ремкомплект', rem_hydromas: 'Ремкомплект',
  // komplektuiuchi
  kompl_pidsh: 'Підшипник ШС', kompl_buks: 'Букса', kompl_porsh: 'Поршень',
  kompl_vuho_shtok: 'Вухо ГЦ (шток)', kompl_vuho_truba: 'Вухо ГЦ (труба)',
  kompl_khrom: 'Шток хромований', kompl_trubu: 'Труба хонінгована',
};

// Категорії без підкатегорій → тип
const CATEGORY_LABELS = {
  vtulky:       'Втулка',
  rotatsiyni:   'Ротаційне ущільнення',
  robotyzovani: 'Ущільнення КП',
};

function findSubcatInfo(categoryId, subtypeId) {
  if (typeof SUBCATEGORIES !== 'undefined') {
    const subs = SUBCATEGORIES[categoryId];
    if (subs && subs.length) {
      const isTwoLevel = subs[0] && subs[0].children;
      if (isTwoLevel) {
        for (const group of subs) {
          if (group.id === subtypeId) return { typeLabel: GROUP_TYPE_LABELS[group.id] || null, image: group.image || null };
          const child = (group.children || []).find(c => c.id === subtypeId);
          if (child) return { typeLabel: GROUP_TYPE_LABELS[group.id] || null, image: child.image || group.image || null };
        }
      } else if (subtypeId) {
        const sub = subs.find(s => s.id === subtypeId);
        if (sub) return { typeLabel: SUBTYPE_LABELS[subtypeId] || null, image: sub.image || null };
      }
    }
  }
  // Fallback: категорія без підкатегорій
  return { typeLabel: CATEGORY_LABELS[categoryId] || null, image: null };
}

document.addEventListener('DOMContentLoaded', async () => {
  const params    = new URLSearchParams(window.location.search);
  const id        = parseInt(params.get('id'), 10);
  const container = document.getElementById('productDetail');
  if (!container) return;

  if (!id) {
    container.innerHTML = '<p class="catalog__loading">Невірне посилання на товар. <a href="catalog.html">Повернутись до каталогу</a></p>';
    return;
  }

  container.innerHTML = '<p class="catalog__loading">Завантаження...</p>';

  const products = await loadProducts();
  const product  = products.find(p => p.id === id);

  if (!product) {
    container.innerHTML = '<p class="catalog__loading">Товар не знайдено. <a href="catalog.html">Повернутись до каталогу</a></p>';
    return;
  }

  const cat     = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === product.categoryId) : null;
  const catName = cat ? cat.name : '';
  const catPage = cat ? cat.page : 'catalog.html';

  const subcat  = findSubcatInfo(product.categoryId, product.subtype);
  const imgSrc  = product.image || (subcat && subcat.image) || (cat && cat.image) || '';

  document.title = product.name + ' — Sealmaster';

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = product.details || product.desc || '';
    metaDesc.content = product.name + (catName ? '. ' + catName : '') + (descText ? '. ' + descText : '') + '. Sealmaster Львів. Тел.: 068 574 09 61.';
  }

  const chevron = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  const breadcrumbEl = document.getElementById('productBreadcrumb');
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML =
      `<a href="catalog.html">Каталог</a>${chevron}` +
      (cat ? `<a href="${escHtml(catPage)}">${escHtml(catName)}</a>${chevron}` : '') +
      `<span>${escHtml(product.name)}</span>`;
  }

  const priceVal  = (product.price && product.categoryId !== 'kilcia') ? formatPrice(product.price) : null;
  const priceHTML = priceVal
    ? `<p class="product-detail__price">${priceVal}</p>`
    : `<p class="product-detail__price product-detail__price--ask">Ціна за запитом</p>`;
  const desc = product.details || product.desc || '';

  const imgHTML = imgSrc
    ? `<img class="product-detail__img loading" id="pdImg" src="${escHtml(imgSrc)}" alt="${escHtml(product.name)}" />`
    : `<div class="product-detail__img-ph">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span>Фото незабаром</span>
       </div>`;

  const typePrefix = subcat && subcat.typeLabel ? subcat.typeLabel + ' ' : '';

  container.innerHTML = `
    <div class="product-detail">
      <div class="product-detail__img-wrap" id="pdImgWrap">${imgHTML}</div>
      <div class="product-detail__info">
        ${catName ? `<p class="product-detail__cat"><a href="${escHtml(catPage)}">${escHtml(catName)}</a></p>` : ''}
        <h1 class="product-detail__title">${escHtml(typePrefix + product.name)}</h1>
        ${desc ? `<p class="product-detail__desc">${escHtml(desc)}</p>` : ''}
        ${priceHTML}
        <div class="product-detail__actions">
          <div class="product-card__qty-wrap pd-qty">
            <button class="product-card__qty-btn" id="pdQtyDec" type="button">−</button>
            <input type="number" class="product-card__qty-val" id="pdQtyVal" value="1" min="1">
            <button class="product-card__qty-btn" id="pdQtyInc" type="button">+</button>
          </div>
          <button class="btn btn--primary" id="pdAddCart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            В кошик
          </button>
          <a href="tel:+380685740961" class="btn btn--outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.18 6.18l.77-.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Зателефонувати
          </a>
        </div>
      </div>
    </div>`;

  // Image load/error handling
  const pdImg = document.getElementById('pdImg');
  if (pdImg) {
    pdImg.addEventListener('load', () => { pdImg.classList.remove('loading'); pdImg.classList.add('loaded'); });
    pdImg.addEventListener('error', () => { pdImg.style.display = 'none'; });
    pdImg.addEventListener('click', () => {
      if (typeof window.openLightbox === 'function') window.openLightbox(imgSrc, product.name);
    });
  }

  // Qty stepper
  const qtyVal = document.getElementById('pdQtyVal');
  document.getElementById('pdQtyDec')?.addEventListener('click', () => {
    qtyVal.value = Math.max(1, (parseInt(qtyVal.value) || 1) - 1);
  });
  document.getElementById('pdQtyInc')?.addEventListener('click', () => {
    qtyVal.value = (parseInt(qtyVal.value) || 1) + 1;
  });
  if (qtyVal) {
    qtyVal.addEventListener('blur', () => { qtyVal.value = Math.max(1, parseInt(qtyVal.value) || 1); });
  }

  // Add to cart
  const addBtn = document.getElementById('pdAddCart');
  if (addBtn && typeof cartAdd === 'function') {
    const updateBtn = () => {
      if (typeof cartGet === 'function') {
        const inCart = cartGet().some(i => i.id === product.id);
        if (inCart) {
          addBtn.classList.add('product-detail__add--done');
          addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> В кошику`;
        } else {
          addBtn.classList.remove('product-detail__add--done');
          addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> В кошик`;
        }
      }
    };
    updateBtn();
    addBtn.addEventListener('click', () => {
      if (typeof cartGet === 'function' && cartGet().some(i => i.id === product.id)) {
        if (typeof cartRemove === 'function') cartRemove(product.id);
      } else {
        const qty = Math.max(1, parseInt(qtyVal?.value) || 1);
        cartAdd(product, qty);
      }
      updateBtn();
      if (typeof cartUpdateButtons === 'function') cartUpdateButtons();
    });
  }
});
