(function () {
  "use strict";

  function cfg() {
    return window.THAYS_CONFIG || {};
  }

  function currentUrl() {
    return window.location.href.split("#")[0];
  }

  function inject(schema, id) {
    if (!schema || !id || document.getElementById(id)) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  function breadcrumb(name) {
    if (name === "Inicio") return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": new URL("index.html", window.location.href).href
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": name,
          "item": currentUrl()
        }
      ]
    };
  }

  function pageName() {
    return document.body.getAttribute("data-page-title") || document.title || cfg().brandName || "thayspostres";
  }

  function init() {
    var baseName = cfg().brandName || "thayspostres";
    var page = document.body.getAttribute("data-page") || "home";
    var title = pageName();
    var descriptionMeta = document.querySelector('meta[name="description"]');
    var description = descriptionMeta ? descriptionMeta.getAttribute("content") : "";

    inject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": currentUrl(),
      "isPartOf": {
        "@type": "WebSite",
        "name": baseName,
        "url": new URL("index.html", window.location.href).href
      },
      "inLanguage": "es-MX"
    }, "schema-webpage");

    if (page === "home") {
      inject({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "name": baseName,
            "url": currentUrl(),
            "logo": new URL("assets/img/icons/favicon.svg", window.location.href).href
          },
          {
            "@type": "Bakery",
            "name": baseName,
            "url": currentUrl(),
            "image": new URL("assets/img/og/og-home.jpg", window.location.href).href,
            "description": "Marca local de repostería artesanal y postres personalizados. Datos de contacto específicos pendientes de validación.",
            "servesCuisine": ["Repostería", "Postres"]
          },
          {
            "@type": "WebSite",
            "name": baseName,
            "url": currentUrl(),
            "inLanguage": "es-MX"
          }
        ]
      }, "schema-home");
    }

    if (page === "catalog") {
      var itemList = (window.THAYS_PRODUCTS || []).map(function (product, index) {
        return {
          "@type": "ListItem",
          "position": index + 1,
          "name": product.name,
          "url": currentUrl() + "#" + product.id
        };
      });
      inject({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Catálogo para cotización de thayspostres",
        "itemListElement": itemList
      }, "schema-itemlist");
    }

    if (page === "faq") {
      var questions = Array.prototype.slice.call(document.querySelectorAll("[data-faq-button]")).map(function (button) {
        var panel = document.getElementById(button.getAttribute("aria-controls"));
        return {
          "@type": "Question",
          "name": button.textContent.trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": panel ? panel.textContent.trim() : ""
          }
        };
      });
      inject({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions
      }, "schema-faq");
    }

    var crumb = breadcrumb(title.replace(" | thayspostres", ""));
    if (crumb) inject(crumb, "schema-breadcrumb");
  }

  window.ThaysSchema = {
    init: init
  };
})();
