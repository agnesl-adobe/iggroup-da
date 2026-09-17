/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-product.
 * Base block: hero. Model: blocks/hero-product/_hero-product.json (xwalk simple block).
 * Source: https://www.ig.com/en (migration-work/block-context/hero-product/source.html)
 * Library structure: 1 column. Row = image, Row = text/content (heading + copy + CTAs + link).
 * Field hints (xwalk): image (reference), text (richtext). imageAlt is a collapsed attribute.
 */
export default function parse(element, { document }) {
  // Convert IG custom CTA web-components (<igws-cta href>) into real anchors so their
  // links survive html2md. On the live page these hydrate with a label; fall back to a
  // sensible label derived from the href when the element is empty.
  const toAnchor = (node) => {
    const href = node.getAttribute('href') || '#';
    const label = (node.textContent || '').trim()
      || (href.split('/').filter(Boolean).pop() || 'Learn more').replace(/[-_]/g, ' ');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = label;
    return a;
  };

  // ---- Extraction (validated against source.html) ----
  const heading = element.querySelector('.cmp-hero-section__content__main__heading, h1, h2');
  const subCopy = element.querySelector('.cmp-hero-section__content__main__sub-copy, p.cmp-hero-section__content__main__sub-copy');
  const ctaEls = Array.from(element.querySelectorAll('.cmp-hero-section__content__main__buttons igws-cta, .cmp-hero-section__content__main__buttons a.button, .cmp-hero-section__content__main__buttons a'));
  const contactText = element.querySelector('.cmp-hero-section__content__main__contact-text');
  const image = element.querySelector('.image-component-root img, picture img, img');

  const cells = [];

  // Row: image (asset). Field hint required; alt collapses into the <img alt> attribute.
  if (image) {
    cells.push([[document.createComment(' field:image '), image]]);
  }

  // Row: text (richtext) — heading, sub-copy, CTA links, and contact copy in one cell.
  const textCell = [document.createComment(' field:text ')];
  if (heading) textCell.push(heading);
  if (subCopy) textCell.push(subCopy);
  ctaEls.forEach((c) => {
    if (c.tagName && c.tagName.toLowerCase() === 'igws-cta') {
      const a = toAnchor(c);
      const p = document.createElement('p');
      p.appendChild(a);
      textCell.push(p);
    } else {
      textCell.push(c);
    }
  });
  if (contactText) textCell.push(contactText);

  // Empty-block guard: nothing meaningful to import.
  if (!image && textCell.length === 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (textCell.length > 1) cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
