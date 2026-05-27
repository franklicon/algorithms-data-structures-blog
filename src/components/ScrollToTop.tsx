import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Runs on every route change:
 *   1. Scrolls window to the top — without it, navigating from a scrolled
 *      list (e.g. the home page) into a post leaves the post mounted at the
 *      previous scroll offset.
 *   2. Fires a history.replaceState so the Cloudflare Web Analytics beacon
 *      registers a pageview — HashRouter changes the URL via hashchange,
 *      which the beacon's SPA tracker doesn't listen for; replaceState does.
 * Mount once inside the Router context — does not render anything.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(window.history.state, '', window.location.href);
    }
  }, [pathname]);

  return null;
}
