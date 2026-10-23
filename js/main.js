/**
 * Pulse Music - Landing Page JavaScript
 */

// Idempotent initialization guard
if (typeof window.__PULSE_MAIN_INITIALIZED === 'undefined') {
  window.__PULSE_MAIN_INITIALIZED = true;

// Configuration Constants
const CONFIG = {
  DOWNLOAD_URL: "https://github.com/chriz-3656/Pulse-Music/releases/latest",
  GITHUB_URL: "https://github.com/chriz-3656/Pulse-Music"
};

// GitHub's unauthenticated API allows 60 requests per hour per IP. Cache the
// few public responses we need for 10 minutes so a page visit does not burn
// through that budget. No token or credential is ever stored or exposed.
const CACHE_TTL = 10 * 60 * 1000;
const CACHE_PREFIX = 'pulse_github_cache_v1:';

function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.cachedAt !== 'number' || Date.now() - entry.cachedAt > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      cachedAt: Date.now(),
      data
    }));
  } catch (e) {
    // Storage can be unavailable in private windows or when the quota is full.
  }
}

async function fetchCachedJSON(url, cacheKey) {
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github+json' }
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }
  const data = await response.json();
  writeCache(cacheKey, data);
  return data;
}

/**
 * Clean URL: automatically hide .html and /index.html in the address bar
 * and normalize directory subpages with trailing slash.
 */
function cleanAddressBarUrl() {
  try {
    const loc = window.location;
    let path = loc.pathname;
    if (path.endsWith('/index.html')) {
      path = path.replace(/\/index\.html$/, '/');
    } else if (path.endsWith('index.html')) {
      path = path.replace(/index\.html$/, '');
      if (!path) path = '/';
    } else if (path.endsWith('.html')) {
      const base = path.replace(/\.html$/, '');
      path = base.endsWith('/') ? base : base + '/';
    } else {
      const lastSeg = path.split('/').pop();
      if (!path.endsWith('/') && lastSeg && !lastSeg.includes('.')) {
        path = path + '/';
      }
    }
    if (path !== loc.pathname) {
      window.history.replaceState(null, '', path + loc.search + loc.hash);
    }
  } catch (e) {
    // Graceful fallback for restricted environments
  }
}
cleanAddressBarUrl();

document.addEventListener('DOMContentLoaded', () => {
  cleanAddressBarUrl();
  initThemeSelector();
  initNavigation();
  initScrollReveal();
  initVUMeter();
  initInteractivePlayer();
  initTeleprompter();
  initFAQAccordion();
  initFooterYear();
  setupLinks();
  fetchLatestRelease();
  fetchDeveloperInfo();
});

/**
 * Fetch developer profile from GitHub
 */
async function fetchDeveloperInfo() {
  try {
    const data = await fetchCachedJSON('https://api.github.com/users/chriz-3656', 'developer');

    const avatarEl = document.getElementById('dev-avatar');
    const nameEl = document.getElementById('dev-name');
    const bioEl = document.getElementById('dev-bio');
    const reposEl = document.getElementById('dev-repos');
    const followersEl = document.getElementById('dev-followers');

    if (avatarEl && data.avatar_url) {
      const separator = data.avatar_url.includes('?') ? '&' : '?';
      avatarEl.src = `${data.avatar_url}${separator}s=150`;
      avatarEl.srcset = `${data.avatar_url}${separator}s=150 1x, ${data.avatar_url}${separator}s=300 2x`;
    }
    if (nameEl) nameEl.textContent = data.name || data.login;
    if (bioEl && data.bio) bioEl.textContent = data.bio;
    if (reposEl) reposEl.textContent = data.public_repos;
    if (followersEl) followersEl.textContent = data.followers;
  } catch (error) {
    console.warn('Failed to fetch developer info; keeping static fallback.', error);
  }
}

/**
 * Fetch latest release from GitHub
 */
async function fetchLatestRelease() {
  try {
    const data = await fetchCachedJSON(
      'https://api.github.com/repos/chriz-3656/Pulse-Music/releases/latest',
      'latest-release'
    );
    const apkAsset = data.assets && data.assets.find(asset =>
      asset.name.endsWith('.apk') && !asset.name.includes('-debug')
    );

    if (apkAsset) {
      CONFIG.DOWNLOAD_URL = apkAsset.browser_download_url;
      setupLinks(); // Refresh links with the current APK URL

      // Update total downloads indicator. Version text stays static so the page
      // never displays an older GitHub tag than the site's stated app version.
      const downloadCountEl = document.getElementById('download-count');
      if (downloadCountEl && apkAsset.download_count !== undefined) {
        downloadCountEl.textContent = `${apkAsset.download_count.toLocaleString()} DOWNLOADS`;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch latest release; keeping static fallback links.', error);
  }
}

/**
 * Mobile Navigation setup
 */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu(true);
      }
    });
  }

  function setMenuInert(isInert) {
    mobileNav.inert = isInert;
    if (isInert) {
      mobileNav.setAttribute('inert', '');
      mobileNav.setAttribute('aria-hidden', 'true');
    } else {
      mobileNav.removeAttribute('inert');
      mobileNav.setAttribute('aria-hidden', 'false');
    }
  }

  function openMenu() {
    mobileNav.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    setMenuInert(false);
    // Transform hamburger icon to X
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(8px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
  }

  function closeMenu(returnFocus) {
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    setMenuInert(true);
    // Reset hamburger icon
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
    if (returnFocus) hamburger.focus();
  }

  // Start with the menu out of the tab order even if the markup attribute was
  // omitted by a template or an old cached copy.
  if (hamburger && mobileNav) {
    setMenuInert(true);
  }
}

/**
 * IntersectionObserver for scroll reveal animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * Hi-Fi VU Meter Animation
 */
function initVUMeter() {
  const vuLeft = document.getElementById('vu-left');
  const vuRight = document.getElementById('vu-right');
  
  if (!vuLeft || !vuRight) return;
  
  const numBars = 12;
  const barsLeft = [];
  const barsRight = [];
  
  // Create bars
  for (let i = 0; i < numBars; i++) {
    const lBar = document.createElement('div');
    lBar.className = 'vu-bar';
    vuLeft.appendChild(lBar);
    barsLeft.push(lBar);
    
    const rBar = document.createElement('div');
    rBar.className = 'vu-bar';
    vuRight.appendChild(rBar);
    barsRight.push(rBar);
  }
  
  const hifiSection = document.getElementById('hifi');
  let animationId = null;
  let isPlaying = false;
  
  // Update function to simulate audio levels
  function updateVU() {
    if (!isPlaying) return;
    
    const updateSide = (bars) => {
      // Simulate level jumping between 2 and 10 mostly
      const level = Math.random() > 0.1 ? Math.floor(Math.random() * 7) + 3 : Math.floor(Math.random() * 12);
      
      bars.forEach((bar, index) => {
        bar.classList.remove('active', 'warning', 'danger');
        if (index <= level) {
          bar.classList.add('active');
          if (index >= 8 && index < 10) bar.classList.add('warning');
          if (index >= 10) bar.classList.add('danger');
          bar.style.height = `${(index + 1) * 8}%`;
        } else {
          bar.style.height = '10%'; // rest state
        }
      });
    };
    
    updateSide(barsLeft);
    // Add slight delay/difference for right channel
    setTimeout(() => updateSide(barsRight), 50);
    
    // Slow down the update rate for a more analog feel
    setTimeout(() => {
      animationId = requestAnimationFrame(updateVU);
    }, 100);
  }
  
  // Only animate when section is in view
  const vuObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isPlaying = true;
        updateVU();
      } else {
        isPlaying = false;
        if (animationId) cancelAnimationFrame(animationId);
      }
    });
  }, { threshold: 0.2 });
  
  if (hifiSection) {
    vuObserver.observe(hifiSection);
  }
}

/**
 * Dynamic Footer Year
 */
function initFooterYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Setup configurable links
 */
function setupLinks() {
  const downloadLinks = document.querySelectorAll('.btn-download, #bottom-download-btn');
  const githubLinks = document.querySelectorAll('#nav-github-btn, #mobile-github-btn, #bottom-github-btn, #footer-github-link');
  
  downloadLinks.forEach(link => {
    // Set the href directly to trigger the file download
    link.href = CONFIG.DOWNLOAD_URL;
    link.setAttribute('data-download-url', CONFIG.DOWNLOAD_URL);
  });
  
  githubLinks.forEach(link => {
    link.href = CONFIG.GITHUB_URL;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

/**
 * Tactile Mechanical Audio Click
 */
function playMechanicalClick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  } catch (e) {}
}

/**
 * Deck Finish & Colorway Theme Selector
 */
function initThemeSelector() {
  const savedTheme = localStorage.getItem('pulse_deck_theme') || 'amber';
  applyTheme(savedTheme);

  const chips = document.querySelectorAll('.deck-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const theme = chip.getAttribute('data-theme');
      playMechanicalClick();
      applyTheme(theme);
      localStorage.setItem('pulse_deck_theme', theme);
    });
  });

  function applyTheme(theme) {
    if (theme === 'cyan') {
      document.documentElement.setAttribute('data-theme', 'cyan');
    } else if (theme === 'green') {
      document.documentElement.setAttribute('data-theme', 'green');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    document.querySelectorAll('.deck-chip').forEach(c => {
      if (c.getAttribute('data-theme') === theme) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }
}

/**
 * Web Audio Ambient Lo-Fi Synthesizer & Interactive Player
 */
class WebAudioDeckEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play() {
    this.init();
    this.isPlaying = true;

    // Atmospheric warm analog chords: Cm9 -> Gm7 -> Fm9 -> Abmaj7
    const chords = [
      [130.81, 155.56, 196.00, 233.08, 293.66],
      [98.00, 146.83, 174.61, 220.00, 261.63],
      [87.31, 130.81, 155.56, 174.61, 220.00],
      [103.83, 155.56, 207.65, 261.63, 311.13]
    ];

    let chordIdx = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      const freqs = chords[chordIdx % chords.length];
      chordIdx++;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650 + Math.random() * 300, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.7);

      filter.connect(gain);
      gain.connect(this.ctx.destination);

      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 2.8);
      });

      this.timer = setTimeout(playNext, 2800);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }
}

const deckAudioEngine = new WebAudioDeckEngine();

function initInteractivePlayer() {
  const playButtons = document.querySelectorAll('.control-btn.play');
  const playerWrappers = document.querySelectorAll('.player-visual, .phone-mockup-wrapper');
  const progressBars = document.querySelectorAll('.progress-fill');
  const timeLabels = document.querySelectorAll('.progress-times span:first-child');

  let isPlaying = false;
  let elapsedSec = 102; // 1:42
  const totalSec = 232;  // 3:52
  let progressInterval = null;

  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playMechanicalClick();
      togglePlayState();
    });
  });

  function togglePlayState() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      deckAudioEngine.play();
      playerWrappers.forEach(w => w.classList.add('is-playing'));
      playButtons.forEach(b => {
        b.classList.add('active');
        b.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      });

      progressInterval = setInterval(() => {
        elapsedSec = (elapsedSec + 1) % totalSec;
        const mins = Math.floor(elapsedSec / 60);
        const secs = (elapsedSec % 60).toString().padStart(2, '0');
        const percent = (elapsedSec / totalSec) * 100;

        progressBars.forEach(p => p.style.width = `${percent}%`);
        timeLabels.forEach(t => t.textContent = `${mins}:${secs}`);
      }, 1000);

    } else {
      deckAudioEngine.stop();
      playerWrappers.forEach(w => w.classList.remove('is-playing'));
      playButtons.forEach(b => {
        b.classList.remove('active');
        b.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      });
      if (progressInterval) clearInterval(progressInterval);
    }
  }
}

/**
 * Interactive Lyric Teleprompter
 */
function initTeleprompter() {
  const lines = document.querySelectorAll('.teleprompter-line');
  if (!lines.length) return;

  let currentLine = 1;
  let autoAdvanceTimer = null;

  lines.forEach((line, index) => {
    line.addEventListener('click', () => {
      playMechanicalClick();
      selectLine(index);
    });
  });

  function selectLine(idx) {
    currentLine = idx;
    lines.forEach((l, i) => {
      if (i === currentLine) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
  }

  // Cycle lines gently every 3.5 seconds
  setInterval(() => {
    const isDeckPlaying = document.querySelector('.player-visual.is-playing') !== null;
    if (isDeckPlaying) {
      currentLine = (currentLine + 1) % lines.length;
      selectLine(currentLine);
    }
  }, 3500);
}

/**
 * Hardware FAQ Accordion
 */
function initFAQAccordion() {
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item, index) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    if (!questionBtn.id) questionBtn.id = `faq-question-${index + 1}`;
    if (!answer.id) answer.id = `faq-answer-${index + 1}`;

    questionBtn.setAttribute('aria-controls', answer.id);
    questionBtn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', questionBtn.id);
    answer.setAttribute('aria-hidden', 'true');
    answer.hidden = true;

    questionBtn.addEventListener('click', () => {
      playMechanicalClick();
      const willOpen = !item.classList.contains('open');

      // Close other open items, then toggle this one.
      faqItems.forEach(other => setItemState(other, false));
      setItemState(item, willOpen);
    });
  });

  function setItemState(item, isOpen) {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    if (answer._hideTimer) {
      clearTimeout(answer._hideTimer);
      answer._hideTimer = null;
    }

    item.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    answer.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      answer.hidden = false;
    } else {
      // Let the closing transition finish before removing the answer from the
      // accessibility tree entirely.
      answer._hideTimer = setTimeout(() => {
        if (!item.classList.contains('open')) answer.hidden = true;
      }, 350);
    }
  }
}
} // End __PULSE_MAIN_INITIALIZED
