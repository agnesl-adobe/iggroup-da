/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document: document2 }) {
    const toAnchor = (node) => {
      const href = node.getAttribute("href") || "#";
      const label = (node.textContent || "").trim() || (href.split("/").filter(Boolean).pop() || "Learn more").replace(/[-_]/g, " ");
      const a = document2.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label;
      return a;
    };
    const heading = element.querySelector(".cmp-hero-section__content__main__heading, h1, h2");
    const subCopy = element.querySelector(".cmp-hero-section__content__main__sub-copy, p.cmp-hero-section__content__main__sub-copy");
    const ctaEls = Array.from(element.querySelectorAll(".cmp-hero-section__content__main__buttons igws-cta, .cmp-hero-section__content__main__buttons a.button, .cmp-hero-section__content__main__buttons a"));
    const contactText = element.querySelector(".cmp-hero-section__content__main__contact-text");
    const image = element.querySelector(".image-component-root img, picture img, img");
    const cells = [];
    if (image) {
      cells.push([[document2.createComment(" field:image "), image]]);
    }
    const textCell = [document2.createComment(" field:text ")];
    if (heading) textCell.push(heading);
    if (subCopy) textCell.push(subCopy);
    ctaEls.forEach((c) => {
      if (c.tagName && c.tagName.toLowerCase() === "igws-cta") {
        const a = toAnchor(c);
        const p = document2.createElement("p");
        p.appendChild(a);
        textCell.push(p);
      } else {
        textCell.push(c);
      }
    });
    if (contactText) textCell.push(contactText);
    if (!image && textCell.length === 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (textCell.length > 1) cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-prices.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const cards = Array.from(element.querySelectorAll(
      '.carousel-slide, .cmp-carousel__item, .live-price-card, [class*="price-card"]'
    ));
    cards.forEach((card) => {
      const image = card.querySelector("picture, img");
      const textNodes = Array.from(card.querySelectorAll(":scope p, :scope h1, :scope h2, :scope h3, :scope h4, :scope a"));
      const imageCell = [document2.createComment(" field:media_image ")];
      if (image) imageCell.push(image);
      const textCell = [document2.createComment(" field:content_text "), ...textNodes];
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-prices", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-markets.js
  function extractSectionIntro(element) {
    const grid = element.querySelector(":scope > .cmp-container > .aem-Grid") || element.querySelector(".cmp-container > .aem-Grid");
    if (!grid) return [];
    const introBlocks = Array.from(grid.querySelectorAll(":scope > .simple-text.parbase"));
    const nodes = [];
    introBlocks.forEach((block) => {
      const inner = block.querySelector(".simple-text") || block;
      Array.from(inner.children).forEach((child) => nodes.push(child));
    });
    return nodes;
  }
  function extractStandaloneCtas(element, document2) {
    const CTA_LABELS = {
      "/en/application-form": "Create live account",
      "/en/demo-account": "Create demo account"
    };
    const ctas = Array.from(element.querySelectorAll(".cmp-flex-container .cta igws-cta[href], .cta igws-cta[href]"));
    return ctas.map((cta) => {
      const href = cta.getAttribute("href") || "#";
      const label = (cta.textContent || "").trim() || CTA_LABELS[href] || (href.split("/").filter(Boolean).pop() || "Learn more").replace(/[-_]/g, " ");
      const a = document2.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label;
      const p = document2.createElement("p");
      p.appendChild(a);
      return p;
    });
  }
  function parse3(element, { document: document2 }) {
    const introNodes = extractSectionIntro(element);
    const ctaNodes = extractStandaloneCtas(element, document2);
    const cards = Array.from(element.querySelectorAll(".news-card"));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".cmp-news-card__image img, picture img, img");
      const titleP = card.querySelector(".cmp-news-card__text__title");
      const descP = card.querySelector(".cmp-news-card__text__text");
      const imageCell = [document2.createComment(" field:image ")];
      if (image) imageCell.push(image);
      const textCell = [document2.createComment(" field:text ")];
      if (titleP) {
        const link = titleP.querySelector("a");
        const h = document2.createElement("h3");
        if (link) {
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href") || "#");
          a.textContent = (link.textContent || "").trim();
          h.appendChild(a);
        } else {
          h.textContent = (titleP.textContent || "").trim();
        }
        textCell.push(h);
      }
      if (descP) textCell.push(descP);
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-markets", cells });
    element.replaceWith(...introNodes, block, ...ctaNodes);
  }

  // tools/importer/parsers/cards-stats.js
  function extractSectionIntro2(element, document2) {
    const title = element.querySelector(".cmp-usp-display__title");
    if (!title) return [];
    const text = (title.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return [];
    const h = document2.createElement("h2");
    h.textContent = text;
    return [h];
  }
  function parse4(element, { document: document2 }) {
    const introNodes = extractSectionIntro2(element, document2);
    const items = Array.from(element.querySelectorAll(".cmp-usp-display__content__item"));
    const cells = [];
    items.forEach((item) => {
      const values = item.querySelector(".cmp-usp-display__content__values");
      const label = item.querySelector(".cmp-usp-display__content__text");
      const imageCell = [""];
      const textCell = [document2.createComment(" field:text ")];
      if (values) {
        const figure = (values.textContent || "").replace(/\s+/g, " ").trim();
        if (figure) {
          const h = document2.createElement("h3");
          h.textContent = figure;
          textCell.push(h);
        }
      }
      if (label) {
        const p = document2.createElement("p");
        p.textContent = (label.textContent || "").trim();
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-stats", cells });
    element.replaceWith(...introNodes, block);
  }

  // tools/importer/parsers/columns-promo.js
  function extractSectionIntro3(element) {
    const grid = element.querySelector(":scope > .cmp-container > .aem-Grid") || element.querySelector(".cmp-container > .aem-Grid");
    if (!grid) return [];
    const introBlocks = Array.from(grid.querySelectorAll(":scope > .simple-text.parbase"));
    const nodes = [];
    introBlocks.forEach((block) => {
      const inner = block.querySelector(".simple-text") || block;
      Array.from(inner.children).forEach((child) => nodes.push(child));
    });
    return nodes;
  }
  function extractStandaloneCtas2(element, document2) {
    const CTA_LABELS = {
      "/en/application-form": "Create live account",
      "/en/demo-account": "Create demo account"
    };
    const ctas = Array.from(element.querySelectorAll(".cmp-flex-container .cta igws-cta[href], .cta igws-cta[href]"));
    return ctas.map((cta) => {
      const href = cta.getAttribute("href") || "#";
      const label = (cta.textContent || "").trim() || CTA_LABELS[href] || (href.split("/").filter(Boolean).pop() || "Learn more").replace(/[-_]/g, " ");
      const a = document2.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label;
      const p = document2.createElement("p");
      p.appendChild(a);
      return p;
    });
  }
  function parse5(element, { document: document2 }) {
    const introNodes = extractSectionIntro3(element);
    const ctaNodes = extractStandaloneCtas2(element, document2);
    const panels = Array.from(element.querySelectorAll(":scope .cmp-flex-container .image-background, .image-background"));
    const columns = panels.map((panel) => {
      const cell = [];
      const textBlocks = Array.from(panel.querySelectorAll(".simple-text.theme--light, .simple-text.theme--dark"));
      if (textBlocks.length) {
        textBlocks.forEach((tb) => {
          Array.from(tb.children).forEach((child) => cell.push(child));
        });
      } else {
        Array.from(panel.children).forEach((child) => cell.push(child));
      }
      return cell.length ? cell : [""];
    });
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document: document2 }) {
    const inner = element.querySelector(".cmp-account-panel__inner") || element;
    const textWrap = inner.querySelector(".cmp-account-panel__inner__text");
    const imageWrap = inner.querySelector(".cmp-account-panel__inner__image");
    const toAnchor = (node) => {
      const href = node.getAttribute("href") || "#";
      const label = (node.textContent || "").trim() || (href.split("/").filter(Boolean).pop() || "Learn more").replace(/[-_]/g, " ");
      const a = document2.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label;
      return a;
    };
    const textCell = [];
    if (textWrap) {
      const heading = textWrap.querySelector("h1, h2, h3");
      if (heading) textCell.push(heading);
      const list = textWrap.querySelector("ul, ol");
      if (list) {
        const ul = document2.createElement("ul");
        Array.from(list.querySelectorAll(":scope > li")).forEach((li) => {
          const sub = li.querySelector('[class*="subtext"]') || li;
          const text = (sub.textContent || "").replace(/\s+/g, " ").trim();
          if (text) {
            const item = document2.createElement("li");
            item.textContent = text;
            ul.appendChild(item);
          }
        });
        if (ul.childElementCount) textCell.push(ul);
      }
      const cta = textWrap.querySelector("igws-cta, a.button, a");
      if (cta) {
        const a = cta.tagName.toLowerCase() === "igws-cta" ? toAnchor(cta) : cta;
        const p = document2.createElement("p");
        p.appendChild(a);
        textCell.push(p);
      }
    }
    const imageCell = [];
    const image = (imageWrap || inner).querySelector("picture img, img");
    if (image) imageCell.push(image);
    if (textCell.length === 0 && imageCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      textCell.length ? textCell : [""],
      imageCell.length ? imageCell : [""]
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-links.js
  function extractSectionIntro4(element) {
    const grid = element.querySelector(":scope > .cmp-container > .aem-Grid") || element.querySelector(".cmp-container > .aem-Grid");
    if (!grid) return [];
    const introBlocks = Array.from(grid.querySelectorAll(":scope > .simple-text.parbase"));
    const nodes = [];
    introBlocks.forEach((block) => {
      const inner = block.querySelector(".simple-text") || block;
      Array.from(inner.children).forEach((child) => nodes.push(child));
    });
    return nodes;
  }
  function parse7(element, { document: document2 }) {
    const introNodes = extractSectionIntro4(element);
    const flex = element.querySelector(".cmp-flex-container") || element;
    let groups = Array.from(flex.querySelectorAll(":scope > .container.responsivegrid"));
    if (groups.length === 0) {
      groups = Array.from(flex.querySelectorAll(".container.responsivegrid"));
    }
    const columns = groups.map((group) => {
      const cell = [];
      const subHeadingP = group.querySelector(".simple-text.theme--light p");
      if (subHeadingP) {
        const h = document2.createElement("h3");
        h.textContent = (subHeadingP.textContent || "").trim();
        cell.push(h);
      }
      const image = group.querySelector(".image picture img, picture img, img");
      if (image) cell.push(image);
      const anchors = Array.from(group.querySelectorAll("a[href]"));
      if (anchors.length) {
        const ul = document2.createElement("ul");
        anchors.forEach((anchor) => {
          const li = document2.createElement("li");
          const a = document2.createElement("a");
          a.setAttribute("href", anchor.getAttribute("href") || "#");
          a.textContent = (anchor.textContent || "").trim();
          li.appendChild(a);
          ul.appendChild(li);
        });
        cell.push(ul);
      }
      return cell.length ? cell : [""];
    });
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-links", cells });
    element.replaceWith(...introNodes, block);
  }

  // tools/importer/parsers/columns-steps.js
  function parse8(element, { document: document2 }) {
    const inner = element.querySelector(".cmp-account-panel__inner") || element;
    const textWrap = inner.querySelector(".cmp-account-panel__inner__text");
    const imageWrap = inner.querySelector(".cmp-account-panel__inner__image");
    const toAnchor = (node) => {
      const href = node.getAttribute("href") || "#";
      const label = (node.textContent || "").trim() || (href.split("/").filter(Boolean).pop() || "Get started").replace(/[-_]/g, " ");
      const a = document2.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label;
      return a;
    };
    const textCell = [];
    if (textWrap) {
      const heading = textWrap.querySelector("h1, h2, h3");
      if (heading) textCell.push(heading);
      const intro = textWrap.querySelector(":scope > p");
      if (intro && (intro.textContent || "").trim()) textCell.push(intro);
      const ol = textWrap.querySelector("ol");
      if (ol) {
        const list = document2.createElement("ol");
        Array.from(ol.querySelectorAll(":scope > li")).forEach((li) => {
          const sub = li.querySelector('[class*="subtext"]');
          const desc = li.querySelector('[class*="description"]');
          const parts = [sub, desc].map((n) => n ? (n.textContent || "").replace(/\s+/g, " ").trim() : "").filter(Boolean);
          if (parts.length) {
            const item = document2.createElement("li");
            item.textContent = parts.join(" \u2014 ");
            list.appendChild(item);
          }
        });
        if (list.childElementCount) textCell.push(list);
      }
      const cta = textWrap.querySelector("igws-cta, a.button, a");
      if (cta) {
        const a = cta.tagName.toLowerCase() === "igws-cta" ? toAnchor(cta) : cta;
        const p = document2.createElement("p");
        p.appendChild(a);
        textCell.push(p);
      }
    }
    const imageCell = [];
    const image = (imageWrap || inner).querySelector("picture img, img");
    if (image) imageCell.push(image);
    if (textCell.length === 0 && imageCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      textCell.length ? textCell : [""],
      imageCell.length ? imageCell : [""]
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ig-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Cookie consent overlay (cleaned.html:1373-1376)
        "#onetrust-consent-sdk",
        // Overlays / modals that can interfere with parsing (cleaned.html:1351,1355,1342)
        ".megamenu-modal-overlay",
        ".megamenu-modal",
        ".ig-c-floating-action-bar-eu__qr-modal",
        // Sticky-menu helper input (cleaned.html:2)
        "input.enable-sticky-menu-on-mob"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Skip-to-content accessibility link (cleaned.html:3)
        "a.skip-to-content__link",
        // Header / network-strip / mega-menu (cleaned.html:35)
        "div.wrapper-header",
        // Footer (cleaned.html:1087)
        "div.footer__wrapper",
        // Floating WhatsApp / QR action bar chrome (cleaned.html:1332)
        "aside.ig-c-floating-action-bar-eu",
        "img.whatsappLogo",
        // Tracking pixels / analytics beacons (cleaned.html:1364-1369)
        "img.ywa-10000",
        "#batBeacon231796542879",
        'img[src*="analytics.twitter.com"]',
        'img[src*="t.co/1/i/adsct"]',
        'img[src*="insight.adsrvr.org"]',
        // Tracking / modal iframes (cleaned.html:1357,1371,1646)
        "iframe",
        // Non-authorable leftover elements
        "noscript",
        "link",
        "source"
      ]);
    }
  }

  // tools/importer/transformers/ig-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-product": parse,
    "carousel-prices": parse2,
    "cards-markets": parse3,
    "cards-stats": parse4,
    "columns-promo": parse5,
    "columns-feature": parse6,
    "columns-links": parse7,
    "columns-steps": parse8
  };
  var PAGE_TEMPLATE = {
    "name": "home",
    "description": "",
    "urls": [
      "https://www.ig.com/en"
    ],
    "blocks": [
      {
        "name": "hero-product",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn--default--none.aem-GridColumn--phone--none.aem-GridColumn--phone--11.aem-GridColumn.aem-GridColumn--default--12.aem-GridColumn--offset--phone--0.aem-GridColumn--offset--default--0"
        ]
      },
      {
        "name": "carousel-prices",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(2)"
        ]
      },
      {
        "name": "cards-markets",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)"
        ]
      },
      {
        "name": "columns-promo",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(5)"
        ]
      },
      {
        "name": "columns-feature",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)"
        ]
      },
      {
        "name": "cards-stats",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(7)"
        ]
      },
      {
        "name": "columns-links",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(9)"
        ]
      },
      {
        "name": "columns-steps",
        "instances": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(10)"
        ]
      }
    ],
    "sections": [
      {
        "id": "rc-esma",
        "name": "rc-esma",
        "selector": [
          "body > div.wrapper > div.esma.experiencefragment"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      },
      {
        "id": "rc-hero",
        "name": "rc-hero",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn--default--none.aem-GridColumn--phone--none.aem-GridColumn--phone--11.aem-GridColumn.aem-GridColumn--default--12.aem-GridColumn--offset--phone--0.aem-GridColumn--offset--default--0"
        ],
        "style": null,
        "blocks": [
          "hero-product"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-liveprices",
        "name": "rc-liveprices",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(2)"
        ],
        "style": null,
        "blocks": [
          "carousel-prices"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-markets",
        "name": "rc-markets",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)"
        ],
        "style": null,
        "blocks": [
          "cards-markets"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-spacer-1",
        "name": "rc-spacer-1",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.vertical-spacer.mt-4xl.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(4)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      },
      {
        "id": "rc-rewards",
        "name": "rc-rewards",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(5)"
        ],
        "style": null,
        "blocks": [
          "columns-promo"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-platforms",
        "name": "rc-platforms",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)"
        ],
        "style": null,
        "blocks": [
          "columns-feature"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-trust-stats",
        "name": "rc-trust-stats",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(7)"
        ],
        "style": "accent",
        "blocks": [
          "cards-stats"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-spacer-2",
        "name": "rc-spacer-2",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.vertical-spacer.mt-4xl.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(8)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      },
      {
        "id": "rc-everything",
        "name": "rc-everything",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(9)"
        ],
        "style": null,
        "blocks": [
          "columns-links"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-joinig",
        "name": "rc-joinig",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(10)"
        ],
        "style": "grey",
        "blocks": [
          "columns-steps"
        ],
        "defaultContent": []
      },
      {
        "id": "rc-disclaimer",
        "name": "rc-disclaimer",
        "selector": [
          "#main-content > div.container.responsivegrid > div.cmp-container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12.aem-Grid--phone--12 > div.container.responsivegrid.container--mw-1200.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(11)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
