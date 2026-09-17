import { getMetadata } from '../../scripts/aem.js';
import { isAuthorEnvironment } from '../../scripts/scripts.js';
import { getHostname } from '../../scripts/utils.js';

/**
 * content-fragment — renders an Article content fragment (Title, Subtitle,
 * Summary, Main Content, Main image, Author, Publish date).
 *
 * Data source: an AEM GraphQL *persisted query* (ad-hoc GraphQL and the CF
 * delivery APIs are blocked on publish). You must create + PUBLISH a persisted
 * query named `ArticleByPath` under your Sites GraphQL endpoint config, then set
 * ENDPOINT_CONFIG below to that config's name. See the query text in the block's
 * README / the message that shipped this change.
 *
 * If the fragment does not render, open DevTools → Network and check the
 * `execute.json/<config>/ArticleByPath` request, and Console for the logged error.
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  // ---- CONFIG: adjust to your instance -------------------------------------
  // The Sites GraphQL endpoint configuration name that owns the persisted query
  // (the segment after /graphql/execute.json/). Was `ref-demo-eds` (reference
  // demo); set this to your own config.
  const ENDPOINT_CONFIG = 'wknd-universal';
  const PERSISTED_QUERY = `/graphql/execute.json/${ENDPOINT_CONFIG}/ArticleByPath`;
  // Publish-tier origin for the live (.aem.page/.aem.live) page. The persisted
  // query is CORS-enabled there, so the block queries it directly from the
  // browser (no proxy). Derived from the hostname placeholder when set.
  const PUBLISH_ORIGIN = 'https://publish-p179457-e1900808.adobeaemcloud.com';
  // --------------------------------------------------------------------------

  const hostnameFromPlaceholders = await getHostname();
  const hostname = hostnameFromPlaceholders || getMetadata('hostname');
  const aemauthorurl = getMetadata('authorurl') || '';
  const aempublishurl = (hostname ? hostname.replace('author', 'publish').replace(/\/$/, '') : '') || PUBLISH_ORIGIN;

  // Block config cells (authored order): 1 CF path, 2 variation, 3 style, 4 alignment.
  const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();
  let variationname = block.querySelector(':scope div:nth-child(2) > div')?.textContent?.trim()?.toLowerCase()?.replace(/\s+/g, '_') || 'master';
  // AEM's default variation is technically "master" (the UE labels it "Main").
  // Passing "main" 404s the CF edit API and points data-aue-resource at a
  // non-existent .../data/main node, which breaks inline editing in the UE.
  if (variationname === 'main') variationname = 'master';
  const displayStyle = block.querySelector(':scope div:nth-child(3) > div')?.textContent?.trim()?.toLowerCase()?.replace(/\s+/g, '-') || 'image-top';
  const alignment = block.querySelector(':scope div:nth-child(4) > div')?.textContent?.trim()?.toLowerCase()?.replace(/\s+/g, '-') || 'text-left';

  block.innerHTML = '';
  if (!contentPath) return;
  const isAuthor = isAuthorEnvironment();

  // Normalize the CF path to a SINGLE url-encoding. The picker may already hand
  // us an encoded path (e.g. "AL%20demos"); encoding that again yields
  // "AL%2520demos", which AEM resolves to a non-existent node (item: null).
  // Decode first, then encode once, so a space is always a single %20.
  let normalizedPath = contentPath;
  try { normalizedPath = decodeURI(contentPath); } catch (e) { /* leave as-is */ }
  const encodedPath = encodeURI(normalizedPath);

  // Query the persisted query directly on the right tier: the author instance in
  // the UE (same-origin, session auth), the publish instance on the live page
  // (CORS-enabled). No proxy needed.
  const base = isAuthor ? aemauthorurl : aempublishurl;
  const requestConfig = {
    url: `${base}${PERSISTED_QUERY};path=${encodedPath};variation=${variationname};ts=${Date.now()}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers,
      ...(requestConfig.body && { body: requestConfig.body }),
    });
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(`content-fragment: GraphQL request failed (${response.status})`, { contentPath, variationname, isAuthor });
      return;
    }

    const offer = await response.json();
    // ---- FIELD MAPPING: match these to your model's GraphQL property names ----
    // Take the first query root in the response (e.g. articleByPath / newsByPath)
    // so the block works whatever the model's generated query name is.
    const item = offer?.data ? Object.values(offer.data)[0]?.item : undefined;
    if (!item) {
      // eslint-disable-next-line no-console
      console.error('content-fragment: no article item in GraphQL response', { response: offer, contentPath });
      return;
    }

    const title = item.title || '';
    const subtitle = Array.isArray(item.subtitle) ? item.subtitle.join(' ') : (item.subtitle || '');
    // summary and mainContent may be multiline fields (objects with
    // html/plaintext) or plain strings depending on the model.
    const summary = item.summary?.plaintext ?? (typeof item.summary === 'string' ? item.summary : '');
    let contentHtml = item.mainContent?.html || (item.mainContent?.plaintext ? `<p>${item.mainContent.plaintext}</p>` : '');
    // Defensive: some fragments have literal HTML tags pasted into the text field
    // (e.g. copied from GraphQL html output). AEM escapes them as entities, so
    // they render as visible "</p><p>"/"<br>". Un-escape just the paragraph/break
    // tags so they format as intended instead of showing as text.
    contentHtml = contentHtml
      .replace(/&lt;\s*(\/?)\s*p\s*&gt;/gi, '<$1p>')
      .replace(/&lt;\s*br\s*\/?\s*&gt;/gi, '<br>');
    const author = item.author || '';
    // mainImage is a Reference resolved as ImageRef: prefer the dynamic delivery
    // URL, then author/publish URLs, then the raw DAM path.
    const img = item.mainImage || {};
    const imgUrl = img._dynamicUrl || (isAuthor ? img._authorUrl : img._publishUrl) || img._path || '';

    let publishDate = '';
    if (item.publishDate) {
      const d = new Date(item.publishDate);
      publishDate = Number.isNaN(d.getTime()) ? item.publishDate
        : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    // --------------------------------------------------------------------------

    const itemId = `urn:aemconnection:${contentPath}/jcr:content/data/${variationname}`;
    block.setAttribute('data-aue-type', 'container');

    const meta = [author && `<span class="cf-article-author">${author}</span>`, publishDate && `<time class="cf-article-date">${publishDate}</time>`]
      .filter(Boolean).join('<span class="cf-article-dot">·</span>');

    block.innerHTML = `
      <article class="cf-article ${displayStyle} ${alignment}" data-aue-resource="${itemId}" data-aue-label="${title || 'Article'}" data-aue-type="reference" data-aue-filter="contentfragment">
        ${imgUrl ? `<div class="cf-article-media" data-aue-prop="mainImage" data-aue-label="Main image" data-aue-type="media"><img src="${imgUrl}" alt="${title}" loading="eager"></div>` : ''}
        <div class="cf-article-body">
          <h1 class="cf-article-title" data-aue-prop="title" data-aue-label="Title" data-aue-type="text">${title}</h1>
          ${subtitle ? `<p class="cf-article-subtitle" data-aue-prop="subtitle" data-aue-label="Subtitle" data-aue-type="text">${subtitle}</p>` : ''}
          ${meta ? `<p class="cf-article-meta">${meta}</p>` : ''}
          ${summary ? `<p class="cf-article-summary" data-aue-prop="summary" data-aue-label="Summary" data-aue-type="text">${summary}</p>` : ''}
          <div class="cf-article-content" data-aue-prop="mainContent" data-aue-label="Main content" data-aue-type="richtext">${contentHtml}</div>
        </div>
      </article>`;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('content-fragment: error rendering article', { error: error.message, contentPath, variationname, isAuthor });
  }
}
