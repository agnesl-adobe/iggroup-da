/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductParser from './parsers/hero-product.js';
import carouselPricesParser from './parsers/carousel-prices.js';
import cardsMarketsParser from './parsers/cards-markets.js';
import cardsStatsParser from './parsers/cards-stats.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsLinksParser from './parsers/columns-links.js';
import columnsStepsParser from './parsers/columns-steps.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/ig-cleanup.js';
import sectionsTransformer from './transformers/ig-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProductParser,
  'carousel-prices': carouselPricesParser,
  'cards-markets': cardsMarketsParser,
  'cards-stats': cardsStatsParser,
  'columns-promo': columnsPromoParser,
  'columns-feature': columnsFeatureParser,
  'columns-links': columnsLinksParser,
  'columns-steps': columnsStepsParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
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

// TRANSFORMER REGISTRY (section transformer runs after cleanup)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. parse each block (skip elements already replaced/detached)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. sanitized path (root URL -> /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
