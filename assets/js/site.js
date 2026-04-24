(() => {
  const siteHeader = document.getElementById('site-header');
  if (!siteHeader) {
    return;
  }

  const navToggle = siteHeader.querySelector('.nav-toggle');
  const navigationLinks = siteHeader.querySelectorAll('.nav-links a');
  const prefetchedUrls = new Set();

  function closeNavigation() {
    siteHeader.classList.remove('is-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleNavigation() {
    const isOpen = siteHeader.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function shouldPrefetch(url) {
    return url.origin === window.location.origin &&
      url.pathname !== window.location.pathname &&
      !prefetchedUrls.has(url.href);
  }

  function prefetchUrl(href) {
    const url = new URL(href, window.location.href);
    if (!shouldPrefetch(url)) {
      return;
    }

    prefetchedUrls.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.href;
    link.as = 'document';
    document.head.appendChild(link);
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNavigation);
  }

  navigationLinks.forEach((link) => {
    link.addEventListener('click', closeNavigation);
    link.addEventListener('pointerenter', () => prefetchUrl(link.href), { passive: true });
    link.addEventListener('focus', () => prefetchUrl(link.href));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNavigation();
    }
  });

  const prefetchLocalNavigation = () => {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => prefetchUrl(link.href));
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchLocalNavigation, { timeout: 2500 });
  } else {
    window.setTimeout(prefetchLocalNavigation, 1500);
  }
})();
