// ============================================================
// Personalization — localStorage visitor profile
// ============================================================
const STORAGE_KEY = 'boileau_visitor';

function getVisitor() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function saveVisitor(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function personalizeHero(visitor) {
  const el = document.getElementById('personalized-greeting');
  if (!el) return;
  const lang = window.BOILEAU_LANG || document.documentElement.lang || 'en';
  const name = visitor.name ? `, ${visitor.name}` : '';
  if (!visitor.type) return;

  let msg;
  if (lang === 'fr') {
    const fr = window.BOILEAU_GREETINGS_FR || {};
    const tpl = fr[visitor.type] || 'Bienvenue{name} — voici ce qui intéresse habituellement nos clients.';
    msg = tpl.replace('{name}', name);
  } else {
    const labels = { plex: 'plex owner', condo: 'condo owner', commercial: 'property manager' };
    msg = `Welcome back${name} — here's what ${labels[visitor.type] || 'our clients'}s usually ask about.`;
  }
  el.textContent = msg;
  el.style.opacity = '1';
}

function reorderServices(visitor) {
  const grid = document.querySelector('.services-grid');
  if (!grid || !visitor.type) return;
  const order = {
    plex:       ['plumbing', 'heating',  'heatpump'],
    condo:      ['plumbing', 'heatpump', 'heating'],
    commercial: ['heating',  'plumbing', 'heatpump'],
  };
  const seq = order[visitor.type];
  if (!seq) return;
  seq.forEach(id => {
    const card = grid.querySelector(`[data-service="${id}"]`);
    if (card) grid.appendChild(card);
  });
}

// ============================================================
// Modal
// ============================================================
function showModal() {
  const modal = document.getElementById('visit-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  const firstBtn = modal.querySelector('.choice-btn');
  if (firstBtn) firstBtn.focus();
}

function hideModal() {
  const modal = document.getElementById('visit-modal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

function initModal() {
  const visitor = getVisitor();
  if (visitor) {
    personalizeHero(visitor);
    reorderServices(visitor);
    return;
  }
  // First visit — show modal after 800 ms
  setTimeout(showModal, 800);
}

// ============================================================
// DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ---- Modal logic ----
  const modal = document.getElementById('visit-modal');
  if (modal) {
    let selected = null;

    modal.querySelectorAll('.choice-btn[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.choice-btn[data-type]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selected = btn.dataset.type;
      });
    });

    document.getElementById('modal-confirm')?.addEventListener('click', () => {
      if (!selected) return;
      const name    = document.getElementById('visitor-name')?.value.trim() || '';
      const visitor = { type: selected, name, lang: document.documentElement.lang || 'en' };
      saveVisitor(visitor);
      hideModal();
      personalizeHero(visitor);
      reorderServices(visitor);
    });

    document.getElementById('modal-skip')?.addEventListener('click', () => {
      saveVisitor({ type: null, name: '', lang: document.documentElement.lang || 'en' });
      hideModal();
    });

    document.querySelector('.modal-close')?.addEventListener('click', hideModal);

    // Close on backdrop click
    modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });

    // Close on Escape
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });
  }

  initModal();

  // ---- Scroll reveal ----
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // ---- Mobile nav ----
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const nav = document.querySelector('.site-nav');
      const isOpen = nav.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // ---- Waitlist form ----
  document.getElementById('waitlist-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const lang = window.BOILEAU_LANG || document.documentElement.lang || 'en';
    const msg = lang === 'fr'
      ? '&#10003; Vous êtes sur la liste &mdash; on vous appelera dans l\'ordre.'
      : '&#10003; You\'re on the list &mdash; we\'ll call in order.';
    e.target.innerHTML = `<p style="color:var(--mint);font-size:1.1rem;font-weight:500;">${msg}</p>`;
  });

  // ---- Language toggle ----
  document.getElementById('lang-fr')?.addEventListener('click', e => {
    e.preventDefault();
    const path = window.location.pathname;
    if (path.startsWith('/en')) {
      window.location.href = path.replace(/^\/en/, '') || '/';
    } else {
      window.location.href = '/';
    }
  });

  document.getElementById('lang-en')?.addEventListener('click', e => {
    e.preventDefault();
    const path = window.location.pathname;
    if (!path.startsWith('/en')) {
      window.location.href = '/en' + (path === '/' ? '/' : path);
    }
  });

  // Footer lang link (en pages)
  document.getElementById('lang-fr-footer')?.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = '/';
  });
});
