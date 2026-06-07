'use client';

import { useEffect } from 'react';

/**
 * Applies the `site-body` class on <body> while a site page is active.
 * Removes it on unmount so the admin layout can apply `admin-body`.
 */
export function SiteBodyClass() {
  useEffect(() => {
    document.body.classList.add('site-body');
    document.body.classList.remove('admin-body');
    return () => {
      document.body.classList.remove('site-body');
    };
  }, []);
  return null;
}
