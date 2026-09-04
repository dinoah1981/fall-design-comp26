// ===================================================================
// AI FOR THE PEOPLE — site behavior
// Link application, mobile menu, scroll reveal.
// NOTE: The LINKS object lives in index.html (inline script), not here.
// ===================================================================

// ===================================================================
// FINALISTS GALLERY
// FINALISTS (index.html) -> cards grouped by grade, each with a live
// scaled preview of the team's app, plus an in-page demo viewer with
// prev/next. A team with app: null renders as "awaiting build".
// ===================================================================
const PREVIEW_W = 960;   // previews render the app at this width...
const PREVIEW_H = 600;   // ...and height, then scale down to the card
const finalistState = { live: [], index: -1 };

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function joinNames(names) {
  if (!names || !names.length) return '';
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1];
}

function renderFinalists() {
  const root = document.getElementById('finalistsGallery');
  if (!root || typeof FINALISTS === 'undefined') return;

  const teams = FINALISTS.map((t, i) => ({
    ...t,
    id: i,
    live: typeof t.app === 'string' && t.app !== '' && t.app !== '#',
  }));
  finalistState.live = teams.filter((t) => t.live);
  const grades = [...new Set(teams.map((t) => t.grade))].sort((a, b) => a - b);

  root.innerHTML = grades.map((g) => {
    const rows = teams.filter((t) => t.grade === g);
    const liveCount = rows.filter((t) => t.live).length;
    const cards = rows.map((t) => {
      const label = escapeHtml(t.name || t.advisory + ' team');
      const title = t.name
        ? `<h3 class="fin-name">${escapeHtml(t.name)}</h3>`
        : '<h3 class="fin-name fin-name-pending mono">// name pending</h3>';
      const file = t.live ? t.app.replace(/^finalists\//, '') : 'awaiting_build';
      const preview = t.live
        ? `<button type="button" class="fin-shot" data-demo="${t.id}" aria-label="Open the ${label} demo">
             <iframe src="${escapeHtml(t.app)}" loading="lazy" tabindex="-1" aria-hidden="true" title="preview" sandbox="allow-scripts allow-same-origin"></iframe>
             <span class="fin-shot-hover mono">&#9654; demo</span>
           </button>`
        : `<div class="fin-shot fin-shot-pending"><span class="mono">&gt; awaiting build<span class="fin-cursor"></span></span></div>`;
      const actions = t.live
        ? `<div class="fin-actions">
             <button type="button" class="ws-link fin-open" data-demo="${t.id}">open demo</button>
             <a class="fin-newtab mono" href="${escapeHtml(t.app)}" target="_blank" rel="noopener">new tab &#8599;</a>
           </div>`
        : '<div class="fin-actions"><span class="ws-link fin-open link-pending">open demo</span></div>';
      return `<article class="fin-card reveal${t.winner ? ' is-winner' : ''}${t.live ? '' : ' is-pending'}">
        <div class="terminal-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="terminal-name">${escapeHtml(file)}</span></div>
        ${preview}
        <div class="fin-body">
          ${t.winner ? '<p class="fin-stamp mono">&#9733; winning team</p>' : ''}
          ${title}
          <p class="fin-advisory mono">// advisory: ${escapeHtml(t.advisory)}</p>
          <p class="fin-members">${escapeHtml(joinNames(t.members))}</p>
          ${actions}
        </div>
      </article>`;
    }).join('');
    return `<div class="fin-group">
      <div class="fin-group-head">
        <span class="fin-grade mono">/grade_${String(g).padStart(2, '0')}</span>
        <span class="fin-rule"></span>
        <span class="fin-count mono">${rows.length} teams &middot; ${liveCount} live</span>
      </div>
      <div class="fin-grid">${cards}</div>
    </div>`;
  }).join('');

  scalePreviews();
  window.addEventListener('resize', scalePreviews);

  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-demo]');
    if (el) openViewer(Number(el.getAttribute('data-demo')));
  });
}

// Previews render at PREVIEW_W x PREVIEW_H and scale to the card width.
function scalePreviews() {
  document.querySelectorAll('.fin-shot iframe').forEach((f) => {
    const w = f.parentElement.clientWidth;
    if (!w) return;
    f.style.width = PREVIEW_W + 'px';
    f.style.height = PREVIEW_H + 'px';
    f.style.transform = `scale(${w / PREVIEW_W})`;
  });
}

// ---- Demo viewer (native <dialog>) ----
function openViewer(id) {
  const dlg = document.getElementById('finViewer');
  const idx = finalistState.live.findIndex((t) => t.id === id);
  if (idx < 0) return;
  if (!dlg || typeof dlg.showModal !== 'function') {
    window.open(finalistState.live[idx].app, '_blank', 'noopener');
    return;
  }
  showViewer(idx);
  if (!dlg.open) {
    dlg.showModal();
    document.body.classList.add('fin-viewer-open');
  }
}

function showViewer(idx) {
  const live = finalistState.live;
  const t = live[idx];
  if (!t) return;
  finalistState.index = idx;
  document.getElementById('finViewerTitle').textContent = t.name || '// name pending';
  document.getElementById('finViewerMeta').textContent =
    `grade ${t.grade} · ${t.advisory} · ${joinNames(t.members)}`;
  document.getElementById('finViewerCount').textContent = `${idx + 1}/${live.length}`;
  document.getElementById('finViewerOpen').setAttribute('href', t.app);
  const frame = document.getElementById('finViewerFrame');
  if (frame.getAttribute('src') !== t.app) frame.setAttribute('src', t.app);
  document.getElementById('finViewerPrev').disabled = idx === 0;
  document.getElementById('finViewerNext').disabled = idx === live.length - 1;
}

function setupViewer() {
  const dlg = document.getElementById('finViewer');
  if (!dlg) return;
  const step = (d) => showViewer(finalistState.index + d);
  document.getElementById('finViewerPrev').addEventListener('click', () => step(-1));
  document.getElementById('finViewerNext').addEventListener('click', () => step(1));
  document.getElementById('finViewerClose').addEventListener('click', () => dlg.close());
  // Backdrop click closes (the dialog has no padding, so a click that lands
  // on the dialog element itself rather than a child is the backdrop).
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    document.body.classList.remove('fin-viewer-open');
    // Unload the app so its audio/timers stop.
    document.getElementById('finViewerFrame').removeAttribute('src');
  });
  document.addEventListener('keydown', (e) => {
    if (!dlg.open) return;
    if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
}

// ---- Apply LINKS to data-link elements ----
document.addEventListener('DOMContentLoaded', () => {
  renderFinalists();   // before the reveal observer below so cards animate in
  setupViewer();

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
