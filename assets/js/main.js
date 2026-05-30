document.addEventListener("DOMContentLoaded", function () {
  if (window.ThaysUI) {
    window.ThaysUI.initHeader();
    window.ThaysUI.initMobileNav();
    window.ThaysUI.initFaq();
    window.ThaysUI.initCartShell();
    window.ThaysUI.initToastEvents();
  }

  if (window.ThaysCart) {
    window.ThaysCart.init();
  }

  if (window.ThaysQuote) {
    window.ThaysQuote.init();
  }

  if (window.ThaysCatalog) {
    window.ThaysCatalog.init();
  }

  if (window.ThaysAnimations) {
    window.ThaysAnimations.init();
  }

  if (window.ThaysSchema) {
    window.ThaysSchema.init();
  }
});
