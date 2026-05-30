(function () {
  "use strict";

  function getQuoteNumber() {
    var config = window.THAYS_CONFIG || {};
    var quote = config.quote || {};
    var contact = config.contact || {};
    return quote.whatsappNumber || contact.whatsappNumber || "";
  }

  function normalizeNumber(number) {
    return String(number || "").replace(/[^\d]/g, "");
  }

  function isConfigured(number) {
    var normalized = normalizeNumber(number || getQuoteNumber());
    return normalized.length >= 8;
  }

  function buildUrl(message, number) {
    var normalized = normalizeNumber(number || getQuoteNumber());
    if (!isConfigured(normalized)) {
      return "";
    }
    return "https://wa.me/" + normalized + "?text=" + encodeURIComponent(String(message || ""));
  }

  function openMessage(message, number) {
    var url = buildUrl(message, number);
    if (!url) {
      return {
        ok: false,
        reason: "missing-whatsapp"
      };
    }
    window.open(url, "_blank", "noopener,noreferrer");
    return {
      ok: true,
      url: url
    };
  }

  window.ThaysWhatsapp = {
    getQuoteNumber: getQuoteNumber,
    normalizeNumber: normalizeNumber,
    isConfigured: isConfigured,
    buildUrl: buildUrl,
    openMessage: openMessage
  };
})();
