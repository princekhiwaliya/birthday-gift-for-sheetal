// =====================================================
// gallery.js — Romantic image lightbox for Sheetal ♥
// Click any image → opens fullscreen viewer with zoom,
// prev/next navigation, swipe support, and close button.
// =====================================================

(function () {
  "use strict";

  let allImgs = [];
  let currentIdx = 0;
  let zoomLevel = 1;
  let touchStart = null;

  function init() {
    allImgs = Array.from(document.querySelectorAll("img[data-img]"));
    if (allImgs.length === 0) return;

    allImgs.forEach((img, idx) => {
      img.classList.add("gv-thumb");
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openGallery(idx);
      });
    });

    buildOverlay();
  }

  function buildOverlay() {
    if (document.getElementById("gv-overlay")) return;

    // Inject CSS
    const style = document.createElement("style");
    style.id = "gv-style";
    style.textContent = `
      img.gv-thumb { cursor: zoom-in; }
      img.gv-thumb:hover { filter: brightness(1.05); }

      #gv-overlay {
        position: fixed; inset: 0;
        z-index: 9999;
        display: none;
        align-items: center; justify-content: center;
        font-family: Georgia, 'Cormorant Garamond', serif;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      #gv-overlay.open { display: flex; animation: gv-fade .35s ease; }
      @keyframes gv-fade { from { opacity: 0 } to { opacity: 1 } }

      #gv-bg {
        position: absolute; inset: 0;
        background:
          radial-gradient(circle at 25% 20%, rgba(244, 114, 182, 0.22), transparent 55%),
          radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.16), transparent 55%),
          rgba(12, 4, 18, 0.96);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
        cursor: pointer;
      }

      .gv-float-heart {
        position: absolute;
        color: rgba(244, 114, 182, 0.35);
        pointer-events: none;
        font-size: 20px;
        animation: gv-floatup 9s linear infinite;
      }
      .gv-float-heart.h1 { left: 8%; top: 100%; animation-delay: 0s; font-size: 18px; }
      .gv-float-heart.h2 { left: 28%; top: 100%; animation-delay: 2.5s; font-size: 24px; }
      .gv-float-heart.h3 { left: 55%; top: 100%; animation-delay: 5s; font-size: 16px; }
      .gv-float-heart.h4 { left: 78%; top: 100%; animation-delay: 7s; font-size: 22px; }
      @keyframes gv-floatup {
        0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
        15%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
      }

      #gv-stage {
        position: relative; z-index: 2;
        max-width: 92vw; max-height: 80vh;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
        touch-action: pan-x pinch-zoom;
      }

      #gv-image {
        max-width: 92vw;
        max-height: 80vh;
        border-radius: 14px;
        box-shadow:
          0 30px 90px rgba(244, 114, 182, 0.28),
          0 20px 50px rgba(0, 0, 0, 0.55),
          0 0 0 1px rgba(255, 255, 255, 0.07);
        transition: transform .35s cubic-bezier(.2,.7,.2,1);
        display: block;
      }
      #gv-image.gv-img-enter {
        animation: gv-img-in .45s cubic-bezier(.2,.7,.2,1);
      }
      @keyframes gv-img-in {
        from { opacity: 0; transform: scale(.93) translateY(12px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }

      .gv-btn {
        position: absolute;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        color: #ffd6e0;
        cursor: pointer;
        z-index: 4;
        transition: all .25s ease;
        font-family: inherit;
      }
      .gv-btn:hover {
        background: rgba(244, 114, 182, 0.4);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.06);
      }
      .gv-btn:active { transform: scale(0.96); }

      #gv-close {
        top: 22px; right: 22px;
        width: 46px; height: 46px;
        border-radius: 50%;
        font-size: 22px; font-weight: 300;
        display: flex; align-items: center; justify-content: center;
        line-height: 1;
      }

      #gv-prev, #gv-next {
        top: 50%;
        transform: translateY(-50%);
        width: 52px; height: 68px;
        border-radius: 12px;
        font-size: 36px;
        font-weight: 300;
        display: flex; align-items: center; justify-content: center;
        line-height: 1;
      }
      #gv-prev:hover, #gv-next:hover { transform: translateY(-50%) scale(1.06); }
      #gv-prev { left: 20px; }
      #gv-next { right: 20px; }

      .gv-hearts {
        position: absolute; top: 28px; left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        display: flex; gap: 14px;
        pointer-events: none;
      }
      .gv-hearts span {
        color: #f472b6;
        font-size: 18px;
        animation: gv-heart-pulse 2.4s ease-in-out infinite;
        filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.6));
      }
      .gv-hearts span:nth-child(2) { animation-delay: .3s; font-size: 22px; }
      .gv-hearts span:nth-child(3) { animation-delay: .6s; }
      @keyframes gv-heart-pulse {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 1;    transform: scale(1.25); }
      }

      .gv-footer {
        position: absolute; bottom: 26px; left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        color: rgba(255, 214, 224, 0.75);
        pointer-events: none;
        text-align: center;
      }
      #gv-counter {
        font-style: italic;
        font-size: 14px;
        letter-spacing: 2px;
        color: #ffd6e0;
        background: rgba(0,0,0,0.42);
        padding: 6px 16px;
        border-radius: 999px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 214, 224, 0.15);
      }
      .gv-note {
        font-style: italic;
        font-size: 10px;
        letter-spacing: 4.5px;
        text-transform: uppercase;
        color: rgba(255, 214, 224, 0.6);
        margin-top: 2px;
      }
      .gv-note .em {
        color: #f472b6;
        font-style: normal;
        font-size: 12px;
      }

      @media (max-width: 600px) {
        #gv-close { top: 14px; right: 14px; width: 40px; height: 40px; font-size: 20px; }
        #gv-prev, #gv-next { width: 42px; height: 56px; font-size: 28px; border-radius: 10px; }
        #gv-prev { left: 10px; }
        #gv-next { right: 10px; }
        .gv-hearts { top: 22px; gap: 10px; }
        .gv-hearts span { font-size: 14px; }
        .gv-hearts span:nth-child(2) { font-size: 16px; }
        .gv-footer { bottom: 16px; }
        #gv-counter { font-size: 12px; padding: 5px 12px; letter-spacing: 1.5px; }
        .gv-note { font-size: 9px; letter-spacing: 3px; }
        #gv-image { border-radius: 10px; }
      }
    `;
    document.head.appendChild(style);

    // Create overlay HTML
    const ov = document.createElement("div");
    ov.id = "gv-overlay";
    ov.innerHTML = `
      <div id="gv-bg"></div>
      <span class="gv-float-heart h1">♥</span>
      <span class="gv-float-heart h2">♥</span>
      <span class="gv-float-heart h3">♥</span>
      <span class="gv-float-heart h4">♥</span>
      <button class="gv-btn" id="gv-close" aria-label="Close" title="Close (Esc)">✕</button>
      <button class="gv-btn" id="gv-prev" aria-label="Previous" title="Previous (←)">‹</button>
      <button class="gv-btn" id="gv-next" aria-label="Next" title="Next (→)">›</button>
      <div class="gv-hearts">
        <span>♥</span><span>♥</span><span>♥</span>
      </div>
      <div id="gv-stage">
        <img id="gv-image" alt="">
      </div>
      <div class="gv-footer">
        <span id="gv-counter">1 / 1</span>
        <span class="gv-note">— for <span class="em">Sheetal</span> · with love —</span>
      </div>
    `;
    document.body.appendChild(ov);

    // Wire up events
    document.getElementById("gv-close").addEventListener("click", closeGallery);
    document.getElementById("gv-prev").addEventListener("click", (e) => { e.stopPropagation(); navigate(-1); });
    document.getElementById("gv-next").addEventListener("click", (e) => { e.stopPropagation(); navigate(1); });
    document.getElementById("gv-bg").addEventListener("click", closeGallery);

    const stage = document.getElementById("gv-stage");
    stage.addEventListener("click", (e) => {
      if (e.target === stage) closeGallery();
    });

    const mainImg = document.getElementById("gv-image");
    mainImg.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleZoom();
    });

    // Keyboard nav
    document.addEventListener("keydown", (e) => {
      if (!ov.classList.contains("open")) return;
      if (e.key === "Escape") { closeGallery(); }
      else if (e.key === "ArrowRight") { navigate(1); }
      else if (e.key === "ArrowLeft")  { navigate(-1); }
      else if (e.key === " ")          { e.preventDefault(); toggleZoom(); }
    });

    // Touch swipe
    stage.addEventListener("touchstart", (e) => {
      if (zoomLevel > 1) { touchStart = null; return; }
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    }, { passive: true });

    stage.addEventListener("touchend", (e) => {
      if (!touchStart || zoomLevel > 1) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStart.y);
      const dt = Date.now() - touchStart.t;
      if (Math.abs(dx) > 50 && dy < 80 && dt < 500) {
        navigate(dx < 0 ? 1 : -1);
      }
      touchStart = null;
    }, { passive: true });
  }

  function openGallery(idx) {
    currentIdx = idx;
    zoomLevel = 1;
    updateImage(true);
    const ov = document.getElementById("gv-overlay");
    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    const ov = document.getElementById("gv-overlay");
    if (ov) ov.classList.remove("open");
    document.body.style.overflow = "";
    zoomLevel = 1;
  }

  function navigate(dir) {
    if (allImgs.length === 0) return;
    currentIdx = (currentIdx + dir + allImgs.length) % allImgs.length;
    zoomLevel = 1;
    updateImage(true);
  }

  function updateImage(animate) {
    const img = document.getElementById("gv-image");
    const ctr = document.getElementById("gv-counter");
    if (!img || !ctr) return;
    const src = allImgs[currentIdx].src;
    img.src = src;
    img.style.transform = `scale(${zoomLevel})`;
    img.style.cursor = zoomLevel === 1 ? "zoom-in" : "zoom-out";
    ctr.textContent = `${currentIdx + 1}  ·  ${allImgs.length}`;
    if (animate) {
      img.classList.remove("gv-img-enter");
      // Force reflow then re-add to restart animation
      void img.offsetWidth;
      img.classList.add("gv-img-enter");
    }
  }

  function toggleZoom() {
    zoomLevel = zoomLevel === 1 ? 2.4 : 1;
    const img = document.getElementById("gv-image");
    img.style.transform = `scale(${zoomLevel})`;
    img.style.cursor = zoomLevel === 1 ? "zoom-in" : "zoom-out";
  }

  // Initialize after the hydration script has run
  // (app.js loads images via data-img, so wait a tick)
  function start() { setTimeout(init, 200); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
