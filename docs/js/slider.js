/* ============================================================
   BLENDY — slider.js
   Hero slider 4 rasa: Berry, Kiwi, Banana, Strawberry.
   - Transisi panel wipe 970 ms (panel warna rasa berikutnya
     menyapu layar, konten berganti di tengah sapuan)
   - Parallax layer: mouse move (desktop) + geser saat transisi
   - Buah melayang (floating) dengan animasi CSS
   - Autoplay, pause saat hover / interaksi
   - Keyboard (←/→), swipe sentuh, drag mouse
   - prefers-reduced-motion: tanpa autoplay/float/parallax,
     pergantian instan
   ============================================================ */

"use strict";

const HERO_SLIDES = [
  { key: "berry",      productId: "berry-blast",      headline: "Berry",      tagline: "Ledakan rasa berry yang menyegarkan di setiap tegukan.",    fruits: ["berry", "berry", "strawberry"] },
  { key: "kiwi",       productId: "kiwi-fresh",       headline: "Kiwi",       tagline: "Segar, ringan, dan bikin hari terasa lebih hijau.",          fruits: ["kiwi", "kiwi", "leaf"] },
  { key: "banana",     productId: "banana-smooth",    headline: "Banana",     tagline: "Lembut, creamy, dan mengenyangkan dengan cara yang enak.",   fruits: ["banana", "banana", "leaf"] },
  { key: "strawberry", productId: "strawberry-dream", headline: "Strawberry", tagline: "Manis stroberi ranum yang selalu bikin jatuh cinta.",        fruits: ["strawberry", "strawberry", "berry"] }
];

const WIPE_MS = 970;
const AUTOPLAY_MS = 5200;
/* REDUCED didefinisikan di products.js (dimuat lebih dulu) */

let heroIndex = 0;
let heroBusy = false;
let autoplayTimer = null;
let parallax = { x: 0, y: 0 };

function heroSlideHTML(slide, i) {
  const f = FLAVOURS[slide.key];
  const fruitAt = function (kind, style, depth, delay) {
    const art = kind === "leaf" ? leafSVG() : fruitSVG(kind);
    return '<span class="hero-fruit float-el" data-depth="' + depth + '" style="' + style + ' animation-delay:' + delay + '" aria-hidden="true">' + art + "</span>";
  };
  return '' +
  '<article class="hero-slide' + (i === 0 ? " active" : "") + '" data-slide="' + i + '" aria-hidden="' + (i === 0 ? "false" : "true") + '">' +
    '<div class="hero-bg" style="background:' + f.color + '"></div>' +
    '<div class="hero-blob blob-a" style="background:' + f.soft + '" aria-hidden="true"></div>' +
    '<div class="hero-blob blob-b" style="background:' + f.drink + '" aria-hidden="true"></div>' +
    '<span class="hero-word" data-depth="6" aria-hidden="true">' + slide.headline + "</span>" +
    '<div class="hero-content">' +
      '<p class="hero-eyebrow rise" style="animation-delay:.05s">Blendy Smoothie · ' + f.name + " Series</p>" +
      '<h2 class="hero-title rise" style="animation-delay:.14s">' + slide.headline + '<span class="hero-title-dot">.</span></h2>' +
      '<p class="hero-tag rise" style="animation-delay:.24s">' + slide.tagline + "</p>" +
      '<div class="hero-cta rise" style="animation-delay:.34s">' +
        '<a class="btn btn-dark btn-lg" href="shop.html?product=' + slide.productId + '">SHOP NOW</a>' +
        '<button type="button" class="btn btn-light btn-lg" data-hero-detail="' + slide.productId + '">Lihat Detail</button>' +
      "</div>" +
      '<p class="hero-price rise" style="animation-delay:.42s">Mulai ' + formatRp(basePrice(getProduct(slide.productId))) + ' · <span class="hero-rate">★ ' + String(getProduct(slide.productId).rating).replace(".", ",") + " dari pelanggan contoh</span></p>" +
    "</div>" +
    '<div class="hero-visual">' +
      '<span class="hero-ring" data-depth="10" aria-hidden="true"></span>' +
      '<span class="hero-bottle" data-depth="18">' + bottleSVG(slide.key, { id: "hero" + slide.key }) + "</span>" +
      fruitAt(slide.fruits[0], "left:-4%;top:6%;width:104px;transform:rotate(-14deg)", 30, "0s") +
      fruitAt(slide.fruits[1], "right:-2%;bottom:14%;width:88px;transform:rotate(16deg)", 42, ".7s") +
      fruitAt(slide.fruits[2], "left:6%;bottom:2%;width:64px;transform:rotate(8deg)", 24, "1.3s") +
    "</div>" +
  "</article>";
}

function initHero() {
  const root = document.getElementById("heroSlider");
  if (!root) return;
  const stage = root.querySelector(".hero-stage");
  stage.innerHTML = HERO_SLIDES.map(heroSlideHTML).join("") +
    '<div class="hero-wipe" id="heroWipe" aria-hidden="true"></div>';

  root.querySelectorAll("[data-hero-detail]").forEach(function (btn) {
    btn.addEventListener("click", function () { openQuickView(btn.getAttribute("data-hero-detail")); });
  });

  /* Navigasi rasa */
  const pills = root.querySelectorAll("[data-hero-pill]");
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      goToSlide(parseInt(pill.getAttribute("data-hero-pill"), 10));
      restartAutoplay();
    });
  });

  const prev = root.querySelector("[data-hero-prev]");
  const next = root.querySelector("[data-hero-next]");
  if (prev) prev.addEventListener("click", function () { goToSlide(heroIndex - 1); restartAutoplay(); });
  if (next) next.addEventListener("click", function () { goToSlide(heroIndex + 1); restartAutoplay(); });

  /* Keyboard */
  document.addEventListener("keydown", function (e) {
    if (!root.isConnected) return;
    const rect = root.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === "ArrowRight") { goToSlide(heroIndex + 1); restartAutoplay(); }
    else if (e.key === "ArrowLeft") { goToSlide(heroIndex - 1); restartAutoplay(); }
  });

  /* Parallax mouse (desktop, pointer halus) */
  if (!REDUCED && typeof window.matchMedia === "function" && window.matchMedia("(pointer: fine)").matches) {
    root.addEventListener("mousemove", function (e) {
      const r = root.getBoundingClientRect();
      parallax.x = (e.clientX - r.left) / r.width - 0.5;
      parallax.y = (e.clientY - r.top) / r.height - 0.5;
      applyParallax(root);
    });
    root.addEventListener("mouseleave", function () {
      parallax = { x: 0, y: 0 };
      applyParallax(root);
    });
  }

  /* Swipe & drag */
  let startX = null;
  let dragging = false;
  const threshold = 55;
  stage.addEventListener("pointerdown", function (e) {
    if (e.target.closest("a, button")) return;
    startX = e.clientX;
    dragging = true;
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging || startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > threshold) {
      goToSlide(heroIndex + (dx < 0 ? 1 : -1));
      restartAutoplay();
      dragging = false;
      startX = null;
    }
  });
  window.addEventListener("pointerup", function () { dragging = false; startX = null; });
  stage.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) { goToSlide(heroIndex + (dx < 0 ? 1 : -1)); restartAutoplay(); }
    startX = null;
  }, { passive: true });

  /* Autoplay + pause on hover */
  if (!REDUCED) {
    startAutoplay();
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });
  }

  /* Animasi pembuka */
  requestAnimationFrame(function () { root.classList.add("opened"); });
}

function applyParallax(root) {
  const active = root.querySelector(".hero-slide.active");
  if (!active) return;
  active.querySelectorAll("[data-depth]").forEach(function (el) {
    const d = parseFloat(el.getAttribute("data-depth")) || 0;
    el.style.translate = (-parallax.x * d) + "px " + (-parallax.y * d * 0.7) + "px";
  });
}

function setActiveUI(root, idx) {
  root.querySelectorAll(".hero-slide").forEach(function (s, i) {
    s.classList.toggle("active", i === idx);
    s.setAttribute("aria-hidden", i === idx ? "false" : "true");
  });
  root.querySelectorAll("[data-hero-pill]").forEach(function (p, i) {
    p.classList.toggle("active", i === idx);
    p.setAttribute("aria-selected", i === idx ? "true" : "false");
  });
  const counter = root.querySelector(".hero-counter");
  if (counter) counter.textContent = "0" + (idx + 1) + " / 04";
}

function goToSlide(nextIdx) {
  const root = document.getElementById("heroSlider");
  if (!root || heroBusy) return;
  const total = HERO_SLIDES.length;
  const target = ((nextIdx % total) + total) % total;
  if (target === heroIndex) return;

  if (REDUCED) {
    heroIndex = target;
    setActiveUI(root, heroIndex);
    return;
  }

  heroBusy = true;
  const wipe = document.getElementById("heroWipe");
  const dir = target > heroIndex || (heroIndex === total - 1 && target === 0) ? 1 : -1;
  wipe.style.background = FLAVOURS[HERO_SLIDES[target].key].color;
  wipe.style.transformOrigin = dir > 0 ? "left center" : "right center";
  wipe.classList.remove("run");
  void wipe.offsetWidth;
  wipe.classList.add("run");

  /* Konten berganti tepat saat panel menutup layar (± setengah durasi) */
  setTimeout(function () {
    heroIndex = target;
    setActiveUI(root, heroIndex);
    applyParallax(root);
  }, WIPE_MS / 2);

  setTimeout(function () {
    wipe.classList.remove("run");
    heroBusy = false;
  }, WIPE_MS + 40);
}

function startAutoplay() {
  if (REDUCED || autoplayTimer) return;
  autoplayTimer = setInterval(function () { goToSlide(heroIndex + 1); }, AUTOPLAY_MS);
}

function stopAutoplay() {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

document.addEventListener("DOMContentLoaded", initHero);
