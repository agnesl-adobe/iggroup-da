import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * cards-stats — statistics row.
 * Each authored row becomes one statistic: a large figure and a supporting
 * label. Rendered as an evenly-spaced row that wraps on small screens.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div, index) => {
      if (index === 0) div.className = 'cards-stats-figure';
      else div.className = 'cards-stats-label';
    });

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
