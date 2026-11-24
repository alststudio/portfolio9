/* ============================================================
   Blendy — logika halaman: katalog, modal produk, testimoni,
   FAQ, newsletter, formulir, dan akun demo.
   ============================================================ */

/* ---------- Kartu produk ---------- */
function productCardHTML(p) {
  var f = FLAVOURS[p.flavour];
  var priceHTML = p.promoPrice
    ? "<span class=\"price-old\">" + formatRp(p.price) + "</span> <span class=\"price-now\">" + formatRp(p.promoPrice) + "</span>"
    : "<span class=\"price-now\">" + formatRp(p.price) + "</span>";
  var badges = "";
  if (p.isNew) badges += "<span class=\"badge badge-new\">Baru</span>";
  if (p.promoPrice) badges += "<span class=\"badge badge-promo\">Promo</span>";
  if (!p.available) badges += "<span class=\"badge badge-out\">Stok Habis</span>";
  return "<article class=\"product-card reveal\">" +
    "<button type=\"button\" class=\"card-media\" data-qv=\"" + p.slug + "\" style=\"background-color:" + f.color + "\" aria-label=\"Lihat detail " + p.name + "\">" +
      "<span class=\"card-bottle\" style=\"" + bottleStyle(p.flavour) + "\"></span>" + badges +
    "</button>" +
    "<div class=\"card-body\">" +
      "<span class=\"card-flavour\" style=\"color:" + shadeOf(f.color) + "\">" + f.name + "</span>" +
      "<h3>" + p.name + "</h3>" +
      "<p>" + p.desc + "</p>" +
      "<div class=\"card-rating\"><span class=\"stars\">" + starRow(p.rating) + "</span><span>" + String(p.rating).replace(".", ",") + "</span></div>" +
      "<div class=\"card-price\">" + priceHTML + "</div>" +
      "<div class=\"card-actions\">" +
        "<button type=\"button\" class=\"btn btn-soft\" data-qv=\"" + p.slug + "\">Quick View</button>" +
        "<button type=\"button\" class=\"btn btn-primary\" data-add=\"" + p.slug + "\"" + (p.available ? "" : " disabled") + ">Add to Cart</button>" +
      "</div>" +
    "</div>" +
  "</article>";
}

/* Warna teks turunan sederhana dari warna pastel (untuk label rasa) */
function shadeOf(hex) {
  var map = { "#C2B0DC": "#7A63A8", "#B4D58A": "#5C8438", "#F3DA8A": "#9A7B1E", "#F2AFC0": "#B04A68" };
  return map[hex] || "#302B35";
}

/* ---------- Modal detail produk ---------- */
var modalState = { slug: null, size: "regular", qty: 1 };

function openProductModal(slug) {
  var p = getProduct(slug);
  var modal = document.getElementById("productModal");
  if (!p || !modal) return;
  modalState = { slug: slug, size: "regular", qty: 1 };
  var f = FLAVOURS[p.flavour];
  document.getElementById("modalMedia").innerHTML =
    "<span class=\"modal-bottle\" style=\"" + bottleStyle(p.flavour) + ";background-color:" + f.color + "\"></span>" +
    "<span class=\"modal-fruit mf1\" style=\"" + fruitStyle(p.flavour, 0) + "\"></span>" +
    "<span class=\"modal-fruit mf2\" style=\"" + fruitStyle(p.flavour, 2) + "\"></span>";
  document.getElementById("modalMedia").style.backgroundColor = f.color;
  document.getElementById("modalFlavour").textContent = "Rasa " + f.name;
  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalRating").innerHTML =
    "<span class=\"stars\">" + starRow(p.rating) + "</span> " + String(p.rating).replace(".", ",") + " <span class=\"muted\">(rating contoh)</span>";
  document.getElementById("modalDesc").textContent = p.longDesc;
  document.getElementById("modalMeta").innerHTML =
    "<li>Kategori: Smoothie " + f.name + "</li>" +
    "<li>Ukuran tersedia: Regular, Large, Extra Large</li>" +
    "<li>Ketersediaan: " + (p.available ? "Tersedia" : "Stok contoh sedang habis") + "</li>";
  var sizes = document.getElementById("modalSizes");
  sizes.innerHTML = SIZES.map(function (s) {
    return "<button type=\"button\" class=\"size-pill\" data-size=\"" + s.id + "\">" + s.label +
      "<small>" + (s.delta ? "+" + formatRp(s.delta) : "Dasar") + "</small></button>";
  }).join("");
  var recs = PRODUCTS.filter(function (r) { return r.slug !== slug; })
    .sort(function (a, b) { return (b.flavour === p.flavour) - (a.flavour === p.flavour); })
    .slice(0, 3);
  document.getElementById("modalRecs").innerHTML = recs.map(function (r) {
    return "<button type=\"button\" class=\"rec-item\" data-qv=\"" + r.slug + "\">" +
      "<span class=\"rec-thumb\" style=\"" + bottleStyle(r.flavour) + ";background-color:" + FLAVOURS[r.flavour].color + "\"></span>" +
      "<span>" + r.name + "</span><strong>" + formatRp(basePrice(r)) + "</strong></button>";
  }).join("");
  updateModalPrice();
  modal.hidden = false;
  document.body.classList.add("no-scroll");
}

function updateModalPrice() {
  var p = getProduct(modalState.slug);
  if (!p) return;
  document.getElementById("modalQty").textContent = modalState.qty;
  document.getElementById("modalPrice").innerHTML =
    formatRp(priceFor(p, modalState.size) * modalState.qty) +
    (p.promoPrice && modalState.size === "regular" && modalState.qty === 1
      ? " <span class=\"price-old\">" + formatRp(p.price) + "</span>" : "");
  var pills = document.querySelectorAll("#modalSizes .size-pill");
  for (var i = 0; i < pills.length; i++) {
    pills[i].classList.toggle("active", pills[i].getAttribute("data-size") === modalState.size);
  }
  var addBtn = document.getElementById("modalAdd");
  addBtn.disabled = !p.available;
  addBtn.textContent = p.available ? "Add to Cart" : "Stok Habis";
}

function closeProductModal() {
  var modal = document.getElementById("productModal");
  if (modal) modal.hidden = true;
  document.body.classList.remove("no-scroll");
}

/* ---------- Katalog (shop.html & bagian produk index) ---------- */
var shopState = { cat: "all", query: "", sort: "featured", shown: 4 };
var PAGE_SIZE = 4;

function filteredProducts() {
  var list = PRODUCTS.filter(function (p) {
    var okCat = shopState.cat === "all" || p.flavour === shopState.cat;
    var okQ = !shopState.query || p.name.toLowerCase().indexOf(shopState.query) !== -1;
    return okCat && okQ;
  });
  if (shopState.sort === "price-asc") list.sort(function (a, b) { return basePrice(a) - basePrice(b); });
  if (shopState.sort === "price-desc") list.sort(function (a, b) { return basePrice(b) - basePrice(a); });
  if (shopState.sort === "newest") list.sort(function (a, b) { return b.added - a.added; });
  return list;
}

function renderShopGrid() {
  var grid = document.getElementById("shopGrid");
  if (!grid) return;
  var list = filteredProducts();
  var slice = list.slice(0, shopState.shown);
  grid.innerHTML = slice.length
    ? slice.map(productCardHTML).join("")
    : "<p class=\"empty-note\">Tidak ada produk yang cocok dengan pencarianmu. Coba kata kunci atau rasa lain.</p>";
  var more = document.getElementById("loadMoreBtn");
  if (more) more.hidden = list.length <= shopState.shown;
  var count = document.getElementById("shopCount");
  if (count) count.textContent = "Menampilkan " + slice.length + " dari " + list.length + " produk";
  initReveals(grid);
}

function initShop() {
  var grid = document.getElementById("shopGrid");
  if (!grid) return;
  var params = new URLSearchParams(window.location.search);
  if (params.get("cat") && FLAVOURS[params.get("cat")]) shopState.cat = params.get("cat");
  var chips = document.querySelectorAll("[data-cat]");
  chips.forEach(function (chip) {
    chip.classList.toggle("active", chip.getAttribute("data-cat") === shopState.cat);
    chip.addEventListener("click", function () {
      shopState.cat = chip.getAttribute("data-cat");
      shopState.shown = PAGE_SIZE;
      chips.forEach(function (c) { c.classList.toggle("active", c === chip); });
      renderShopGrid();
    });
  });
  var search = document.getElementById("shopSearch");
  if (search) search.addEventListener("input", function () {
    shopState.query = search.value.trim().toLowerCase();
    shopState.shown = PAGE_SIZE;
    renderShopGrid();
  });
  var sort = document.getElementById("shopSort");
  if (sort) sort.addEventListener("change", function () {
    shopState.sort = sort.value;
    renderShopGrid();
  });
  var more = document.getElementById("loadMoreBtn");
  if (more) more.addEventListener("click", function () {
    shopState.shown += PAGE_SIZE;
    renderShopGrid();
  });
  renderShopGrid();
  if (params.get("product")) openProductModal(params.get("product"));
}

/* ---------- Produk unggulan di beranda ---------- */
function renderFeatured() {
  var grid = document.getElementById("featuredGrid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.filter(function (p) { return p.featured; }).map(productCardHTML).join("");
  initReveals(grid);
}

/* ---------- Testimoni (data contoh) ---------- */
var TESTIMONIALS = [
  { name: " Nadia R.", text: "Berry Blast jadi andalan sarapan. Rasanya segar, warnanya cantik, dan pesan lewat webnya gampang banget.", rating: 5 },
  { name: " Bima P.", text: "Banana Smooth-nya lembut dan mengenyangkan. Ukuran Large pas untuk bekal habis olahraga.", rating: 5 },
  { name: " Sinta L.", text: "Kiwi Fresh ringan dan tidak terlalu manis. Sudah tiga kali pesan ulang minggu ini.", rating: 4 },
  { name: " Rizky A.", text: "Strawberry Dream favorit anak saya. Kemasan botolnya lucu, rasanya konsisten enak.", rating: 5 },
  { name: " Dewi M.", text: "Checkout cepat, ada voucher BLENDY10 pula. Kiwi Glow dengan mint-nya juara.", rating: 5 }
];
var testiIndex = 0;

function renderTestimonials() {
  var track = document.getElementById("testiTrack");
  if (!track) return;
  track.innerHTML = TESTIMONIALS.map(function (t) {
    return "<figure class=\"testi-card\">" +
      "<div class=\"stars\">" + starRow(t.rating) + "</div>" +
      "<blockquote>\u201C" + t.text + "\u201D</blockquote>" +
      "<figcaption>" + t.name + " <span class=\"badge badge-contoh\">Pelanggan contoh</span></figcaption>" +
    "</figure>";
  }).join("");
  updateTesti();
}

function updateTesti() {
  var track = document.getElementById("testiTrack");
  if (!track) return;
  var cards = track.children.length;
  var perView = window.innerWidth <= 720 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
  var maxIndex = Math.max(0, cards - perView);
  testiIndex = Math.min(testiIndex, maxIndex);
  track.style.transform = "translateX(-" + (testiIndex * (100 / perView)) + "%)";
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = item.classList.contains("open");
      items.forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---------- Scroll reveal ---------- */
var revealObserver = null;
function initReveals(scope) {
  var els = (scope || document).querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
  }
  els.forEach(function (el) { revealObserver.observe(el); });
}

/* ---------- Validasi umum ---------- */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function fieldError(input, message) {
  var wrap = input.closest(".field") || input.parentElement;
  var err = wrap.querySelector(".field-error");
  if (!err) {
    err = document.createElement("small");
    err.className = "field-error";
    wrap.appendChild(err);
  }
  err.textContent = message || "";
  input.classList.toggle("invalid", !!message);
  return !message;
}

/* ---------- Newsletter & formulir kontak (simulasi) ---------- */
function initSimForms() {
  var news = document.querySelectorAll("[data-newsletter]");
  news.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type=\"email\"]");
      var msg = form.querySelector(".form-msg");
      if (!isValidEmail(input.value.trim())) {
        if (msg) { msg.textContent = "Masukkan alamat email yang valid."; msg.className = "form-msg error"; }
        input.classList.add("invalid");
        return;
      }
      input.classList.remove("invalid");
      if (msg) {
        msg.textContent = "Terima kasih sudah mendaftar! (Simulasi \u2014 email tidak benar-benar dikirim atau disimpan di server.)";
        msg.className = "form-msg success";
      }
      form.reset();
    });
  });

  var contact = document.getElementById("contactForm");
  if (contact) {
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("ctName");
      var email = document.getElementById("ctEmail");
      var subject = document.getElementById("ctSubject");
      var message = document.getElementById("ctMessage");
      var ok = true;
      ok = fieldError(name, name.value.trim().length >= 3 ? "" : "Nama minimal 3 karakter.") && ok;
      ok = fieldError(email, isValidEmail(email.value.trim()) ? "" : "Masukkan email yang valid.") && ok;
      ok = fieldError(subject, subject.value.trim() ? "" : "Subjek wajib diisi.") && ok;
      ok = fieldError(message, message.value.trim().length >= 10 ? "" : "Pesan minimal 10 karakter.") && ok;
      var msg = document.getElementById("contactMsg");
      if (!ok) { if (msg) { msg.textContent = ""; } return; }
      if (msg) {
        msg.textContent = "Pesanmu terkirim dalam mode simulasi. Tim Blendy (contoh) akan membalas ke " + email.value.trim() + ".";
        msg.className = "form-msg success";
      }
      contact.reset();
      showToast("Pesan terkirim (simulasi). Terima kasih!");
    });
  }
}

/* ---------- Voucher dari banner promo ---------- */
function initPromo() {
  var btn = document.getElementById("applyPromoBtn");
  if (btn) {
    btn.addEventListener("click", function () {
      setAppliedVoucher("BLENDY10");
      showToast("Voucher BLENDY10 aktif \u2014 diskon 10% di keranjangmu.");
      if (typeof renderCartDrawer === "function") renderCartDrawer();
    });
  }
  var copyBtn = document.getElementById("copyVoucherBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () { showToast("Kode BLENDY10 disalin."); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("BLENDY10").then(done, done);
      } else { done(); }
    });
  }
}

/* ---------- Halaman keranjang ---------- */
function renderCartPage() {
  var wrap = document.getElementById("cartPageBody");
  if (!wrap) return;
  var lines = cartLines();
  var empty = document.getElementById("cartPageEmpty");
  var content = document.getElementById("cartPageContent");
  if (!lines.length) {
    if (empty) empty.hidden = false;
    if (content) content.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (content) content.hidden = false;
  wrap.innerHTML = lines.map(function (l, i) { return cartLineHTML(l, i, false); }).join("");
  var totals = document.getElementById("cartPageTotals");
  if (totals) totals.innerHTML = totalsHTML();
  var vInput = document.getElementById("voucherInput");
  var v = getAppliedVoucher();
  if (vInput && v) vInput.value = v.code;
}

function initCartPage() {
  if (!document.getElementById("cartPageBody")) return;
  renderCartPage();
  var apply = document.getElementById("applyVoucherBtn");
  if (apply) apply.addEventListener("click", function () {
    var input = document.getElementById("voucherInput");
    var msg = document.getElementById("voucherMsg");
    var v = validateVoucher(input.value);
    if (v) {
      setAppliedVoucher(v.code);
      if (msg) { msg.textContent = "Voucher " + v.code + " aktif: " + v.label + "."; msg.className = "form-msg success"; }
      renderCartPage(); renderCartDrawer();
    } else {
      setAppliedVoucher(null);
      if (msg) { msg.textContent = "Kode voucher tidak ditemukan. Coba BLENDY10."; msg.className = "form-msg error"; }
      renderCartPage(); renderCartDrawer();
    }
  });
  var clear = document.getElementById("clearCartBtn");
  if (clear) clear.addEventListener("click", function () {
    clearCart();
    renderCartPage(); renderCartDrawer();
    showToast("Keranjang dikosongkan.");
  });
}

/* ---------- Akun demo ---------- */
function initAuthPages() {
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("liEmail");
      var pass = document.getElementById("liPass");
      var ok = true;
      ok = fieldError(email, isValidEmail(email.value.trim()) ? "" : "Masukkan email yang valid.") && ok;
      ok = fieldError(pass, pass.value.length >= 6 ? "" : "Kata sandi minimal 6 karakter.") && ok;
      if (!ok) return;
      var name = email.value.split("@")[0].replace(/[._-]+/g, " ");
      name = name.charAt(0).toUpperCase() + name.slice(1);
      setDemoUser({ name: name, email: email.value.trim() });
      showToast("Selamat datang kembali, " + name + "! (Mode demo)");
      window.location.href = "account.html";
    });
    var forgotToggle = document.getElementById("forgotToggle");
    var forgotPanel = document.getElementById("forgotPanel");
    if (forgotToggle && forgotPanel) {
      forgotToggle.addEventListener("click", function () {
        forgotPanel.hidden = !forgotPanel.hidden;
      });
      document.getElementById("forgotForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var em = document.getElementById("fpEmail");
        var msg = document.getElementById("forgotMsg");
        if (!isValidEmail(em.value.trim())) {
          if (msg) { msg.textContent = "Masukkan email yang valid."; msg.className = "form-msg error"; }
          return;
        }
        if (msg) {
          msg.textContent = "Tautan atur ulang kata sandi disimulasikan terkirim ke " + em.value.trim() + " (mode demo, tidak ada email sungguhan).";
          msg.className = "form-msg success";
        }
      });
    }
  }

  var regForm = document.getElementById("registerForm");
  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("rgName");
      var email = document.getElementById("rgEmail");
      var pass = document.getElementById("rgPass");
      var pass2 = document.getElementById("rgPass2");
      var ok = true;
      ok = fieldError(name, name.value.trim().length >= 3 ? "" : "Nama minimal 3 karakter.") && ok;
      ok = fieldError(email, isValidEmail(email.value.trim()) ? "" : "Masukkan email yang valid.") && ok;
      ok = fieldError(pass, pass.value.length >= 6 ? "" : "Kata sandi minimal 6 karakter.") && ok;
      ok = fieldError(pass2, pass2.value === pass.value ? "" : "Konfirmasi kata sandi tidak sama.") && ok;
      if (!ok) return;
      /* Kata sandi TIDAK pernah disimpan — hanya nama & email untuk sesi demo. */
      setDemoUser({ name: name.value.trim(), email: email.value.trim() });
      showToast("Akun demo dibuat. Selamat bergabung, " + name.value.trim() + "!");
      window.location.href = "account.html";
    });
  }
}

function initAccountPage() {
  var wrap = document.getElementById("accountWrap");
  if (!wrap) return;
  var user = getDemoUser();
  if (!user) { window.location.href = "login.html"; return; }
  document.getElementById("accName").textContent = user.name;
  document.getElementById("accEmail").textContent = user.email;
  var orders = getOrders();
  var list = document.getElementById("orderHistory");
  if (!orders.length) {
    list.innerHTML = "<p class=\"muted\">Belum ada pesanan. Riwayat pesanan demo kamu akan muncul di sini setelah checkout.</p>";
  } else {
    list.innerHTML = orders.map(function (o) {
      var items = o.items.map(function (it) {
        return "<li>" + it.name + " \u2014 " + it.sizeLabel + " \u00D7 " + it.qty + " <span>" + formatRp(it.total) + "</span></li>";
      }).join("");
      return "<div class=\"order-card\"><div class=\"order-head\"><strong>" + o.number + "</strong>" +
        "<span>" + o.date + "</span><span class=\"badge badge-new\">" + o.payment + "</span></div>" +
        "<ul class=\"order-items\">" + items + "</ul>" +
        "<div class=\"order-total\">Total: <strong>" + formatRp(o.total) + "</strong></div></div>";
    }).join("");
  }
  var logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", function () {
    setDemoUser(null);
    showToast("Kamu sudah keluar dari akun demo.");
    window.location.href = "index.html";
  });
}

/* ---------- Delegasi global: Quick View & Add to Cart ---------- */
document.addEventListener("click", function (e) {
  var qv = e.target.closest("[data-qv]");
  if (qv) { openProductModal(qv.getAttribute("data-qv")); return; }
  var add = e.target.closest("[data-add]");
  if (add) {
    var p = getProduct(add.getAttribute("data-add"));
    if (p && addToCart(p.id, "regular", 1)) {
      showToast(p.name + " masuk keranjang.");
    }
    return;
  }
  if (e.target.closest("[data-close-modal]")) closeProductModal();
  var modal = document.getElementById("productModal");
  if (modal && e.target === modal) closeProductModal();
  var sizeBtn = e.target.closest("#modalSizes .size-pill");
  if (sizeBtn) { modalState.size = sizeBtn.getAttribute("data-size"); updateModalPrice(); }
  if (e.target.closest("#modalQtyInc")) { modalState.qty = Math.min(99, modalState.qty + 1); updateModalPrice(); }
  if (e.target.closest("#modalQtyDec")) { modalState.qty = Math.max(1, modalState.qty - 1); updateModalPrice(); }
  if (e.target.closest("#modalAdd")) {
    var prod = getProduct(modalState.slug);
    if (prod && addToCart(prod.id, modalState.size, modalState.qty)) {
      showToast(prod.name + " (" + getSize(modalState.size).label + ") \u00D7 " + modalState.qty + " masuk keranjang.");
      closeProductModal();
      openCartDrawer();
    }
  }
  if (e.target.closest("#testiPrev")) { testiIndex = Math.max(0, testiIndex - 1); updateTesti(); }
  if (e.target.closest("#testiNext")) {
    var track = document.getElementById("testiTrack");
    if (track) {
      var perView = window.innerWidth <= 720 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
      testiIndex = Math.min(Math.max(0, track.children.length - perView), testiIndex + 1);
      updateTesti();
    }
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeProductModal();
});

window.addEventListener("resize", function () { updateTesti(); });

/* ---------- Inisialisasi ---------- */
document.addEventListener("DOMContentLoaded", function () {
  renderFeatured();
  initShop();
  renderTestimonials();
  initFaq();
  initSimForms();
  initPromo();
  initCartPage();
  initAuthPages();
  initAccountPage();
  initReveals(document);
});
