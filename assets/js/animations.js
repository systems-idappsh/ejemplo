(function () {
  "use strict";

  var observer;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function observe() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal:not(.is-observed)"));

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible", "is-observed");
      });
      return;
    }

    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      });
    }

    items.forEach(function (item) {
      item.classList.add("is-observed");
      observer.observe(item);
    });
  }

  function init() {
    observe();
  }

  window.ThaysAnimations = {
    init: init,
    observe: observe,
    prefersReducedMotion: prefersReducedMotion
  };
})();
