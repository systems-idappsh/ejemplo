(function () {
  "use strict";

  var memoryState = {
    items: [],
    meta: {
      eventType: "",
      eventDate: "",
      generalNote: ""
    }
  };

  function config() {
    return window.THAYS_CONFIG || {};
  }

  function quoteConfig() {
    return config().quote || {};
  }

  function storageKey() {
    return quoteConfig().localStorageKey || "thayspostres_quote_cart_v1";
  }

  function products() {
    return window.THAYS_PRODUCTS || [];
  }

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  function canUseStorage() {
    try {
      var key = "__thays_storage_test__";
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalizeState(state) {
    var incoming = state && typeof state === "object" ? state : {};
    var items = Array.isArray(incoming.items) ? incoming.items : [];
    var meta = incoming.meta && typeof incoming.meta === "object" ? incoming.meta : {};
    return {
      items: items
        .filter(function (item) {
          return item && item.id && Number(item.quantity) > 0;
        })
        .map(function (item) {
          return {
            id: String(item.id),
            quantity: Math.max(1, Number(item.quantity) || 1)
          };
        }),
      meta: {
        eventType: String(meta.eventType || ""),
        eventDate: String(meta.eventDate || ""),
        generalNote: String(meta.generalNote || "")
      }
    };
  }

  function load() {
    if (!canUseStorage()) return memoryState;
    var parsed = safeParse(window.localStorage.getItem(storageKey()));
    memoryState = normalizeState(parsed);
    return memoryState;
  }

  function save(state) {
    memoryState = normalizeState(state || memoryState);
    if (!canUseStorage()) return;
    try {
      window.localStorage.setItem(storageKey(), JSON.stringify(memoryState));
    } catch (error) {
      dispatchToast("No se pudo guardar el carrito temporalmente.", "warning");
    }
  }

  function getState() {
    return normalizeState(memoryState);
  }

  function findProduct(productId) {
    return products().find(function (product) {
      return product.id === productId;
    });
  }

  function detailItems() {
    var state = getState();
    return state.items.map(function (item) {
      var product = findProduct(item.id);
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        isAssumption: Boolean(product.isAssumption),
        quoteEnabled: product.quoteEnabled !== false,
        quantity: item.quantity
      };
    }).filter(Boolean);
  }

  function totalItems() {
    return getState().items.reduce(function (sum, item) {
      return sum + Number(item.quantity || 0);
    }, 0);
  }

  function add(productId) {
    var product = findProduct(productId);
    if (!product) {
      dispatchToast("No se encontró el producto seleccionado.", "error");
      return;
    }
    if (product.quoteEnabled === false) {
      dispatchToast("Este producto se consulta directamente por WhatsApp.", "warning");
      return;
    }

    var state = getState();
    var existing = state.items.find(function (item) {
      return item.id === productId;
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      state.items.push({ id: productId, quantity: 1 });
    }

    save(state);
    render();
    bumpCounters();
    dispatchToast("Producto agregado a cotización.", "success");
  }

  function setQuantity(productId, quantity) {
    var state = getState();
    var item = state.items.find(function (entry) {
      return entry.id === productId;
    });
    if (!item) return;

    var qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      remove(productId);
      return;
    }

    item.quantity = Math.max(1, Math.floor(qty));
    save(state);
    render();
  }

  function increase(productId) {
    var state = getState();
    var item = state.items.find(function (entry) {
      return entry.id === productId;
    });
    if (!item) return;
    setQuantity(productId, item.quantity + 1);
  }

  function decrease(productId) {
    var state = getState();
    var item = state.items.find(function (entry) {
      return entry.id === productId;
    });
    if (!item) return;
    setQuantity(productId, item.quantity - 1);
  }

  function remove(productId) {
    var state = getState();
    state.items = state.items.filter(function (item) {
      return item.id !== productId;
    });
    save(state);
    render();
    dispatchToast("Producto eliminado de la cotización.", "info");
  }

  function clear() {
    var state = getState();
    state.items = [];
    save(state);
    render();
    dispatchToast("Cotización vaciada.", "info");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderItems() {
    var container = document.querySelector("[data-cart-items]");
    if (!container) return;
    var items = detailItems();

    if (!items.length) {
      container.innerHTML = '<div class="cart-empty"><strong>Tu cotización está vacía.</strong><p>Agrega al menos un producto del catálogo para solicitar detalles por WhatsApp.</p></div>';
      return;
    }

    container.innerHTML = items.map(function (item) {
      return [
        '<article class="cart-item">',
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">',
        '<div class="cart-item-content">',
        '<div class="cart-item-title">' + escapeHtml(item.name) + '</div>',
        '<div class="cart-item-meta">Categoría: ' + escapeHtml(item.category) + '</div>',
        '<div class="qty-row">',
        '<div class="qty-controls" aria-label="Cantidad de ' + escapeHtml(item.name) + '">',
        '<button class="qty-btn" type="button" data-cart-decrease="' + escapeHtml(item.id) + '" aria-label="Disminuir cantidad de ' + escapeHtml(item.name) + '">−</button>',
        '<span class="qty-value" aria-label="Cantidad actual">' + item.quantity + '</span>',
        '<button class="qty-btn" type="button" data-cart-increase="' + escapeHtml(item.id) + '" aria-label="Aumentar cantidad de ' + escapeHtml(item.name) + '">+</button>',
        '</div>',
        '<button class="btn btn-danger" type="button" data-cart-remove="' + escapeHtml(item.id) + '">Eliminar</button>',
        '</div>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");
  }

  function renderCounters() {
    var count = totalItems();
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.textContent = String(count);
      node.setAttribute("aria-label", count + " productos en cotización");
    });
    document.querySelectorAll("[data-cart-summary-count]").forEach(function (node) {
      node.textContent = String(count);
    });
  }

  function renderMetaFields() {
    var state = getState();
    var eventField = document.querySelector("[data-quote-event]");
    var dateField = document.querySelector("[data-quote-date]");
    var noteField = document.querySelector("[data-quote-note]");

    if (eventField && eventField.value !== state.meta.eventType) {
      eventField.value = state.meta.eventType;
    }
    if (dateField && dateField.value !== state.meta.eventDate) {
      dateField.value = state.meta.eventDate;
    }
    if (noteField && noteField.value !== state.meta.generalNote) {
      noteField.value = state.meta.generalNote;
    }
  }

  function render() {
    renderItems();
    renderCounters();
    renderMetaFields();
    document.dispatchEvent(new CustomEvent("thays:cart-rendered", { detail: getState() }));
  }

  function setMeta(key, value) {
    var state = getState();
    state.meta[key] = String(value || "");
    save(state);
  }

  function syncMetaFromDOM() {
    var eventField = document.querySelector("[data-quote-event]");
    var dateField = document.querySelector("[data-quote-date]");
    var noteField = document.querySelector("[data-quote-note]");
    var state = getState();

    if (eventField) state.meta.eventType = eventField.value;
    if (dateField) state.meta.eventDate = dateField.value;
    if (noteField) state.meta.generalNote = noteField.value;

    save(state);
    return state;
  }

  function dispatchToast(message, tone) {
    document.dispatchEvent(new CustomEvent("thays:toast", {
      detail: { message: message, tone: tone || "info" }
    }));
  }

  function bumpCounters() {
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.classList.remove("cart-bump");
      void node.offsetWidth;
      node.classList.add("cart-bump");
    });
  }

  function initEvents() {
    document.addEventListener("click", function (event) {
      var addButton = event.target.closest("[data-cart-add]");
      var increaseButton = event.target.closest("[data-cart-increase]");
      var decreaseButton = event.target.closest("[data-cart-decrease]");
      var removeButton = event.target.closest("[data-cart-remove]");
      var clearButton = event.target.closest("[data-cart-clear]");

      if (addButton) {
        event.preventDefault();
        add(addButton.getAttribute("data-cart-add"));
        addButton.classList.remove("add-flash");
        void addButton.offsetWidth;
        addButton.classList.add("add-flash");
      }

      if (increaseButton) {
        event.preventDefault();
        increase(increaseButton.getAttribute("data-cart-increase"));
      }

      if (decreaseButton) {
        event.preventDefault();
        decrease(decreaseButton.getAttribute("data-cart-decrease"));
      }

      if (removeButton) {
        event.preventDefault();
        remove(removeButton.getAttribute("data-cart-remove"));
      }

      if (clearButton) {
        event.preventDefault();
        clear();
      }
    });

    document.addEventListener("input", function (event) {
      if (event.target.matches("[data-quote-event]")) setMeta("eventType", event.target.value);
      if (event.target.matches("[data-quote-date]")) setMeta("eventDate", event.target.value);
      if (event.target.matches("[data-quote-note]")) setMeta("generalNote", event.target.value);
    });
  }

  function init() {
    load();
    initEvents();
    render();
  }

  window.ThaysCart = {
    init: init,
    load: load,
    save: save,
    getState: getState,
    detailItems: detailItems,
    totalItems: totalItems,
    add: add,
    increase: increase,
    decrease: decrease,
    remove: remove,
    clear: clear,
    render: render,
    syncMetaFromDOM: syncMetaFromDOM
  };
})();
