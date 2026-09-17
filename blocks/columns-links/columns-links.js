import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * columns-links — side-by-side columns, each an image + sub-heading + link list.
 * Two audience columns ("For experienced traders" / "For new traders"), each
 * with a lifestyle image above a heading and a list of arrow links.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-links-${cols.length || 1}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-links-row');
    [...row.children].forEach((col) => {
      col.classList.add('columns-links-col');
      const pic = col.querySelector('picture');
      if (pic) col.querySelector('picture').closest('*').classList.add('has-media');
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    // Only optimise same-origin images; external CDN images (e.g. www.ig.com)
    // must keep their absolute URL or createOptimizedPicture drops the host.
    let sameOrigin = true;
    try {
      sameOrigin = new URL(img.src, window.location.href).origin === window.location.origin;
    } catch (e) {
      sameOrigin = true;
    }
    if (!sameOrigin) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
