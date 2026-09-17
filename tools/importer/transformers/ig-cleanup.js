/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ig.com site-wide cleanup.
 * Removes non-authorable site chrome (header/mega-menu, footer, floating widgets,
 * cookie consent, tracking pixels/iframes) so the import contains only authorable
 * page content. All selectors verified against migration-work/cleaned.html.
 *
 * NOTE: `div.esma.experiencefragment` (cleaned.html:7) is the ESMA risk-warning
 * banner. It is removed from page content because the header block renders the
 * same disclaimer as a persistent top bar (matches ig.com) — keeping it in the
 * page too would duplicate it on a white background below the black bar.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      // ESMA risk-warning banner — rendered by the header block as a persistent
      // top bar, so removed from page content to avoid duplicating it below.
      'div.esma.experiencefragment',
      'div.esma',
      // Cookie consent overlay (cleaned.html:1373-1376)
      '#onetrust-consent-sdk',
      // Overlays / modals that can interfere with parsing (cleaned.html:1351,1355,1342)
      '.megamenu-modal-overlay',
      '.megamenu-modal',
      '.ig-c-floating-action-bar-eu__qr-modal',
      // Sticky-menu helper input (cleaned.html:2)
      'input.enable-sticky-menu-on-mob',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Skip-to-content accessibility link (cleaned.html:3)
      'a.skip-to-content__link',
      // Header / network-strip / mega-menu (cleaned.html:35)
      'div.wrapper-header',
      // Footer (cleaned.html:1087)
      'div.footer__wrapper',
      // Floating WhatsApp / QR action bar chrome (cleaned.html:1332)
      'aside.ig-c-floating-action-bar-eu',
      'img.whatsappLogo',
      // Tracking pixels / analytics beacons (cleaned.html:1364-1369)
      'img.ywa-10000',
      '#batBeacon231796542879',
      'img[src*="analytics.twitter.com"]',
      'img[src*="t.co/1/i/adsct"]',
      'img[src*="insight.adsrvr.org"]',
      // Tracking / modal iframes (cleaned.html:1357,1371,1646)
      'iframe',
      // Non-authorable leftover elements
      'noscript',
      'link',
      'source',
    ]);
  }
}
