import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-product — product-intro hero.
 * Centered text stack (heading, supporting copy, CTA buttons in a row, chat
 * link) with a large product image below.
 *
 * Works against both authoring shapes:
 *  - import table: image cell + text cell
 *  - Universal Editor model: image (may render as a link when the asset is an
 *    external DAM URL) as one cell, a richtext `text` field as another, plus
 *    several trailing config-field cells (herolayout, ctastyle, badge, …) that
 *    are empty and must be ignored.
 *
 * Strategy: classify every cell by content — media (picture/img), or prose
 * (heading/paragraph/list/link) — keep prose as the text stack and media as
 * the image, and drop empty config cells. Never assume a fixed cell count.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const IMG_URL = /\.(png|jpe?g|gif|webp|svg|avif)(\?|#|$)|\/is\/image\/|jcr:content\/renditions/i;
  const isImageLink = (a) => a && IMG_URL.test(a.getAttribute('href') || '');

  let mediaCell = null;
  let mediaImageUrl = null;
  let mediaImageAlt = '';
  const proseNodes = [];

  cells.forEach((cell) => {
    // A real <picture>/<img> is the media.
    if (!mediaCell && !mediaImageUrl && cell.querySelector('picture, img')) {
      mediaCell = cell;
      return;
    }
    // The image field may be delivered as a bare link to the asset URL
    // (external DAM references render as anchors, not pictures). Treat the
    // first such link as the media and do NOT let it fall into the text stack.
    const lone = cell.querySelector('a');
    if (!mediaCell && !mediaImageUrl && isImageLink(lone)
        && !cell.querySelector('h1, h2, h3, h4, h5, h6')) {
      mediaImageUrl = lone.getAttribute('href');
      mediaImageAlt = (lone.getAttribute('title') || lone.textContent || '').trim();
      return;
    }
    // Skip boolean config-field cells (e.g. enableunderline) that render as a
    // lone "true"/"false" — even when wrapped in a <p> — so they don't leak.
    if (/^(true|false)$/i.test(cell.textContent.trim())) return;
    // Collect real prose only — a cell that carries a heading, paragraph, or
    // list. UE config-field cells render as bare text (e.g. "true", "default")
    // with no block-level element; skip those so they don't leak into the copy.
    if (cell.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol')) {
      [...cell.childNodes].forEach((n) => {
        // Keep element nodes and non-empty text, but drop stray bare-text
        // config values (a text node not inside any element).
        if (n.nodeType === Node.ELEMENT_NODE) proseNodes.push(n);
      });
    }
  });

  block.textContent = '';

  // --- Text stack ---
  if (proseNodes.length) {
    const textWrap = document.createElement('div');
    textWrap.className = 'hero-product-text';
    proseNodes.forEach((n) => textWrap.append(n));

    // Footnote markers need to render as superscripts (e.g. "provider¹").
    // They arrive in two shapes depending on delivery:
    textWrap.querySelectorAll('h1, h2, h3').forEach((hd) => {
      // (a) as a child <div>N</div> (Universal Editor / raw HTML)
      hd.querySelectorAll(':scope > div').forEach((d) => {
        if (/^\d{1,2}$/.test(d.textContent.trim())) {
          const sup = document.createElement('sup');
          sup.textContent = d.textContent.trim();
          d.replaceWith(sup);
        }
      });
      // (b) collapsed into a trailing digit stuck to the last word on the live
      // site (e.g. "provider1") — split it off and superscript it.
      const last = hd.lastChild;
      if (last && last.nodeType === Node.TEXT_NODE) {
        const m = last.textContent.match(/^(.*[a-zA-Z])(\d{1,2})$/);
        if (m) {
          const [, lead, digit] = m;
          last.textContent = lead;
          const sup = document.createElement('sup');
          sup.textContent = digit;
          hd.append(sup);
        }
      }
    });

    // Group the CTA paragraphs into one horizontal row; mark the second (and
    // later) CTA as the outlined secondary variant.
    // Detect CTA paragraphs robustly: a <p> that is (or will be) a
    // button-container — i.e. its only meaningful content is a single link.
    // Search descendants (not just direct children): the Universal Editor wraps
    // fields in `data-aue-*` instrumentation divs, so the CTA paragraphs are not
    // direct children of the text stack there. Matching only `:scope > p` left
    // them ungrouped in the UE, so both buttons fell back to the global stacked
    // red-pill styling (while Preview/published, which have no instrumentation,
    // rendered correctly). Relying on the `.button-container` class alone is also
    // fragile because EDS's decorateButtons may not have tagged it yet.
    const ctaParas = [...textWrap.querySelectorAll('p')].filter((p) => {
      if (p.classList.contains('button-container')) return true;
      const links = p.querySelectorAll('a');
      return links.length === 1 && p.textContent.trim() === links[0].textContent.trim();
    });
    if (ctaParas.length) {
      // Ensure each grouped CTA paragraph carries button-container + its link
      // carries .button, so the block CSS (and global pill styling) applies.
      ctaParas.forEach((p) => {
        p.classList.add('button-container');
        const a = p.querySelector('a');
        if (a) a.classList.add('button');
      });
      const ctaRow = document.createElement('div');
      ctaRow.className = 'hero-product-cta';
      ctaParas[0].before(ctaRow);
      ctaParas.forEach((p, i) => {
        if (i > 0) p.classList.add('secondary');
        ctaRow.append(p);
      });
      // Align hero CTA labels with ig.com wording (keyed by link target), since
      // the imported link text is the raw path ("application form"/"demo account").
      ctaRow.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href') || '';
        if (/application-form/.test(href)) a.textContent = 'Create live account';
        else if (/demo-account/.test(href)) a.textContent = 'Create demo account';
      });
    }

    block.append(textWrap);
  }

  // --- Product image ---
  if (mediaCell) {
    mediaCell.classList.add('hero-product-media');
    const img = mediaCell.querySelector('img');
    if (img && img.src && img.src.startsWith(window.location.origin)) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [{ width: '1600' }]);
      mediaCell.querySelector('picture')?.replaceWith(optimized);
    }
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    block.append(mediaCell);
  } else if (mediaImageUrl) {
    // The image was delivered as a link to an (external) asset URL — render it
    // as an <img> so the hero shows the product image rather than a text link.
    const wrap = document.createElement('div');
    wrap.className = 'hero-product-media';
    const img = document.createElement('img');
    // The hero art is the LCP element. If it's the ig.com marketing PNG (a 2.8MB
    // external asset that can't be optimized through our pipeline), swap in the
    // local optimized webp copy (~77KB, same-origin) instead.
    img.src = /homepageHero/i.test(mediaImageUrl)
      ? `${window.hlx.codeBasePath}/images/homepage-hero.webp`
      : mediaImageUrl;
    img.alt = mediaImageAlt;
    // Reserve the hero's aspect ratio (source is 2:1) so the image doesn't push
    // the page down as it loads — this is the dominant CLS culprit. CSS keeps it
    // width:100%/height:auto, so these attributes only set the ratio.
    img.setAttribute('width', '1600');
    img.setAttribute('height', '800');
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    wrap.append(img);
    block.append(wrap);
  }
}
