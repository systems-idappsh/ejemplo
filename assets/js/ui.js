(function () {
  "use strict";

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initHeader() {
    var header = qs("[data-site-header]");
    if (!header) return;
    var update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMobileNav() {
    var button = qs("[data-toggle-nav]");
    var panel = qs("[data-mobile-menu]");
    if (!button || !panel) return;

    function setOpen(open) {
      button.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      document.body.classList.toggle("is-nav-open", open);
    }

    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    qsa("a", panel).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });
  }

  function initFaq() {
    qsa("[data-faq-button]").forEach(function (button) {
      var panelId = button.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      button.addEventListener("click", function () {
        var open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });
  }

  function setCartOpen(open) {
    var panel = qs("[data-cart-panel]");
    var backdrop = qs("[data-cart-backdrop]");
    var triggers = qsa("[data-open-cart]");
    if (!panel) return;

    panel.hidden = !open;
    if (backdrop) backdrop.hidden = !open;
    document.body.classList.toggle("is-cart-open", open);

    triggers.forEach(function (trigger) {
      trigger.setAttribute("aria-expanded", String(open));
    });

    if (open) {
      var firstFocus = qs("[data-close-cart]", panel) || panel;
      window.setTimeout(function () {
        firstFocus.focus && firstFocus.focus();
      }, 40);
    }
  }

  function initCartShell() {
    document.addEventListener("click", function (event) {
      var open = event.target.closest("[data-open-cart]");
      var close = event.target.closest("[data-close-cart]");
      if (open) {
        event.preventDefault();
        setCartOpen(true);
      }
      if (close) {
        event.preventDefault();
        setCartOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    });
  }

  function toast(message, tone) {
    var region = qs("[data-toast-region]");
    if (!region || !message) return;

    var item = document.createElement("div");
    item.className = "toast";
    item.setAttribute("role", "status");
    item.textContent = message;
    if (tone) item.dataset.tone = tone;

    region.appendChild(item);

    window.setTimeout(function () {
      item.style.opacity = "0";
      item.style.transform = "translateY(8px)";
    }, 2600);

    window.setTimeout(function () {
      item.remove();
    }, 3200);
  }

  function initToastEvents() {
    document.addEventListener("thays:toast", function (event) {
      toast(event.detail && event.detail.message, event.detail && event.detail.tone);
    });
  }

  window.ThaysUI = {
    initHeader: initHeader,
    initMobileNav: initMobileNav,
    initFaq: initFaq,
    initCartShell: initCartShell,
    setCartOpen: setCartOpen,
    toast: toast,
    initToastEvents: initToastEvents
  };
})();
