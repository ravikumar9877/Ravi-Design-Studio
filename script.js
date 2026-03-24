/* ============================================================
   PORTFOLIO — script.js  (RESPONSIVE VERSION)
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────
   1. DOM REFERENCES
───────────────────────────────────────── */
const siteWrap    = document.getElementById('screen'); // now .site-wrap
const hamburger   = document.getElementById('hamburger');
const sideMenu    = document.getElementById('sideMenu');
const sideOverlay = document.getElementById('sideOverlay');
const menuClose   = document.getElementById('menuClose');
const themeToggle = document.getElementById('themeToggle');
const cursorDot   = document.getElementById('cursorDot');
const cursorRing  = document.getElementById('cursorRing');
const canvas      = document.getElementById('particleCanvas');
const ctx         = canvas.getContext('2d');
const typedEl     = document.getElementById('typed');
const procItems   = document.querySelectorAll('.proc-item');
const navItems    = document.querySelectorAll('[data-nav]');
const dnav        = document.querySelectorAll('.dnav-link');
const sections    = ['home', 'about', 'projects', 'skills', 'process', 'contact'];

/* ─────────────────────────────────────────
   2. SIDE MENU
───────────────────────────────────────── */
function openMenu() {
  sideMenu.classList.add('open');
  sideOverlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  sideMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  sideMenu.classList.remove('open');
  sideOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  sideMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
  sideMenu.classList.contains('open') ? closeMenu() : openMenu();
});

menuClose.addEventListener('click', closeMenu);
sideOverlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ─────────────────────────────────────────
   3. THEME TOGGLE
───────────────────────────────────────── */
let isDark = true;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  document.body.classList.toggle('dark',  isDark);
  initParticles();
});

/* ─────────────────────────────────────────
   4. SMOOTH SCROLL (now uses window scroll)
───────────────────────────────────────── */
function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Account for sticky topbar height (64px)
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: 'smooth' });
  updateActiveNav(id);
}

/* ─────────────────────────────────────────
   5. ACTIVE NAV HIGHLIGHT (scroll-spy)
───────────────────────────────────────── */
function updateActiveNav(id) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.nav === id));
  dnav.forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.classList.toggle('active', href === id);
  });
}

function detectCurrentSection() {
  const scrollTop = window.scrollY;
  let current = sections[0];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop - 140 <= scrollTop) current = id;
  });
  updateActiveNav(current);
}

/* Topbar shrink on scroll */
const topbar = document.getElementById('topbar');
function handleTopbarScroll() {
  topbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', () => {
  detectCurrentSection();
  handleTopbarScroll();
  animateOnScroll();
  parallaxOrbs();
  tryStartCounters();
  tryAnimateSkills();
  updateScrollProgress();
});

/* ─────────────────────────────────────────
   6. TYPED TEXT
───────────────────────────────────────── */
const WORDS = ['Experiences', 'Products', 'Interfaces', 'Journeys', 'Stories'];
let wordIdx = 0, charIdx = 0, isDeleting = false, typingPaused = false;

function typeLoop() {
  if (typingPaused) return;
  const word  = WORDS[wordIdx];
  const speed = isDeleting ? 60 : 90;
  const pause = isDeleting ? 0 : 1800;

  if (!isDeleting && charIdx < word.length) {
    typedEl.textContent = word.slice(0, ++charIdx);
  } else if (isDeleting && charIdx > 0) {
    typedEl.textContent = word.slice(0, --charIdx);
  } else if (!isDeleting && charIdx === word.length) {
    isDeleting = true; typingPaused = true;
    setTimeout(() => { typingPaused = false; typeLoop(); }, pause);
    return;
  } else {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % WORDS.length;
  }
  setTimeout(typeLoop, speed);
}
setTimeout(typeLoop, 1000);

/* ─────────────────────────────────────────
   7. ANIMATED COUNTERS
───────────────────────────────────────── */
function animateCounter(el, target, suffix, duration = 1400) {
  let current = 0;
  const start = performance.now();
  function step(ts) {
    const pct   = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    current     = Math.round(eased * target);
    el.innerHTML = current + suffix;
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

let countersStarted = false;
function tryStartCounters() {
  if (countersStarted) return;
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;
  const rect = statsGrid.getBoundingClientRect();
  if (rect.top < window.innerHeight + 200) {
    countersStarted = true;
    animateCounter(document.getElementById('cnt1'), 400, '<em>k+</em>', 1600);
    animateCounter(document.getElementById('cnt2'),  20, '<em>k+</em>', 1300);
    animateCounter(document.getElementById('cnt3'), 230, '<em>+</em>',  1800);
  }
}
setTimeout(tryStartCounters, 800);

/* ─────────────────────────────────────────
   8. SKILL BARS
───────────────────────────────────────── */
let skillsDone = false;
function tryAnimateSkills() {
  if (skillsDone) return;
  const list = document.getElementById('skillList');
  if (!list) return;
  const rect = list.getBoundingClientRect();
  if (rect.top < window.innerHeight + 100) {
    skillsDone = true;
    document.querySelectorAll('.skill-fill').forEach((fill, i) => {
      setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, i * 100 + 100);
    });
  }
}
setTimeout(tryAnimateSkills, 1000);

/* ─────────────────────────────────────────
   9. FAQ ACCORDION
───────────────────────────────────────── */
document.querySelectorAll('[data-faq]').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('[data-faq]').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─────────────────────────────────────────
   10. PROCESS STEP AUTO-CYCLE
───────────────────────────────────────── */
let procIdx = 0;
setInterval(() => {
  procItems.forEach(p => p.classList.remove('active'));
  procIdx = (procIdx + 1) % procItems.length;
  procItems[procIdx].classList.add('active');
}, 2200);

/* ─────────────────────────────────────────
   11. SCROLL REVEAL (window-based)
───────────────────────────────────────── */
function animateOnScroll() {
  const revealClasses = [
    '.reveal-up', '.reveal-left', '.reveal-scale',
    '.reveal-skill', '.reveal-svc', '.reveal-proj',
    '.reveal-proc', '.reveal-testi', '.reveal-faq'
  ];
  revealClasses.forEach(cls => {
    document.querySelectorAll(cls + ':not(.visible)').forEach(el => {
      const rect  = el.getBoundingClientRect();
      const delay = parseInt(el.dataset.delay || '0', 10);
      if (rect.top < window.innerHeight - 60) {
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  });
}

/* ─────────────────────────────────────────
   12. MAGNETIC CURSOR
───────────────────────────────────────── */
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverEls = document.querySelectorAll('button, a, .nav-item, .stat-card, .proj-card, .svc-item, .testi-card, .faq-q, .tag');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => { cursorDot.classList.add('hovered'); cursorRing.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovered'); cursorRing.classList.remove('hovered'); });
});

/* Magnetic pull on buttons */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width  - 0.5;
    const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
    btn.style.transform = `translate(${xPct * 10}px, ${yPct * 6}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ─────────────────────────────────────────
   13. PARTICLE CANVAS
───────────────────────────────────────── */
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  const count = Math.min(60, Math.floor(window.innerWidth / 20));
  const color = isDark ? 'rgba(200,255,87,' : 'rgba(100,100,200,';
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.6 + 0.1,
      color
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.a + ')';
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();
drawParticles();

/* ─────────────────────────────────────────
   14. PARALLAX FLOATING ORBS
───────────────────────────────────────── */
function parallaxOrbs() {
  const max    = document.body.scrollHeight - window.innerHeight;
  const pct    = window.scrollY / (max || 1);
  const shapes = document.querySelectorAll('.fshape');
  shapes.forEach((sh, i) => {
    const depth = (i + 1) * 0.4;
    const yOff  = window.scrollY * depth * 0.08;
    const xOff  = Math.sin(pct * Math.PI * (i + 1)) * 8;
    sh.style.transform = `translate(${xOff}px, ${yOff}px)`;
  });
}

/* ─────────────────────────────────────────
   15. HORIZONTAL SCROLL (drag)
───────────────────────────────────────── */
function addMomentumScroll(el) {
  if (!el) return;
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => { isDown = true; el.style.cursor = 'grabbing'; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
  el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mouseup',    () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.6;
  });
}
addMomentumScroll(document.getElementById('projectScroll'));
addMomentumScroll(document.querySelector('.testi-scroll'));

/* ─────────────────────────────────────────
   16. SCROLL PROGRESS BAR
───────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
progressBar.style.cssText = `
  position: fixed; top: 64px; left: 0;
  height: 2px; width: 0%;
  background: linear-gradient(90deg, #c8ff57, #7b68ee, #ff6b9d);
  z-index: 999; transition: width 0.1s linear;
  border-radius: 0 2px 2px 0; pointer-events: none;
`;
document.body.appendChild(progressBar);

function updateScrollProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = ((window.scrollY / max) * 100) + '%';
}

/* ─────────────────────────────────────────
   17. STAT CARD RIPPLE
───────────────────────────────────────── */
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%; width:80px; height:80px;
      background:rgba(200,255,87,0.15); pointer-events:none;
      transform:translate(-50%,-50%) scale(0);
      left:${e.offsetX}px; top:${e.offsetY}px;
      animation:rippleOut 0.6s ease-out forwards;
    `;
    if (!document.getElementById('rippleStyle')) {
      const s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = '@keyframes rippleOut { to { transform:translate(-50%,-50%) scale(4); opacity:0; } }';
      document.head.appendChild(s);
    }
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ─────────────────────────────────────────
   18. MISC INTERACTIONS
───────────────────────────────────────── */
// Service icon bounce
document.querySelectorAll('.svc-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const icon = item.querySelector('.svc-icon');
    icon.animate([
      { transform: 'rotate(-6deg) scale(1.1) translateY(-2px)' },
      { transform: 'rotate(6deg)  scale(1.1) translateY(-4px)' },
      { transform: 'rotate(-3deg) scale(1.05) translateY(-2px)' },
      { transform: 'rotate(0deg)  scale(1)   translateY(0)' }
    ], { duration: 400, easing: 'ease-out' });
  });
});

// Testimonial card tilt
document.querySelectorAll('.testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width  - 0.5;
    const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${xPct * 6}deg) rotateX(${-yPct * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Social btn wave
document.querySelectorAll('.soc-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-8px) rotate(-8deg)' },
      { transform: 'translateY(-5px) rotate(5deg)' },
      { transform: 'translateY(-5px) rotate(-5deg)' }
    ], { duration: 350, easing: 'ease-out', fill: 'none' });
  });
});

// About avatar spark
const aboutAv = document.querySelector('.about-av');
if (aboutAv) {
  aboutAv.addEventListener('mouseenter', () => {
    aboutAv.animate([
      { transform: 'scale(1)    rotate(0deg)' },
      { transform: 'scale(1.08) rotate(3deg)' },
      { transform: 'scale(1.05) rotate(-2deg)' },
      { transform: 'scale(1)    rotate(0deg)' }
    ], { duration: 500, easing: 'ease-out' });
  });
}

// Bottom nav ripple
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    this.animate([
      { transform: 'scale(1)' }, { transform: 'scale(0.88)' },
      { transform: 'scale(1.04)' }, { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
  });
});

// Tag stagger
function animateTags() {
  document.querySelectorAll('.hover-tag').forEach((tag, i) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(10px)';
    setTimeout(() => {
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      tag.style.opacity = '1';
      tag.style.transform = 'translateY(0)';
    }, 800 + i * 80);
  });
}
setTimeout(animateTags, 400);

/* ─────────────────────────────────────────
   19. PAGE LOAD REVEAL
───────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
    animateOnScroll();
  }, 100);
});

// Initial trigger
setTimeout(animateOnScroll, 500);
