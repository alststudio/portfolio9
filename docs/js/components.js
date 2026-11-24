/* ============================================================
   Blendy — komponen bersama: header situs, footer, drawer
   keranjang, dan modal detail produk. Dirender dari satu
   sumber agar konsisten di semua halaman.
   ============================================================ */

/* ---------- Sesi demo (hanya nama + email, tanpa kata sandi) ---------- */
var USER_KEY = "blendy_demo_user";

function getDemoUser() {
  try {
    var raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function setDemoUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (e) {}
}

function getOrders() {
  try {
    var raw = localStorage.getItem("blendy_orders");
    var list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}

function saveOrder(order) {
  var list = getOrders();
  list.unshift(order);
  try { localStorage.setItem("blendy_orders", JSON.stringify(list)); } catch (e) {}
}

/* ---------- Header situs ---------- */
function siteHeaderHTML(active) {
  var user = getDemoUser();
  var accountLink = user
    ? "<a href=\"account.html\" data-account-link>Halo, " + escapeHTML(user.name.split(" ")[0]) + "</a>"
    : "<a href=\"login.html\" data-account-link>Login</a>";
  function nav(href, label, key) {
    return "<a href=\"" + href + "\"" + (active === key ? " class=\"active\" aria-current=\"page\"" : "") + ">" + label + "</a>";
  }
  return "<div class=\"site-bar-inner\">" +
    "<a class=\"site-logo\" href=\"index.html\">Blendy<span class=\"logo-dot\">.</span></a>" +
    "<button class=\"nav-toggle\" type=\"button\" aria-label=\"Buka menu navigasi\" aria-expanded=\"false\" data-nav-toggle><span></span><span></span><span></span></button>" +
    "<nav class=\"site-nav\" data-site-nav aria-label=\"Navigasi utama\">" +
      nav("index.html", "Home", "home") +
      nav("shop.html", "Shop", "shop") +
      nav("about.html", "Our Story", "about") +
      nav("shop.html", "Flavours", "flavours") +
      nav("contact.html", "Contact", "contact") +
    "</nav>" +
    "<div class=\"site-actions\">" +
      accountLink +
      "<a href=\"register.html\" class=\"hide-sm\">Register</a>" +
      "<button type=\"button\" class=\"cart-btn\" data-open-cart aria-label=\"Buka keranjang belanja\">" +
        "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"21\" r=\"1.6\"/><circle cx=\"19\" cy=\"21\" r=\"1.6\"/><path d=\"M2.5 3h2l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h9.7a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6\"/></svg>" +
        "<span class=\"cart-badge\" data-cart-count hidden>0</span>" +
      "</button>" +
    "</div>" +
  "</div>";
}

/* ---------- Footer situs ---------- */
function siteFooterHTML() {
  return "<div class=\"footer-grid\">" +
    "<div class=\"footer-brand\">" +
      "<a class=\"site-logo light\" href=\"index.html\">Blendy<span class=\"logo-dot\">.</span></a>" +
      "<p>Real Fruit. Real Freshness. Smoothie buah premium dengan pilihan rasa Berry, Kiwi, Banana, dan Strawberry untuk setiap momen harimu.</p>" +
      "<div class=\"social-row\">" +
        "<a href=\"" + SITE_CONFIG.instagram + "\" aria-label=\"Instagram Blendy\">IG</a>" +
        "<a href=\"" + SITE_CONFIG.tiktok + "\" aria-label=\"TikTok Blendy\">TT</a>" +
        "<a href=\"" + SITE_CONFIG.youtube + "\" aria-label=\"YouTube Blendy\">YT</a>" +
      "</div>" +
    "</div>" +
    "<div class=\"footer-col\"><h4>Navigasi</h4>" +
      "<a href=\"index.html\">Home</a><a href=\"shop.html\">Shop</a><a href=\"about.html\">Our Story</a><a href=\"contact.html\">Contact</a><a href=\"account.html\">My Account</a>" +
    "</div>" +
    "<div class=\"footer-col\"><h4>Kategori Produk</h4>" +
      "<a href=\"shop.html?cat=berry\">Berry</a><a href=\"shop.html?cat=kiwi\">Kiwi</a><a href=\"shop.html?cat=banana\">Banana</a><a href=\"shop.html?cat=strawberry\">Strawberry</a>" +
    "</div>" +
    "<div class=\"footer-col\"><h4>Hubungi Kami</h4>" +
      "<p>" + SITE_CONFIG.email + "</p><p>WhatsApp: " + SITE_CONFIG.whatsappDisplay + "</p><p>" + SITE_CONFIG.address + "</p><p>" + SITE_CONFIG.hours + "</p>" +
    "</div>" +
  "</div>" +
  "<div class=\"footer-bottom\"><span>\u00A9 2026 Blendy. All Rights Reserved.</span><span class=\"muted\">Website demo \u2014 belum terhubung ke backend.</span></div>";
}

/* ---------- Drawer keranjang + overlay ---------- */
function cartDrawerHTML() {
  return "<div class=\"drawer-overlay\" id=\"drawerOverlay\" data-close-cart></div>" +
  "<aside class=\"cart-drawer\" id=\"cartDrawer\" aria-label=\"Keranjang belanja\">" +
    "<div class=\"drawer-head\"><h3>Keranjang Kamu</h3>" +
    "<button type=\"button\" class=\"drawer-close\" data-close-cart aria-label=\"Tutup keranjang\">\u00D7</button></div>" +
    "<div class=\"drawer-body\" id=\"cartDrawerBody\"></div>" +
    "<div class=\"drawer-foot\" id=\"cartDrawerFoot\"></div>" +
  "</aside>";
}

/* ---------- Modal detail produk ---------- */
function productModalHTML() {
  return "<div class=\"modal-overlay\" id=\"productModal\" hidden>" +
    "<div class=\"modal-card\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modalName\">" +
      "<button type=\"button\" class=\"modal-close\" data-close-modal aria-label=\"Tutup detail produk\">\u00D7</button>" +
      "<div class=\"modal-media\" id=\"modalMedia\"></div>" +
      "<div class=\"modal-info\">" +
        "<span class=\"modal-flavour\" id=\"modalFlavour\"></span>" +
        "<h3 id=\"modalName\"></h3>" +
        "<div class=\"modal-rating\" id=\"modalRating\"></div>" +
        "<p class=\"modal-desc\" id=\"modalDesc\"></p>" +
        "<div class=\"modal-price\" id=\"modalPrice\"></div>" +
        "<div class=\"modal-label\">Pilih Ukuran</div>" +
        "<div class=\"size-row\" id=\"modalSizes\"></div>" +
        "<div class=\"modal-label\">Jumlah</div>" +
        "<div class=\"qty-stepper big\">" +
          "<button type=\"button\" id=\"modalQtyDec\" aria-label=\"Kurangi jumlah\">\u2212</button>" +
          "<span id=\"modalQty\">1</span>" +
          "<button type=\"button\" id=\"modalQtyInc\" aria-label=\"Tambah jumlah\">+</button>" +
        "</div>" +
        "<button type=\"button\" class=\"btn btn-primary btn-block\" id=\"modalAdd\">Add to Cart</button>" +
        "<ul class=\"modal-meta\" id=\"modalMeta\"></ul>" +
        "<div class=\"modal-recs\"><h4>Kamu Mungkin Juga Suka</h4><div class=\"rec-row\" id=\"modalRecs\"></div></div>" +
      "</div>" +
    "</div>" +
  "</div>";
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------- Render komponen ke placeholder ---------- */
function renderComponents() {
  var page = document.body.getAttribute("data-page") || "";
  var headerSlot = document.querySelector("[data-site-header]");
  if (headerSlot) headerSlot.innerHTML = siteHeaderHTML(page);
  var footerSlot = document.querySelector("[data-site-footer]");
  if (footerSlot) footerSlot.innerHTML = siteFooterHTML();
  if (!document.getElementById("cartDrawer")) {
    var wrap = document.createElement("div");
    wrap.innerHTML = cartDrawerHTML();
    document.body.appendChild(wrap);
  }
  if (!document.getElementById("productModal")) {
    var wrap2 = document.createElement("div");
    wrap2.innerHTML = productModalHTML();
    document.body.appendChild(wrap2);
  }
  var toggle = document.querySelector("[data-nav-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var nav = document.querySelector("[data-site-nav]");
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
}

document.addEventListener("DOMContentLoaded", renderComponents);
