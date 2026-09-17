/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-steps.
 * Base block: columns. Model: blocks/columns-steps/_columns-steps.json (xwalk columns block).
 * Source: https://www.ig.com/en (migration-work/block-context/columns-steps/source.html)
 *
 * Columns blocks use NO field hints (per hinting.md) — each column is one cell of default
 * content in a single row. Layout: column 1 = text (heading + subheading + numbered steps
 * + CTA), column 2 = lifestyle image. IG's custom <igws-cta> is converted to an anchor.
 */
export default function parse(element, { document }) {
  const inner = element.querySelector('.cmp-account-panel__inner') || element;

  const textWrap = inner.querySelector('.cmp-account-panel__inner__text');
  const imageWrap = inner.querySelector('.cmp-account-panel__inner__image');

  const toAnchor = (node) => {
    const href = node.getAttribute('href') || '#';
    const label = (node.textContent || '').trim()
      || (href.split('/').filter(Boolean).pop() || 'Get started').replace(/[-_]/g, ' ');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = label;
    return a;
  };

  // Column 1: heading, intro copy, numbered steps, CTA.
  const textCell = [];
  if (textWrap) {
    const heading = textWrap.querySelector('h1, h2, h3');
    if (heading) textCell.push(heading);

    const intro = textWrap.querySelector(':scope > p');
    if (intro && (intro.textContent || '').trim()) textCell.push(intro);

    const ol = textWrap.querySelector('ol');
    if (ol) {
      // Rebuild an ordered list combining each step's subtext + description.
      const list = document.createElement('ol');
      Array.from(ol.querySelectorAll(':scope > li')).forEach((li) => {
        const sub = li.querySelector('[class*="subtext"]');
        const desc = li.querySelector('[class*="description"]');
        const parts = [sub, desc]
          .map((n) => (n ? (n.textContent || '').replace(/\s+/g, ' ').trim() : ''))
          .filter(Boolean);
        if (parts.length) {
          const item = document.createElement('li');
          item.textContent = parts.join(' — ');
          list.appendChild(item);
        }
      });
      if (list.childElementCount) textCell.push(list);
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-steps', cells });
  element.replaceWith(block);
}
