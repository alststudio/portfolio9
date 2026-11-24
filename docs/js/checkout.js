/* ============================================================
   BLENDY — checkout.js
   Checkout SIMULASI: validasi form, ringkasan pesanan,
   nomor pesanan contoh, riwayat pesanan di localStorage.
   Tidak ada pembayaran sungguhan di sini (lihat README).
   ============================================================ */

"use strict";

const ORDERS_KEY = "blendy_orders_v1";
const LAST_ORDER_KEY = "blendy_last_order_v1";

function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function saveOrder(order) {
  try {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch (e) { /* abaikan */ }
}

function getLastOrder() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function makeOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return "BLD-2026-" + rand;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fieldError(input, msg) {
  const wrap = input.closest(".field");
  if (!wrap) return;
  let err = wrap.querySelector(".field-err");
  if (!err) {
    err = document.createElement("p");
    err.className = "field-err";
    wrap.appendChild(err);
  }
  err.textContent = msg || "";
  input.classList.toggle("invalid", !!msg);
  if (msg) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

/* ---------- Ringkasan di halaman checkout ---------- */
function renderCheckoutSummary() {
  const host = document.getElementById("checkoutSummary");
  if (!host) return;
  if (Cart.items.length === 0) {
    host.innerHTML = "<p>Keranjang kosong.</p>";
    return;
  }
  const lines = Cart.items.map(function (it) {
    const p = getProduct(it.id);
    const size = sizeByKey(it.size);
    return '<div class="sum-line">' +
      '<span class="sum-name">' + p.name + ' <small>' + size.name + " × " + it.qty + "</small></span>" +
      "<strong>" + formatRp(priceFor(p, it.size) * it.qty) + "</strong></div>";
  }).join("");
  host.innerHTML = lines + cartTotalsHTML() +
    voucherBoxHTML("checkout") +
    '<p class="demo-note">Simulasi checkout — tidak ada pembayaran sungguhan dan tidak ada data yang dikirim ke server.</p>';
}

/* ---------- Init halaman checkout ---------- */
function initCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  if (Cart.items.length === 0) {
    try { sessionStorage.setItem("blendy_flash", "Keranjang masih kosong — pilih produk dulu sebelum checkout ya."); } catch (e) {}
    window.location.href = "cart.html";
    return;
  }

  renderCheckoutSummary();

  /* Prefill dari sesi demo bila ada */
  const user = getDemoUser();
  if (user) {
    const nameEl = form.querySelector("[name=fullname]");
    const emailEl = form.querySelector("[name=email]");
    if (nameEl && !nameEl.value) nameEl.value = user.name;
    if (emailEl && !emailEl.value) emailEl.value = user.email;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {};
    let valid = true;

    const need = [
      { name: "fullname", label: "Nama lengkap", test: function (v) { return v.trim().length >= 3 || "Nama lengkap wajib diisi (min. 3 karakter)."; } },
      { name: "email", label: "Email", test: function (v) { return EMAIL_RE.test(v.trim()) || "Format email belum benar."; } },
      { name: "phone", label: "Nomor telepon", test: function (v) { return v.replace(/\D/g, "").length >= 9 || "Nomor telepon wajib diisi (min. 9 digit)."; } },
      { name: "address", label: "Alamat", test: function (v) { return v.trim().length >= 10 || "Alamat wajib diisi lengkap (min. 10 karakter)."; } },
      { name: "city", label: "Kota", test: function (v) { return v.trim().length >= 3 || "Kota wajib diisi."; } },
      { name: "zip", label: "Kode pos", test: function (v) { return /^\d{5}$/.test(v.trim()) || "Kode pos harus 5 digit angka."; } }
    ];

    need.forEach(function (f) {
      const input = form.querySelector("[name=" + f.name + "]");
      const res = f.test(input.value);
      if (res !== true) { fieldError(input, res); valid = false; }
      else { fieldError(input, ""); data[f.name] = input.value.trim(); }
    });

    const pay = form.querySelector("input[name=payment]:checked");
    const payErr = document.getElementById("paymentErr");
    if (!pay) {
      if (payErr) payErr.textContent = "Pilih metode pembayaran dulu ya (semua hanya simulasi).";
      valid = false;
    } else if (payErr) payErr.textContent = "";

    if (!valid) {
      showToast("Ada isian yang belum benar — cek kolom berwarna merah ya.");
      const firstBad = form.querySelector(".invalid");
      if (firstBad) firstBad.focus();
      return;
    }

    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Memproses…";

    const order = {
      number: makeOrderNumber(),
      date: new Date().toISOString(),
      customer: {
        name: data.fullname, email: data.email, phone: data.phone,
        address: data.address, city: data.city, zip: data.zip
      },
      payment: pay.value,
      items: Cart.items.map(function (it) {
        const p = getProduct(it.id);
        return { id: it.id, name: p.name, size: sizeByKey(it.size).name, qty: it.qty, price: priceFor(p, it.size) };
      }),
      subtotal: Cart.subtotal(),
      discount: Cart.discount(),
      voucher: Cart.voucherApplied ? CONFIG.voucher.code : null,
      total: Cart.total()
    };

    /* Jeda singkat agar terasa seperti proses (tetap simulasi lokal) */
    setTimeout(function () {
      saveOrder(order);
      Cart.clear();
      window.location.href = "order-success.html";
    }, 650);
  });
}

/* ---------- Halaman order-success ---------- */
function initOrderSuccess() {
  const host = document.getElementById("successDetail");
  if (!host) return;
  const order = getLastOrder();
  if (!order) {
    host.innerHTML = '<div class="cart-empty big">' + fruitSVG("kiwi") +
      "<h3>Belum ada pesanan</h3><p>Halaman ini menampilkan pesanan terakhir setelah checkout demo selesai.</p>" +
      '<a class="btn btn-primary" href="shop.html">Lihat Katalog</a></div>';
    return;
  }
  const numEl = document.getElementById("successOrderNo");
  if (numEl) numEl.textContent = order.number;
  const lines = order.items.map(function (it) {
    return '<div class="sum-line"><span class="sum-name">' + escapeHTML(it.name) + " <small>" + it.size + " × " + it.qty + "</small></span><strong>" + formatRp(it.price * it.qty) + "</strong></div>";
  }).join("");
  host.innerHTML =
    '<div class="success-grid">' +
      '<div class="success-card"><h3>Ringkasan Pesanan</h3>' + lines +
        '<div class="totals">' +
          '<div class="totals-row"><span>Subtotal</span><strong>' + formatRp(order.subtotal) + "</strong></div>" +
          (order.discount > 0 ? '<div class="totals-row discount"><span>Diskon voucher (' + order.voucher + ')</span><strong>−' + formatRp(order.discount) + "</strong></div>" : "") +
          '<div class="totals-row grand"><span>Total Pembayaran</span><strong>' + formatRp(order.total) + "</strong></div>" +
        "</div>" +
        '<p class="demo-note">Metode pembayaran (simulasi): ' + escapeHTML(order.payment) + "</p>" +
      "</div>" +
      '<div class="success-card"><h3>Informasi Pelanggan</h3>' +
        "<p><strong>" + escapeHTML(order.customer.name) + "</strong></p>" +
        "<p>" + escapeHTML(order.customer.email) + " · " + escapeHTML(order.customer.phone) + "</p>" +
        "<p>" + escapeHTML(order.customer.address) + ", " + escapeHTML(order.customer.city) + " " + escapeHTML(order.customer.zip) + "</p>" +
        '<p class="demo-note">Ini halaman sukses untuk mode demo — tidak ada transaksi atau pembayaran sungguhan yang terjadi.</p>' +
      "</div>" +
    "</div>";
}

document.addEventListener("DOMContentLoaded", function () {
  initCheckout();
  initOrderSuccess();
});
