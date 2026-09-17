import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * columns-promo — side-by-side promotional panels.
 * Each column is a rich promotional panel (background imagery, heading,
 * description, "Learn more" link). Columns that contain only a picture are
 * flagged so CSS can treat them as media panels.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-promo-${cols.length || 1}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-promo-row');
    [...row.children].forEach((col) => {
      col.classList.add('columns-promo-panel');
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) col.classList.add('columns-promo-media');
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
