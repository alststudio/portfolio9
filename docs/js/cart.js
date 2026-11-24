/* ============================================================
   BLENDY — cart.js
   Keranjang belanja: state, localStorage, drawer, halaman cart.
   Item unik = productId + sizeKey (ukuran sama digabung,
   ukuran berbeda menjadi baris terpisah).
   ============================================================ */

"use strict";

const CART_KEY = "blendy_cart_v1";
const VOUCHER_KEY = "blendy_voucher_v1";

const Cart = {
  items: [],
  voucherApplied: false,

  load: function () {
    try {
      const raw = localStorage.getItem(CART_KEY);
      this.items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(this.items)) this.items = [];
      this.voucherApplied = localStorage.getItem(VOUCHER_KEY) === "1";
    } catch (e) {
      this.items = [];
      this.voucherApplied = false;
    }
    this.items = this.items.filter(function (it) {
      return getProduct(it.id) && sizeByKey(it.size) && it.qty > 0;
    });
  },

  save: function () {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(this.items));
      localStorage.setItem(VOUCHER_KEY, this.voucherApplied ? "1" : "0");
    } catch (e) { /* penyimpanan tidak tersedia — cart tetap jalan di memori */ }
    this.syncUI();
  },

  add: function (productId, sizeKey, qty) {
    qty = qty || 1;
    const found = this.items.find(function (it) {
      return it.id === productId && it.size === sizeKey;
    });
    if (found) found.qty += qty;
    else this.items.push({ id: productId, size: sizeKey, qty: qty });
    this.save();
    const p = getProduct(productId);
    if (p && typeof showToast === "function") {
      showToast(p.name + " (" + sizeByKey(sizeKey).name + ") masuk keranjang.");
    }
    pulseCartBadge();
  },

  remove: function (productId, sizeKey) {
    this.items = this.items.filter(function (it) {
      return !(it.id === productId && it.size === sizeKey);
    });
    this.save();
  },

  setQty: function (productId, sizeKey, qty) {
    if (qty <= 0) { this.remove(productId, sizeKey); return; }
    const found = this.items.find(function (it) {
      return it.id === productId && it.size === sizeKey;
    });
    if (found) { found.qty = qty; this.save(); }
  },

  clear: function () {
    this.items = [];
    this.voucherApplied = false;
    this.save();
  },

  count: function () {
    return this.items.reduce(function (n, it) { return n + it.qty; }, 0);
  },

  subtotal: function () {
    return this.items.reduce(function (sum, it) {
      const p = getProduct(it.id);
      return sum + (p ? priceFor(p, it.size) * it.qty : 0);
    }, 0);
  },

  discount: function () {
    if (!this.voucherApplied) return 0;
    return Math.round(this.subtotal() * CONFIG.voucher.percent / 100);
  },

  total: function () {
    return this.subtotal() - this.discount();
  },

  applyVoucher: function (code) {
    const clean = (code || "").trim().toUpperCase();
    if (clean === CONFIG.voucher.code) {
      this.voucherApplied = true;
      this.save();
      return { ok: true, msg: "Voucher " + CONFIG.voucher.code + " aktif — " + CONFIG.voucher.label + " diterapkan." };
    }
    return { ok: false, msg: "Kode voucher tidak ditemukan. Coba lagi ya." };
  },

  removeVoucher: function () {
    this.voucherApplied = false;
    this.save();
  },

  /* Perbarui badge + drawer + halaman cart bila ada */
  syncUI: function () {
    const count = this.count();
    document.querySelectorAll(".cart-count").forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
    renderCartDrawer();
    if (document.getElementById("cartPageItems")) renderCartPage();
    if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
  }
};

function pulseCartBadge() {
  document.querySelectorAll(".cart-count").forEach(function (el) {
    el.classList.remove("pulse");
    void el.offsetWidth;
    el.classList.add("pulse");
  });
}

/* ---------- Baris item cart (dipakai drawer & halaman) ---------- */
function cartLineHTML(it) {
  const p = getProduct(it.id);
  const size = sizeByKey(it.size);
  const price = priceFor(p, it.size);
  return '' +
  '<div class="cart-line" data-id="' + p.id + '" data-size="' + it.size + '">' +
    '<div class="cart-line-art" style="background:' + FLAVOURS[p.category].soft + '">' + bottleSVG(p.category, { label: false, straw: false, id: "cl" + p.id + it.size }) + '</div>' +
    '<div class="cart-line-info">' +
      '<strong>' + p.name + '</strong>' +
      '<span class="cart-line-size">' + size.name + ' · ' + size.note + '</span>' +
      '<span class="cart-line-price">' + formatRp(price) + '</span>' +
    '</div>' +
    '<div class="cart-line-actions">' +
      '<div class="qty-stepper" role="group" aria-label="Jumlah ' + p.name + '">' +
        '<button type="button" class="qty-btn" data-cart-dec aria-label="Kurangi jumlah">−</button>' +
        '<span class="qty-val" aria-live="polite">' + it.qty + '</span>' +
        '<button type="button" class="qty-btn" data-cart-inc aria-label="Tambah jumlah">+</button>' +
      '</div>' +
      '<button type="button" class="cart-remove" data-cart-remove aria-label="Hapus ' + p.name + ' dari keranjang">Hapus</button>' +
    '</div>' +
  '</div>';
}

function cartTotalsHTML() {
  const diskon = Cart.discount();
  return '' +
  '<div class="totals">' +
    '<div class="totals-row"><span>Subtotal</span><strong>' + formatRp(Cart.subtotal()) + '</strong></div>' +
    (diskon > 0 ? '<div class="totals-row discount"><span>Diskon voucher (' + CONFIG.voucher.code + ')</span><strong>−' + formatRp(diskon) + '</strong></div>' : "") +
    '<div class="totals-row grand"><span>Total</span><strong>' + formatRp(Cart.total()) + '</strong></div>' +
  '</div>';
}

/* ---------- Drawer ---------- */
function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const foot = document.getElementById("cartDrawerFoot");
  if (!body || !foot) return;
  if (Cart.items.length === 0) {
    body.innerHTML = '<div class="cart-empty">' + fruitSVG("strawberry") +
      '<p>Keranjangmu masih kosong.</p><span>Yuk, pilih smoothie favoritmu dulu.</span></div>';
    foot.innerHTML = '<a class="btn btn-primary btn-block" href="shop.html">Lihat Katalog</a>';
    return;
  }
  body.innerHTML = Cart.items.map(cartLineHTML).join("");
  foot.innerHTML = cartTotalsHTML() +
    '<div class="drawer-btns">' +
      '<a class="btn btn-primary" href="checkout.html">Checkout</a>' +
      '<a class="btn btn-ghost" href="cart.html">Lihat Keranjang</a>' +
    '</div>' +
    '<button type="button" class="link-btn" data-cart-clear>Kosongkan keranjang</button>';
}

function openCartDrawer() {
  const d = document.getElementById("cartDrawer");
  const o = document.getElementById("drawerOverlay");
  if (!d) return;
  renderCartDrawer();
  d.classList.add("open");
  d.setAttribute("aria-hidden", "false");
  if (o) o.classList.add("show");
  document.body.classList.add("no-scroll");
}

function closeCartDrawer() {
  const d = document.getElementById("cartDrawer");
  const o = document.getElementById("drawerOverlay");
  if (!d) return;
  d.classList.remove("open");
  d.setAttribute("aria-hidden", "true");
  if (o) o.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

/* ---------- Halaman cart.html ---------- */
function renderCartPage() {
  const wrap = document.getElementById("cartPageItems");
  const side = document.getElementById("cartPageSummary");
  if (!wrap) return;
  if (Cart.items.length === 0) {
    wrap.innerHTML = '<div class="cart-empty big">' + fruitSVG("berry") +
      '<h3>Keranjang masih kosong</h3><p>Belum ada smoothie yang dipilih. Jelajahi katalog dan temukan favoritmu.</p>' +
      '<a class="btn btn-primary" href="shop.html">Mulai Belanja</a></div>';
    if (side) side.innerHTML = "";
    return;
  }
  wrap.innerHTML = Cart.items.map(cartLineHTML).join("");
  if (side) {
    side.innerHTML = '<h3>Ringkasan Belanja</h3>' + cartTotalsHTML() +
      voucherBoxHTML("page") +
      '<a class="btn btn-primary btn-block" href="checkout.html">Lanjut ke Checkout</a>' +
      '<button type="button" class="link-btn" data-cart-clear>Kosongkan keranjang</button>' +
      '<p class="demo-note">Mode demo: belum ada pembayaran sungguhan.</p>';
  }
}

function voucherBoxHTML(scope) {
  if (Cart.voucherApplied) {
    return '<div class="voucher-box applied"><p>Voucher <strong>' + CONFIG.voucher.code + '</strong> sedang aktif (' + CONFIG.voucher.label + ').</p>' +
      '<button type="button" class="link-btn" data-voucher-remove>Lepas voucher</button></div>';
  }
  return '<form class="voucher-box" data-voucher-form="' + scope + '">' +
    '<label for="voucher-' + scope + '">Punya kode voucher?</label>' +
    '<div class="voucher-row"><input id="voucher-' + scope + '" name="voucher" type="text" placeholder="cth. ' + CONFIG.voucher.code + '" autocomplete="off">' +
    '<button class="btn btn-dark" type="submit">Pakai</button></div>' +
    '<p class="form-msg" data-voucher-msg role="status"></p></form>';
}

/* ---------- Event delegation untuk semua kontrol cart ---------- */
document.addEventListener("click", function (e) {
  const line = e.target.closest(".cart-line");
  const id = line ? line.getAttribute("data-id") : null;
  const size = line ? line.getAttribute("data-size") : null;

  if (e.target.closest("[data-cart-open]")) { e.preventDefault(); openCartDrawer(); return; }
  if (e.target.closest("[data-cart-close]") || e.target.id === "drawerOverlay") { closeCartDrawer(); return; }

  if (!line) {
    if (e.target.closest("[data-cart-clear]")) { Cart.clear(); if (typeof showToast === "function") showToast("Keranjang dikosongkan."); }
    if (e.target.closest("[data-voucher-remove]")) { Cart.removeVoucher(); }
    return;
  }
  const item = Cart.items.find(function (it) { return it.id === id && it.size === size; });
  if (!item) return;
  if (e.target.closest("[data-cart-inc]")) Cart.setQty(id, size, item.qty + 1);
  else if (e.target.closest("[data-cart-dec]")) Cart.setQty(id, size, item.qty - 1);
  else if (e.target.closest("[data-cart-remove]")) { Cart.remove(id, size); if (typeof showToast === "function") showToast("Item dihapus dari keranjang."); }
});

document.addEventListener("submit", function (e) {
  const form = e.target.closest("[data-voucher-form]");
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector("input[name=voucher]");
  const msg = form.querySelector("[data-voucher-msg]");
  const res = Cart.applyVoucher(input ? input.value : "");
  if (msg) { msg.textContent = res.msg; msg.className = "form-msg " + (res.ok ? "ok" : "err"); }
  if (!res.ok && typeof showToast === "function") showToast(res.msg);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeCartDrawer();
});

/* ---------- Init ---------- */
Cart.load();
document.addEventListener("DOMContentLoaded", function () { Cart.syncUI(); });
