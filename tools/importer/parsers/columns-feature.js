/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Base block: columns. Model: blocks/columns-feature/_columns-feature.json (xwalk columns block).
 * Source: https://www.ig.com/en (migration-work/block-context/columns-feature/source.html)
 *
 * Columns blocks use NO field hints (per hinting.md) — each column is one cell of default
 * content in a single row. Layout: column 1 = text (heading + benefit checklist + CTA),
 * column 2 = platform screenshot image. IG's custom <igws-cta> is converted to an anchor.
 */
export default function parse(element, { document }) {
  const inner = element.querySelector('.cmp-account-panel__inner') || element;

  const textWrap = inner.querySelector('.cmp-account-panel__inner__text');
  const imageWrap = inner.querySelector('.cmp-account-panel__inner__image');

  const toAnchor = (node) => {
    const href = node.getAttribute('href') || '#';
    const label = (node.textContent || '').trim()
      || (href.split('/').filter(Boolean).pop() || 'Learn more').replace(/[-_]/g, ' ');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = label;
    return a;
  };

  // Column 1: heading, list of benefits, CTA button.
  const textCell = [];
  if (textWrap) {
    const heading = textWrap.querySelector('h1, h2, h3');
    if (heading) textCell.push(heading);

    const list = textWrap.querySelector('ul, ol');
    if (list) {
      // Rebuild a clean list from each item's subtext so the checklist survives as a <ul>.
      const ul = document.createElement('ul');
      Array.from(list.querySelectorAll(':scope > li')).forEach((li) => {
        const sub = li.querySelector('[class*="subtext"]') || li;
        const text = (sub.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) {
          const item = document.createElement('li');
          item.textContent = text;
          ul.appendChild(item);
        }
      });
      if (ul.childElementCount) textCell.push(ul);
    }

    const cta = textWrap.querySelector('igws-cta, a.button, a');
    if (cta) {
      const a = cta.tagName.toLowerCase() === 'igws-cta' ? toAnchor(cta) : cta;
      const p = document.createElement('p');
      p.appendChild(a);
      textCell.push(p);
    }
  }

  // Column 2: image.
  const imageCell = [];
  const image = (imageWrap || inner).querySelector('picture img, img');
  if (image) imageCell.push(image);

  if (textCell.length === 0 && imageCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[
    textCell.length ? textCell : [''],
    imageCell.length ? imageCell : [''],
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
