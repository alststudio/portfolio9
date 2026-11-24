/* ============================================================
   Blendy — keranjang belanja (localStorage, data demo)
   ============================================================ */

var CART_KEY = "blendy_cart";
var VOUCHER_KEY = "blendy_voucher";

function loadCart() {
  try {
    var raw = localStorage.getItem(CART_KEY);
    var items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch (e) { return []; }
}

function saveCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
  updateCartBadges();
  renderCartDrawer();
  if (typeof renderCartPage === "function") renderCartPage();
  if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
}

function cartCount() {
  return loadCart().reduce(function (sum, it) { return sum + it.qty; }, 0);
}

function updateCartBadges() {
  var n = cartCount();
  var badges = document.querySelectorAll("[data-cart-count]");
  for (var i = 0; i < badges.length; i++) {
    badges[i].textContent = n;
    badges[i].hidden = n === 0;
    if (n > 0) {
      badges[i].classList.remove("bump");
      void badges[i].offsetWidth;
      badges[i].classList.add("bump");
    }
  }
}

function addToCart(productId, sizeId, qty) {
  var product = getProduct(productId);
  if (!product || !product.available) return false;
  qty = Math.max(1, parseInt(qty, 10) || 1);
  var items = loadCart();
  for (var i = 0; i < items.length; i++) {
    if (items[i].productId === product.id && items[i].size === sizeId) {
      items[i].qty += qty;
      saveCart(items);
      return true;
    }
  }
  items.push({ productId: product.id, size: sizeId, qty: qty });
  saveCart(items);
  return true;
}

function setCartQty(index, qty) {
  var items = loadCart();
  if (!items[index]) return;
  qty = parseInt(qty, 10) || 0;
  if (qty <= 0) items.splice(index, 1);
  else items[index].qty = qty;
  saveCart(items);
}

function removeCartItem(index) {
  var items = loadCart();
  items.splice(index, 1);
  saveCart(items);
}

function clearCart() {
  saveCart([]);
  setAppliedVoucher(null);
}

function cartLines() {
  return loadCart().map(function (it) {
    var p = getProduct(it.productId);
    if (!p) return null;
    var unit = priceFor(p, it.size);
    return { item: it, product: p, size: getSize(it.size), unit: unit, total: unit * it.qty };
  }).filter(Boolean);
}

function cartSubtotal() {
  return cartLines().reduce(function (sum, l) { return sum + l.total; }, 0);
}

/* ---------- Voucher ---------- */
function getAppliedVoucher() {
  try {
    var code = localStorage.getItem(VOUCHER_KEY);
    return code && VOUCHERS[code] ? VOUCHERS[code] : null;
  } catch (e) { return null; }
}

function setAppliedVoucher(code) {
  try {
    if (code) localStorage.setItem(VOUCHER_KEY, code);
    else localStorage.removeItem(VOUCHER_KEY);
  } catch (e) {}
}

function validateVoucher(code) {
  if (!code) return null;
  var v = VOUCHERS[code.trim().toUpperCase()];
  return v || null;
}

function cartDiscount() {
  var v = getAppliedVoucher();
  if (!v) return 0;
  return Math.round(cartSubtotal() * v.percent / 100);
}

function cartTotal() {
  return Math.max(0, cartSubtotal() - cartDiscount());
}

/* ---------- Toast ---------- */
function showToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 2600);
}

/* ---------- Cart drawer ---------- */
function openCartDrawer() {
  var d = document.getElementById("cartDrawer");
  var o = document.getElementById("drawerOverlay");
  if (d) d.classList.add("open");
  if (o) o.classList.add("show");
  document.body.classList.add("no-scroll");
  renderCartDrawer();
}

function closeCartDrawer() {
  var d = document.getElementById("cartDrawer");
  var o = document.getElementById("drawerOverlay");
  if (d) d.classList.remove("open");
  if (o) o.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

function cartLineHTML(line, index, compact) {
  var p = line.product;
  return "<div class=\"cart-line\">" +
    "<div class=\"cart-thumb\" style=\"" + bottleStyle(p.flavour) + ";background-color:" + FLAVOURS[p.flavour].color + "\" role=\"img\" aria-label=\"" + p.name + "\"></div>" +
    "<div class=\"cart-line-info\">" +
      "<strong>" + p.name + "</strong>" +
      "<span class=\"cart-line-size\">Ukuran " + line.size.label + "</span>" +
      "<span class=\"cart-line-price\">" + formatRp(line.unit) + "</span>" +
    "</div>" +
    "<div class=\"cart-line-actions\">" +
      "<div class=\"qty-stepper\">" +
        "<button type=\"button\" data-cart-dec=\"" + index + "\" aria-label=\"Kurangi jumlah\">\u2212</button>" +
        "<span>" + line.item.qty + "</span>" +
        "<button type=\"button\" data-cart-inc=\"" + index + "\" aria-label=\"Tambah jumlah\">+</button>" +
      "</div>" +
      "<strong>" + formatRp(line.total) + "</strong>" +
      (compact ? "" : "<button type=\"button\" class=\"cart-remove\" data-cart-remove=\"" + index + "\">Hapus</button>") +
    "</div>" +
  "</div>";
}

function totalsHTML() {
  var sub = cartSubtotal();
  var disc = cartDiscount();
  var v = getAppliedVoucher();
  var html = "<div class=\"totals-row\"><span>Subtotal</span><span>" + formatRp(sub) + "</span></div>";
  if (v && disc > 0) {
    html += "<div class=\"totals-row discount\"><span>Voucher " + v.code + " (\u2212" + v.percent + "%)</span><span>\u2212" + formatRp(disc) + "</span></div>";
  }
  html += "<div class=\"totals-row grand\"><span>Total</span><span>" + formatRp(cartTotal()) + "</span></div>";
  return html;
}

function renderCartDrawer() {
  var body = document.getElementById("cartDrawerBody");
  var foot = document.getElementById("cartDrawerFoot");
  if (!body || !foot) return;
  var lines = cartLines();
  if (!lines.length) {
    body.innerHTML = "<div class=\"cart-empty\"><p>Keranjangmu masih kosong.</p><p class=\"muted\">Yuk, pilih smoothie favoritmu!</p></div>";
    foot.innerHTML = "<a class=\"btn btn-primary btn-block\" href=\"shop.html\">Mulai Belanja</a>";
    return;
  }
  body.innerHTML = lines.map(function (l, i) { return cartLineHTML(l, i, true); }).join("");
  foot.innerHTML = totalsHTML() +
    "<a class=\"btn btn-primary btn-block\" href=\"checkout.html\">Checkout</a>" +
    "<a class=\"btn btn-ghost btn-block\" href=\"cart.html\">Lihat Keranjang</a>";
}

/* Delegasi klik untuk kontrol keranjang (drawer & halaman cart) */
document.addEventListener("click", function (e) {
  var inc = e.target.closest("[data-cart-inc]");
  var dec = e.target.closest("[data-cart-dec]");
  var rem = e.target.closest("[data-cart-remove]");
  if (inc) { var i1 = +inc.getAttribute("data-cart-inc"); setCartQty(i1, loadCart()[i1].qty + 1); }
  if (dec) { var i2 = +dec.getAttribute("data-cart-dec"); setCartQty(i2, loadCart()[i2].qty - 1); }
  if (rem) { removeCartItem(+rem.getAttribute("data-cart-remove")); showToast("Item dihapus dari keranjang."); }
  if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openCartDrawer(); }
  if (e.target.closest("[data-close-cart]")) { closeCartDrawer(); }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeCartDrawer();
});

document.addEventListener("DOMContentLoaded", function () {
  updateCartBadges();
  renderCartDrawer();
});
