import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets window scroll to the top on every route change.
 * Mount once inside the Router context — does not render anything.
 * Without it, navigating from a scrolled list (e.g. the home page) into a
 * post leaves the post mounted at the previous scroll offset.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
