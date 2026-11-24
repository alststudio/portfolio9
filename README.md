# Blendy — Website E-Commerce Smoothie Premium

Website toko online smoothie fiktif **Blendy** ("Real Fruit. Real Freshness.") dengan hero slider rasa interaktif (Berry, Kiwi, Banana, Strawberry), katalog produk, keranjang belanja, checkout demo, dan akun demo. Dibangun dengan HTML5, CSS3, dan Vanilla JavaScript — tanpa framework dan tanpa proses build.

> Catatan rilis: hero mengikuti *exact-recreation prompt* Blendy. Satu adaptasi yang disengaja: pada spek aslinya hero adalah halaman mandiri yang tidak bisa di-scroll (panggung `fixed`, `body` overflow hidden). Di website lengkap ini hero menjadi layar pertama `index.html` — section setinggi `100svh` dengan panggung `position: absolute` di dalamnya — agar halaman dapat di-scroll ke section di bawahnya. Seluruh pengukuran, tabel timing wipe 970 ms, faktor parallax, urutan pembuka, aturan ponsel, dan aturan reduced-motion lainnya dipertahankan persis seperti spek.

## Struktur Folder

```
.
├── README.md
└── docs/                  <- root website (folder /docs untuk GitHub Pages)
    ├── index.html         <- beranda: hero slider + intro + unggulan + why + promo
    │                         + testimoni + newsletter + FAQ + footer
    ├── shop.html          <- katalog: filter rasa, pencarian, sortir, Load More
    ├── about.html         <- Our Story, visi & misi
    ├── contact.html       <- info kontak contoh + formulir (simulasi)
    ├── cart.html          <- halaman keranjang + voucher
    ├── checkout.html      <- formulir checkout + ringkasan (simulasi)
    ├── order-success.html <- ringkasan pesanan berhasil (simulasi)
    ├── login.html         <- login demo (+ panel lupa kata sandi)
    ├── register.html      <- register demo
    ├── account.html       <- profil demo + riwayat pesanan
    ├── .htaccess          <- konfigurasi Apache opsional
    ├── .nojekyll
    ├── assets/fonts/      <- Poppins 500/600/700 & Baloo 2 800 (WOFF2, self-hosted)
    ├── css/
    │   ├── style.css      <- gaya utama situs
    │   ├── responsive.css <- penyesuaian layar kecil
    │   └── animations.css <- scroll reveal & micro-interactions
    └── js/
        ├── products.js    <- PUSAT DATA: produk, harga, ukuran, voucher, info toko
        ├── cart.js        <- keranjang (localStorage), drawer, voucher, toast
        ├── components.js  <- header/footer/drawer/modal bersama + sesi demo
        ├── app.js         <- katalog, modal produk, testimoni, FAQ, formulir, akun
        └── checkout.js    <- checkout & halaman sukses
```

Seluruh path bersifat **relatif**, sehingga website berjalan di subfolder (mis. `https://alststudio.github.io/portfolio9/`) maupun di domain root.

## Cara Menjalankan di Localhost

- **XAMPP / Laragon:** salin isi folder `docs/` ke `htdocs/blendy/` (XAMPP) atau `www/blendy/` (Laragon), start Apache, lalu buka `http://localhost/blendy/`.
- **Server statis sederhana:** dari dalam folder `docs/`, jalankan `python3 -m http.server 8000`, lalu buka `http://localhost:8000/`.
- Tidak membutuhkan Node.js, npm, atau langkah build apa pun.

## Cara Upload ke cPanel

1. Zip isi folder `docs/` (bukan foldernya) dari komputer kamu.
2. Di cPanel → File Manager → `public_html` (atau subfolder tujuan), upload dan extract zip tersebut.
3. Pastikan `index.html` berada tepat di folder tujuan.
4. File `.htaccess` opsional ikut ter-upload untuk konfigurasi Apache dasar (halaman 404 diarahkan ke `index.html` tidak diperlukan — setiap halaman adalah file HTML nyata).

## Kustomisasi

Semua pengaturan utama terpusat di **`docs/js/products.js`**:

- **Mengganti logo:** teks logo "Blendy" dirender dari `components.js` (fungsi `siteHeaderHTML`/`siteFooterHTML`) dan dari markup hero di `index.html` (`.hx-logo`). Ganti teksnya di kedua tempat, atau sisipkan `<img>` logo kamu di sana.
- **Mengganti gambar produk:** visual produk adalah potongan (crop) CSS dari empat *sheet* PNG transparan 2048×2048 (satu per rasa) yang dimuat lewat proxy images.higgs.ai. URL sheet dan kotak item (`bottle`, `items`) ada di objek `FLAVOURS` pada `products.js` (dan salinannya di skrip hero `index.html`). Untuk memakai sheet/foto sendiri, ganti URL-nya dan sesuaikan kotak `[x, y, lebar, tinggi]` item di dalamnya. Tidak ada file gambar yang perlu di-slice.
- **Mengganti harga produk:** ubah `price` / `promoPrice` pada entri produk di array `PRODUCTS` (`products.js`). Selisih harga ukuran diatur sekali di array `SIZES` (Regular +Rp0, Large +Rp7.000, Extra Large +Rp14.000).
- **Menambahkan produk:** salin satu objek produk di `PRODUCTS`, isi `id` & `slug` unik, `name`, `flavour` (`berry`/`kiwi`/`banana`/`strawberry`), `price`, `desc`, `longDesc`, `rating`, dan flag `featured`/`isNew`/`available`. Produk otomatis muncul di katalog, pencarian, dan rekomendasi.
- **Mengganti informasi kontak:** ubah objek `SITE_CONFIG` di `products.js` (email, nomor WhatsApp tampilan + tautan `wa.me`, alamat, jam operasional, tautan media sosial). Footer dan halaman Contact membaca dari sana.
- **Mengubah warna brand:** warna rasa ada di `FLAVOURS` (`color`) dan variabel CSS di `css/style.css` (`--berry`, `--kiwi`, `--banana`, `--strawberry`, `--bg`, `--ink`).
- **Kode voucher:** diatur di objek `VOUCHERS` pada `products.js` (bawaan: `BLENDY10` = diskon 10%).

## Fitur yang Masih Simulasi (Demo)

Website ini 100% frontend. Fitur berikut **disimulasikan** dan diberi label jujur di halaman masing-masing:

- **Checkout & pembayaran** — tidak ada payment gateway; pesanan disimpan di `localStorage` browser dengan nomor simulasi `BLD-2026-XXXX`.
- **Login / Register / Lupa kata sandi** — mode demo; hanya nama & email yang disimpan di `localStorage`. Kata sandi **tidak pernah disimpan**.
- **Newsletter & formulir kontak** — hanya validasi + pesan sukses simulasi; tidak ada email yang benar-benar terkirim.
- **Testimoni & rating produk** — data contoh, diberi label "contoh" di halaman.
- **Informasi kontak** — data contoh dari `SITE_CONFIG`.

## Panduan Integrasi Backend & Payment Gateway

1. **API produk:** ganti array `PRODUCTS` di `products.js` dengan `fetch()` ke endpoint REST/GraphQL kamu; pertahankan bentuk objeknya agar renderer tidak berubah.
2. **Autentikasi:** ganti `getDemoUser`/`setDemoUser` di `components.js` dengan token sesi dari backend (mis. JWT di cookie httpOnly). Jangan pernah menyimpan kata sandi di frontend.
3. **Checkout:** kirim isi keranjang ke server, **hitung ulang harga di server** (jangan percaya harga dari browser), buat transaksi di payment gateway (Midtrans/Xendit/Stripe), lalu arahkan kembali ke `order-success.html` dengan nomor order resmi dari server.
4. **Validasi:** semua validasi form di frontend bersifat pendamping — ulangi validasi yang sama di server.
5. **Email transaksional:** kirim konfirmasi pesanan & newsletter dari server (SMTP/API email), bukan dari browser.

## Teknologi

HTML5 · CSS3 · Vanilla JavaScript · LocalStorage untuk data demo · Font self-hosted (Poppins & Baloo 2) · Gambar produk sebagai CSS background crop dari sheet transparan via proxy images.higgs.ai.
