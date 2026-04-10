/* ═══════════════════════════════════════════════
   NEXUS — app.js
   Core: Product data, Cart, Routing, UI interactions
   ═══════════════════════════════════════════════ */

'use strict';

/* ── Product Data ── */
const PRODUCTS = [
  { id: 1,  name: 'ProAudio X9',         category: 'Electronics', price: 349, originalPrice: 499, emoji: '🎧', rating: 4.8, reviews: 2341, badge: 'New',  desc: 'Immersive 40mm drivers with active noise cancellation, 30hr battery life, and premium memory foam ear cushions. Compatible with all Bluetooth 5.3 devices.' },
  { id: 2,  name: 'Quantum Watch S3',    category: 'Wearables',   price: 299, originalPrice: 399, emoji: '⌚', rating: 4.7, reviews: 1823, badge: 'Hot',  desc: 'Always-on AMOLED display, health monitoring suite including ECG, SpO2, and sleep tracking. Water-resistant to 50m with 7-day battery.' },
  { id: 3,  name: 'Nova Sneakers Pro',   category: 'Footwear',    price: 189, originalPrice: 249, emoji: '👟', rating: 4.6, reviews: 3102, badge: 'Sale', desc: 'Engineered with responsive foam technology and breathable mesh upper. Designed for both performance and style, available in 8 colorways.' },
  { id: 4,  name: 'LuminaLens 4K',       category: 'Electronics', price: 799, originalPrice: 999, emoji: '📷', rating: 4.9, reviews: 987,  badge: 'New',  desc: '50MP sensor with 8K video capability, in-body stabilization, and AI subject tracking. Weather sealed for all-terrain photography.' },
  { id: 5,  name: 'ArcDesk Pro',         category: 'Office',      price: 449, originalPrice: 549, emoji: '🖥️', rating: 4.5, reviews: 756,  badge: null,  desc: 'Ergonomic monitor arm with built-in USB-C hub, wireless charging pad, and cable management. Supports displays up to 34".' },
  { id: 6,  name: 'FrostBlend Ultra',    category: 'Kitchen',     price: 129, originalPrice: 179, emoji: '🧃', rating: 4.4, reviews: 2109, badge: 'Sale', desc: 'Professional-grade 1200W motor with 72oz BPA-free container. Smart controls with 10 presets and self-cleaning cycle.' },
  { id: 7,  name: 'ZenPad Air',          category: 'Electronics', price: 599, originalPrice: 699, emoji: '📱', rating: 4.7, reviews: 1456, badge: 'New',  desc: '11.5" ProMotion display with Apple Pencil support, M2 chip, 5G connectivity and all-day battery. Your creative studio on the go.' },
  { id: 8,  name: 'CloudStep Sandals',   category: 'Footwear',    price: 89,  originalPrice: 120, emoji: '🩴', rating: 4.3, reviews: 884,  badge: null,  desc: 'Lightweight EVA sole with contoured arch support and adjustable straps. Perfect for warm-weather adventures.' },
  { id: 9,  name: 'SpeedKet 360',        category: 'Sports',      price: 219, originalPrice: 280, emoji: '🏸', rating: 4.6, reviews: 543,  badge: 'Hot',  desc: 'Carbon fiber frame with an optimal flex rating for power and control. Includes high-tension strings and a premium carry case.' },
  { id: 10, name: 'AromaCore Diffuser',  category: 'Home',        price: 69,  originalPrice: 89,  emoji: '🕯️', rating: 4.5, reviews: 1688, badge: null,  desc: 'Ultrasonic 400ml diffuser with 7-color ambient LED, auto-shutoff timer, and whisper-quiet operation for bedrooms and offices.' },
  { id: 11, name: 'PolarFleece X2',      category: 'Clothing',    price: 139, originalPrice: 180, emoji: '🧥', rating: 4.7, reviews: 1231, badge: 'Sale', desc: 'Mid-layer fleece crafted from 100% recycled polyester with a wind-resistant DWR outer. Packable to a pouch size.' },
  { id: 12, name: 'GlowDesk Lamp S',     category: 'Office',      price: 159, originalPrice: 199, emoji: '💡', rating: 4.6, reviews: 892,  badge: 'New',  desc: 'Circadian-aware LED with tunable color temperature (2700K–6500K), touch dimmer, USB-A/C charging ports built into the base.' },
];

const CATEGORIES = [
  { name: 'Electronics', icon: '⚡', count: 3 },
  { name: 'Wearables',   icon: '⌚', count: 1 },
  { name: 'Footwear',    icon: '👟', count: 2 },
  { name: 'Sports',      icon: '🏃', count: 1 },
  { name: 'Kitchen',     icon: '🍳', count: 1 },
  { name: 'Office',      icon: '🗂️', count: 2 },
  { name: 'Clothing',    icon: '👕', count: 1 },
  { name: 'Home',        icon: '🏠', count: 1 },
];

/* ── State ── */
let cart = JSON.parse(localStorage.getItem('nexus-cart') || '[]');
let currentDetailId = null;
let detailQty = 1;
let activeFilters = { categories: [], maxPrice: 2000, minRating: 0 };
let currentSearchQuery = '';
let currentSort = 'default';

/* ══════════════ LOADER ══════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

/* ══════════════ NAVBAR ══════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMenu() {
  const links = document.getElementById('navLinks');
  const btn   = document.getElementById('hamburger');
  links.classList.toggle('open');
  btn.classList.toggle('active');
}

function handleNavSearch(val) {
  currentSearchQuery = val;
  showPage('products');
  document.getElementById('searchInput').value = val;
  filterProducts();
}

/* ══════════════ THEME ══════════════ */
const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
  const html  = document.documentElement;
  const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', theme);
  localStorage.setItem('nexus-theme', theme);
}

/* ══════════════ ROUTING ══════════════ */
function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById(`page-${name}`);
  if (target) target.classList.add('active');
  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('active');
  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Page-specific init
  if (name === 'cart')     renderCart();
  if (name === 'checkout') renderCheckoutSummary();
  // Show/hide footer
  const footer = document.getElementById('footer');
  footer.style.display = name === 'success' ? 'none' : 'block';
}

/* ══════════════ TOAST ══════════════ */
function showToast(msg, icon = '✦') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

/* ══════════════ CART LOGIC ══════════════ */
function saveCart() {
  localStorage.setItem('nexus-cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.classList.remove('bump');
  void badge.offsetWidth; // reflow
  badge.classList.add('bump');
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart();
  showToast(`${product.name} added to cart`, '🛒');
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
  showToast('Item removed', '🗑️');
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

/* ══════════════ RENDER CART ══════════════ */
function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const summaryEl = document.getElementById('cartSummary');
  if (!itemsEl || !summaryEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <div class="ec-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="showPage('products')">Start Shopping</button>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 300 ? 0 : 15;
  const tax      = +(subtotal * 0.08).toFixed(2);
  const total    = +(subtotal + shipping + tax).toFixed(2);

  itemsEl.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-img">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-cat">${p.category}</div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-variant">Unit price: $${p.price}</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-qty">
            <button class="cart-qty-btn" onclick="updateCartQty(${p.id}, -1)">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn" onclick="updateCartQty(${p.id}, 1)">+</button>
          </div>
          <div class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</div>
          <button class="cart-remove" onclick="removeFromCart(${p.id})" title="Remove">✕</button>
        </div>
      </div>`;
  }).join('');

  summaryEl.innerHTML = `
    <div class="summary-title">Order Summary</div>
    <div class="summary-row"><span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--accent)">Free</span>' : '$'+shipping}</span></div>
    <div class="summary-row"><span>Tax (8%)</span><span>$${tax}</span></div>
    <div class="coupon-row">
      <input type="text" placeholder="Coupon code" id="couponInput" />
      <button class="coupon-apply" onclick="applyCoupon()">Apply</button>
    </div>
    <div class="summary-row total"><span>Total</span><span>$${total}</span></div>
    <button class="btn-primary full-btn" onclick="showPage('checkout')">Proceed to Checkout →</button>
    <button class="btn-outline" style="width:100%;justify-content:center;margin-top:12px;" onclick="showPage('products')">Continue Shopping</button>
  `;
}

function applyCoupon() {
  const val = document.getElementById('couponInput')?.value?.toUpperCase();
  if (val === 'NEXUS20') showToast('20% discount applied!', '🎉');
  else showToast('Invalid coupon code', '❌');
}

/* ══════════════ RENDER CHECKOUT SUMMARY ══════════════ */
function renderCheckoutSummary() {
  const el = document.getElementById('checkoutSummary');
  if (!el) return;

  const subtotal = getCartTotal();
  const shipping = subtotal > 300 ? 0 : 15;
  const tax      = +(subtotal * 0.08).toFixed(2);
  const total    = +(subtotal + shipping + tax).toFixed(2);

  const itemsHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="checkout-item">
        <div class="checkout-item-img">${p.emoji}</div>
        <div class="checkout-item-name">${p.name} ×${item.qty}</div>
        <div class="checkout-item-price">$${(p.price*item.qty).toFixed(2)}</div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <h3>Order Summary</h3>
    <div class="checkout-items">${itemsHTML || '<p style="color:var(--text3);font-size:14px">Cart is empty</p>'}</div>
    <div style="border-top:1px solid var(--border);padding-top:16px;display:flex;flex-direction:column;gap:10px;">
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping===0?'Free':'$'+shipping}</span></div>
      <div class="summary-row"><span>Tax (8%)</span><span>$${tax}</span></div>
      <div class="summary-row total" style="margin-top:8px;"><span>Total</span><span>$${total}</span></div>
    </div>
  `;
}

function placeOrder() {
  cart = [];
  saveCart();
  showPage('success');
}

/* ══════════════ PRODUCTS PAGE ══════════════ */
function buildFilters() {
  /* Category checkboxes */
  const catEl = document.getElementById('categoryFilters');
  const uniqueCats = [...new Set(PRODUCTS.map(p => p.category))].sort();
  catEl.innerHTML = uniqueCats.map(cat => `
    <label class="filter-check" id="cat-label-${cat}">
      <input type="checkbox" value="${cat}" onchange="onCategoryFilter(this)" />
      ${cat}
    </label>`).join('');

  /* Rating filter */
  const ratingEl = document.getElementById('ratingFilters');
  ratingEl.innerHTML = [4, 3, 2].map(r => `
    <label class="filter-check" id="rating-label-${r}">
      <input type="radio" name="rating" value="${r}" onchange="onRatingFilter(${r})" />
      ${'★'.repeat(r)}${'☆'.repeat(5-r)} & up
    </label>`).join('');
}

function onCategoryFilter(checkbox) {
  if (checkbox.checked) {
    activeFilters.categories.push(checkbox.value);
  } else {
    activeFilters.categories = activeFilters.categories.filter(c => c !== checkbox.value);
  }
  // Update label style
  const label = checkbox.closest('.filter-check');
  label.classList.toggle('active', checkbox.checked);
  filterProducts();
}

function onRatingFilter(rating) {
  activeFilters.minRating = rating;
  document.querySelectorAll('#ratingFilters .filter-check').forEach(l => l.classList.remove('active'));
  document.getElementById(`rating-label-${rating}`)?.classList.add('active');
  filterProducts();
}

function clearFilters() {
  activeFilters = { categories: [], maxPrice: 2000, minRating: 0 };
  document.getElementById('searchInput').value = '';
  document.getElementById('priceRange').value = 2000;
  document.getElementById('priceVal').textContent = '$2000';
  document.getElementById('sortSelect').value = 'default';
  document.querySelectorAll('.filter-check input[type=checkbox]').forEach(i => i.checked = false);
  document.querySelectorAll('.filter-check input[type=radio]').forEach(i => i.checked = false);
  document.querySelectorAll('.filter-check').forEach(l => l.classList.remove('active'));
  currentSearchQuery = '';
  currentSort = 'default';
  filterProducts();
}

function filterProducts() {
  const query    = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const maxPrice = +(document.getElementById('priceRange')?.value || 2000);
  document.getElementById('priceVal').textContent = '$' + maxPrice;
  currentSort = document.getElementById('sortSelect')?.value || 'default';

  let results = PRODUCTS.filter(p => {
    const matchSearch   = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    const matchCat      = activeFilters.categories.length === 0 || activeFilters.categories.includes(p.category);
    const matchPrice    = p.price <= maxPrice;
    const matchRating   = p.rating >= activeFilters.minRating;
    return matchSearch && matchCat && matchPrice && matchRating;
  });

  // Sort
  if (currentSort === 'price-asc')  results.sort((a,b) => a.price - b.price);
  if (currentSort === 'price-desc') results.sort((a,b) => b.price - a.price);
  if (currentSort === 'name')       results.sort((a,b) => a.name.localeCompare(b.name));

  renderProductGrid('productsGrid', results);
  const count = document.getElementById('productCount');
  if (count) count.textContent = `${results.length} product${results.length !== 1 ? 's' : ''} found`;
}

function toggleFilters() {
  const panel = document.getElementById('filterPanel');
  panel.classList.toggle('open');
}

/* ══════════════ RENDER GRIDS ══════════════ */
function renderProductGrid(targetId, products, delay = 0) {
  const el = document.getElementById(targetId);
  if (!el) return;

  if (products.length === 0) {
    el.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filters.</p>
        <button class="btn-ghost" onclick="clearFilters()">Clear Filters</button>
      </div>`;
    return;
  }

  el.innerHTML = products.map((p, i) => {
    const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice) * 100) : null;
    return `
      <div class="product-card" style="animation-delay:${i * 0.06}s" onclick="openDetail(${p.id})">
        <div class="product-img-wrap">
          <div class="product-emoji">${p.emoji}</div>
          ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
          <button class="product-wishlist" onclick="event.stopPropagation();showToast('Added to wishlist','❤️')">♡</button>
        </div>
        <div class="product-info">
          <div class="product-cat">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">
            <div class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div>
            <span class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
          </div>
          <div class="product-footer">
            <div class="product-price">
              <span class="price-current">$${p.price}</span>
              ${p.originalPrice ? `<span class="price-original">$${p.originalPrice}</span>` : ''}
            </div>
            <button class="btn-add" onclick="event.stopPropagation();addToCart(${p.id})" title="Add to cart">+</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ══════════════ FEATURED GRID ══════════════ */
function renderFeatured() {
  const featured = PRODUCTS.filter(p => p.badge || p.rating >= 4.7).slice(0, 8);
  renderProductGrid('featuredGrid', featured);
}

/* ══════════════ CATEGORIES ══════════════ */
function renderCategories() {
  const el = document.getElementById('catGrid');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(cat => `
    <div class="cat-card" onclick="filterByCategory('${cat.name}')">
      <div class="cat-icon">${cat.icon}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-count">${cat.count} items</div>
    </div>`).join('');
}

function filterByCategory(catName) {
  activeFilters.categories = [catName];
  showPage('products');
  // Check the right checkbox after render
  setTimeout(() => {
    const cb = document.querySelector(`#categoryFilters input[value="${catName}"]`);
    if (cb) { cb.checked = true; cb.closest('.filter-check').classList.add('active'); }
    filterProducts();
  }, 50);
}

/* ══════════════ PRODUCT DETAIL ══════════════ */
function openDetail(id) {
  currentDetailId = id;
  detailQty = 1;
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) return;

  const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : null;

  document.getElementById('detailContent').innerHTML = `
    <a class="detail-back" href="#" onclick="history.back()">← Back</a>
    <div class="detail-layout">
      <!-- Gallery -->
      <div class="detail-gallery">
        <div class="detail-main-img">
          <span class="emoji">${p.emoji}</span>
        </div>
        <div class="detail-thumbs">
          ${[p.emoji, '🔲', '📦', '🎁'].map((e,i) => `
            <div class="detail-thumb ${i===0?'active':''}" onclick="selectThumb(this,'${e}')">${e}</div>
          `).join('')}
        </div>
      </div>
      <!-- Info -->
      <div class="detail-info">
        <div class="detail-cat">${p.category}</div>
        <h1 class="detail-name">${p.name}</h1>
        <div class="detail-rating">
          <div class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div>
          <span class="count">${p.rating} · ${p.reviews.toLocaleString()} reviews</span>
        </div>
        <div class="detail-price">
          <span class="current">$${p.price}</span>
          ${p.originalPrice ? `<span class="original">$${p.originalPrice}</span>` : ''}
          ${discount ? `<span class="save">Save ${discount}%</span>` : ''}
        </div>
        <p class="detail-desc">${p.desc}</p>

        <!-- Colors -->
        <div class="detail-options">
          <div class="detail-option-label">Color</div>
          <div class="color-swatches">
            ${['#7c5cfc','#00d4ff','#ff6b6b','#2d2d2d','#fff'].map((c,i)=>`
              <div class="swatch ${i===0?'active':''}" style="background:${c}" onclick="selectSwatch(this)"></div>
            `).join('')}
          </div>
        </div>
        <!-- Size -->
        <div class="detail-options">
          <div class="detail-option-label">Size</div>
          <div class="size-btns">
            ${['XS','S','M','L','XL'].map((s,i)=>`
              <button class="size-btn ${i===2?'active':''}" onclick="selectSize(this)">${s}</button>
            `).join('')}
          </div>
        </div>
        <!-- Qty -->
        <div class="detail-qty">
          <span class="detail-qty-label">Quantity</span>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeDetailQty(-1)">−</button>
            <span class="qty-val" id="detailQtyVal">1</span>
            <button class="qty-btn" onclick="changeDetailQty(1)">+</button>
          </div>
        </div>
        <!-- Actions -->
        <div class="detail-actions">
          <button class="btn-add-detail" onclick="addToCart(${p.id}, detailQty)">Add to Cart</button>
          <button class="btn-wish" onclick="showToast('Added to wishlist','❤️')">♡</button>
        </div>
        <!-- Features -->
        <div class="detail-features">
          <div class="feat-item"><span class="feat-icon">🚚</span> Free shipping over $300</div>
          <div class="feat-item"><span class="feat-icon">↩️</span> 30-day returns</div>
          <div class="feat-item"><span class="feat-icon">🛡️</span> 2-year warranty</div>
          <div class="feat-item"><span class="feat-icon">✅</span> Authentic products</div>
        </div>
      </div>
    </div>`;

  showPage('detail');
}

function selectThumb(el, emoji) {
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const mainEmoji = document.querySelector('.detail-main-img .emoji');
  if (mainEmoji) mainEmoji.textContent = emoji;
}

function selectSwatch(el) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function selectSize(el) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function changeDetailQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  const el = document.getElementById('detailQtyVal');
  if (el) el.textContent = detailQty;
}

/* ══════════════ SCROLL TO FEATURED ══════════════ */
function scrollToFeatured() {
  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════ INIT ══════════════ */
function init() {
  updateCartBadge();
  renderCategories();
  renderFeatured();
  buildFilters();
  renderProductGrid('productsGrid', PRODUCTS);
  document.getElementById('productCount').textContent = `${PRODUCTS.length} products found`;
}

document.addEventListener('DOMContentLoaded', init);