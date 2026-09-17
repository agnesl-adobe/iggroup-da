/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-markets.
 * Base block: cards. Model: blocks/cards-markets/_cards-markets.json (xwalk container; card model).
 * Source: https://www.ig.com/en (migration-work/block-context/cards-markets/source.html)
 *
 * Library structure: container with one row per card. Each card row has 2 cells:
 *   cell 1 = image/icon (field:image, imageAlt collapses to alt attr)
 *   cell 2 = text richtext (field:text) — title (heading link) + description.
 *
 * The section wraps a section intro (`.simple-text` h2 title + p subtitle) BEFORE the card
 * grid, and standalone "Create live account"/"Create demo account" CTAs AFTER it. Those are
 * NOT part of the cards block — they are preserved as section-level default content
 * (heading/paragraph/links) emitted adjacent to the block, not folded into the card cells.
 */

// Extract the section-intro heading/subtitle blocks that sit at the section-grid level
// (direct-child `.simple-text.parbase` of the section grid, before the content grid).
function extractSectionIntro(element) {
  const grid = element.querySelector(':scope > .cmp-container > .aem-Grid')
    || element.querySelector('.cmp-container > .aem-Grid');
  if (!grid) return [];
  const introBlocks = Array.from(grid.querySelectorAll(':scope > .simple-text.parbase'));
  const nodes = [];
  introBlocks.forEach((block) => {
    const inner = block.querySelector('.simple-text') || block;
    Array.from(inner.children).forEach((child) => nodes.push(child));
  });
  return nodes;
}

// Convert the standalone IG CTA web-components (empty in static DOM) into real anchors so
// the "Create live account"/"Create demo account" links survive as default content.
function extractStandaloneCtas(element, document) {
  const CTA_LABELS = {
    '/en/application-form': 'Create live account',
    '/en/demo-account': 'Create demo account',
  };
  const ctas = Array.from(element.querySelectorAll('.cmp-flex-container .cta igws-cta[href], .cta igws-cta[href]'));
  return ctas.map((cta) => {
    const href = cta.getAttribute('href') || '#';
    const label = (cta.textContent || '').trim()
      || CTA_LABELS[href]
      || (href.split('/').filter(Boolean).pop() || 'Learn more').replace(/[-_]/g, ' ');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = label;
    const p = document.createElement('p');
    p.appendChild(a);
    return p;
  });
}

export default function parse(element, { document }) {
  const introNodes = extractSectionIntro(element);
  const ctaNodes = extractStandaloneCtas(element, document);

  const cards = Array.from(element.querySelectorAll('.news-card'));
  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('.cmp-news-card__image img, picture img, img');
    const titleP = card.querySelector('.cmp-news-card__text__title');
    const descP = card.querySelector('.cmp-news-card__text__text');

    const imageCell = [document.createComment(' field:image ')];
    if (image) imageCell.push(image);

    const textCell = [document.createComment(' field:text ')];
    // Promote the title to a heading so semantics survive (source uses <p><a>…</a></p>).
    if (titleP) {
      const link = titleP.querySelector('a');
      const h = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href') || '#');
        a.textContent = (link.textContent || '').trim();
        h.appendChild(a);
      } else {
        h.textContent = (titleP.textContent || '').trim();
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-markets', cells });
  // Preserve the section intro (h2/p) before the block and the standalone CTAs after it as
  // section-level default content — adjacent to the block table, never inside its cells.
  element.replaceWith(...introNodes, block, ...ctaNodes);
}
