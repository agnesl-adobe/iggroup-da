/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-links.
 * Base block: columns. Model: blocks/columns-links/_columns-links.json (xwalk columns block).
 * Source: https://www.ig.com/en (migration-work/block-context/columns-links/source.html)
 *
 * Columns blocks use NO field hints (per hinting.md) — each column is one cell of default
 * content in a single row. Layout: two audience columns ("For experienced traders" /
 * "For new traders"), each with an image, a sub-heading and a list of arrow links.
 *
 * The section wraps a section intro (`.simple-text` h2 title "Everything you need to trade
 * the markets") BEFORE the columns grid. It survives as section-level default content
 * (a heading) emitted adjacent to the block, never folded into a column cell. The decorative
 * " ↗" span after each link is dropped.
 */

// Extract the section-intro heading blocks that sit at the section-grid level (direct-child
// `.simple-text.parbase` of the section grid, before the flex/columns grid).
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

export default function parse(element, { document }) {
  const introNodes = extractSectionIntro(element);

  // Each column is a nested .container.responsivegrid inside the flex container.
  const flex = element.querySelector('.cmp-flex-container') || element;
  let groups = Array.from(flex.querySelectorAll(':scope > .container.responsivegrid'));
  if (groups.length === 0) {
    groups = Array.from(flex.querySelectorAll('.container.responsivegrid'));
  }

  const columns = groups.map((group) => {
    const cell = [];

    // Sub-heading (first simple-text paragraph, e.g. "For experienced traders").
    const subHeadingP = group.querySelector('.simple-text.theme--light p');
    if (subHeadingP) {
      const h = document.createElement('h3');
      h.textContent = (subHeadingP.textContent || '').trim();
      cell.push(h);
    }

    // Image.
    const image = group.querySelector('.image picture img, picture img, img');
    if (image) cell.push(image);

    // Link list — collect anchors (drop the trailing decorative arrow span).
    const anchors = Array.from(group.querySelectorAll('a[href]'));
    if (anchors.length) {
      const ul = document.createElement('ul');
      anchors.forEach((anchor) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', anchor.getAttribute('href') || '#');
        a.textContent = (anchor.textContent || '').trim();
        li.appendChild(a);
        ul.appendChild(li);
      });
      cell.push(ul);
    }

    return cell.length ? cell : [''];
  });

  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-links', cells });
  // Preserve the section intro heading before the block as section-level default content.
  element.replaceWith(...introNodes, block);
}
