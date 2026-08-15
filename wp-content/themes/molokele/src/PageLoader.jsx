// Controls the branded #molokele-preloader overlay (server-rendered by
// functions.php at wp_body_open, before any JS has loaded — see there for
// why). This site is plain WordPress page-loads, not a client-routed SPA,
// so every internal link click triggers a full browser navigation. Without
// this, clicking a link just sits there doing nothing visible until the new
// page's HTML arrives. Instead: fade the overlay out once this page's React
// app has mounted, and fade it back in the instant an internal link is
// clicked — the browser then unloads into a fresh page that starts with the
// exact same overlay already showing, so the transition reads as continuous.
export default function initPageTransitions() {
  const preloader = document.getElementById('molokele-preloader');

  // Two rAFs: let the just-mounted app actually paint before we fade the
  // overlay away, so there's no gap of bare white/blank in between.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      preloader?.classList.add('is-hidden');
    });
  });

  const isModifiedClick = (e) =>
    e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  document.addEventListener('click', (e) => {
    if (isModifiedClick(e)) return;

    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.hasAttribute('download') ||
      link.target === '_blank'
    ) {
      return;
    }

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    // Same-page anchor/hash jump — no real navigation happening.
    if (url.pathname === window.location.pathname && url.hash) return;

    preloader?.classList.remove('is-hidden');
  });
}
