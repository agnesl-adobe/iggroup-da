import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * columns-steps — content (numbered steps) beside a lifestyle image.
 * One column holds a heading, sub-heading, a numbered step list and a CTA
 * button; the other holds a supporting image. Picture-only columns are flagged
 * as media.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-steps-${cols.length || 1}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-steps-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) col.classList.add('columns-steps-media');
      else col.classList.add('columns-steps-content');
    });
  });

  // Split each numbered step into a bold title and a regular description.
  // Authored as a single line "Title — description"; the source renders the
  // part before the dash in a heavier weight above the description.
  block.querySelectorAll('.columns-steps-content ol > li').forEach((li) => {
    const raw = li.textContent.trim();
    const parts = raw.split(/\s*[—–-]\s+/);
    const text = document.createElement('div');
    text.className = 'columns-steps-step-text';
    const title = document.createElement('span');
    title.className = 'columns-steps-step-title';
    title.textContent = parts.shift();
    text.append(title);
    if (parts.length) {
      const desc = document.createElement('span');
      desc.className = 'columns-steps-step-desc';
      desc.textContent = parts.join(' ');
      text.append(desc);
    }
    li.textContent = '';
    li.append(text);
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
