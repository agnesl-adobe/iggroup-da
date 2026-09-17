/**
 * carousel-prices — live-prices ticker.
 *
 * A horizontally-scrolling row of market tiles. Each authored row becomes one
 * tile. Within a row, an image cell (if present) becomes the instrument flag/
 * logo; the remaining cells map, in order, to instrument name, current price
 * and percentage change. Any further cells are appended as detail lines.
 *
 * The change cell is inspected for its sign so the strip can colour gains and
 * losses the way the source ticker does (positive blue, negative red).
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const track = document.createElement('ul');
  track.className = 'carousel-prices-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const tile = document.createElement('li');
    tile.className = 'carousel-prices-tile';

    // Pull out an image cell (flag / instrument logo) if the author added one.
    const flagCell = cells.find((c) => c.querySelector('picture, img'));
    if (flagCell) {
      const flag = document.createElement('div');
      flag.className = 'carousel-prices-flag';
      while (flagCell.firstChild) flag.append(flagCell.firstChild);
      tile.append(flag);
    }

    // Remaining (text) cells → name, price, change, then details.
    const dataCells = cells.filter((c) => c !== flagCell);
    const data = document.createElement('div');
    data.className = 'carousel-prices-data';

    const fids = document.createElement('div');
    fids.className = 'carousel-prices-fids';

    dataCells.forEach((cell, index) => {
      const part = document.createElement('div');
      if (index === 0) {
        part.className = 'carousel-prices-instrument';
      } else if (index === 1) {
        part.className = 'carousel-prices-price';
      } else if (index === 2) {
        part.className = 'carousel-prices-change';
        const txt = cell.textContent.trim();
        if (/^[-−]/.test(txt)) part.classList.add('is-negative');
        else if (/^\+/.test(txt) || /\d/.test(txt)) part.classList.add('is-positive');
      } else {
        part.className = 'carousel-prices-detail';
      }
      while (cell.firstChild) part.append(cell.firstChild);

      if (index === 0) data.append(part);
      else fids.append(part);
    });

    if (fids.children.length) data.append(fids);
    tile.append(data);
    track.append(tile);
  });

  block.textContent = '';
  block.append(track);
}
