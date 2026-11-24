# Blendy — Website E-Commerce Smoothie Premium

Website toko online smoothie **Blendy** ("Real Fruit. Real Freshness.") yang dibangun dengan HTML5, CSS3, dan Vanilla JavaScript murni — tanpa framework dan tanpa proses build. Berisi hero slider 4 rasa, katalog produk dengan filter/pencarian/sortir, keranjang belanja persisten, checkout simulasi, dan sistem akun demo.

> **Catatan penting:** Seluruh transaksi di website ini adalah **simulasi frontend**. Belum ada backend, database, atau payment gateway. Harga, kontak, testimoni, dan rating adalah data contoh yang diatur terpusat di `docs/js/products.js`.

## Struktur Folder

```
portfolio9-repo/
├── README.md                  ← dokumen ini
└── docs/                      ← root website (dipakai GitHub Pages: branch main, folder /docs)
    ├── index.html             ← Home (hero slider + semua section)
    ├── shop.html              ← Katalog produk
    ├── about.html             ← Our Story
    ├── contact.html           ← Kontak + formulir
    ├── cart.html              ← Halaman keranjang
    ├── checkout.html          ← Checkout simulasi
    ├── order-success.html     ← Halaman sukses pesanan
    ├── login.html             ← Login demo (+ panel lupa password)
    ├── register.html          ← Register demo
    ├── account.html           ← My Account + Order History
    ├── .htaccess              ← Konfigurasi Apache opsional (diabaikan GitHub Pages)
    ├── css/
    │   ├── style.css          ← Sistem desain & komponen
    │   ├── animations.css     ← Hero, wipe, floating, reveal, FAQ, testimoni
    │   └── responsive.css     ← Layout halaman + breakpoint
    ├── js/
    │   ├── products.js        ← PUSAT DATA: produk, harga, ukuran, voucher, kontak, artwork SVG
    │   ├── cart.js            ← Keranjang (localStorage), drawer, halaman cart
    │   ├── components.js      ← Header/footer, toast, kartu produk, modal Quick View
    │   ├── slider.js          ← Hero slider 4 rasa
    │   ├── checkout.js        ← Checkout simulasi, nomor pesanan, riwayat order
    │   └── app.js             ← Inisialisasi global & logika per halaman
    └── assets/                ← (kosong — semua artwork berupa SVG inline dari js/products.js)
```

Semua path antar-halaman dan aset bersifat **relatif**, sehingga website berjalan baik di root domain maupun di subfolder (mis. `https://alststudio.github.io/portfolio9/`).

## Cara Menjalankan di Localhost

Tidak perlu Node.js/npm. Pilih salah satu:

- **XAMPP / Laragon:** salin folder `docs/` ke `htdocs` (XAMPP) atau `www` (Laragon), lalu buka `http://localhost/<nama-folder>/`.
- **Python:** `cd docs && python3 -m http.server 8000` lalu buka `http://localhost:8000`.
- **VS Code:** gunakan ekstensi Live Server pada folder `docs/`.

## Cara Upload ke cPanel

1. Zip isi folder `docs/` (bukan foldernya) sehingga `index.html` berada di level teratas zip.
2. Di cPanel → File Manager → buka `public_html` (atau folder subdomain/subfolder tujuan).
3. Upload zip, lalu Extract.
4. Selesai — website langsung bisa diakses. File `.htaccess` opsional ikut terbawa untuk keamanan dasar dan halaman 404.

## Cara Mengganti Konten

Semua pengaturan utama ada di **`docs/js/products.js`**:

### Mengganti logo
Logo dirender oleh fungsi `logoSVG()` dan teks `blendy` di `docs/js/components.js` (fungsi `renderHeader` dan `renderFooter`). Ubah bentuk SVG di `logoSVG()` dan teks di `<span class="logo-text">`. Favicon ada sebagai data URI SVG di `<head>` setiap halaman.

### Mengganti gambar produk
Produk tidak memakai file gambar eksternal: botol dan buah digambar sebagai **SVG terprogram** oleh fungsi `bottleSVG()` dan `fruitSVG()` di `docs/js/products.js`, diwarnai otomatis dari objek `FLAVOURS`. Untuk memakai foto asli, ganti pemanggilan fungsi tersebut di `productCardHTML()` (components.js) dan `heroSlideHTML()` (slider.js) dengan tag `<img src="...">` mengarah ke file gambar kamu.

### Mengganti harga produk
Edit field `price` (dan `promoPrice` bila ada promo) pada objek produk di array `PRODUCTS` (`docs/js/products.js`). Selisih harga ukuran diatur di array `SIZES` (`delta` dalam Rupiah). Semua tampilan harga, keranjang, dan checkout menghitung otomatis dari sini.

### Menambahkan produk
Tambahkan satu objek baru ke array `PRODUCTS` dengan field: `id` (unik), `name`, `slug`, `category` (`berry`/`kiwi`/`banana`/`strawberry`), `price`, `promoPrice` (atau `null`), `description`, `longDescription`, `ingredients`, `rating`, `reviews`, `isNew`, `addedIndex` (semakin besar = semakin baru), `available`, dan `accentFruit`. Produk langsung muncul di katalog dan bisa difilter/dicari.

### Mengganti informasi kontak
Edit objek `CONFIG` di `docs/js/products.js`: `email`, `whatsappDisplay`, `whatsappNumber` (format internasional tanpa `+`, cth. `62812...`), `address`, dan `hours`. Footer dan halaman Contact membaca dari sini.

### Mengubah warna brand
Warna rasa ada di dua tempat yang harus selaras: objek `FLAVOURS` di `docs/js/products.js` (dipakai artwork & aksen dinamis) dan variabel CSS `--berry`, `--kiwi`, `--banana`, `--strawberry` beserta varian `-deep` di `docs/css/style.css`.

### Mengatur link WhatsApp & media sosial
Nomor WhatsApp: field `whatsappNumber` di `CONFIG`. Tautan Instagram/TikTok/YouTube: field `socials` di `CONFIG` yang sama (dipakai footer di semua halaman).

## Fitur yang Masih Simulasi

| Fitur | Status |
|---|---|
| Checkout & pembayaran | Simulasi. Metode Transfer Bank / E-Wallet / COD hanya pilihan tampilan; nomor pesanan (format `BLD-2026-XXXX`) dibuat acak di browser. |
| Login / Register / Lupa password | Mode demo. Hanya nama & email yang disimpan di `localStorage` (kunci `blendy_demo_user`). **Password tidak pernah disimpan.** |
| Newsletter | Email divalidasi lalu disimpan di `localStorage` browser pengunjung — tidak dikirim ke server mana pun. |
| Formulir kontak | Divalidasi dan menampilkan pesan sukses simulasi; tidak ada pesan yang benar-benar terkirim. |
| Keranjang | Tersimpan di `localStorage` (`blendy_cart_v1`) per browser/perangkat, bukan per akun. |
| Rating & testimoni | Konten contoh, ditandai sebagai contoh di halaman. |

Data demo lain: pesanan `blendy_orders_v1`, voucher aktif `blendy_voucher_v1`. Hapus kunci-kunci tersebut dari DevTools → Application → Local Storage untuk mereset demo.

## Panduan Integrasi Backend & Payment Gateway

Struktur kode disiapkan agar mudah dihubungkan ke backend sungguhan:

1. **Katalog produk:** ganti array `PRODUCTS` di `products.js` dengan `fetch()` ke REST API kamu; pertahankan bentuk field-nya agar fungsi render tidak berubah. Harga final **wajib dihitung ulang di server** — jangan percaya harga dari frontend.
2. **Autentikasi:** ganti `setDemoUser/getDemoUser` di `components.js` dengan sesi/JWT dari API (mis. Laravel, Express, Firebase Auth). Formulir login/register sudah memiliki validasi sisi klien sebagai lapisan pertama.
3. **Checkout:** pada handler submit di `checkout.js` (`initCheckout`), kirim isi keranjang ke endpoint order di server; server memvalidasi stok & harga, membuat pesanan, lalu mengembalikan nomor pesanan resmi.
4. **Payment gateway:** untuk Indonesia, integrasikan misalnya Midtrans/Xendit/Doku di sisi server: buat transaksi dari endpoint order, arahkan pengguna ke halaman pembayaran gateway, dan konfirmasi status lewat webhook — bukan dari halaman sukses frontend.
5. **Newsletter & kontak:** arahkan kedua formulir ke endpoint API atau layanan formulir (mis. Formspree) dan tampilkan pesan sukses hanya setelah respons server berhasil.

## Teknologi

HTML5 semantik · CSS3 (variabel, grid, flexbox) · Vanilla JavaScript (ES6, tanpa framework) · Google Fonts (Poppins & Baloo 2) · localStorage · SVG inline. Menghormati `prefers-reduced-motion` dan dapat diakses dengan keyboard.
