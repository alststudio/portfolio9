/* ============================================================
   Blendy — checkout demo & halaman sukses pesanan.
   Semua transaksi di sini adalah SIMULASI frontend:
   tidak ada pembayaran sungguhan yang diproses.
   ============================================================ */

function renderCheckoutSummary() {
  var wrap = document.getElementById("summaryItems");
  if (!wrap) return;
  var lines = cartLines();
  wrap.innerHTML = lines.map(function (l) {
    return "<div class=\"summary-line\">" +
      "<div class=\"cart-thumb\" style=\"" + bottleStyle(l.product.flavour) + ";background-color:" + FLAVOURS[l.product.flavour].color + "\" role=\"img\" aria-label=\"" + l.product.name + "\"></div>" +
      "<div class=\"summary-info\"><strong>" + l.product.name + "</strong>" +
      "<span>" + l.size.label + " \u00D7 " + l.item.qty + "</span></div>" +
      "<strong>" + formatRp(l.total) + "</strong></div>";
  }).join("");
  var totals = document.getElementById("summaryTotals");
  if (totals) totals.innerHTML = totalsHTML();
}

function initCheckout() {
  var form = document.getElementById("checkoutForm");
  if (!form) return;

  if (!loadCart().length) {
    showToast("Keranjangmu kosong \u2014 pilih smoothie dulu, yuk.");
    window.location.href = "cart.html";
    return;
  }
  renderCheckoutSummary();

  var apply = document.getElementById("coApplyVoucher");
  if (apply) apply.addEventListener("click", function () {
    var input = document.getElementById("coVoucherInput");
    var msg = document.getElementById("coVoucherMsg");
    var v = validateVoucher(input.value);
    if (v) {
      setAppliedVoucher(v.code);
      if (msg) { msg.textContent = "Voucher " + v.code + " aktif: " + v.label + "."; msg.className = "form-msg success"; }
    } else {
      setAppliedVoucher(null);
      if (msg) { msg.textContent = "Kode voucher tidak ditemukan. Coba BLENDY10."; msg.className = "form-msg error"; }
    }
    renderCheckoutSummary();
    renderCartDrawer();
  });
  var existing = getAppliedVoucher();
  if (existing) {
    var inp = document.getElementById("coVoucherInput");
    if (inp) inp.value = existing.code;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = {
      name: document.getElementById("coName"),
      email: document.getElementById("coEmail"),
      phone: document.getElementById("coPhone"),
      address: document.getElementById("coAddress"),
      city: document.getElementById("coCity"),
      zip: document.getElementById("coZip")
    };
    var ok = true;
    ok = fieldError(fields.name, fields.name.value.trim().length >= 3 ? "" : "Nama lengkap minimal 3 karakter.") && ok;
    ok = fieldError(fields.email, isValidEmail(fields.email.value.trim()) ? "" : "Masukkan email yang valid.") && ok;
    ok = fieldError(fields.phone, fields.phone.value.replace(/\D/g, "").length >= 9 ? "" : "Nomor telepon minimal 9 digit.") && ok;
    ok = fieldError(fields.address, fields.address.value.trim().length >= 10 ? "" : "Alamat minimal 10 karakter.") && ok;
    ok = fieldError(fields.city, fields.city.value.trim() ? "" : "Kota wajib diisi.") && ok;
    ok = fieldError(fields.zip, /^\d{5}$/.test(fields.zip.value.trim()) ? "" : "Kode pos harus 5 digit angka.") && ok;

    var pay = form.querySelector("input[name=\"payment\"]:checked");
    var payMsg = document.getElementById("payMsg");
    if (!pay) {
      if (payMsg) { payMsg.textContent = "Pilih salah satu metode pembayaran (simulasi)."; payMsg.className = "form-msg error"; }
      ok = false;
    } else if (payMsg) { payMsg.textContent = ""; }

    if (!ok) return;

    var lines = cartLines();
    var number = "BLD-2026-" + Math.floor(1000 + Math.random() * 9000);
    var now = new Date();
    var order = {
      number: number,
      date: now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) +
        ", " + now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      items: lines.map(function (l) {
        return { name: l.product.name, sizeLabel: l.size.label, qty: l.item.qty, unit: l.unit, total: l.total };
      }),
      subtotal: cartSubtotal(),
      discount: cartDiscount(),
      voucher: getAppliedVoucher() ? getAppliedVoucher().code : null,
      total: cartTotal(),
      payment: pay.value,
      customer: {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim(),
        address: fields.address.value.trim(),
        city: fields.city.value.trim(),
        zip: fields.zip.value.trim()
      }
    };
    saveOrder(order);
    saveCart([]);
    setAppliedVoucher(null);
    window.location.href = "order-success.html?order=" + encodeURIComponent(number);
  });
}

/* ---------- Halaman sukses ---------- */
function initOrderSuccess() {
  var wrap = document.getElementById("successWrap");
  if (!wrap) return;
  var params = new URLSearchParams(window.location.search);
  var num = params.get("order");
  var orders = getOrders();
  var order = null;
  for (var i = 0; i < orders.length; i++) if (orders[i].number === num) order = orders[i];
  if (!order && orders.length) order = orders[0];
  if (!order) {
    wrap.innerHTML = "<div class=\"success-card\"><h1>Belum Ada Pesanan</h1>" +
      "<p class=\"muted\">Halaman ini menampilkan ringkasan setelah checkout demo selesai.</p>" +
      "<a class=\"btn btn-primary\" href=\"shop.html\">Mulai Belanja</a></div>";
    return;
  }
  document.getElementById("successNumber").textContent = order.number;
  document.getElementById("successItems").innerHTML = order.items.map(function (it) {
    return "<div class=\"summary-line\"><div class=\"summary-info\"><strong>" + it.name + "</strong>" +
      "<span>" + it.sizeLabel + " \u00D7 " + it.qty + "</span></div><strong>" + formatRp(it.total) + "</strong></div>";
  }).join("");
  var discRow = order.discount > 0
    ? "<div class=\"totals-row discount\"><span>Voucher " + (order.voucher || "") + "</span><span>\u2212" + formatRp(order.discount) + "</span></div>"
    : "";
  document.getElementById("successTotals").innerHTML =
    "<div class=\"totals-row\"><span>Subtotal</span><span>" + formatRp(order.subtotal) + "</span></div>" +
    discRow +
    "<div class=\"totals-row grand\"><span>Total Pembayaran</span><span>" + formatRp(order.total) + "</span></div>";
  var c = order.customer;
  document.getElementById("successCustomer").innerHTML =
    "<p><strong>" + escapeHTML(c.name) + "</strong></p>" +
    "<p>" + escapeHTML(c.email) + " \u00B7 " + escapeHTML(c.phone) + "</p>" +
    "<p>" + escapeHTML(c.address) + ", " + escapeHTML(c.city) + " " + escapeHTML(c.zip) + "</p>" +
    "<p>Metode pembayaran (simulasi): <strong>" + order.payment + "</strong></p>" +
    "<p class=\"muted\">Tanggal pesanan: " + order.date + "</p>";
}

document.addEventListener("DOMContentLoaded", function () {
  initCheckout();
  initOrderSuccess();
});
