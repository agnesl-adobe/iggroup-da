import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * columns-feature — image + feature content, side by side.
 * One column holds a product/platform screenshot; the other holds a heading,
 * a benefit checklist and a CTA button. Picture-only columns are flagged as
 * media so CSS can size them.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-feature-${cols.length || 1}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) col.classList.add('columns-feature-media');
      else col.classList.add('columns-feature-content');
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
