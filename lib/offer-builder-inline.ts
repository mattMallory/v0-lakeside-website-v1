export const offerBuilderInlineScript = `
(function () {
  if (window.__lakesideOfferBuilderNative) return;
  window.__lakesideOfferBuilderNative = true;

  var INTERACTIVE_SELECTOR =
    "[data-ob-field], .offer-builder-select, #ob-concern-custom";

  function getRoot() {
    return document.getElementById("offer-builder");
  }

  function syncHappensLimit(root) {
    var checkedCount = root.querySelectorAll('input[name="ob-happen"]:checked').length;
    root.querySelectorAll('input[name="ob-happen"]').forEach(function (input) {
      input.disabled = !input.checked && checkedCount >= 3;
    });
  }

  function applySideEffects(root, target) {
    if (target.name === "ob-happen" && target.type === "checkbox" && target.checked) {
      if (root.querySelectorAll('input[name="ob-happen"]:checked').length > 3) {
        target.checked = false;
        return false;
      }
    }

    if (target.name === "ob-price" && target.type === "checkbox" && target.checked) {
      root.querySelectorAll('input[name="ob-price"]').forEach(function (input) {
        if (input !== target) input.checked = false;
      });
    }

    if (target.name === "ob-concern" && target.checked) {
      var custom = root.querySelector("#ob-concern-custom");
      if (custom) custom.value = "";
    }

    if (target.id === "ob-concern-custom") {
      root.querySelectorAll('input[name="ob-concern"]').forEach(function (input) {
        input.checked = false;
      });
    }

    return true;
  }

  function dispatchSelect(field, value) {
    window.dispatchEvent(
      new CustomEvent("lakeside:offer-builder-select", {
        detail: { field: field, value: value },
      }),
    );
  }

  function onNativeChange(event) {
    var target = event.target;
    var root = getRoot();
    if (!root || !target) return;

    if (target.tagName === "SELECT") {
      window.dispatchEvent(
        new CustomEvent("lakeside:offer-builder-select", {
          detail: { field: target.id === "ob-audience" ? "audience" : "firstStep", value: target.value },
        }),
      );
      return;
    }

    if (!target.classList || !target.classList.contains("offer-builder-native-input")) {
      if (target.id !== "ob-concern-custom") return;
    }

    if (!applySideEffects(root, target)) return;

    syncHappensLimit(root);
  }

  function onPointerSync(event) {
    var root = getRoot();
    if (!root || !event.target || !event.target.closest) return;

    var label = event.target.closest("[data-ob-field]");
    if (label) {
      var field = label.getAttribute("data-ob-field");
      var value = label.getAttribute("data-ob-value");
      if (field && value) {
        window.setTimeout(function () {
          dispatchSelect(field, value);
          syncHappensLimit(root);
        }, 0);
      }
      return;
    }

    if (!event.target.closest(INTERACTIVE_SELECTOR)) return;

    window.setTimeout(function () {
      syncHappensLimit(root);
    }, 0);
  }

  document.addEventListener("change", onNativeChange, true);
  document.addEventListener("input", onNativeChange, true);
  document.addEventListener("click", onPointerSync, true);
  document.addEventListener("touchend", onPointerSync, true);

  function boot() {
    var root = getRoot();
    if (root) syncHappensLimit(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", boot);
})();
`.trim()
