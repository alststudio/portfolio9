/* ============================================================
   BLENDY — app.js
   Inisialisasi global + logika per halaman:
   header scroll, scroll reveal, featured, katalog shop,
   newsletter, FAQ, testimoni, kontak, dan akun demo.
   ============================================================ */

"use strict";

/* ---------- Flash message (antar halaman) ---------- */
function readFlash() {
  try {
    const msg = sessionStorage.getItem("blendy_flash");
    if (msg) {
      sessionStorage.removeItem("blendy_flash");
      setTimeout(function () { showToast(msg); }, 250);
    }
  } catch (e) { /* abaikan */ }
}

/* ---------- Header: transparan → putih blur setelah scroll ---------- */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
function initReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || REDUCED) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
  els.forEach(function (el) { io.observe(el); });
}

/* ---------- Featured Products (home) ---------- */
function initFeatured() {
  const host = document.getElementById("featuredGrid");
  if (!host) return;
  const featured = ["berry-blast", "kiwi-fresh", "banana-smooth", "strawberry-dream"]
    .map(getProduct).filter(Boolean);
  host.innerHTML = featured.map(productCardHTML).join("");
}

/* ============================================================
   SHOP — katalog: filter, pencarian, sortir, load more
   ============================================================ */
const shopState = { cat: "all", query: "", sort: "featured", shown: 4 };
const PAGE_SIZE = 4;

function shopFiltered() {
  let list = PRODUCTS.slice();
  if (shopState.cat !== "all") list = list.filter(function (p) { return p.category === shopState.cat; });
  if (shopState.query) {
    const q = shopState.query.toLowerCase();
    list = list.filter(function (p) {
      return p.name.toLowerCase().indexOf(q) !== -1 || p.description.toLowerCase().indexOf(q) !== -1;
    });
  }
  if (shopState.sort === "price-asc") list.sort(function (a, b) { return basePrice(a) - basePrice(b); });
  else if (shopState.sort === "price-desc") list.sort(function (a, b) { return basePrice(b) - basePrice(a); });
  else if (shopState.sort === "newest") list.sort(function (a, b) { return b.addedIndex - a.addedIndex; });
  return list;
}

function renderShop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;
  const list = shopFiltered();
  const visible = list.slice(0, shopState.shown);
  grid.innerHTML = visible.length
    ? visible.map(productCardHTML).join("")
    : '<div class="shop-none">' + fruitSVG("kiwi") + "<h3>Tidak ada produk yang cocok</h3><p>Coba ubah kata kunci atau pilih rasa lain ya.</p></div>";

  const info = document.getElementById("shopResultInfo");
  if (info) info.textContent = "Menampilkan " + visible.length + " dari " + list.length + " produk";

  const moreBtn = document.getElementById("loadMoreBtn");
  if (moreBtn) moreBtn.style.display = list.length > shopState.shown ? "" : "none";

  /* Kartu yang baru dirender langsung tampil (tanpa menunggu observer lama) */
  grid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });

  document.querySelectorAll("[data-shop-cat]").forEach(function (chip) {
    const active = chip.getAttribute("data-shop-cat") === shopState.cat;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function initShop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  /* Parameter URL: ?cat=berry / ?product=id */
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat");
  if (catParam && FLAVOURS[catParam]) shopState.cat = catParam;

  document.querySelectorAll("[data-shop-cat]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      shopState.cat = chip.getAttribute("data-shop-cat");
      shopState.shown = PAGE_SIZE;
      renderShop();
    });
  });

  const search = document.getElementById("shopSearch");
  if (search) search.addEventListener("input", function () {
    shopState.query = search.value.trim();
    shopState.shown = PAGE_SIZE;
    renderShop();
  });

  const sort = document.getElementById("shopSort");
  if (sort) sort.addEventListener("change", function () {
    shopState.sort = sort.value;
    shopState.shown = PAGE_SIZE;
    renderShop();
  });

  const moreBtn = document.getElementById("loadMoreBtn");
  if (moreBtn) moreBtn.addEventListener("click", function () {
    shopState.shown += PAGE_SIZE;
    renderShop();
  });

  renderShop();

  const productParam = params.get("product");
  if (productParam && getProduct(productParam)) {
    setTimeout(function () { openQuickView(productParam); }, 350);
  }
}

/* ---------- Newsletter (simulasi lokal, jujur dilabeli) ---------- */
function initNewsletter() {
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const msg = form.querySelector(".form-msg");
      const val = input.value.trim();
      if (!EMAIL_RE.test(val)) {
        if (msg) { msg.textContent = "Alamat email belum valid — periksa lagi ya."; msg.className = "form-msg err"; }
        input.focus();
        return;
      }
      try {
        const key = "blendy_newsletter_demo";
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        if (list.indexOf(val) === -1) list.push(val);
        localStorage.setItem(key, JSON.stringify(list));
      } catch (err) { /* abaikan */ }
      if (msg) { msg.textContent = "Terima kasih sudah mendaftar! (Mode demo: email hanya disimpan di browser ini, tidak dikirim ke server.)"; msg.className = "form-msg ok"; }
      showToast("Berhasil mendaftar newsletter (demo).");
      form.reset();
    });
  });
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach(function (item) {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });
}

/* ---------- Testimoni carousel ---------- */
function initTestimonials() {
  const track = document.getElementById("testiTrack");
  if (!track) return;
  const cards = track.children.length;
  let idx = 0;
  const update = function () {
    const w = track.children[0].getBoundingClientRect().width + 20;
    track.style.transform = "translateX(" + (-idx * w) + "px)";
    const dots = document.querySelectorAll("[data-testi-dot]");
    dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
  };
  const prev = document.querySelector("[data-testi-prev]");
  const next = document.querySelector("[data-testi-next]");
  if (prev) prev.addEventListener("click", function () { idx = (idx - 1 + cards) % cards; update(); });
  if (next) next.addEventListener("click", function () { idx = (idx + 1) % cards; update(); });
  document.querySelectorAll("[data-testi-dot]").forEach(function (d, i) {
    d.addEventListener("click", function () { idx = i; update(); });
  });
  window.addEventListener("resize", update);
  update();
}

/* ---------- Form kontak (simulasi) ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    const checks = [
      { el: form.querySelector("[name=name]"), test: function (v) { return v.trim().length >= 3 || "Nama wajib diisi (min. 3 karakter)."; } },
      { el: form.querySelector("[name=email]"), test: function (v) { return EMAIL_RE.test(v.trim()) || "Format email belum benar."; } },
      { el: form.querySelector("[name=subject]"), test: function (v) { return v.trim().length >= 4 || "Subject wajib diisi (min. 4 karakter)."; } },
      { el: form.querySelector("[name=message]"), test: function (v) { return v.trim().length >= 10 || "Pesan wajib diisi (min. 10 karakter)."; } }
    ];
    checks.forEach(function (c) {
      const res = c.test(c.el.value);
      if (res !== true) { fieldError(c.el, res); valid = false; } else fieldError(c.el, "");
    });
    const msg = document.getElementById("contactMsg");
    if (!valid) { if (msg) { msg.textContent = ""; } return; }
    if (msg) {
      msg.textContent = "Terima kasih! Pesanmu sudah kami terima dalam mode demo — pesan ini tidak benar-benar terkirim ke server. Untuk respons cepat, hubungi kami lewat WhatsApp di nomor contoh pada halaman ini.";
      msg.className = "form-msg ok big";
    }
    showToast("Pesan terkirim (simulasi demo).");
    form.reset();
  });
}

/* ============================================================
   AKUN DEMO — login / register / lupa password / akun saya
   Tidak pernah menyimpan password. Lihat README.md.
   ============================================================ */
function initAuth() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = loginForm.querySelector("[name=email]");
      const pass = loginForm.querySelector("[name=password]");
      let valid = true;
      if (!EMAIL_RE.test(email.value.trim())) { fieldError(email, "Format email belum benar."); valid = false; } else fieldError(email, "");
      if (pass.value.length < 6) { fieldError(pass, "Password wajib diisi (min. 6 karakter untuk demo)."); valid = false; } else fieldError(pass, "");
      if (!valid) return;
      const name = email.value.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      setDemoUser({ name: name, email: email.value.trim() });
      showToast("Selamat datang kembali, " + name + "! (Mode demo)");
      setTimeout(function () { window.location.href = "account.html"; }, 500);
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = registerForm.querySelector("[name=name]");
      const email = registerForm.querySelector("[name=email]");
      const pass = registerForm.querySelector("[name=password]");
      const pass2 = registerForm.querySelector("[name=password2]");
      let valid = true;
      if (name.value.trim().length < 3) { fieldError(name, "Nama wajib diisi (min. 3 karakter)."); valid = false; } else fieldError(name, "");
      if (!EMAIL_RE.test(email.value.trim())) { fieldError(email, "Format email belum benar."); valid = false; } else fieldError(email, "");
      if (pass.value.length < 6) { fieldError(pass, "Password minimal 6 karakter."); valid = false; } else fieldError(pass, "");
      if (pass2.value !== pass.value) { fieldError(pass2, "Konfirmasi password tidak sama."); valid = false; } else fieldError(pass2, "");
      if (!valid) return;
      /* Password TIDAK disimpan — hanya nama & email untuk sesi demo. */
      setDemoUser({ name: name.value.trim(), email: email.value.trim() });
      showToast("Akun demo berhasil dibuat. Selamat datang!");
      setTimeout(function () { window.location.href = "account.html"; }, 500);
    });
  }

  const forgotToggle = document.getElementById("forgotToggle");
  const forgotPanel = document.getElementById("forgotPanel");
  if (forgotToggle && forgotPanel) {
    forgotToggle.addEventListener("click", function () {
      const open = forgotPanel.classList.toggle("open");
      forgotToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    const forgotForm = document.getElementById("forgotForm");
    if (forgotForm) forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = forgotForm.querySelector("[name=email]");
      const msg = document.getElementById("forgotMsg");
      if (!EMAIL_RE.test(email.value.trim())) {
        if (msg) { msg.textContent = "Format email belum benar."; msg.className = "form-msg err"; }
        return;
      }
      if (msg) {
        msg.textContent = "Tautan reset terkirim (simulasi) — di mode demo tidak ada email yang benar-benar dikirim. Silakan kembali login dengan password demo apa pun (min. 6 karakter).";
        msg.className = "form-msg ok";
      }
    });
  }
}

function initAccount() {
  const host = document.getElementById("accountDetail");
  if (!host) return;
  const user = getDemoUser();
  if (!user) {
    host.innerHTML = '<div class="cart-empty big">' + fruitSVG("banana") +
      "<h3>Kamu belum masuk</h3><p>Masuk atau daftar dulu untuk melihat halaman akun demo ini.</p>" +
      '<div class="row-btns"><a class="btn btn-primary" href="login.html">Login</a><a class="btn btn-ghost" href="register.html">Register</a></div></div>';
    return;
  }
  const orders = getOrders();
  const ordersHTML = orders.length
    ? orders.map(function (o) {
        const items = o.items.map(function (it) { return it.name + " (" + it.size + ") × " + it.qty; }).join(", ");
        const tgl = new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
        return '<div class="order-row"><div><strong>' + o.number + '</strong><span>' + tgl + " · " + escapeHTML(items) + '</span></div><strong>' + formatRp(o.total) + "</strong></div>";
      }).join("")
    : "<p>Belum ada pesanan. Riwayat dari checkout demo akan muncul di sini.</p>";

  host.innerHTML =
    '<div class="account-grid">' +
      '<div class="success-card"><h3>Profil Demo</h3>' +
        "<p><strong>" + escapeHTML(user.name) + "</strong></p><p>" + escapeHTML(user.email) + "</p>" +
        '<p class="demo-note">Mode demo: data ini hanya tersimpan di browser kamu (tanpa password) dan belum terhubung ke server.</p>' +
        '<button type="button" class="btn btn-ghost" id="logoutBtn">Keluar (Logout)</button></div>' +
      '<div class="success-card"><h3>Order History</h3>' + ordersHTML + "</div>" +
    "</div>";

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", function () {
    setDemoUser(null);
    showToast("Sampai jumpa! Kamu sudah keluar (demo).");
    setTimeout(function () { window.location.href = "index.html"; }, 500);
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", function () {
  renderHeader(document.body.getAttribute("data-nav") || "");
  renderFooter();
  initHeaderScroll();
  initFeatured();
  initShop();
  initNewsletter();
  initFaq();
  initTestimonials();
  initContactForm();
  initAuth();
  initAccount();
  initReveals();
  readFlash();
  if (typeof Cart !== "undefined") Cart.syncUI();
});
