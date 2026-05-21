// ===========================================================
// app.js — Hydration: applies data + localStorage overrides
// to elements with data-t (text) and data-img (image) attrs.
// ===========================================================

(function () {
  const LS_KEY = "birthdaySiteOverrides_v1";
  const LS_UPLOADS = "birthdaySite_uploads_v1";

  function deepGet(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function loadUploads() {
    try {
      const raw = localStorage.getItem(LS_UPLOADS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function mergeData(base, overrides) {
    const out = Array.isArray(base) ? base.slice() : { ...base };
    for (const k in overrides) {
      const v = overrides[k];
      if (v && typeof v === "object" && !Array.isArray(v) && base && typeof base[k] === "object") {
        out[k] = mergeData(base[k], v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  // Resolve an image name to a usable src:
  //  - "data:..."          → returned as-is
  //  - "upload_..."        → looked up from localStorage uploads
  //  - "anything else"     → "images/" + name
  function resolveImgSrc(name) {
    if (!name) return null;
    if (typeof name !== "string") return null;
    if (name.startsWith("data:")) return name;
    if (name.startsWith("upload_")) {
      const uploads = loadUploads();
      return uploads[name] || null;
    }
    return "images/" + name;
  }

  function hydrate() {
    const base = window.SITE_DATA || {};
    const overrides = loadOverrides();
    const data = mergeData(base, overrides);
    window.SITE_DATA = data;

    // ── Text replacements ──
    document.querySelectorAll("[data-t]").forEach((el) => {
      const key = el.getAttribute("data-t");
      const val = deepGet(data, key);
      if (val != null) el.innerHTML = val;
    });

    // ── Image replacements ──
    const imgs = (data.images) || {};
    const positions = (data.image_positions) || {};
    document.querySelectorAll("[data-img]").forEach((el) => {
      const slot = el.getAttribute("data-img");
      const file = imgs[slot];
      if (file) {
        const src = resolveImgSrc(file);
        if (src) el.setAttribute("src", src);
      }
      const pos = positions[slot] || "center 25%";
      el.style.objectPosition = pos;
    });
  }

  // ── Public API for admin page ──
  window.SiteApp = {
    LS_KEY,
    LS_UPLOADS,
    resolveImgSrc,
    loadUploads,
    saveUploads(o) {
      try { localStorage.setItem(LS_UPLOADS, JSON.stringify(o)); return true; }
      catch (e) { return false; }
    },
    getMerged() {
      const base = window.SITE_DEFAULTS || window.SITE_DATA || {};
      const ov = loadOverrides();
      return mergeData(base, ov);
    },
    getOverrides: loadOverrides,
    saveOverrides(obj) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); return true; }
      catch (e) { return false; }
    },
    resetAll() {
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
  } else {
    hydrate();
  }
})();
