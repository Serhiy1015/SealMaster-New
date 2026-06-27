function findSubcatInfo(categoryId, subtypeId) {
  if (!subtypeId || typeof SUBCATEGORIES === 'undefined') return null;
  const subs = SUBCATEGORIES[categoryId];
  if (!subs || !subs.length) return null;
  const isTwoLevel = subs[0] && subs[0].children;
  if (isTwoLevel) {
    for (const group of subs) {
      if (group.id === subtypeId) return { label: group.name, image: group.image || null };
      const child = (group.children || []).find(c => c.id === subtypeId);
      if (child) return { label: child.name, image: child.image || group.image || null };
    }
  } else {
    const sub = subs.find(s => s.id === subtypeId);
    if (sub) return { label: sub.name, image: sub.image || null };
  }
  return null;
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
  const imgSrc  = product.image || (subcat && subcat.image) || '';

  document.title = product.name + ' — Sealmaster';

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = product.name + (catName ? '. ' + catName : '') + '. Sealmaster Львів. Тел.: 068 574 09 61.';

  const chevron = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  const breadcrumbEl = document.getElementById('productBreadcrumb');
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML =
      `<a href="catalog.html">Каталог</a>${chevron}` +
      (cat ? `<a href="${escHtml(catPage)}">${escHtml(catName)}</a>${chevron}` : '') +
      `<span>${escHtml(product.name)}</span>`;
  }

  const priceVal  = product.price ? formatPrice(product.price) : null;
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

  const subcatLabelHTML = subcat
    ? `<p class="product-detail__subtype">${escHtml(subcat.label)}</p>`
    : '';

  container.innerHTML = `
    <div class="product-detail">
      <div class="product-detail__img-wrap" id="pdImgWrap">${imgHTML}</div>
      <div class="product-detail__info">
        ${catName ? `<p class="product-detail__cat"><a href="${escHtml(catPage)}">${escHtml(catName)}</a></p>` : ''}
        ${subcatLabelHTML}
        <h1 class="product-detail__title">${escHtml(product.name)}</h1>
        ${desc ? `<p class="product-detail__desc">${escHtml(desc)}</p>` : ''}
        ${priceHTML}
        <div class="product-detail__actions">
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
        cartAdd(product);
      }
      updateBtn();
      if (typeof cartUpdateButtons === 'function') cartUpdateButtons();
    });
  }
});
