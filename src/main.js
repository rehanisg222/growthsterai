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

// ── NUMBER COUNT-UP ANIMATION ─────────────────────────────
function initCountUp() {
  const countEls = document.querySelectorAll('[data-animate="count"]');
  if (!countEls.length) return;

  const parseTarget = (target) => {
    // Extract prefix (e.g. "$"), numeric part, suffix (e.g. "M", "%", "+")
    const prefix      = target.match(/^[^0-9]*/)?.[0] ?? '';
    const rawDigits   = target.replace(/[^0-9.]/g, '');
    const numericPart = parseFloat(rawDigits) || 0;
    const suffix      = target.match(/[^0-9.]*$/)?.[0] ?? '';
    const isFloat     = rawDigits.includes('.');
    return { prefix, numericPart, suffix, isFloat };
  };

  const formatCount = (n, isFloat) => {
    if (isFloat) return n.toFixed(1);
    if (n >= 1000) return Math.round(n).toLocaleString('en-US');
    return Math.round(n).toString();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);

        const rawTarget = el.dataset.countTarget;
        if (!rawTarget) return;

        const { prefix, numericPart, suffix, isFloat } = parseTarget(rawTarget);
        const countEl = el.querySelector('.count-number');
        if (!countEl) return;

        const duration = 1800;
        const start    = performance.now();

        const tick = (now) => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased    = 1 - Math.pow(1 - progress, 3);
          countEl.textContent = prefix + formatCount(numericPart * eased, isFloat) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.3 }
  );

  countEls.forEach((el) => observer.observe(el));
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

// ── HERO PARALLAX ─────────────────────────────────────────
function initHeroParallax() {
  const heroVideo = document.getElementById('hero-video');
  if (!heroVideo) return;

  const update = () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  };

  window.addEventListener('scroll', update, { passive: true });
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

// ── DEMO VIDEO PLACEHOLDER ────────────────────────────────
function initDemoVideo() {
  const prodFrame   = document.querySelector('.prod-frame');
  const placeholder = prodFrame?.querySelector('.demo-placeholder');
  const demoVideo   = prodFrame?.querySelector('video');

  if (demoVideo && placeholder) {
    placeholder.style.display = 'none';
    demoVideo.addEventListener('error', () => {
      demoVideo.style.display  = 'none';
      placeholder.style.display = 'flex';
    });
    const src = demoVideo.querySelector('source')?.getAttribute('src');
    if (!src) placeholder.style.display = 'flex';
  }
}

// ── VIDEO AUTOPLAY FALLBACK ───────────────────────────────
function initVideos() {
  document.querySelectorAll('video')
    .forEach(video => {
      video.muted = true;
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          video.addEventListener(
            'canplay',
            () => video.play(),
            { once: true }
          );
        });
      }
    });
}

function initLazyVideos() {
  const lazy = document.querySelectorAll(
    'video[preload="none"]'
  );
  if (!lazy.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const v = entry.target;
        v.preload = 'auto';
        v.load();
        v.play().catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
        obs.unobserve(v);
      });
    },
    { rootMargin: '800px' }
  );

  lazy.forEach(v => obs.observe(v));
}

function initVisibility() {
  document.addEventListener(
    'visibilitychange', () => {
      document.querySelectorAll('video')
        .forEach(v => {
          document.hidden
            ? v.pause()
            : v.play().catch(() => {});
        });
    }
  );
}

// ── INITIALISE ALL ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initVideos();
  initLazyVideos();
  initVisibility();
  initFeatureRows();
  initScrollAnimations();
  initCountUp();
  initNavScroll();
  initActiveNav();
  initHeroParallax();
  initSmoothScroll();
  initDemoVideo();
});
