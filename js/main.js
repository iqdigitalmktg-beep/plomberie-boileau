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

  // ---- Scroll reveal with staggered grid cards ----
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Pre-assign stagger delays to grid children so sibling cards
    // fan in when the whole grid scrolls into view together.
    document.querySelectorAll('.services-grid > .service-card, .blog-grid > .blog-card').forEach(el => {
      const siblings = Array.from(el.parentElement.children);
      el.dataset.staggerDelay = siblings.indexOf(el) * 0.11;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseFloat(e.target.dataset.staggerDelay || 0);
          e.target.style.transitionDelay = `${delay}s`;
          e.target.classList.add('visible');
          // Clear the delay after the reveal so hover transitions feel instant
          const clearAfter = Math.round((550 + delay * 1000) + 60);
          setTimeout(() => { e.target.style.transitionDelay = ''; }, clearAfter);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

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

  // ---- Services blueprint scrollytelling ----
  // Passive IntersectionObserver only — no scroll listeners, no rAF.
  // It flips data-active-stage; CSS handles the opacity cross-fades.
  const scrolly = document.querySelector('.services-scrolly');
  if (scrolly && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const panels = [...scrolly.querySelectorAll('.scrolly-panel[data-stage]')];
    if (panels.length) {
      const mobile = window.matchMedia('(max-width: 900px)').matches;
      const setStage = i => {
        const stage = panels[i].dataset.stage;
        if (scrolly.getAttribute('data-active-stage') !== stage) {
          scrolly.setAttribute('data-active-stage', stage);
        }
      };

      if (mobile) {
        // Mobile: the cards are a stacking deck pinned just under the house
        // banner, each card occupying an EQUAL fixed-height slot (set in CSS).
        // We flip the active stage from the scroll percentage through those
        // equal slots — never from per-panel pixel offsets — so the differing
        // text lengths of FR vs EN can't shift the trigger geometry and open
        // blank gaps. The card pins at top:42vh, so the handoff between card i
        // and card i+1 lands exactly when the slot boundary crosses that pin
        // line: card i exits (75→100% of its slot) while card i+1 enters
        // (0→25% of the next). Flipping the flag at the boundary lets the
        // asymmetric CSS fades (slow out / quick in) cover the handoff.
        const track = scrolly.querySelector('.scrolly-panels');
        const PIN = 0.42; // matches .scrolly-card top:42vh
        let ticking = false;
        const update = () => {
          ticking = false;
          const rect = track.getBoundingClientRect();
          const slot = rect.height / panels.length; // equal slot per card
          if (slot <= 0) return;
          const readLine = window.innerHeight * PIN;
          const pos = (readLine - rect.top) / slot;  // position in slot units
          const idx = Math.max(0, Math.min(panels.length - 1, Math.floor(pos)));
          setStage(idx);
        };
        const onScroll = () => {
          if (!ticking) { ticking = true; requestAnimationFrame(update); }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        update();
      } else {
        // Desktop centres the active panel in the viewport; a passive
        // IntersectionObserver flips the stage as each panel crosses centre.
        const stageObserver = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting && e.target.dataset.stage) {
              scrolly.setAttribute('data-active-stage', e.target.dataset.stage);
            }
          });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
        panels.forEach(p => stageObserver.observe(p));
      }
    }
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

  // ---- Hero drop→flame: precise stroke-dasharray via getTotalLength ----
  const hdmOutline = document.querySelector('.hdm-outline');
  if (hdmOutline) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      hdmOutline.style.strokeDashoffset = '0';
      hdmOutline.style.strokeDasharray = 'none';
      const hdmFlame = document.querySelector('.hdm-flame');
      if (hdmFlame) { hdmFlame.style.opacity = '1'; hdmFlame.style.transform = 'scale(1)'; }
    } else {
      const len = Math.ceil(hdmOutline.getTotalLength());
      hdmOutline.style.strokeDasharray = len;
      hdmOutline.style.strokeDashoffset = len;
    }
  }
});
