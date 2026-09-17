/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-prices.
 * Base block: carousel. Model: blocks/carousel-prices/_carousel-prices.json (xwalk container).
 * Source: https://www.ig.com/en (migration-work/block-context/carousel-prices/source.html)
 *
 * The live-prices carousel is a hydrated web component (<igws-live-prices-carousel>) whose
 * slides (instrument / price / % change) are fetched client-side — there is NO static slide
 * markup in the source DOM. Per the library description a carousel container may have zero to
 * N card rows, so when no slide content is present we emit the block shell (name row only) so
 * the block is recognised and authored/populated in Universal Editor. If static card markup
 * ever appears (image + text per card) it is captured as one row per card.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Attempt to capture any statically-rendered slide/card markup (defensive; usually none).
  const cards = Array.from(element.querySelectorAll(
    '.carousel-slide, .cmp-carousel__item, .live-price-card, [class*="price-card"]'
  ));

  cards.forEach((card) => {
    const image = card.querySelector('picture, img');
    const textNodes = Array.from(card.querySelectorAll(':scope p, :scope h1, :scope h2, :scope h3, :scope h4, :scope a'));
    const imageCell = [document.createComment(' field:media_image ')];
    if (image) imageCell.push(image);
    const textCell = [document.createComment(' field:content_text '), ...textNodes];
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-prices', cells });
  element.replaceWith(block);
}
