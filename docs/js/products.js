/* ============================================================
   BLENDY — products.js
   Pusat data & konfigurasi. Semua halaman membaca produk,
   harga, ukuran, voucher, dan info kontak DARI SINI SAJA.
   Untuk mengganti harga / menambah produk / mengubah kontak,
   cukup edit file ini (lihat README.md).
   ============================================================ */

"use strict";

/* Preferensi gerak pengguna (dipakai slider.js & app.js) */
const REDUCED = typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Konfigurasi toko (contoh — mudah diganti) ---------- */
const CONFIG = {
  storeName: "Blendy",
  tagline: "Real Fruit. Real Freshness.",
  email: "halo@blendy.example",
  whatsappDisplay: "0812-3456-7890",
  whatsappNumber: "6281234567890",
  address: "Jl. Segar Buah No. 12, Jakarta Selatan (alamat contoh)",
  hours: "Senin–Jumat 08.00–21.00 WIB · Sabtu–Minggu 09.00–22.00 WIB",
  currency: "IDR",
  voucher: { code: "BLENDY10", percent: 10, label: "Diskon 10%" },
  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/"
  }
};

/* ---------- Warna tiap rasa ---------- */
const FLAVOURS = {
  berry:      { key: "berry",      name: "Berry",      color: "#C2B0DC", deep: "#8F76B8", soft: "#EFE9F8", drink: "#B79EDB", drinkDark: "#9A7FC6" },
  kiwi:       { key: "kiwi",       name: "Kiwi",       color: "#B4D58A", deep: "#6F9E3E", soft: "#F0F7E2", drink: "#A9CF7E", drinkDark: "#8AB85C" },
  banana:     { key: "banana",     name: "Banana",     color: "#F3DA8A", deep: "#C79A2E", soft: "#FCF4DC", drink: "#F2D67C", drinkDark: "#E3BC4E" },
  strawberry: { key: "strawberry", name: "Strawberry", color: "#F2AFC0", deep: "#D96B8A", soft: "#FCEBF0", drink: "#F2A3B8", drinkDark: "#E87E9B" }
};

/* ---------- Ukuran & selisih harga (Rp) ---------- */
const SIZES = [
  { key: "regular", name: "Regular",     note: "250 ml", delta: 0 },
  { key: "large",   name: "Large",       note: "350 ml", delta: 7000 },
  { key: "xlarge",  name: "Extra Large", note: "500 ml", delta: 14000 }
];

function sizeByKey(key) {
  return SIZES.find(function (s) { return s.key === key; }) || SIZES[0];
}

/* ---------- Katalog produk (data contoh) ---------- */
const PRODUCTS = [
  {
    id: "berry-blast", name: "Berry Blast", slug: "berry-blast", category: "berry",
    price: 32000, promoPrice: 28000, rating: 4.9, reviews: 132, isNew: false, addedIndex: 4, available: true,
    description: "Perpaduan rasa buah berry yang menyegarkan.",
    longDescription: "Berry Blast memadukan stroberi, blueberry, dan raspberry dalam satu botol yang cerah. Rasanya asam-manis seimbang, ringan di tenggorokan, dan paling pas dinikmati dingin setelah beraktivitas.",
    ingredients: "Campuran berry segar, susu/yogurt pilihan, madu, es batu.",
    accentFruit: "berry"
  },
  {
    id: "kiwi-fresh", name: "Kiwi Fresh", slug: "kiwi-fresh", category: "kiwi",
    price: 30000, promoPrice: null, rating: 4.8, reviews: 98, isNew: false, addedIndex: 3, available: true,
    description: "Sensasi rasa kiwi yang segar dan ringan.",
    longDescription: "Kiwi Fresh menghadirkan rasa kiwi hijau yang asam segar dengan sentuhan apel dan daun mint. Pilihan paling ringan untuk teman makan siang atau penyegar di siang yang terik.",
    ingredients: "Kiwi hijau segar, apel, daun mint, madu, es batu.",
    accentFruit: "kiwi"
  },
  {
    id: "banana-smooth", name: "Banana Smooth", slug: "banana-smooth", category: "banana",
    price: 28000, promoPrice: null, rating: 4.9, reviews: 154, isNew: false, addedIndex: 2, available: true,
    description: "Smoothie pisang dengan karakter rasa lembut.",
    longDescription: "Banana Smooth adalah smoothie pisang bertekstur creamy dengan rasa manis alami yang lembut. Mengenyangkan, bersahaja, dan jadi favorit untuk sarapan cepat atau camilan sore.",
    ingredients: "Pisang matang pilihan, susu segar, oatmeal, madu, es batu.",
    accentFruit: "banana"
  },
  {
    id: "strawberry-dream", name: "Strawberry Dream", slug: "strawberry-dream", category: "strawberry",
    price: 34000, promoPrice: 30000, rating: 5.0, reviews: 187, isNew: false, addedIndex: 1, available: true,
    description: "Rasa strawberry yang manis dan menyegarkan.",
    longDescription: "Strawberry Dream menonjolkan stroberi merah ranum dengan rasa manis yang cerah dan aroma yang wangi. Ditambah sedikit yogurt, hasilnya lembut seperti dessert tapi tetap terasa segar.",
    ingredients: "Stroberi segar, yogurt, susu segar, madu, es batu.",
    accentFruit: "strawberry"
  },
  {
    id: "berry-velvet", name: "Berry Velvet", slug: "berry-velvet", category: "berry",
    price: 36000, promoPrice: null, rating: 4.7, reviews: 64, isNew: true, addedIndex: 8, available: true,
    description: "Berry pekat bertekstur lembut seperti beludru.",
    longDescription: "Berry Velvet adalah varian berry yang lebih pekat dan creamy, dengan blackberry dan blueberry sebagai bintang utama. Teksturnya halus dan rasanya dalam — untuk pencinta berry sejati.",
    ingredients: "Blackberry, blueberry, yogurt Yunani, madu, es batu.",
    accentFruit: "berry"
  },
  {
    id: "kiwi-glow", name: "Kiwi Glow", slug: "kiwi-glow", category: "kiwi",
    price: 33000, promoPrice: null, rating: 4.8, reviews: 57, isNew: true, addedIndex: 7, available: true,
    description: "Kiwi emas dengan sentuhan nanas yang tropis.",
    longDescription: "Kiwi Glow memadukan kiwi emas yang lebih manis dengan nanas dan sedikit perasan jeruk nipis. Rasanya tropis, berkilau, dan memberi semangat di tengah hari.",
    ingredients: "Kiwi emas, nanas, jeruk nipis, madu, es batu.",
    accentFruit: "kiwi"
  },
  {
    id: "banana-honey-oat", name: "Banana Honey Oat", slug: "banana-honey-oat", category: "banana",
    price: 31000, promoPrice: 27000, rating: 4.8, reviews: 88, isNew: false, addedIndex: 6, available: true,
    description: "Pisang, madu, dan oat untuk pagi yang padat.",
    longDescription: "Banana Honey Oat dirancang sebagai pengganjal pagi: pisang dan oat yang creamy dipadukan madu dan taburan kayu manis. Praktis dibawa, cukup mengenyangkan sampai jam makan siang.",
    ingredients: "Pisang, oatmeal, susu segar, madu murni, kayu manis, es batu.",
    accentFruit: "banana"
  },
  {
    id: "strawberry-cloud", name: "Strawberry Cloud", slug: "strawberry-cloud", category: "strawberry",
    price: 35000, promoPrice: null, rating: 4.9, reviews: 73, isNew: true, addedIndex: 5, available: false,
    description: "Stroberi lembut dengan foam susu selembut awan.",
    longDescription: "Strawberry Cloud menghadirkan stroberi yang diblender halus lalu ditutup foam susu ringan. Manisnya pas dan tampilannya cantik — stok contoh ini sedang habis, pantau terus ya.",
    ingredients: "Stroberi segar, susu segar, foam susu, madu, es batu.",
    accentFruit: "strawberry"
  }
];

function getProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; }) || null;
}

function basePrice(product) {
  return product.promoPrice ? product.promoPrice : product.price;
}

/* Harga final SELALU dihitung dari data pusat + ukuran. */
function priceFor(product, sizeKey) {
  return basePrice(product) + sizeByKey(sizeKey).delta;
}

function formatRp(n) {
  return "Rp" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ============================================================
   SISTEM ARTWORK SVG
   Botol & buah digambar sebagai SVG agar setiap layer hero
   bisa melayang / parallax secara terpisah dan tidak ada
   gambar yang gagal dimuat (404).
   ============================================================ */

/* Botol smoothie. opts: { label=true, straw=true, id=unik } */
function bottleSVG(flavourKey, opts) {
  opts = opts || {};
  var f = FLAVOURS[flavourKey] || FLAVOURS.berry;
  var uid = opts.id || ("g" + Math.random().toString(36).slice(2, 8));
  var label = opts.label === false ? "" :
    '<g>' +
      '<rect x="70" y="238" width="84" height="86" rx="14" fill="#FFFFFF" opacity="0.94"/>' +
      '<text x="112" y="272" text-anchor="middle" font-family="Baloo 2, cursive" font-weight="700" font-size="21" fill="#302B35">blendy</text>' +
      '<text x="112" y="294" text-anchor="middle" font-family="Poppins, sans-serif" font-size="10.5" letter-spacing="1.5" fill="' + f.deep + '">' + f.name.toUpperCase() + '</text>' +
      '<circle cx="112" cy="308" r="3.2" fill="' + f.color + '"/>' +
    '</g>';
  var straw = opts.straw === false ? "" :
    '<g transform="rotate(9 138 62)">' +
      '<rect x="130" y="6" width="15" height="96" rx="7.5" fill="' + f.deep + '"/>' +
      '<rect x="130" y="6" width="6" height="96" rx="3" fill="#FFFFFF" opacity="0.35"/>' +
    '</g>';
  return '' +
  '<svg viewBox="0 0 224 400" role="img" aria-label="Botol smoothie Blendy rasa ' + f.name + '" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<linearGradient id="dr' + uid + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="' + f.drinkDark + '"/>' +
        '<stop offset="0.45" stop-color="' + f.drink + '"/>' +
        '<stop offset="1" stop-color="' + f.drinkDark + '"/>' +
      '</linearGradient>' +
      '<linearGradient id="gl' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>' +
        '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0.05"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<ellipse cx="112" cy="382" rx="72" ry="12" fill="#302B35" opacity="0.10"/>' +
    straw +
    '<rect x="82" y="52" width="60" height="26" rx="9" fill="#302B35"/>' +
    '<rect x="82" y="52" width="60" height="10" rx="5" fill="#FFFFFF" opacity="0.14"/>' +
    '<path d="M84 78 h56 l10 34 c14 10 20 26 20 48 v176 c0 26 -18 44 -44 44 h-28 c-26 0 -44 -18 -44 -44 v-176 c0 -22 6 -38 20 -48 z" fill="url(#dr' + uid + ')"/>' +
    '<path d="M84 78 h56 l10 34 c14 10 20 26 20 48 v18 c-38 12 -94 12 -132 0 v-18 c0 -22 6 -38 20 -48 z" fill="#FFFFFF" opacity="0.20"/>' +
    '<rect x="66" y="128" width="17" height="218" rx="8.5" fill="url(#gl' + uid + ')"/>' +
    '<circle cx="88" cy="196" r="7" fill="#FFFFFF" opacity="0.35"/>' +
    '<circle cx="140" cy="228" r="5" fill="#FFFFFF" opacity="0.28"/>' +
    '<circle cx="96" cy="330" r="5.5" fill="#FFFFFF" opacity="0.25"/>' +
    '<circle cx="146" cy="300" r="4" fill="#FFFFFF" opacity="0.3"/>' +
    label +
  '</svg>';
}

/* Potongan buah per rasa — dipakai di hero, kartu, dan detail. */
function fruitSVG(kind, opts) {
  opts = opts || {};
  var cls = opts.cls ? ' class="' + opts.cls + '"' : "";
  var open = '<svg viewBox="0 0 120 120" role="img" xmlns="http://www.w3.org/2000/svg"' + cls + '>';
  var body = "";
  if (kind === "berry") {
    body =
      '<circle cx="46" cy="66" r="24" fill="#7C6BB0"/>' +
      '<circle cx="76" cy="58" r="20" fill="#8F76B8"/>' +
      '<circle cx="62" cy="86" r="19" fill="#6E5AA6"/>' +
      '<circle cx="38" cy="58" r="6" fill="#FFFFFF" opacity="0.45"/>' +
      '<circle cx="70" cy="50" r="5" fill="#FFFFFF" opacity="0.45"/>' +
      '<path d="M58 34 q4 -12 16 -14 q-2 12 -12 16 z" fill="#6F9E3E"/>' +
      '<path d="M52 38 q-10 -8 -20 -5 q6 10 16 11 z" fill="#86B85C"/>';
  } else if (kind === "kiwi") {
    body =
      '<circle cx="60" cy="62" r="42" fill="#7A5C3E"/>' +
      '<circle cx="60" cy="62" r="37" fill="#A9CF7E"/>' +
      '<circle cx="60" cy="62" r="15" fill="#EAF5D2"/>' +
      '<g fill="#302B35">' +
        '<ellipse cx="60" cy="40" rx="2.1" ry="3.4"/>' +
        '<ellipse cx="76" cy="47" rx="2.1" ry="3.4" transform="rotate(40 76 47)"/>' +
        '<ellipse cx="82" cy="62" rx="2.1" ry="3.4" transform="rotate(80 82 62)"/>' +
        '<ellipse cx="76" cy="77" rx="2.1" ry="3.4" transform="rotate(130 76 77)"/>' +
        '<ellipse cx="60" cy="84" rx="2.1" ry="3.4" transform="rotate(180 60 84)"/>' +
        '<ellipse cx="44" cy="77" rx="2.1" ry="3.4" transform="rotate(230 44 77)"/>' +
        '<ellipse cx="38" cy="62" rx="2.1" ry="3.4" transform="rotate(280 38 62)"/>' +
        '<ellipse cx="44" cy="47" rx="2.1" ry="3.4" transform="rotate(320 44 47)"/>' +
      '</g>' +
      '<path d="M60 47 v-6 M74 52 l5 -4 M79 66 h7 M72 76 l5 5 M60 79 v7 M48 76 l-5 5 M41 66 h-7 M48 52 l-5 -4" stroke="#DCEBC2" stroke-width="2.4" stroke-linecap="round"/>';
  } else if (kind === "banana") {
    body =
      '<path d="M26 22 q-6 44 26 68 q30 22 58 10 q-34 -2 -56 -24 q-22 -22 -24 -50 z" fill="#F2D67C"/>' +
      '<path d="M26 22 q-6 44 26 68 q30 22 58 10 q-6 2 -14 1 q-30 -3 -48 -25 q-18 -22 -20 -48 z" fill="#E3BC4E" opacity="0.55"/>' +
      '<path d="M30 30 q0 34 24 56" stroke="#FFF3C4" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>' +
      '<path d="M24 22 q-3 -8 4 -12 q7 3 5 11 q-4 4 -9 1z" fill="#7A5C3E"/>';
  } else { /* strawberry */
    body =
      '<path d="M60 108 C34 88 22 68 24 50 C26 34 40 28 52 34 C56 30 64 30 68 34 C80 28 94 34 96 50 C98 68 86 88 60 108z" fill="#F2708C"/>' +
      '<path d="M36 46 q-4 16 8 30" stroke="#FFB3C4" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>' +
      '<g fill="#FFE3EA">' +
        '<ellipse cx="46" cy="56" rx="2.4" ry="3.6"/>' +
        '<ellipse cx="62" cy="50" rx="2.4" ry="3.6"/>' +
        '<ellipse cx="76" cy="58" rx="2.4" ry="3.6"/>' +
        '<ellipse cx="52" cy="72" rx="2.4" ry="3.6"/>' +
        '<ellipse cx="68" cy="74" rx="2.4" ry="3.6"/>' +
        '<ellipse cx="60" cy="88" rx="2.4" ry="3.6"/>' +
      '</g>' +
      '<path d="M60 34 q2 -14 14 -18 q0 12 -8 18 q10 -2 16 4 q-10 6 -22 -4z" fill="#6F9E3E"/>' +
      '<path d="M60 34 q-2 -14 -14 -18 q0 12 8 18 q-10 -2 -16 4 q10 6 22 -4z" fill="#86B85C"/>';
  }
  return open + body + "</svg>";
}

/* Daun mint kecil untuk aksen */
function leafSVG(cls) {
  return '<svg viewBox="0 0 60 60" role="img" xmlns="http://www.w3.org/2000/svg"' + (cls ? ' class="' + cls + '"' : "") + '>' +
    '<path d="M30 54 C12 44 8 24 12 8 C28 6 46 14 50 28 C44 46 38 52 30 54z" fill="#86B85C"/>' +
    '<path d="M16 44 C24 32 34 22 46 14" stroke="#5E8F36" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>';
}

/* Rating bintang (visual, data contoh) */
function starsSVG(rating) {
  var full = Math.round(rating);
  var out = '<span class="stars" role="img" aria-label="Rating ' + rating + ' dari 5">';
  for (var i = 1; i <= 5; i++) {
    out += '<svg viewBox="0 0 24 24" class="star' + (i <= full ? " on" : "") + '" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>';
  }
  return out + "</span>";
}
