/* ============================================================
   BLENDY — components.js
   Header & footer dirender dari sini ke placeholder di setiap
   halaman agar markup konsisten tanpa duplikasi.
   Juga berisi: toast, kartu produk, dan modal Quick View.
   ============================================================ */

"use strict";

/* ---------- Sesi demo (TANPA password — lihat README) ---------- */
const USER_KEY = "blendy_demo_user";

function getDemoUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function setDemoUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify({ name: user.name, email: user.email }));
    else localStorage.removeItem(USER_KEY);
  } catch (e) { /* abaikan */ }
}

/* ---------- Logo ---------- */
function logoSVG() {
  return '<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true">' +
    '<circle cx="24" cy="27" r="16" fill="#F2AFC0"/>' +
    '<circle cx="18" cy="21" r="5" fill="#FFFFFF" opacity="0.5"/>' +
    '<path d="M24 12 q1 -7 8 -9 q1 7 -5 10 q8 -1 11 4 q-7 4 -13 -1 q-1 -2 -1 -4z" fill="#6F9E3E"/>' +
    '<rect x="21.5" y="4" width="4.5" height="10" rx="2.25" transform="rotate(14 24 9)" fill="#D96B8A"/>' +
  '</svg>';
}

/* ---------- Header ---------- */
function renderHeader(active) {
  const host = document.getElementById("siteHeader");
  if (!host) return;
  const user = getDemoUser();
  const link = function (href, key, label) {
    return '<a href="' + href + '" class="nav-link' + (active === key ? " active" : "") + '"' +
      (active === key ? ' aria-current="page"' : "") + '>' + label + '</a>';
  };
  const accountHTML = user
    ? '<a href="account.html" class="nav-link nav-user">Hai, ' + escapeHTML(user.name.split(" ")[0]) + '</a>'
    : '<a href="login.html" class="nav-link">Login</a><a href="register.html" class="btn btn-dark btn-sm">Register</a>';

  host.innerHTML =
  '<div class="header-inner">' +
    '<a class="logo" href="index.html" aria-label="Blendy — kembali ke Home">' + logoSVG() + '<span class="logo-text">blendy</span></a>' +
    '<nav class="main-nav" id="mainNav" aria-label="Navigasi utama">' +
      link("index.html", "home", "Home") +
      link("shop.html", "shop", "Shop") +
      link("about.html", "story", "Our Story") +
      '<a href="shop.html" class="nav-link' + (active === "flavours" ? " active" : "") + '">Flavours</a>' +
      link("contact.html", "contact", "Contact") +
    '</nav>' +
    '<div class="header-actions">' +
      '<div class="header-account">' + accountHTML + '</div>' +
      '<button type="button" class="cart-btn" data-cart-open aria-label="Buka keranjang belanja">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.1 12.2a1.8 1.8 0 0 0 1.8 1.5h8.9a1.8 1.8 0 0 0 1.8-1.4L21.5 8H6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.5" fill="currentColor"/><circle cx="18" cy="21" r="1.5" fill="currentColor"/></svg>' +
        '<span class="cart-count" style="display:none">0</span>' +
      '</button>' +
      '<button type="button" class="burger" id="burgerBtn" aria-label="Buka menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>' +
    '</div>' +
  '</div>' +
  '<div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
    link("index.html", "home", "Home") +
    link("shop.html", "shop", "Shop") +
    link("about.html", "story", "Our Story") +
    '<a href="shop.html" class="nav-link">Flavours</a>' +
    link("contact.html", "contact", "Contact") +
    '<div class="mobile-menu-foot">' +
      (user
        ? '<a href="account.html" class="btn btn-dark">Akun Saya</a>'
        : '<a href="login.html" class="btn btn-ghost">Login</a><a href="register.html" class="btn btn-dark">Register</a>') +
    '</div>' +
  '</div>';

  const burger = document.getElementById("burgerBtn");
  const menu = document.getElementById("mobileMenu");
  burger.addEventListener("click", function () {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("no-scroll", open);
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      burger.classList.remove("open");
      document.body.classList.remove("no-scroll");
    });
  });
}

/* ---------- Footer ---------- */
function renderFooter() {
  const host = document.getElementById("siteFooter");
  if (!host) return;
  host.innerHTML =
  '<div class="footer-inner">' +
    '<div class="footer-brand">' +
      '<a class="logo" href="index.html">' + logoSVG() + '<span class="logo-text">blendy</span></a>' +
      '<p>' + CONFIG.tagline + ' Smoothie buah premium dengan rasa yang cerah, tampilan yang cantik, dan pengalaman belanja yang mudah.</p>' +
      '<div class="socials">' +
        '<a href="' + CONFIG.socials.instagram + '" target="_blank" rel="noopener" aria-label="Instagram Blendy (contoh)">' + socialIcon("instagram") + '</a>' +
        '<a href="' + CONFIG.socials.tiktok + '" target="_blank" rel="noopener" aria-label="TikTok Blendy (contoh)">' + socialIcon("tiktok") + '</a>' +
        '<a href="' + CONFIG.socials.youtube + '" target="_blank" rel="noopener" aria-label="YouTube Blendy (contoh)">' + socialIcon("youtube") + '</a>' +
      '</div>' +
    '</div>' +
    '<nav class="footer-col" aria-label="Navigasi website">' +
      '<h4>Navigasi</h4>' +
      '<a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">Our Story</a><a href="contact.html">Contact</a><a href="cart.html">Keranjang</a>' +
    '</nav>' +
    '<nav class="footer-col" aria-label="Kategori produk">' +
      '<h4>Flavours</h4>' +
      '<a href="shop.html?cat=berry">Berry</a><a href="shop.html?cat=kiwi">Kiwi</a><a href="shop.html?cat=banana">Banana</a><a href="shop.html?cat=strawberry">Strawberry</a>' +
    '</nav>' +
    '<div class="footer-col footer-contact">' +
      '<h4>Hubungi Kami</h4>' +
      '<p>' + CONFIG.address + '</p>' +
      '<p><a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a></p>' +
      '<p><a href="https://wa.me/' + CONFIG.whatsappNumber + '" target="_blank" rel="noopener">WhatsApp ' + CONFIG.whatsappDisplay + '</a></p>' +
      '<p>' + CONFIG.hours + '</p>' +
      '<a class="footer-news-link" href="index.html#newsletter">Langganan kabar &amp; promo →</a>' +
    '</div>' +
  '</div>' +
  '<div class="footer-bottom"><p>© 2026 Blendy. All Rights Reserved.</p><p class="footer-demo">Website demo — harga &amp; kontak adalah contoh.</p></div>';
}

function socialIcon(kind) {
  if (kind === "instagram") return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor"/></svg>';
  if (kind === "tiktok") return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 3v10.8a3.7 3.7 0 1 1 -3-3.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M14.5 3c.4 2.9 2.2 4.9 5.2 5.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.2 9.3v5.4l4.8-2.7z" fill="currentColor"/></svg>';
}

/* ---------- Util ---------- */
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------- Toast ---------- */
function showToast(msg) {
  let host = document.getElementById("toastHost");
  if (!host) {
    host = document.createElement("div");
    host.id = "toastHost";
    host.className = "toast-host";
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
  }
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' + escapeHTML(msg) + "</span>";
  host.appendChild(t);
  requestAnimationFrame(function () { t.classList.add("show"); });
  setTimeout(function () {
    t.classList.remove("show");
    setTimeout(function () { t.remove(); }, 350);
  }, 2600);
}

/* ---------- Kartu produk ---------- */
function productCardHTML(p) {
  const f = FLAVOURS[p.category];
  const price = basePrice(p);
  const priceHTML = p.promoPrice
    ? '<span class="price-old">' + formatRp(p.price) + '</span> <span class="price-now">' + formatRp(price) + "</span>"
    : '<span class="price-now">' + formatRp(price) + "</span>";
  return '' +
  '<article class="product-card reveal" data-product-card="' + p.id + '">' +
    '<button type="button" class="card-art" data-quick-view="' + p.id + '" style="background:' + f.soft + '" aria-label="Lihat detail ' + p.name + '">' +
      '<span class="card-bottle">' + bottleSVG(p.category, { id: "pc" + p.id }) + "</span>" +
      '<span class="card-fruit">' + fruitSVG(p.accentFruit) + "</span>" +
      (p.isNew ? '<span class="badge badge-new">Baru</span>' : "") +
      (p.promoPrice ? '<span class="badge badge-sale">Promo</span>' : "") +
      (!p.available ? '<span class="badge badge-out">Stok Habis</span>' : "") +
    "</button>" +
    '<div class="card-body">' +
      '<div class="card-top">' + starsSVG(p.rating) + '<span class="card-rating-num">' + String(p.rating).replace(".", ",") + " (" + p.reviews + ")</span></div>" +
      "<h3>" + p.name + "</h3>" +
      '<p class="card-desc">' + p.description + "</p>" +
      '<div class="card-price">' + priceHTML + '</div>' +
      '<div class="card-actions">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-quick-view="' + p.id + '">Quick View</button>' +
        '<button type="button" class="btn btn-primary btn-sm" data-add-cart="' + p.id + '"' + (p.available ? "" : " disabled") + '>Add to Cart</button>' +
      "</div>" +
    "</div>" +
  "</article>";
}

/* ---------- Modal Quick View / Detail produk ---------- */
let qvState = { id: null, size: "regular", qty: 1 };

function openQuickView(productId) {
  const p = getProduct(productId);
  if (!p) return;
  qvState = { id: productId, size: "regular", qty: 1 };
  const modal = document.getElementById("quickView");
  if (!modal) return;
  renderQuickView();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  const closeBtn = modal.querySelector("[data-qv-close]");
  if (closeBtn) closeBtn.focus();
}

function closeQuickView() {
  const modal = document.getElementById("quickView");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function renderQuickView() {
  const p = getProduct(qvState.id);
  const body = document.getElementById("qvBody");
  if (!p || !body) return;
  const f = FLAVOURS[p.category];
  const sizeOpts = SIZES.map(function (s) {
    return '<button type="button" class="size-chip' + (qvState.size === s.key ? " active" : "") + '" data-qv-size="' + s.key + '">' +
      s.name + '<small>' + s.note + (s.delta ? " · +" + formatRp(s.delta) : "") + "</small></button>";
  }).join("");
  const recs = PRODUCTS.filter(function (r) { return r.category === p.category && r.id !== p.id; })
    .concat(PRODUCTS.filter(function (r) { return r.category !== p.category; }))
    .slice(0, 3);
  const recHTML = recs.map(function (r) {
    return '<button type="button" class="qv-rec" data-quick-view="' + r.id + '">' +
      '<span class="qv-rec-art" style="background:' + FLAVOURS[r.category].soft + '">' + bottleSVG(r.category, { label: false, straw: false, id: "qr" + r.id }) + "</span>" +
      "<strong>" + r.name + "</strong><span>" + formatRp(basePrice(r)) + "</span></button>";
  }).join("");

  body.innerHTML =
  '<div class="qv-art" style="background:' + f.soft + '">' +
    '<span class="qv-bottle">' + bottleSVG(p.category, { id: "qv" + p.id }) + "</span>" +
    '<span class="qv-fruit">' + fruitSVG(p.accentFruit) + "</span>" +
  "</div>" +
  '<div class="qv-info">' +
    '<p class="qv-cat" style="color:' + f.deep + '">' + f.name + " Series</p>" +
    "<h3 id=\"qvTitle\">" + p.name + "</h3>" +
    '<div class="card-top">' + starsSVG(p.rating) + '<span class="card-rating-num">' + String(p.rating).replace(".", ",") + " · " + p.reviews + " ulasan contoh</span></div>" +
    '<p class="qv-desc">' + p.longDescription + "</p>" +
    '<div class="qv-price" id="qvPrice">' + formatRp(priceFor(p, qvState.size)) + "</div>" +
    '<div class="qv-group"><span class="qv-label">Ukuran</span><div class="size-chips">' + sizeOpts + "</div></div>" +
    '<div class="qv-group"><span class="qv-label">Jumlah</span>' +
      '<div class="qty-stepper big"><button type="button" class="qty-btn" data-qv-dec aria-label="Kurangi jumlah">−</button>' +
      '<span class="qty-val" id="qvQty">' + qvState.qty + '</span>' +
      '<button type="button" class="qty-btn" data-qv-inc aria-label="Tambah jumlah">+</button></div></div>' +
    '<button type="button" class="btn btn-primary btn-block" data-qv-add' + (p.available ? "" : " disabled") + ">" +
      (p.available ? "Add to Cart" : "Stok Habis") + "</button>" +
    '<ul class="qv-meta">' +
      "<li><strong>Bahan utama:</strong> " + p.ingredients + "</li>" +
      "<li><strong>Kategori:</strong> Smoothie " + f.name + "</li>" +
      "<li><strong>Ketersediaan:</strong> " + (p.available ? "Tersedia" : "Stok habis (contoh)") + "</li>" +
      "<li><strong>Penyajian:</strong> Nikmati dingin, kocok perlahan sebelum diminum.</li>" +
    "</ul>" +
    '<div class="qv-recs"><h4>Kamu Mungkin Suka</h4><div class="qv-rec-row">' + recHTML + "</div></div>" +
  "</div>";
}

/* Delegasi global: quick view & add to cart dari kartu */
document.addEventListener("click", function (e) {
  const qv = e.target.closest("[data-quick-view]");
  if (qv) { openQuickView(qv.getAttribute("data-quick-view")); return; }

  const add = e.target.closest("[data-add-cart]");
  if (add && !add.disabled) { Cart.add(add.getAttribute("data-add-cart"), "regular", 1); return; }

  if (e.target.closest("[data-qv-close]") || e.target.id === "quickView") { closeQuickView(); return; }

  const sizeBtn = e.target.closest("[data-qv-size]");
  if (sizeBtn) { qvState.size = sizeBtn.getAttribute("data-qv-size"); renderQuickView(); return; }
  if (e.target.closest("[data-qv-inc]")) { qvState.qty = Math.min(99, qvState.qty + 1); renderQuickView(); return; }
  if (e.target.closest("[data-qv-dec]")) { qvState.qty = Math.max(1, qvState.qty - 1); renderQuickView(); return; }
  const qvAdd = e.target.closest("[data-qv-add]");
  if (qvAdd && !qvAdd.disabled) { Cart.add(qvState.id, qvState.size, qvState.qty); closeQuickView(); openCartDrawer(); }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeQuickView();
});
