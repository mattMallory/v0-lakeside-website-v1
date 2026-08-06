(function () {
  if (window.__lakesideMetricCountUp) return;
  window.__lakesideMetricCountUp = true;

  var DURATION = 1600;
  var animated = new WeakSet();

  function format(value, decimals) {
    if (decimals > 0) return value.toFixed(decimals);
    return Math.round(value).toLocaleString("en-US");
  }

  function getViewportHeight() {
    return (
      (window.visualViewport && window.visualViewport.height) ||
      document.documentElement.clientHeight ||
      window.innerHeight ||
      0
    );
  }

  function isContainerInView(el) {
    if (!el) return false;

    var rect = el.getBoundingClientRect();
    var vh = getViewportHeight();
    var visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    var isMobile = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    var revealLine = vh * (isMobile ? 0.9 : 0.92);
    var minVisible = isMobile ? 48 : 64;

    return visiblePx >= minVisible && rect.top <= revealLine && rect.bottom > 0;
  }

  function animate(el) {
    if (animated.has(el)) return;

    var target = parseFloat(el.getAttribute("data-metric-target") || "");
    if (!Number.isFinite(target)) return;

    animated.add(el);

    var prefix = el.getAttribute("data-metric-prefix") || "";
    var suffix = el.getAttribute("data-metric-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-metric-decimals") || "0", 10);

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = prefix + format(target, decimals) + suffix;
      return;
    }

    el.textContent = prefix + format(0, decimals) + suffix;

    var start = performance.now();

    function tick(now) {
      var progress = Math.min(1, (now - start) / DURATION);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + format(target * eased, decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function scan() {
    var sections = document.querySelectorAll("[data-case-study-metrics]");

    if (sections.length) {
      sections.forEach(function (section) {
        if (!isContainerInView(section)) return;
        section.querySelectorAll(".case-study-metric-value[data-metric-target]").forEach(animate);
      });
      return;
    }

    document.querySelectorAll(".case-study-metric-value[data-metric-target]").forEach(function (el) {
      if (animated.has(el)) return;
      var card = el.closest("article") || el;
      if (isContainerInView(card)) animate(el);
    });
  }

  function onActivity() {
    window.requestAnimationFrame(scan);
  }

  var booted = false;

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

    if ("MutationObserver" in window && document.body) {
      new MutationObserver(onActivity).observe(document.body, { childList: true, subtree: true });
    }

    [50, 150, 400, 900, 1800, 3000].forEach(function (delay) {
      window.setTimeout(scan, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", boot);
})();
