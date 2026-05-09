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
   FORM HANDLING — replace with your backend/Formspree/etc.
   ============================================================== */
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    btn.innerHTML = 'Sending... ↗';
    btn.style.background = 'var(--accent)';
    setTimeout(() => {
      btn.innerHTML = '✓ Got it — I\'ll be in touch';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
      }, 3500);
    }, 900);
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
