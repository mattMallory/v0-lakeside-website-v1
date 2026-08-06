(function () {
  if (window.__lakesideOfferBuilderLayout) return;
  window.__lakesideOfferBuilderLayout = true;

  var GHL_KEYS = {
    audience: "offer_audience",
    concern: "offer_concern",
    firstStep: "offer_first_step",
    visitIncludes: "offer_visit_includes",
    takeaway: "offer_takeaway",
    action: "offer_action",
    price: "offer_price",
    previewEyebrow: "offer_preview_eyebrow",
    previewTitle: "offer_preview_title",
    previewBody: "offer_preview_body",
    offerSummary: "offer_summary",
  };

  function getRoot() {
    return document.getElementById("offer-builder");
  }

  function lc(value) {
    return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
  }

  function prettyLabel(value) {
    return value ? value.replace(/\\b[a-z]/g, function (char) { return char.toUpperCase(); }) : value;
  }

  function joinHappens(happens) {
    var normalized = happens.map(function (item) { return lc(item); });
    if (normalized.length === 0) return "discuss your concerns";
    if (normalized.length === 1) return normalized[0];
    if (normalized.length === 2) return normalized[0] + " and " + normalized[1];
    return normalized[0] + ", " + normalized[1] + ", and " + normalized[2];
  }

  function readStateFromDom(root) {
    var audienceEl = root.querySelector("#ob-audience");
    var firstStepEl = root.querySelector("#ob-first-step");
    var concernCustomEl = root.querySelector("#ob-concern-custom");
    var concernCustom = concernCustomEl && concernCustomEl.value ? concernCustomEl.value.trim() : "";
    var concernRadio = root.querySelector('input[name="ob-concern"]:checked');
    var concern = concernCustom ? "" : concernRadio ? concernRadio.value : "";

    var happens = [];
    root.querySelectorAll('input[name="ob-happen"]:checked').forEach(function (input) {
      happens.push(input.value);
    });

    var takeawayEl = root.querySelector('input[name="ob-takeaway"]:checked');
    var actionEl = root.querySelector('input[name="ob-action"]:checked');
    var priceEl = root.querySelector('input[name="ob-price"]:checked');

    return {
      audience: audienceEl ? audienceEl.value : "",
      concern: concern,
      concernCustom: concernCustom,
      firstStep: firstStepEl ? firstStepEl.value : "",
      happens: happens,
      takeaway: takeawayEl ? takeawayEl.value : "",
      action: actionEl ? actionEl.value : "",
      price: priceEl ? priceEl.value : "",
    };
  }

  function computeClarity(state) {
    var audience = Boolean(state.audience);
    var experience = Boolean(state.firstStep) && state.happens.length >= 1;
    var value = Boolean(state.takeaway);
    var nextStep = Boolean(state.action);
    return {
      audience: audience,
      experience: experience,
      value: value,
      nextStep: nextStep,
      ready: audience && experience && value && nextStep,
    };
  }

  function effectiveConcern(state) {
    return (state.concernCustom || "").trim() || state.concern;
  }

  function computePreview(state) {
    var concern = effectiveConcern(state);
    var priceShown = Boolean(state.price) && state.price !== "No price shown";
    return {
      eyebrow: state.audience ? "For " + state.audience : "For your chosen audience",
      title: state.firstStep ? prettyLabel(state.firstStep) : "Your first-step visit",
      body:
        "Experiencing " +
        (concern ? concern.toLowerCase() : "a specific concern") +
        "? Meet with a chiropractor to " +
        joinHappens(state.happens) +
        " so you can " +
        (state.takeaway ? lc(state.takeaway) : "understand your next step") +
        ".",
      action: state.action || "Choose a Time",
      price: priceShown ? state.price : "",
      priceShown: priceShown,
    };
  }

  function buildSummary(state) {
    var concern = effectiveConcern(state);
    return (
      "FOR " +
      (state.audience || "your audience").toUpperCase() +
      "\\n" +
      (state.firstStep ? prettyLabel(state.firstStep) : "First-step visit") +
      "\\nConcern: " +
      (concern || "—") +
      "\\nVisit includes: " +
      (state.happens.join(", ") || "—") +
      "\\nTakeaway: " +
      (state.takeaway || "—") +
      "\\nNext step: " +
      (state.action || "—") +
      (state.price && state.price !== "No price shown" ? " (" + state.price + ")" : "")
    );
  }

  function buildGhlUrl(baseUrl, state) {
    var preview = computePreview(state);
    var concern = effectiveConcern(state);
    var url = new URL(baseUrl);
    var fields = {};
    fields[GHL_KEYS.audience] = state.audience;
    fields[GHL_KEYS.concern] = concern;
    fields[GHL_KEYS.firstStep] = state.firstStep;
    fields[GHL_KEYS.visitIncludes] = state.happens.join("; ");
    fields[GHL_KEYS.takeaway] = state.takeaway;
    fields[GHL_KEYS.action] = state.action;
    fields[GHL_KEYS.price] = state.price;
    fields[GHL_KEYS.previewEyebrow] = preview.eyebrow;
    fields[GHL_KEYS.previewTitle] = preview.title;
    fields[GHL_KEYS.previewBody] = preview.body;
    fields[GHL_KEYS.offerSummary] = buildSummary(state);

    Object.keys(fields).forEach(function (key) {
      var value = String(fields[key] || "").trim();
      if (value) url.searchParams.set(key, value);
    });

    return url.toString();
  }

  function syncHappensLimit(root) {
    var checkedCount = root.querySelectorAll('input[name="ob-happen"]:checked').length;
    root.querySelectorAll('input[name="ob-happen"]').forEach(function (input) {
      input.disabled = !input.checked && checkedCount >= 3;
      var label = root.querySelector('label[for="' + input.id + '"]');
      if (label) {
        if (input.disabled) label.setAttribute("data-ob-disabled", "true");
        else label.removeAttribute("data-ob-disabled");
      }
    });
  }

  function setSentenceSpan(el, value, placeholder) {
    if (!el) return;
    el.textContent = value || placeholder;
    el.setAttribute("data-ob-filled", value ? "true" : "false");
  }

  function updateClarityUI(root, clarity) {
    root.querySelectorAll("[data-ob-clarity-badge]").forEach(function (badge) {
      badge.textContent = clarity.ready ? "Ready to test" : "In progress";
      badge.setAttribute("data-ob-ready", clarity.ready ? "true" : "false");
    });

    var map = {
      audience: clarity.audience,
      experience: clarity.experience,
      value: clarity.value,
      nextStep: clarity.nextStep,
    };

    Object.keys(map).forEach(function (key) {
      root.querySelectorAll('[data-ob-clarity-item="' + key + '"]').forEach(function (el) {
        el.textContent = map[key] ? "Clear" : "Add it";
        el.setAttribute("data-ob-clear", map[key] ? "true" : "false");
      });
    });
  }

  function updatePreviewUI(root, preview) {
    var eyebrow = root.querySelector("[data-ob-preview-eyebrow]");
    var title = root.querySelector('[data-ob="pvtitle"]');
    var body = root.querySelector('[data-ob="pvbody"]');
    var action = root.querySelector("[data-ob-preview-action]");
    var price = root.querySelector("[data-ob-preview-price]");

    if (eyebrow) eyebrow.textContent = preview.eyebrow;
    if (title) title.textContent = preview.title;
    if (body) body.textContent = preview.body;
    if (action) {
      for (var i = 0; i < action.childNodes.length; i++) {
        if (action.childNodes[i].nodeType === 3) {
          action.childNodes[i].textContent = preview.action;
          break;
        }
      }
    }
    if (price) {
      if (preview.priceShown) {
        price.textContent = preview.price;
        price.hidden = false;
      } else {
        price.hidden = true;
      }
    }
  }

  function updateSentenceUI(root, state) {
    var concern = effectiveConcern(state);
    setSentenceSpan(root.querySelector('[data-ob-sentence="audience"]'), state.audience, "audience");
    setSentenceSpan(root.querySelector('[data-ob-sentence="concern"]'), concern, "concern or situation");
    setSentenceSpan(root.querySelector('[data-ob-sentence="firstStep"]'), state.firstStep, "first-step appointment");
    setSentenceSpan(
      root.querySelector('[data-ob-sentence="happen1"]'),
      state.happens[0] ? lc(state.happens[0]) : "",
      "experience one",
    );
    setSentenceSpan(
      root.querySelector('[data-ob-sentence="happen2"]'),
      state.happens[1] ? lc(state.happens[1]) : "",
      "experience two",
    );
    setSentenceSpan(
      root.querySelector('[data-ob-sentence="takeaway"]'),
      state.takeaway ? lc(state.takeaway) : "",
      "realistic takeaway",
    );
    setSentenceSpan(
      root.querySelector('[data-ob-sentence="action"]'),
      state.action ? state.action.toLowerCase() : "",
      "call to action",
    );
  }

  var embedSlotState = new WeakMap();

  function getEmbedSlotState(slot) {
    return embedSlotState.get(slot) || { mode: "waiting", src: "" };
  }

  function setEmbedSlotState(slot, state) {
    embedSlotState.set(slot, state);
  }

  function updateEmbedSlot(slot, state, clarity, formUrl, submitMode) {
    if (!clarity.ready || !formUrl || submitMode === "redirect") return;

    var embedUrl = buildGhlUrl(formUrl, state);
    var slotState = getEmbedSlotState(slot);
    if (slotState.mode === "iframe" && slotState.src === embedUrl) return;

    slot.innerHTML =
      '<iframe title="Email me this offer" src="' +
      embedUrl +
      '" class="block w-full border-0 bg-white" style="min-height:216px;height:216px"></iframe>';
    setEmbedSlotState(slot, { mode: "iframe", src: embedUrl });
  }

  function updateEmbedUI(root, state, clarity) {
    var slots = root.querySelectorAll("[data-ob-embed-root]");
    if (!slots.length) return;

    var formUrl = root.getAttribute("data-ob-form-url") || "";
    var submitMode = root.getAttribute("data-ob-submit-mode") || "embed";

    slots.forEach(function (slot) {
      updateEmbedSlot(slot, state, clarity, formUrl, submitMode);
    });
  }

  function stateKey(state) {
    return [
      state.audience,
      state.concern,
      state.concernCustom,
      state.firstStep,
      state.happens.join("|"),
      state.takeaway,
      state.action,
      state.price,
    ].join("::");
  }

  var lastSyncedStateKey = "";

  function pushStateToReact(state) {
    var key = stateKey(state);
    if (key === lastSyncedStateKey) return;
    lastSyncedStateKey = key;

    if (typeof window.__lakesideOfferBuilderSyncState === "function") {
      window.__lakesideOfferBuilderSyncState(state);
    } else {
      window.__lakesideOfferBuilderPendingState = state;
    }
  }

  function syncAll(skipReactSync) {
    var root = getRoot();
    if (!root) return;

    syncHappensLimit(root);
    var state = readStateFromDom(root);
    var clarity = computeClarity(state);
    var preview = computePreview(state);

    updateClarityUI(root, clarity);
    updatePreviewUI(root, preview);
    updateSentenceUI(root, state);
    updateEmbedUI(root, state, clarity);

    if (!skipReactSync) {
      pushStateToReact(state);
    }
  }

  function scheduleSync() {
    window.setTimeout(syncAll, 0);
  }

  function onInteraction(event) {
    var root = getRoot();
    if (!root || !event.target || !event.target.closest) return;
    if (!event.target.closest("#offer-builder")) return;

    var target = event.target;
    if (target instanceof HTMLInputElement) {
      if (target.name === "ob-price" && target.checked) {
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
    }

    scheduleSync();
  }

  var layoutStarted = false;

  function bootLayout() {
    if (layoutStarted) return;
    layoutStarted = true;
    syncAll(true);
  }

  function scheduleBoot() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(bootLayout);
    });
  }

  document.addEventListener("change", onInteraction, true);
  document.addEventListener("input", onInteraction, true);
  document.addEventListener("click", onInteraction, true);
  document.addEventListener("touchend", onInteraction, true);

  window.setInterval(function () {
    if (!layoutStarted || !getRoot()) return;
    syncAll(true);
  }, 400);

  if ("MutationObserver" in window && document.body) {
    var mountObserver = new MutationObserver(function () {
      if (!getRoot()) return;
      mountObserver.disconnect();
      scheduleBoot();
    });
    mountObserver.observe(document.body, { childList: true, subtree: true });
  }

  scheduleBoot();
})();
