/* ============================================
   ARIX PORTFOLIO — script.js
   ============================================ */

/* -----------------------------------------------
   GOOGLE SHEETS APPS SCRIPT CODE
   -----------------------------------------------
   Paste this in Google Apps Script (Extensions > Apps Script):

   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       new Date(),
       data.name,
       data.email,
       data.message
     ]);
     return ContentService
       .createTextOutput(JSON.stringify({ result: 'success' }))
       .setMimeType(ContentService.MimeType.JSON);
   }

   DEPLOYMENT STEPS:
   1. Open Google Sheets → Extensions → Apps Script
   2. Paste the code above
   3. Click Deploy → New Deployment
   4. Type: Web App
   5. Execute as: Me
   6. Access: Anyone
   7. Click Deploy and copy the Web App URL
   8. Paste that URL as the value of SHEETS_URL below

   GOOGLE SHEET STRUCTURE (columns):
   A: Timestamp | B: Name | C: Email | D: Message
----------------------------------------------- */

const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1MgkXI1VZAqS0zIsAmA3LBOTsnm4tUDRzlZDaa9RZ5ec/edit?usp=sharing';

/* ============================================
   CURSOR
   ============================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animRing);
  }
  animRing();

  /* Hover state */
  document.querySelectorAll('a, button, .service-card, .project-frame, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  /* Click state */
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('click'));

  /* Hide on touch */
  document.addEventListener('touchstart', () => {
    cursor.style.display = 'none';
    ring.style.display   = 'none';
    cancelAnimationFrame(raf);
  }, { once: true });
})();

/* ============================================
   NAVIGATION — scroll effects
   ============================================ */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Smooth scroll for nav links */
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ============================================
   MOBILE MENU
   ============================================ */
(function initMobileMenu() {
  const btn   = document.getElementById('menuBtn');
  const menu  = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 320);
    });
  });
})();

/* ============================================
   HERO CANVAS — animated particle field
   ============================================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;
  const COUNT = 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.a  = Math.random() * 0.4 + 0.05;
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  /* Mouse parallax */
  let mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Subtle gradient vignette */
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.7);
    grad.addColorStop(0, 'rgba(40,40,40,0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* Lines between close particles */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(244,241,236,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      /* Mouse attraction */
      const dx   = particles[i].x - mx;
      const dy   = particles[i].y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(244,241,236,${0.06 * (1 - dist / 180)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    /* Dots */
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244,241,236,${p.a})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });
})();

/* ============================================
   SCROLL REVEAL
   ============================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger children */
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach((el, i) => {
    el.dataset.delay = i % 3 * 80; /* stagger siblings */
    obs.observe(el);
  });
})();

/* ============================================
   PARALLAX — project rows on scroll
   ============================================ */
(function initParallax() {
  const rows = document.querySelectorAll('.project-frame');
  if (!rows.length || window.matchMedia('(max-width: 900px)').matches) return;

  function onScroll() {
    const sy = window.scrollY;
    rows.forEach(row => {
      const rect   = row.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const vy     = (window.innerHeight / 2 - center) * 0.04;
      row.querySelector('.project-placeholder').style.transform =
        `translateY(${vy}px)`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================
   CONTACT FORM → GOOGLE SHEETS
   ============================================ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitText');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* Basic validation */
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return;

    /* Loading state */
    btn.disabled = true;
    btnText.textContent = 'Sending…';
    success.classList.remove('show');
    error.classList.remove('show');

    const payload = JSON.stringify({ name, email, message });

    /* If no Google Sheets URL, show success after short delay (demo mode) */
    if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      await sleep(1200);
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      form.reset();
      success.classList.add('show');
      return;
    }

    try {
      const res = await fetch(SHEETS_URL, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Network error');

      btn.disabled = false;
      btnText.textContent = 'Send Message';
      form.reset();
      success.classList.add('show');

      /* Auto-hide success after 6 seconds */
      setTimeout(() => success.classList.remove('show'), 6000);

    } catch (err) {
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      error.classList.add('show');
      setTimeout(() => error.classList.remove('show'), 6000);
    }
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();

/* ============================================
   MARQUEE — pause on hover
   ============================================ */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const wrap = track.parentElement;
  wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();
