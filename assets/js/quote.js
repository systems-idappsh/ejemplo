(function () {
  "use strict";

  function quoteConfig() {
    return (window.THAYS_CONFIG && window.THAYS_CONFIG.quote) || {};
  }

  function escapeLine(value) {
    return String(value || "").trim();
  }

  function validate(state, detailedItems) {
    var cfg = quoteConfig();
    var note = state.meta && state.meta.generalNote ? String(state.meta.generalNote) : "";
    var maxNoteLength = Number(cfg.maxNoteLength || 500);

    if (!window.ThaysWhatsapp || !window.ThaysWhatsapp.isConfigured()) {
      return {
        ok: false,
        message: cfg.missingWhatsappMessage || "El número de WhatsApp aún no está configurado."
      };
    }

    if (!detailedItems.length) {
      return {
        ok: false,
        message: cfg.emptyCartMessage || "Agrega al menos un producto para solicitar cotización."
      };
    }

    var invalidQuantity = detailedItems.some(function (item) {
      return !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0;
    });
    if (invalidQuantity) {
      return {
        ok: false,
        message: "La cantidad debe ser mayor a cero."
      };
    }

    if (note.length > maxNoteLength) {
      return {
        ok: false,
        message: "La nota es demasiado larga. Resume tu solicitud para enviarla por WhatsApp."
      };
    }

    return { ok: true };
  }

  function buildMessage(state, detailedItems) {
    var cfg = quoteConfig();
    var lines = [];
    var meta = state.meta || {};

    lines.push(cfg.defaultMessageIntro || "Hola, vengo del sitio web de thayspostres.");
    lines.push("");
    lines.push(cfg.defaultMessageLead || "Me gustaría solicitar una cotización para:");
    lines.push("");

    detailedItems.forEach(function (item, index) {
      lines.push((index + 1) + ". " + escapeLine(item.name));
      lines.push("   Cantidad: " + item.quantity);
      lines.push("   Categoría: " + escapeLine(item.category));
      lines.push("");
    });

    if (meta.eventType) {
      lines.push("Tipo de evento: " + escapeLine(meta.eventType));
    }

    if (meta.eventDate) {
      lines.push("Fecha tentativa: " + escapeLine(meta.eventDate));
    }

    if (meta.generalNote) {
      lines.push("Notas: " + escapeLine(meta.generalNote));
    }

    if (meta.eventType || meta.eventDate || meta.generalNote) {
      lines.push("");
    }

    lines.push(cfg.defaultMessageClosing || "¿Me puedes compartir disponibilidad, opciones y detalles?");

    return lines.join("\n");
  }

  function setMessage(message, tone) {
    var messageNode = document.querySelector("[data-cart-message]");
    if (messageNode) {
      messageNode.textContent = message || "";
      messageNode.dataset.tone = tone || "";
    }
    if (message) {
      document.dispatchEvent(new CustomEvent("thays:toast", {
        detail: { message: message, tone: tone || "info" }
      }));
    }
  }

  function sendQuote() {
    if (!window.ThaysCart) return;

    var state = window.ThaysCart.syncMetaFromDOM();
    var items = window.ThaysCart.detailItems();
    var validation = validate(state, items);

    if (!validation.ok) {
      setMessage(validation.message, "error");
      return;
    }

    var message = buildMessage(state, items);
    var result = window.ThaysWhatsapp.openMessage(message);

    if (!result.ok) {
      setMessage(quoteConfig().missingWhatsappMessage || "El número de WhatsApp aún no está configurado.", "error");
      return;
    }

    setMessage("Solicitud preparada para WhatsApp.", "success");
  }

  function init() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-quote-send]");
      if (!button) return;
      event.preventDefault();
      sendQuote();
    });
  }

  window.ThaysQuote = {
    init: init,
    buildMessage: buildMessage,
    validate: validate,
    sendQuote: sendQuote
  };
})();
