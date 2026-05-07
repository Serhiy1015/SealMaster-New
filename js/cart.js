/* ============================================================
   CART.JS — Кошик замовлень + Telegram
   ============================================================

   ЯК НАЛАШТУВАТИ TELEGRAM:
   1. Напишіть @BotFather у Telegram → /newbot → отримайте токен
   2. Напишіть своєму боту будь-яке повідомлення
   3. Відкрийте у браузері:
      https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   4. Знайдіть "chat":{"id": ...} — це ваш CHAT_ID
   5. Вставте обидва значення нижче
   ============================================================ */

const TELEGRAM_BOT_TOKEN = '8687340496:AAFfUeCIQhbSrvt5Bjnp67aRduG1s-zu0Jo';
const TELEGRAM_CHAT_ID   = '597089199';

/* ── Storage ─────────────────────────────────────────────── */
function cartGet() {
  try { return JSON.parse(localStorage.getItem('sm_cart') || '[]'); } catch { return []; }
}
function cartSave(cart) { localStorage.setItem('sm_cart', JSON.stringify(cart)); }

function cartAdd(product) {
  const cart = cartGet();
  const ex = cart.find(i => i.id === product.id);
  if (ex) ex.qty = (ex.qty || 1) + 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  cartSave(cart);
  cartUpdateBadge();
  cartUpdateButtons();
  cartBounce();
}

function cartBounce() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  btn.classList.remove('cart-btn--bounce');
  void btn.offsetWidth; // скидає анімацію щоб спрацювала знову
  btn.classList.add('cart-btn--bounce');
  btn.addEventListener('animationend', () => btn.classList.remove('cart-btn--bounce'), { once: true });
}
function cartRemove(id) {
  cartSave(cartGet().filter(i => i.id !== id));
  cartUpdateBadge();
  cartRenderItems();
  cartUpdateButtons();
}
function cartChangeQty(id, delta) {
  const cart = cartGet();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) { cartRemove(id); return; }
  cartSave(cart);
  cartUpdateBadge();
  cartRenderItems();
}
function cartClear() {
  localStorage.removeItem('sm_cart');
  cartUpdateBadge();
  cartUpdateButtons();
}

/* ── Badge ───────────────────────────────────────────────── */
function cartUpdateBadge() {
  const count = cartGet().reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

/* ── Синхронізація кнопок "В кошик" ─────────────────────── */
function cartUpdateButtons() {
  const cart = cartGet();
  document.querySelectorAll('.product-card__add[data-id]').forEach(btn => {
    const id = parseInt(btn.dataset.id, 10);
    const inCart = cart.some(i => i.id === id);
    const span = btn.querySelector('span');
    if (span) span.textContent = inCart ? 'В кошику' : 'В кошик';
    btn.classList.toggle('product-card__add--done', inCart);
  });
}

/* ── Drawer open/close ───────────────────────────────────── */
function cartOpen() {
  cartRenderItems();
  document.getElementById('cartDrawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function cartClose() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Render items ────────────────────────────────────────── */
function cartRenderItems() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  const cart = cartGet();
  if (!cart.length) {
    el.innerHTML = '<p class="cart-empty">Кошик порожній</p>';
    return;
  }
  const fmt = (p) => {
    if (!p) return 'Ціна за запитом';
    if (/грн|₴|\$|€/.test(p)) return p;
    return p + ' грн';
  };
  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__name">${item.name}</div>
      <div class="cart-item__right">
        <span class="cart-item__price">${fmt(item.price)}</span>
        <div class="cart-item__qty-wrap">
          <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="cart-qty-num">${item.qty || 1}</span>
          <button class="cart-qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
        <button class="cart-item__del" data-id="${item.id}" aria-label="Видалити">×</button>
      </div>
    </div>`).join('');
  el.querySelectorAll('.cart-item__del').forEach(btn => {
    btn.addEventListener('click', () => cartRemove(+btn.dataset.id));
  });
  el.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => cartChangeQty(+btn.dataset.id, +btn.dataset.delta));
  });
}

/* ── Telegram ────────────────────────────────────────────── */
async function cartSend(name, phone, comment) {
  const cart = cartGet();
  const fmt = (p) => (!p ? '' : (/грн|₴|\$|€/.test(p) ? p : p + ' грн'));
  const lines = cart.map(i =>
    `• ${i.name}${i.qty > 1 ? ` × ${i.qty}` : ''}${i.price ? ' — ' + fmt(i.price) : ''}`
  ).join('\n');
  const text = `🛒 Нове замовлення SealMaster\n\n👤 ${name}\n📞 ${phone}${comment ? '\n💬 ' + comment : ''}\n\n${lines}`;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram не налаштовано — токен або chat_id порожній');
    return true;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    return res.ok;
  } catch { return false; }
}

/* ── Init ────────────────────────────────────────────────── */
function initCart() {
  /* Кнопка кошика в хедері */
  const headerInner = document.querySelector('.header__inner');
  if (headerInner) {
    const btn = document.createElement('button');
    btn.className = 'cart-btn';
    btn.setAttribute('aria-label', 'Кошик');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><span class="cart-btn__label">Кошик</span><span class="cart-badge" hidden>0</span>`;
    btn.addEventListener('click', cartOpen);
    headerInner.appendChild(btn);
  }

  /* Drawer */
  const drawer = document.createElement('div');
  drawer.id = 'cartDrawer';
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-drawer__overlay"></div>
    <div class="cart-drawer__panel">
      <div class="cart-drawer__head">
        <span class="cart-drawer__title">Кошик</span>
        <button class="cart-drawer__close" aria-label="Закрити">×</button>
      </div>
      <div id="cartItems" class="cart-drawer__items"></div>
      <div class="cart-drawer__foot">
        <form id="cartForm" class="cart-form">
          <div class="cart-field">
            <input type="text" name="name" placeholder="Ваше ім'я *" class="cart-input" autocomplete="name">
            <span class="cart-field__err" id="cartErrName"></span>
          </div>
          <div class="cart-field">
            <input type="tel" name="phone" placeholder="Номер телефону * (0XXXXXXXXX)" class="cart-input" autocomplete="tel">
            <span class="cart-field__err" id="cartErrPhone"></span>
          </div>
          <textarea name="comment" placeholder="Коментар (необов'язково)" class="cart-input cart-textarea"></textarea>
          <button type="submit" class="btn btn--primary btn--full">Підтвердити замовлення</button>
        </form>
        <div id="cartSuccess" class="cart-success" hidden>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>Дякуємо!<br>Наш менеджер зв'яжеться з вами незабаром.</p>
          <button class="btn btn--outline btn--full" id="cartSuccessClose">Закрити</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(drawer);

  drawer.querySelector('.cart-drawer__overlay').addEventListener('click', cartClose);
  drawer.querySelector('.cart-drawer__close').addEventListener('click', cartClose);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cartClose(); });

  document.getElementById('cartForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;

    const nameInput  = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const nameVal    = nameInput.value.trim();
    const phoneVal   = phoneInput.value.trim();
    const nameErr    = document.getElementById('cartErrName');
    const phoneErr   = document.getElementById('cartErrPhone');
    let valid = true;

    if (nameVal.length < 2) {
      nameErr.textContent = "Введіть ім'я (мінімум 2 символи)";
      nameInput.classList.add('cart-input--error');
      valid = false;
    } else {
      nameErr.textContent = '';
      nameInput.classList.remove('cart-input--error');
    }

    const digits = phoneVal.replace(/\D/g, '');
    const phoneOk = (digits.startsWith('380') && digits.length === 12) ||
                    (digits.startsWith('0')   && digits.length === 10);
    if (!phoneOk) {
      phoneErr.textContent = 'Введіть коректний номер (наприклад: 0961234567)';
      phoneInput.classList.add('cart-input--error');
      valid = false;
    } else {
      phoneErr.textContent = '';
      phoneInput.classList.remove('cart-input--error');
    }

    if (!valid) return;

    const submitBtn = form.querySelector('[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Відправляємо...';

    const ok = await cartSend(nameVal, phoneVal, form.querySelector('textarea[name="comment"]').value.trim());

    if (ok) {
      submitBtn.textContent = 'Відправлено';
      cartClear();
      cartRenderItems();
      form.hidden = true;
      document.getElementById('cartSuccess').hidden = false;
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Підтвердити замовлення';
      alert('Помилка відправки. Зателефонуйте нам: +380966852191');
    }
  });

  /* Прибираємо помилку при введенні */
  document.getElementById('cartForm').addEventListener('input', e => {
    const input = e.target.closest('.cart-input');
    if (input) input.classList.remove('cart-input--error');
  });

  document.getElementById('cartSuccessClose').addEventListener('click', () => {
    cartClose();
    const form = document.getElementById('cartForm');
    form.reset();
    form.hidden = false;
    document.getElementById('cartSuccess').hidden = true;
  });

  cartUpdateBadge();
}

document.addEventListener('DOMContentLoaded', initCart);
