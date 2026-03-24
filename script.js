/* ============================================================
   PORTFOLIO APP — script.js
   All interactivity, animations & scroll effects
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. DOM REFERENCES
───────────────────────────────────────── */
const screen       = document.getElementById('screen');
const hamburger    = document.getElementById('hamburger');
const sideMenu     = document.getElementById('sideMenu');
const sideOverlay  = document.getElementById('sideOverlay');
const menuClose    = document.getElementById('menuClose');
const themeToggle  = document.getElementById('themeToggle');
const cursorDot    = document.getElementById('cursorDot');
const cursorRing   = document.getElementById('cursorRing');
const canvas       = document.getElementById('particleCanvas');
const ctx          = canvas.getContext('2d');
const typedEl      = document.getElementById('typed');
const procItems    = document.querySelectorAll('.proc-item');
const navItems     = document.querySelectorAll('[data-nav]');
const sections     = ['home', 'about', 'projects', 'skills', 'process', 'contact'];

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

hamburger.addEventListener('click', () => {
  sideMenu.classList.contains('open') ? closeMenu() : openMenu();
});

menuClose.addEventListener('click', closeMenu);
sideOverlay.addEventListener('click', closeMenu);

// Close with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ─────────────────────────────────────────
   3. THEME TOGGLE (LIGHT / DARK)
───────────────────────────────────────── */
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  document.body.classList.toggle('dark', isDark);
  // Restart particles with correct colors
  initParticles();
});

/* ─────────────────────────────────────────
   4. SMOOTH SCROLL TO SECTION
───────────────────────────────────────── */
function goTo(id) {
  const el = document.getElementById(id);
  if (!el || !screen) return;
  const offset = el.offsetTop - 64;
  screen.scrollTo({ top: offset, behavior: 'smooth' });
  updateActiveNav(id);
}

/* ─────────────────────────────────────────
   5. ACTIVE NAV HIGHLIGHT (SCROLL SPY)
───────────────────────────────────────── */
function updateActiveNav(id) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.nav === id));
}

function detectCurrentSection() {
  const scrollTop = screen.scrollTop;
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
  topbar.classList.toggle('scrolled', screen.scrollTop > 40);
}

screen.addEventListener('scroll', () => {
  detectCurrentSection();
  handleTopbarScroll();
  animateOnScroll();
  parallaxOrbs();
});

/* ─────────────────────────────────────────
   6. TYPED TEXT ANIMATION
───────────────────────────────────────── */
const WORDS = ['Experiences', 'Products', 'Interfaces', 'Journeys', 'Stories'];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingPaused = false;

function typeLoop() {
  if (typingPaused) return;

  const word   = WORDS[wordIdx];
  const speed  = isDeleting ? 60 : 90;
  const pause  = isDeleting ? 0 : 1800;

  if (!isDeleting && charIdx < word.length) {
    typedEl.textContent = word.slice(0, ++charIdx);
  } else if (isDeleting && charIdx > 0) {
    typedEl.textContent = word.slice(0, --charIdx);
  } else if (!isDeleting && charIdx === word.length) {
    isDeleting = true;
    typingPaused = true;
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
  let current  = 0;
  const start  = performance.now();

  function step(ts) {
    const pct = Math.min((ts - start) / duration, 1);
    // Easing: ease-out cubic
    const eased = 1 - Math.pow(1 - pct, 3);
    current = Math.round(eased * target);
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

// Also try on screen scroll
screen.addEventListener('scroll', tryStartCounters);
setTimeout(tryStartCounters, 800);

/* ─────────────────────────────────────────
   8. SKILL BARS (ANIMATE ON SCROLL)
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
      setTimeout(() => {
        fill.style.width = fill.dataset.w + '%';
      }, i * 100 + 100);
    });
  }
}

screen.addEventListener('scroll', tryAnimateSkills);
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
   11. SCROLL REVEAL (IntersectionObserver)
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
      const delay = parseInt(el.dataset.delay || 0);
      if (rect.top < window.innerHeight - 40) {
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  });
}

// Also trigger on page load
setTimeout(animateOnScroll, 300);

/* ─────────────────────────────────────────
   12. PROJECT CARD 3D TILT
───────────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const xPct  = (e.clientX - rect.left) / rect.width  - 0.5;
    const yPct  = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${xPct * 8}deg) rotateX(${-yPct * 5}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─────────────────────────────────────────
   13. MAGNETIC BUTTONS
───────────────────────────────────────── */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect   = btn.getBoundingClientRect();
    const dx     = e.clientX - (rect.left + rect.width  / 2);
    const dy     = e.clientY - (rect.top  + rect.height / 2);
    const maxPull = 10;
    const pullX  = dx * 0.3;
    const pullY  = dy * 0.3;
    const clampX = Math.max(-maxPull, Math.min(maxPull, pullX));
    const clampY = Math.max(-maxPull, Math.min(maxPull, pullY));
    btn.style.transform = `translate(${clampX}px, ${clampY}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─────────────────────────────────────────
   14. CUSTOM CURSOR
───────────────────────────────────────── */
let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;
let rAF    = null;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!rAF) rAF = requestAnimationFrame(moveCursor);
});

function moveCursor() {
  rAF = null;
  // Dot: instant
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';

  // Ring: lerp for smooth lag
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  rAF = requestAnimationFrame(moveCursor);
}

// Hover states
document.querySelectorAll('button, a, .nav-item, .proj-card, .faq-q, .svc-item, .stat-card, [data-faq]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovered');
    cursorRing.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovered');
    cursorRing.classList.remove('hovered');
  });
});

/* ─────────────────────────────────────────
   15. PARTICLE CANVAS
───────────────────────────────────────── */
let particles = [];
const PARTICLE_COUNT = 60;

class Particle {
  constructor() { this.reset(true); }

  reset(random = false) {
    this.x    = Math.random() * canvas.width;
    this.y    = random ? Math.random() * canvas.height : canvas.height + 10;
    this.r    = Math.random() * 2 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = -(Math.random() * 0.5 + 0.2);
    this.alpha= Math.random() * 0.5 + 0.1;
    this.life = Math.random() * 300 + 150;
    this.age  = random ? Math.random() * this.life : 0;
    this.color= this.pickColor();
    this.pulse= Math.random() * Math.PI * 2; // phase
  }

  pickColor() {
    const colors = ['200,255,87', '123,104,238', '255,107,157', '78,205,196'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    this.pulse += 0.05;
    const lifeRatio = this.age / this.life;
    this.currentAlpha = this.alpha * Math.sin(lifeRatio * Math.PI);
    if (this.age > this.life) this.reset();
  }

  draw() {
    const glow = 1 + Math.sin(this.pulse) * 0.3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * glow, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.currentAlpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.06;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(200,255,87,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
drawParticles();

/* ─────────────────────────────────────────
   16. PARALLAX FLOATING ORBS ON SCROLL
───────────────────────────────────────── */
function parallaxOrbs() {
  const scrollPct = screen.scrollTop / (screen.scrollHeight - screen.clientHeight);
  const shapes    = document.querySelectorAll('.fshape');

  shapes.forEach((sh, i) => {
    const depth = (i + 1) * 0.4;
    const yOff  = screen.scrollTop * depth * 0.1;
    const scale = 1 + scrollPct * 0.2;
    // Each shape drifts at a different rate
    const xOff  = Math.sin(scrollPct * Math.PI * (i + 1)) * 8;
    sh.style.transform = `translate(${xOff}px, ${yOff}px) scale(${scale})`;
  });
}

/* ─────────────────────────────────────────
   17. HORIZONTAL SCROLL MOMENTUM
         (Project & Testimonial carousels)
───────────────────────────────────────── */
function addMomentumScroll(el) {
  if (!el) return;
  let isDown = false;
  let startX, scrollLeft;

  el.addEventListener('mousedown', e => {
    isDown = true;
    el.style.cursor = 'grabbing';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mouseup',    () => { isDown = false; el.style.cursor = ''; });

  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.6;
    el.scrollLeft = scrollLeft - walk;
  });
}

addMomentumScroll(document.getElementById('projectScroll'));
addMomentumScroll(document.querySelector('.testi-scroll'));

/* ─────────────────────────────────────────
   18. STAT CARD RIPPLE ON CLICK
───────────────────────────────────────── */
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:80px; height:80px;
      background:rgba(200,255,87,0.15);
      transform:translate(-50%,-50%) scale(0);
      left:${e.offsetX}px; top:${e.offsetY}px;
      animation: rippleOut 0.6s ease-out forwards;
      pointer-events:none;
    `;
    // Inject keyframes once
    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id    = 'rippleStyle';
      style.textContent = `
        @keyframes rippleOut {
          to { transform:translate(-50%,-50%) scale(4); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ─────────────────────────────────────────
   19. SERVICE ITEM ICON BOUNCE ON HOVER
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   20. FLOATING TESTIMONIAL CARD TILT
───────────────────────────────────────── */
document.querySelectorAll('.testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width  - 0.5;
    const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(500px) rotateY(${xPct * 6}deg) rotateX(${-yPct * 4}deg) translateY(-3px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─────────────────────────────────────────
   21. TAG STAGGER ANIMATION ON ABOUT CARD
───────────────────────────────────────── */
function animateTags() {
  const tags = document.querySelectorAll('.hover-tag');
  tags.forEach((tag, i) => {
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
   22. GLOWING TOPBAR LOGO ON HOVER
───────────────────────────────────────── */
const logo = document.querySelector('.logo');
logo.addEventListener('mouseenter', () => {
  logo.style.textShadow = '0 0 16px rgba(200,255,87,0.6)';
  logo.style.letterSpacing = '0.14em';
  logo.style.transition = 'all 0.3s ease';
});
logo.addEventListener('mouseleave', () => {
  logo.style.textShadow = '';
  logo.style.letterSpacing = '';
});

/* ─────────────────────────────────────────
   23. PHONE FRAME PAUSE FLOAT ON HOVER
───────────────────────────────────────── */
const phoneWrap = document.querySelector('.phone-wrap');
phoneWrap.addEventListener('mouseenter', () => {
  phoneWrap.style.animation = 'none';
});
phoneWrap.addEventListener('mouseleave', () => {
  phoneWrap.style.animation = 'phoneFloat 8s ease-in-out infinite';
});

/* ─────────────────────────────────────────
   24. SCROLL PROGRESS INDICATOR
───────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
progressBar.style.cssText = `
  position: sticky;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, #c8ff57, #7b68ee, #ff6b9d);
  z-index: 999;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
`;
document.querySelector('.phone-screen').insertBefore(progressBar, document.querySelector('.phone-screen').firstChild);

screen.addEventListener('scroll', () => {
  const max  = screen.scrollHeight - screen.clientHeight;
  const pct  = (screen.scrollTop / max) * 100;
  progressBar.style.width = pct + '%';
});

/* ─────────────────────────────────────────
   25. INITIAL PAGE LOAD REVEAL
───────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Fade in phone frame
  const frame = document.querySelector('.phone-frame');
  frame.style.opacity = '0';
  frame.style.transform = 'translateY(30px)';
  frame.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
  setTimeout(() => {
    frame.style.opacity = '1';
    frame.style.transform = 'translateY(0)';
  }, 150);

  // Trigger initial scroll-reveal
  setTimeout(animateOnScroll, 500);
});

/* ─────────────────────────────────────────
   26. SOCIAL BUTTON WAVE ANIMATION
───────────────────────────────────────── */
document.querySelectorAll('.soc-btn').forEach((btn, i) => {
  btn.addEventListener('mouseenter', () => {
    btn.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-8px) rotate(-8deg)' },
      { transform: 'translateY(-5px) rotate(5deg)' },
      { transform: 'translateY(-5px) rotate(-5deg)' }
    ], { duration: 350, easing: 'ease-out', fill: 'none' });
  });
});

/* ─────────────────────────────────────────
   27. ABOUT CARD AVATAR SPARK ON HOVER
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   28. BOTTOM NAV CLICK RIPPLE
───────────────────────────────────────── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    this.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.88)' },
      { transform: 'scale(1.04)' },
      { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
  });
});
