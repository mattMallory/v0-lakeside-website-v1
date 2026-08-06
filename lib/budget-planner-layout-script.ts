export const budgetPlannerLayoutScript = `
(function () {
  if (window.__lakesideBudgetPlannerLayout) return;
  window.__lakesideBudgetPlannerLayout = true;

  var FOLLOWUP_PRESETS = { strong: 25, average: 17, weak: 9 };

  function getRoot() {
    return document.getElementById("planner");
  }

  function formatBudgetCurrency(value) {
    return "$" + Math.round(value).toLocaleString("en-US");
  }

  function roundToFifty(value) {
    return Math.round(value / 50) * 50;
  }

  function formatBudgetRange(low, high) {
    var plus = high >= 3500 ? "+" : "";
    return formatBudgetCurrency(low) + "–" + formatBudgetCurrency(high) + plus;
  }

  function computeBudgetPlanner(state) {
    var patientValue = state.patientValue;
    var market = state.market;
    var service = state.service;
    var leadConversion = state.leadConversion;
    var landingConversion = 0.1;

    var baseRanges = {
      general: {
        low: [750, 1250],
        moderate: [1000, 1750],
        high: [1500, 2750],
      },
      highvalue: {
        low: [1250, 2000],
        moderate: [1500, 3000],
        high: [2000, 4000],
      },
    };

    var range = baseRanges[service][market];
    var baseLow = range[0];
    var baseHigh = range[1];
    var factor = 0.85 + ((patientValue - 500) / (5000 - 500)) * 0.55;
    var budgetLow = roundToFifty(baseLow * factor);
    var budgetHigh = roundToFifty(baseHigh * factor);
    var budgetMid = (budgetLow + budgetHigh) / 2;
    var costPerClick = { low: 6, moderate: 8, high: 11 }[market];
    var clicks = budgetMid / costPerClick;
    var leads = clicks * landingConversion;
    var patients = Math.max(leads * (leadConversion / 100), 0.3);

    return {
      budgetLow: budgetLow,
      budgetHigh: budgetHigh,
      budgetMid: budgetMid,
      costPerLead: budgetMid / leads,
      costPerPatient: budgetMid / patients,
      landingConversion: landingConversion,
    };
  }

  function getBudgetPlannerNextStep(state) {
    if (state.followup === "weak") {
      return "Fix your front-desk follow-up before you increase spend. More budget just sends more people into a leaky process.";
    }
    if (state.service === "general" && state.patientValue < 1200) {
      return "Lead with one defined offer (like a sciatica consultation) on a single focused landing page before scaling.";
    }
    if (state.market === "high") {
      return "Start at the low end. Prove new patients trace back to the campaign, then scale into the competitive auction.";
    }
    return "Start near the low end of your range, watch your cost per acquired patient, and increase once patients book consistently.";
  }

  function readStateFromDom(root) {
    var patientValueEl = root.querySelector("#bp-patient-value");
    var leadConversionEl = root.querySelector("#bp-lead-conversion");
    var marketEl = root.querySelector('input[name="bp-market"]:checked');
    var serviceEl = root.querySelector('input[name="bp-service"]:checked');
    var followupEl = root.querySelector('input[name="bp-followup"]:checked');

    return {
      patientValue: patientValueEl ? Number(patientValueEl.value) : 1500,
      market: marketEl ? marketEl.value : "moderate",
      service: serviceEl ? serviceEl.value : "general",
      followup: followupEl ? followupEl.value : "average",
      leadConversion: leadConversionEl ? Number(leadConversionEl.value) : 17,
    };
  }

  function setText(root, selector, value) {
    var el = root.querySelector(selector);
    if (el) el.textContent = value;
  }

  function updateResultsUI(root, state, result) {
    setText(root, '[data-bp="patient-value-display"]', formatBudgetCurrency(state.patientValue));
    setText(root, '[data-bp="lead-conversion-display"]', state.leadConversion + "%");
    setText(root, '[data-bp="budget-range"]', formatBudgetRange(result.budgetLow, result.budgetHigh));
    setText(root, '[data-bp="cost-per-lead"]', formatBudgetCurrency(result.costPerLead));
    setText(root, '[data-bp="cost-per-patient"]', formatBudgetCurrency(result.costPerPatient));
    setText(root, '[data-bp="next-step"]', getBudgetPlannerNextStep(state));
    setText(
      root,
      '[data-bp="landing-conversion-pct"]',
      Math.round(result.landingConversion * 100) + "%",
    );
  }

  function syncAll() {
    var root = getRoot();
    if (!root) return;

    var state = readStateFromDom(root);
    var result = computeBudgetPlanner(state);

    updateResultsUI(root, state, result);
  }

  function applyFollowupPreset(root) {
    var followupEl = root.querySelector('input[name="bp-followup"]:checked');
    var leadConversionEl = root.querySelector("#bp-lead-conversion");
    if (!followupEl || !leadConversionEl) return;
    var preset = FOLLOWUP_PRESETS[followupEl.value];
    if (preset !== undefined) leadConversionEl.value = String(preset);
  }

  function scheduleSync() {
    window.setTimeout(syncAll, 0);
    window.setTimeout(syncAll, 50);
  }

  function onInteraction(event) {
    var root = getRoot();
    if (!root || !event.target || !event.target.closest) return;
    if (!event.target.closest("#planner")) return;

    var target = event.target;

    if (target instanceof HTMLInputElement) {
      if (target.name === "bp-followup" && target.checked) {
        applyFollowupPreset(root);
      }
      scheduleSync();
      return;
    }

    if (target.closest && target.closest(".budget-planner-pill-label")) {
      window.setTimeout(function () {
        applyFollowupPreset(root);
        syncAll();
      }, 50);
      return;
    }

    scheduleSync();
  }

  document.addEventListener("change", onInteraction, true);
  document.addEventListener("input", onInteraction, true);
  document.addEventListener("click", onInteraction, true);
  document.addEventListener("touchend", onInteraction, true);

  window.setInterval(function () {
    if (getRoot()) syncAll();
  }, 400);

  if ("MutationObserver" in window && document.body) {
    var mountObserver = new MutationObserver(function () {
      if (!getRoot()) return;
      mountObserver.disconnect();
      syncAll();
    });
    mountObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncAll);
  } else {
    syncAll();
  }

  window.addEventListener("load", syncAll);
  window.__lakesideBudgetPlannerSyncNow = syncAll;
})();
`.trim()
