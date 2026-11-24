/* ============================================================
   Blendy — pusat data produk & konfigurasi toko
   Semua harga, produk, dan info toko diatur dari file ini.
   ============================================================ */

/* ---------- Konfigurasi toko (data contoh, mudah diganti) ---------- */
var SITE_CONFIG = {
  email: "halo@blendy.example",
  whatsappDisplay: "0812-3456-7890",
  whatsappLink: "https://wa.me/6281234567890",
  address: "Jl. Buah Segar No. 8, Jakarta Selatan (alamat contoh)",
  hours: "Senin\u2013Minggu, 08.00\u201321.00 WIB (jam contoh)",
  instagram: "#",
  tiktok: "#",
  youtube: "#"
};

/* ---------- Data rasa: sheet PNG transparan 2048x2048 ---------- */
function sheetURL(original) {
  return "https://images.higgs.ai/?default=1&output=webp&w=2048&q=85&url=" + encodeURIComponent(original);
}

var SHEET_BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

/* Kotak item di dalam sheet: [x, y, lebar, tinggi] dalam piksel sheet.
   Item 0 = botol; item 1..3 = potongan buah. */
var FLAVOURS = {
  berry: {
    name: "Berry",
    color: "#C2B0DC",
    sheet: sheetURL(SHEET_BASE + "hf_20261117_053958_8803e421-29b1-4c24-8efd-54cae3f479b4.png"),
    bottle: [233, 60, 598, 917],
    items: [[1209, 272, 569, 573], [265, 1230, 579, 572], [1192, 1192, 626, 641]]
  },
  kiwi: {
    name: "Kiwi",
    color: "#B4D58A",
    sheet: sheetURL(SHEET_BASE + "hf_20261117_053958_b5695e60-72da-4b5b-bfb7-a091d528af75.png"),
    bottle: [217, 90, 610, 874],
    items: [[1204, 257, 619, 601], [250, 1197, 619, 522], [1200, 1186, 633, 650]]
  },
  banana: {
    name: "Banana",
    color: "#F3DA8A",
    sheet: sheetURL(SHEET_BASE + "hf_20261117_053958_6cf14029-4bce-4c9a-b9fc-1c5b185082e3.png"),
    bottle: [194, 76, 579, 873],
    items: [[1205, 228, 596, 597], [230, 1181, 624, 648], [1193, 1182, 646, 659]]
  },
  strawberry: {
    name: "Strawberry",
    color: "#F2AFC0",
    sheet: sheetURL(SHEET_BASE + "hf_20261117_055135_cbfb5a8d-c52b-4358-a6ee-d941c6c42285.png"),
    bottle: [226, 88, 594, 887],
    items: [[1190, 216, 561, 653], [257, 1168, 604, 662], [1240, 1169, 632, 686]]
  }
};

/* ---------- Pilihan ukuran (selisih harga terpusat) ---------- */
var SIZES = [
  { id: "regular", label: "Regular", delta: 0 },
  { id: "large", label: "Large", delta: 7000 },
  { id: "xl", label: "Extra Large", delta: 14000 }
];

/* ---------- Katalog produk (data contoh) ---------- */
var PRODUCTS = [
  {
    id: 1, slug: "berry-blast", name: "Berry Blast", flavour: "berry",
    price: 32000, promoPrice: 28000, rating: 4.9, featured: true, isNew: false, available: true, added: 1,
    desc: "Perpaduan rasa buah berry yang menyegarkan.",
    longDesc: "Berry Blast memadukan stroberi, blueberry, dan raspberry dalam satu botol berwarna lilac yang cantik. Rasanya asam-manis seimbang, ringan, dan pas diminum kapan saja \u2014 dari sarapan cepat sampai teman santai sore hari."
  },
  {
    id: 2, slug: "kiwi-fresh", name: "Kiwi Fresh", flavour: "kiwi",
    price: 30000, promoPrice: null, rating: 4.8, featured: true, isNew: false, available: true, added: 2,
    desc: "Sensasi rasa kiwi yang segar dan ringan.",
    longDesc: "Kiwi Fresh menghadirkan rasa kiwi yang terang dan menyegarkan dengan tekstur halus. Pilihan tepat untuk kamu yang suka rasa buah yang bersih, tidak terlalu manis, dan terasa ringan di setiap tegukan."
  },
  {
    id: 3, slug: "banana-smooth", name: "Banana Smooth", flavour: "banana",
    price: 28000, promoPrice: null, rating: 4.9, featured: true, isNew: false, available: true, added: 3,
    desc: "Smoothie pisang dengan karakter rasa lembut.",
    longDesc: "Banana Smooth adalah smoothie pisang dengan karakter rasa yang lembut dan creamy. Manis alaminya pisang matang membuat varian ini jadi favorit untuk mengganjal lapar di antara waktu makan."
  },
  {
    id: 4, slug: "strawberry-dream", name: "Strawberry Dream", flavour: "strawberry",
    price: 34000, promoPrice: 30000, rating: 5.0, featured: true, isNew: false, available: true, added: 4,
    desc: "Rasa strawberry yang manis dan menyegarkan.",
    longDesc: "Strawberry Dream menyajikan rasa stroberi yang manis dan menyegarkan dalam warna pink pastel yang ikonik. Lembut, harum, dan selalu jadi pilihan aman untuk pertama kali mencoba Blendy."
  },
  {
    id: 5, slug: "berry-velvet", name: "Berry Velvet", flavour: "berry",
    price: 36000, promoPrice: null, rating: 4.8, featured: false, isNew: true, available: true, added: 8,
    desc: "Berry ganda dengan sentuhan vanila yang lembut.",
    longDesc: "Berry Velvet adalah versi berry yang lebih pekat: campuran berry ganda dengan sentuhan vanila yang memberi rasa akhir lembut seperti beludru. Untuk pencinta berry sejati."
  },
  {
    id: 6, slug: "kiwi-glow", name: "Kiwi Glow", flavour: "kiwi",
    price: 33000, promoPrice: null, rating: 4.7, featured: false, isNew: true, available: true, added: 7,
    desc: "Kiwi dengan perasan jeruk nipis dan daun mint.",
    longDesc: "Kiwi Glow memadukan kiwi dengan perasan jeruk nipis dan daun mint segar. Hasilnya rasa yang cerah dan dingin menyegarkan \u2014 pendamping ideal di siang yang terik."
  },
  {
    id: 7, slug: "banana-honey-oat", name: "Banana Honey Oat", flavour: "banana",
    price: 31000, promoPrice: 27000, rating: 4.8, featured: false, isNew: false, available: true, added: 5,
    desc: "Pisang, madu, dan oat untuk rasa yang lebih mengenyangkan.",
    longDesc: "Banana Honey Oat menggabungkan pisang, madu, dan oat dalam satu botol yang lebih mengenyangkan. Cocok sebagai pengganti sarapan praktis atau bekal sebelum beraktivitas."
  },
  {
    id: 8, slug: "strawberry-cloud", name: "Strawberry Cloud", flavour: "strawberry",
    price: 35000, promoPrice: null, rating: 4.9, featured: false, isNew: true, available: false, added: 6,
    desc: "Strawberry dengan susu oat yang lembut seperti awan.",
    longDesc: "Strawberry Cloud memadukan stroberi dengan susu oat yang lembut, menghasilkan tekstur sehalus awan dan rasa manis yang ringan. Stok contoh saat ini sedang habis \u2014 nantikan kehadirannya kembali."
  }
];

/* ---------- Voucher (simulasi) ---------- */
var VOUCHERS = {
  "BLENDY10": { code: "BLENDY10", percent: 10, label: "Diskon 10%" }
};

/* ---------- Helper bersama ---------- */
function formatRp(n) {
  return "Rp" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getProduct(slugOrId) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].slug === slugOrId || PRODUCTS[i].id === slugOrId) return PRODUCTS[i];
  }
  return null;
}

function getSize(sizeId) {
  for (var i = 0; i < SIZES.length; i++) if (SIZES[i].id === sizeId) return SIZES[i];
  return SIZES[0];
}

function basePrice(product) {
  return product.promoPrice ? product.promoPrice : product.price;
}

function priceFor(product, sizeId) {
  return basePrice(product) + getSize(sizeId).delta;
}

/* Gaya CSS untuk memotong satu item dari sheet (metode persentase,
   bebas resolusi): elemen memakai aspect-ratio dari kotak item. */
function cropStyle(flavourKey, box) {
  var f = FLAVOURS[flavourKey];
  var x = box[0], y = box[1], w = box[2], h = box[3];
  var sx = (2048 / w * 100).toFixed(4);
  var sy = (2048 / h * 100).toFixed(4);
  var px = (x / (2048 - w) * 100).toFixed(4);
  var py = (y / (2048 - h) * 100).toFixed(4);
  return "background-image:url('" + f.sheet + "');background-size:" + sx + "% " + sy +
    "%;background-position:" + px + "% " + py + "%;aspect-ratio:" + w + "/" + h + ";";
}

function bottleStyle(flavourKey) {
  return cropStyle(flavourKey, FLAVOURS[flavourKey].bottle);
}

function fruitStyle(flavourKey, itemIndex) {
  return cropStyle(flavourKey, FLAVOURS[flavourKey].items[itemIndex]);
}

function starRow(rating) {
  var full = Math.round(rating);
  var out = "";
  for (var i = 1; i <= 5; i++) out += i <= full ? "\u2605" : "\u2606";
  return out;
}
