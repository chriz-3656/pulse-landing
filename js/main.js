/**
 * Pulse Music - Landing Page JavaScript
 */

// Configuration Constants
const CONFIG = {
  DOWNLOAD_URL: "https://github.com/chriz-3656/Pulse-Music/releases/download/v1.1.0/PulseMusic-v1.1.0.apk",
  GITHUB_URL: "https://github.com/chriz-3656/Pulse-Music"
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initVUMeter();
  initFooterYear();
  setupLinks();
  fetchLatestRelease();
});

/**
 * Fetch latest release from GitHub
 */
async function fetchLatestRelease() {
  try {
    const response = await fetch('https://api.github.com/repos/chriz-3656/Pulse-Music/releases/latest');
    if (response.ok) {
      const data = await response.json();
      const apkAsset = data.assets.find(asset => asset.name.endsWith('.apk') && !asset.name.includes('-debug'));
      if (apkAsset) {
        CONFIG.DOWNLOAD_URL = apkAsset.browser_download_url;
        setupLinks(); // Refresh links with new URL
        
        // Update any version indicators if they exist
        const versionElements = document.querySelectorAll('.app-version');
        versionElements.forEach(el => {
          el.textContent = data.tag_name;
        });
        
        // You can also add the tag name to the download button text
        const mainDownloadBtn = document.getElementById('bottom-download-btn');
        if (mainDownloadBtn) {
          mainDownloadBtn.textContent = `DOWNLOAD ${data.tag_name}`;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch latest release:', error);
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
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  function openMenu() {
    mobileNav.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    // Transform hamburger icon to X
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(8px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
  }

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    // Reset hamburger icon
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
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
  const downloadLinks = document.querySelectorAll('.btn-download, #bottom-download-btn, [href="#download"]');
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
