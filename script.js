/* ==============================================================
   MOBILE MENU TOGGLE
   ============================================================== */
(function() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const body = document.body;
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.classList.add('active');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
  }

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // Close menu when a link is tapped
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  // Close menu when window is resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880 && menu.classList.contains('open')) closeMenu();
  });
})();

/* ==============================================================
   NAV — sticky with scroll-up reveal
   ============================================================== */
(function() {
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const y = window.scrollY;
    if (y > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (y > 200 && y > lastY) nav.classList.add('hidden');
    else nav.classList.remove('hidden');

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  });
})();

/* ==============================================================
   SCROLL REVEAL
   ============================================================== */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
})();

/* ==============================================================
   PORTFOLIO FILTERING
   ============================================================== */
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ==============================================================
   FAQ ACCORDION
   ============================================================== */
(function() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked one (if it wasn't open)
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ==============================================================
   FORM HANDLING — submits to Formspree via fetch (AJAX)
   so the user stays on the page and sees the success animation.
   The endpoint is read from the form's `action` attribute.
   ============================================================== */
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;

    // Prevent double-submits while in flight
    if (btn.disabled) return;
    btn.disabled = true;

    btn.innerHTML = 'Sending... ↗';
    btn.style.background = 'var(--accent)';

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' } // Formspree returns JSON when this is set
      });

      if (response.ok) {
        // Success
        btn.innerHTML = '✓ Got it — I\'ll be in touch';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      } else {
        // Formspree returned an error (e.g. validation, rate-limit)
        let msg = '✗ Something went wrong — try again';
        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length) {
            msg = '✗ ' + data.errors.map(err => err.message).join(', ');
          }
        } catch (_) { /* ignore JSON parse errors */ }
        btn.innerHTML = msg;
        btn.style.background = '#c4391c';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }
    } catch (err) {
      // Network error
      btn.innerHTML = '✗ Network error — try again';
      btn.style.background = '#c4391c';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
})();

/* ==============================================================
   FOOTER YEAR
   ============================================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ==============================================================
   SMOOTH SCROLL FOR NAV LINKS (already set in CSS, this offsets the sticky nav)
   ============================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
