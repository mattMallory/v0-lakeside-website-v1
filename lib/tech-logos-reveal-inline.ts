export const techLogosRevealInlineScript = `
(function () {
  if (window.__lakesideTechLogosReveal) return;
  window.__lakesideTechLogosReveal = true;

  var STAGGER_MS = 70;
  var animated = new WeakSet();
  var booted = false;

  function getViewportHeight() {
    return (
      (window.visualViewport && window.visualViewport.height) ||
      document.documentElement.clientHeight ||
      window.innerHeight ||
      0
    );
  }

  function isInView(el) {
    var rect = el.getBoundingClientRect();
    var vh = getViewportHeight();
    var visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    var isMobile = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    var revealLine = vh * (isMobile ? 0.9 : 0.85);
    var minVisible = isMobile ? 40 : 56;

    return visiblePx >= minVisible && rect.top <= revealLine && rect.bottom > 0;
  }

  function revealLogos(logoRoot) {
    if (animated.has(logoRoot)) return;

    var items = logoRoot.querySelectorAll(".tech-logo-item");
    if (!items.length) return;

    animated.add(logoRoot);

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) {
        item.classList.add("tech-logo-pop");
      });
      return;
    }

    items.forEach(function (item, index) {
      window.setTimeout(function () {
        item.classList.add("tech-logo-pop");
      }, index * STAGGER_MS);
    });
  }

  function scan() {
    document.querySelectorAll("[data-tech-logos-section]").forEach(function (section) {
      if (!isInView(section)) return;

      var logoRoot = section.querySelector("[data-tech-logos]");
      if (logoRoot) revealLogos(logoRoot);
    });
  }

  function onActivity() {
    window.requestAnimationFrame(scan);
  }

  function boot() {
    if (booted) return;
    booted = true;

    scan();
    window.setInterval(scan, 120);

    ["scroll", "touchmove", "touchend", "touchstart", "resize", "orientationchange", "pageshow", "focus"].forEach(
      function (evt) {
        window.addEventListener(evt, onActivity, { passive: true });
        document.addEventListener(evt, onActivity, { passive: true });
      },
    );

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onActivity, { passive: true });
      window.visualViewport.addEventListener("scroll", onActivity, { passive: true });
    }

    [50, 150, 400, 900, 1800].forEach(function (delay) {
      window.setTimeout(scan, delay);
    });

    if ("MutationObserver" in window && document.body) {
      new MutationObserver(onActivity).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", boot);
})();
`.trim()
