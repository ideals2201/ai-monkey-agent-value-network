// First release is intentionally read-only. No client-side submission handlers.
(function () {
  const filters = Array.from(document.querySelectorAll("[data-route-filter]"));
  const cards = Array.from(document.querySelectorAll(".opportunity-card"));
  const summary = document.querySelector("[data-route-summary]");
  const emptyState = document.querySelector("[data-route-empty]");

  if (!filters.length || !cards.length || !summary || !emptyState) {
    return;
  }

  const labels = {
    "for-this-visitor": "For this visitor",
    "global-high-value": "Global high-value",
    "needs-human-partner": "Needs human partner",
  };

  const descriptions = {
    "for-this-visitor": "Showing all public-safe paths. IP is only a default hint, not eligibility proof.",
    "global-high-value": "Showing paths tagged high_value for global review. Status remains evidence-gated.",
    "needs-human-partner": "Showing paths that need a human partner, account owner, local resource, or final approval.",
  };
  const routeModes = Object.keys(labels);

  function normalizeRouteMode(mode) {
    if (routeModes.includes(mode)) {
      return mode;
    }
    return "for-this-visitor";
  }

  function getInitialRouteMode() {
    const params = new URLSearchParams(window.location.search || "");
    const queryView = params.get("view");
    if (queryView) {
      return normalizeRouteMode(queryView);
    }

    const hashView = (window.location.hash || "").replace(/^#view=/, "");
    if (hashView && hashView !== window.location.hash) {
      return normalizeRouteMode(hashView);
    }

    return "for-this-visitor";
  }

  function getRouteUrl(mode) {
    const routeFilter = filters.find((filter) => filter.dataset.routeFilter === mode);
    return (routeFilter && routeFilter.dataset.routeUrl) || `?view=${mode}`;
  }

  function cardMatches(card, mode) {
    const sortTags = (card.dataset.sortTags || "").split(",").map((tag) => tag.trim());
    if (mode === "global-high-value") {
      return sortTags.includes("high_value");
    }
    if (mode === "needs-human-partner") {
      return sortTags.includes("needs_human_partner") || card.dataset.regionStatus === "needs_human_partner";
    }
    return true;
  }

  function applyFilter(mode, options) {
    const normalizedMode = normalizeRouteMode(mode);
    const shouldUpdateUrl = !options || options.updateUrl !== false;
    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = cardMatches(card, normalizedMode);
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    filters.forEach((filter) => {
      const active = filter.dataset.routeFilter === normalizedMode;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", active ? "true" : "false");
    });

    emptyState.hidden = visibleCount !== 0;
    summary.textContent = `${labels[normalizedMode] || "Selected view"}: ${visibleCount} public-safe path${visibleCount === 1 ? "" : "s"}. ${descriptions[normalizedMode] || ""}`;

    if (shouldUpdateUrl && window.history && window.history.replaceState) {
      const nextUrl = `${window.location.pathname}${getRouteUrl(normalizedMode)}${window.location.hash || "#opportunity-router"}`;
      window.history.replaceState(null, "", nextUrl);
    }
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      applyFilter(filter.dataset.routeFilter || "for-this-visitor");
    });
  });

  applyFilter(getInitialRouteMode(), { updateUrl: false });
})();

(function () {
  const counter = document.querySelector("[data-visit-counter]");
  if (!counter || typeof fetch !== "function") {
    return;
  }

  const totalEl = counter.querySelector("[data-counter-total]");
  const aiEl = counter.querySelector("[data-counter-ai]");
  const humanEl = counter.querySelector("[data-counter-human]");
  const updatedEl = counter.querySelector("[data-counter-updated]");

  function formatNumber(value) {
    const number = Number(value || 0);
    return new Intl.NumberFormat("en").format(number);
  }

  function formatUpdated(value) {
    if (!value) {
      return "Not published yet";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
  }

  fetch("visitor-counter.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const counts = data.counts || {};
      totalEl.textContent = formatNumber(counts.total_requests);
      aiEl.textContent = formatNumber(counts.ai_or_crawler_requests);
      humanEl.textContent = formatNumber(counts.human_or_other_requests);
      updatedEl.textContent = formatUpdated(data.generated_at);
    })
    .catch(() => {
      totalEl.textContent = "Unavailable";
      aiEl.textContent = "Unavailable";
      humanEl.textContent = "Unavailable";
      updatedEl.textContent = "Check visitor-counter.json";
    });
})();
