/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo.
 * Base block: columns. Model: blocks/columns-promo/_columns-promo.json (xwalk columns block).
 * Source: https://www.ig.com/en (migration-work/block-context/columns-promo/source.html)
 *
 * Columns blocks use NO field hints (per hinting.md) — each column is one cell of default
 * content in a single row. Here the two promotional panels (.image-background) become the
 * two columns.
 *
 * The section wraps a section intro (`.simple-text` h2 title "Enjoy exclusive rewards and
 * rebates" + p subtitle) BEFORE the panels, and standalone CTAs AFTER them. Those survive as
 * section-level default content (heading/paragraph/links) emitted adjacent to the block,
 * never folded into the column cells.
 */

// Extract the section-intro heading/subtitle blocks that sit at the section-grid level
// (direct-child `.simple-text.parbase` of the section grid, before the panels grid).
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

// Convert standalone IG CTA web-components (empty in static DOM) into real anchors so the
// "Create live account"/"Create demo account" links survive as default content.
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

  const panels = Array.from(element.querySelectorAll(':scope .cmp-flex-container .image-background, .image-background'));

  const columns = panels.map((panel) => {
    const cell = [];
    // Pull the inner text blocks (heading paragraph + copy + link) from the panel wrapper.
    const textBlocks = Array.from(panel.querySelectorAll('.simple-text.theme--light, .simple-text.theme--dark'));
    if (textBlocks.length) {
      textBlocks.forEach((tb) => {
        Array.from(tb.children).forEach((child) => cell.push(child));
      });
    } else {
      Array.from(panel.children).forEach((child) => cell.push(child));
    }
    return cell.length ? cell : [''];
  });

  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
