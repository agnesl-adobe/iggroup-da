function embedYoutube(url, autoplay, background) {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', 'video/mp4');
  video.append(sourceEl);

  return video;
}

const loadVideoEmbed = (block, link, autoplay, background) => {
  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  if (isYoutube) {
    const url = new URL(link);
    const embedWrapper = embedYoutube(url, autoplay, background);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else {
    const videoEl = getVideoElement(link, autoplay, background);
    block.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  }
};

function isVideoLink(link) {
  try {
    if (!link) return false;
    // Check for regular video files
    const regularVideoCheck = link.match(/\.(mp4|mov|wmv|avi|mkv|webm)$/i) !== null;

    // Check for YouTube URLs
    const youtubeCheck = (
      link.includes('youtube.com')
          || link.includes('youtu.be')
          || link.includes('youtube-nocookie.com')
    );

    // Combined check
    const isVideo = regularVideoCheck || youtubeCheck;

    // Log the type of video for debugging
    if (isVideo) {
      console.log('Video type:', {
        isRegularVideo: regularVideoCheck,
        isYouTube: youtubeCheck,
        url: link,
      });
    }

    return isVideo;
  } catch (error) {
    console.error('Error checking video link:', error);
    return false;
  }
}

/**
 * IG homepage columns variants were authored as forked blocks but serialize to
 * the native `columns` component (no variant class survives to JCR). Detect the
 * variant from a stable content signature and tag the block so the variant
 * styling in columns.css applies. Purely additive — safe on non-IG columns.
 */
function tagIgColumnsVariant(block) {
  if ([...block.classList].some((c) => c.startsWith('columns-') && c.endsWith('-ig'))) return;
  const hasOl = !!block.querySelector('ol');
  const uls = [...block.querySelectorAll('ul')];
  const learnMore = [...block.querySelectorAll('a')].filter((a) => /learn more/i.test(a.textContent)).length;
  // A ul whose items are links (audience link-lists) distinguishes "links"
  // from "feature" (a benefit checklist whose items are plain text).
  const ulLinkItems = uls.reduce((n, ul) => n
    + [...ul.querySelectorAll(':scope > li')].filter((li) => li.querySelector('a')).length, 0);

  let variant = null;
  if (hasOl) variant = 'columns-steps-ig'; // numbered "Join IG" steps
  else if (learnMore >= 2) variant = 'columns-promo-ig'; // two "Learn more" promo panels
  else if (ulLinkItems > 0) variant = 'columns-links-ig'; // audience columns of link-lists
  else if (uls.length) variant = 'columns-feature-ig'; // benefit checklist + screenshot

  if (variant) block.classList.add(variant);
}

/**
 * The IG "Learn more" promo panels (Refer a friend / Volume-based rebates) use a
 * full-card background illustration behind the text. The authored content has no
 * image, so inject the local optimized webp keyed by each panel's link target.
 */
function addPromoImages(block) {
  if (!block.classList.contains('columns-promo-ig')) return;
  const PROMO_IMG = [
    { test: /refer-a-friend/i, file: 'promo-refer-a-friend' },
    { test: /rebate|volume-based/i, file: 'promo-rebates' },
  ];
  block.querySelectorAll(':scope > div > div').forEach((col) => {
    if (col.querySelector('img, picture')) return;
    const href = col.querySelector('a')?.getAttribute('href') || '';
    const match = PROMO_IMG.find((p) => p.test.test(href));
    if (!match) return;
    const img = document.createElement('img');
    img.className = 'columns-promo-bg';
    img.src = `${window.hlx.codeBasePath}/images/${match.file}.webp`;
    img.alt = '';
    img.setAttribute('width', '750');
    img.setAttribute('height', '1090');
    img.setAttribute('loading', 'lazy');
    img.setAttribute('aria-hidden', 'true');
    col.prepend(img);
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  tagIgColumnsVariant(block);
  addPromoImages(block);

  // setup image columns
  [...block.children].forEach((row) => {
    row.classList.add('columns-row');
    // const firstChild = row.querySelector(':scope > div:first-child');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
      // const videoBlock = col.querySelector('div[data-aue-model="video"]');

      const linkavl = col.querySelector('a')?.href;
      const videoBlock = linkavl ? isVideoLink(linkavl) : false;

      if (videoBlock) {
        const videoWrapper = col.closest('div');
        if (videoWrapper) {
          // Add video specific classes
          videoWrapper.classList.add('columns-video-col');

          // Get video link from button container
          const videoLink = col.querySelector('a');
          if (videoLink) {
            const videoUrl = videoLink.getAttribute('href');

            // Create video container
            const videoContainer = document.createElement('div');
            videoContainer.className = 'columns-video-container';

            // Load video with appropriate embed
            loadVideoEmbed(
              videoContainer,
              videoUrl,
              col.dataset.autoplay === 'true',
              col.dataset.background === 'true',
            );

            // Replace button container with video container
            const buttonContainer = videoLink.closest('div');
            if (buttonContainer) {
              buttonContainer.replaceWith(videoContainer);
            }
          }
        }
      }
    });
  });
}
