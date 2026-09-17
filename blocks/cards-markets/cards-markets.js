import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * cards-markets — market-category grid.
 * Each authored row becomes a card with an icon image, a title and a short
 * description. Rendered as a responsive multi-column grid.
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
      if (index === 0) {
        div.className = 'cards-markets-icon';
        return;
      }
      // A real body cell carries the card title (a heading). Some authored rows
      // have a stray extra cell (e.g. a leftover "button" placeholder, which EDS
      // wraps as <p>button</p>) with no heading — drop it so it doesn't render as
      // a random label under the card.
      if (div.querySelector('h2, h3, h4, h5, h6')) div.className = 'cards-markets-body';
      else div.remove();
    });

    ul.append(li);
  });

  // The icon field may be delivered as a bare link to the (external) asset URL
  // rather than a <picture> — turn image-links in the icon cell into <img>.
  const IMG_URL = /\.(png|jpe?g|gif|webp|svg|avif)(\?|#|$)|\/is\/image\/|jcr:content\/renditions/i;
  // Known ig.com market PNGs (multi-hundred-KB each) have local optimized webp
  // copies (~13-24KB, same-origin) — map the source filename to the local asset.
  const LOCAL_MARKET = {
    forexNew: 'market-forex',
    cryptoNew: 'market-crypto',
    commoditiesNew: 'market-commodities',
    etfsNew: 'market-etfs',
    sharesNew: 'market-shares',
    indicesNew: 'market-indices',
  };
  ul.querySelectorAll('.cards-markets-icon a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!IMG_URL.test(href)) return;
    const img = document.createElement('img');
    const stem = (href.match(/([^/]+?)\.(?:png|jpe?g|webp)/i) || [])[1];
    img.src = stem && LOCAL_MARKET[stem]
      ? `${window.hlx.codeBasePath}/images/${LOCAL_MARKET[stem]}.webp`
      : href;
    // Use the title as alt; never the link text (which is the raw URL).
    const title = (a.getAttribute('title') || '').trim();
    img.alt = title && !/^https?:\/\//i.test(title) ? title : '';
    // Reserve the card image's aspect ratio (source is 1484x987) so lazy-loading
    // doesn't shift the grid. CSS keeps it width:100%/height:auto.
    img.setAttribute('width', '1484');
    img.setAttribute('height', '987');
    img.setAttribute('loading', 'lazy');
    a.replaceWith(img);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
