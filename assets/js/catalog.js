(function () {
  "use strict";

  var activeCategory = "Todos";

  function products() {
    return window.THAYS_PRODUCTS || [];
  }

  function categories() {
    return ["Todos"].concat(Array.from(new Set(products().map(function (product) {
      return product.category;
    }))).filter(Boolean));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderFilters() {
    var container = document.querySelector("[data-catalog-filters]");
    if (!container) return;
    container.innerHTML = categories().map(function (category) {
      var active = category === activeCategory ? " is-active" : "";
      return '<button class="chip' + active + '" type="button" data-catalog-filter="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    }).join("");
  }

  function productCard(product) {
    var tags = (product.tags || []).map(function (tag) {
      return '<span class="chip">' + escapeHtml(tag) + '</span>';
    }).join("");
    var disabled = product.quoteEnabled === false;
    var buttonText = disabled ? "Consultar disponibilidad" : "Agregar a cotización";
    var buttonClass = disabled ? "btn btn-secondary" : "btn btn-primary";

    return [
      '<article class="card product-card reveal">',
      '<div class="card-media">',
      '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy" width="640" height="480">',
      '</div>',
      '<div class="card-body">',
      '<span class="badge">' + escapeHtml(product.category) + '</span>',
      product.isAssumption ? '<span class="badge badge-soft">[SUPUESTO]</span>' : '',
      '<h3>' + escapeHtml(product.name) + '</h3>',
      '<p>' + escapeHtml(product.description) + '</p>',
      '<div class="tag-list">' + tags + '</div>',
      '<div class="product-actions">',
      '<button class="' + buttonClass + '" type="button" data-cart-add="' + escapeHtml(product.id) + '"' + (disabled ? ' aria-disabled="true"' : '') + '>',
      '<span aria-hidden="true">🛒</span>',
      '<span>' + buttonText + '</span>',
      '</button>',
      '</div>',
      '</div>',
      '</article>'
    ].join("");
  }

  function renderProducts() {
    var grid = document.querySelector("[data-catalog-grid]");
    var empty = document.querySelector("[data-catalog-empty]");
    if (!grid) return;

    var list = products().filter(function (product) {
      return activeCategory === "Todos" || product.category === activeCategory;
    });

    grid.innerHTML = list.map(productCard).join("");

    if (empty) {
      empty.hidden = list.length > 0;
    }

    if (window.ThaysAnimations) {
      window.ThaysAnimations.observe();
    }
  }

  function initEvents() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-catalog-filter]");
      if (!button) return;
      activeCategory = button.getAttribute("data-catalog-filter") || "Todos";
      renderFilters();
      renderProducts();
    });
  }

  function init() {
    if (!document.querySelector("[data-catalog-grid]")) return;
    renderFilters();
    renderProducts();
    initEvents();
  }

  window.ThaysCatalog = {
    init: init,
    renderProducts: renderProducts,
    renderFilters: renderFilters
  };
})();
