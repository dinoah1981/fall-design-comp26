// ===================================================================
// AI FOR THE PEOPLE — site behavior
// Link application, mobile menu, scroll reveal.
// NOTE: The LINKS object lives in index.html (inline script), not here.
// ===================================================================

// ---- Apply LINKS to data-link elements ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof LINKS !== 'undefined') {
    document.querySelectorAll('[data-link]').forEach((el) => {
      const key = el.getAttribute('data-link');
      const url = LINKS[key];
      if (url && url !== '#') {
        el.setAttribute('href', url);
        // External links open in new tabs; local pages stay in-tab
        if (/^https?:\/\//.test(url)) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener');
        } else {
          el.removeAttribute('target');
        }
      } else if (!url || url === '#') {
        // Placeholder: mark visually and disable navigation
        el.classList.add('link-pending');
        el.setAttribute('href', '#');
        el.setAttribute('title', 'Coming soon');
        el.addEventListener('click', (e) => e.preventDefault());
      }
    });
  }

  // ---- Mobile menu ----
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close the menu after tapping a link
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
});
