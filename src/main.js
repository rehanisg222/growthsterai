import './style.css';
import './form.js';

// ── FEATURE ROW DATA ──────────────────────────────────────
const FEATURE_IMAGES = [
  '/images/feature-brand-intel.png',
  '/images/feature-creative-studio.png',
  '/images/feature-command-center.png',
  '/images/feature-analytics.png',
  '/images/feature-automation.png',
];

const FEATURE_NAMES = [
  'Brand Intelligence',
  'Creative Studio',
  'AI Command Center',
  'Live Analytics',
  'Full Automation',
];

// ── FEATURE ROW INTERACTIVITY ─────────────────────────────
function initFeatureRows() {
  const rows        = document.querySelectorAll('.feat-row');
  const img         = document.getElementById('feat-img');
  const placeholder = document.getElementById('feat-placeholder');

  if (!rows.length || !img) return;

  // Hide placeholder initially — show only on error
  if (placeholder) placeholder.style.display = 'none';

  rows.forEach((row, i) => {
    // Keyboard: Enter / Space triggers click
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });

    row.addEventListener('click', () => {
      // Update active tab state
      rows.forEach((r) => {
        r.classList.remove('active');
        r.setAttribute('aria-selected', 'false');
      });
      row.classList.add('active');
      row.setAttribute('aria-selected', 'true');

      // Crossfade to new image
      img.style.opacity = '0';

      setTimeout(() => {
        img.alt  = `${FEATURE_NAMES[i]} visualization`;
        img.src  = FEATURE_IMAGES[i];

        img.onload = () => {
          img.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
          img.style.opacity = '1';
        };

        img.onerror = () => {
          img.style.display = 'none';
          if (placeholder) {
            const fn = placeholder.querySelector('.feat-placeholder-filename');
            if (fn) fn.textContent = FEATURE_IMAGES[i].replace('/images/', '');
            placeholder.style.display = 'flex';
          }
        };
      }, 120);
    });
  });
}

// ── SCROLL ANIMATIONS ─────────────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  els.forEach((el) => observer.observe(el));
}


// ── NAV SCROLL BEHAVIOUR ──────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 80) {
      nav.style.borderBottomColor = 'var(--b2)';
      nav.style.background        = 'rgba(42,42,40,0.99)';
    } else {
      nav.style.borderBottomColor = 'var(--b1)';
      nav.style.background        = 'rgba(42,42,40,0.97)';
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── ACTIVE NAV LINK HIGHLIGHT ─────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-center .nl');
  if (!sections.length || !navLinks.length) return;

  const sectionMap = { features: 0, process: 1 };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sectionMap[entry.target.id];
          if (idx !== undefined) {
            navLinks.forEach((link, i) => {
              link.style.color = i === idx ? 'var(--t1)' : 'var(--t3)';
            });
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

// ── SMOOTH SCROLL FOR NAV LINKS ───────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('.nav-center a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── IMAGE FADE-IN ─────────────────────────────────
function initImageFadeIn() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load',  () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });
}

// ── INITIALISE ALL ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initImageFadeIn();
  initFeatureRows();
  initScrollAnimations();
  initNavScroll();
  initActiveNav();
  initSmoothScroll();
});
