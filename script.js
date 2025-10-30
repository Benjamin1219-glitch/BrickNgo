// ===================================
// MODERN BRICKNGO - INTERACTIVE COMPONENTS
// ===================================

// Theme Toggle (Dark Mode)
const themeToggle = () => {
  const theme = document.documentElement.getAttribute('data-theme');
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

// Initialize theme from localStorage
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

// Navbar scroll effect
const handleNavbarScroll = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
};

// Scroll Reveal Animations
const scrollReveal = () => {
  const reveals = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  
  const revealOnScroll = () => {
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('revealed');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
};

// Staggered List Animations
const staggeredAnimation = () => {
  const items = document.querySelectorAll('.stagger-item');
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.style.transform = 'translateY(30px)';
  });
};

// Magnetic Button Effect
const magneticButtons = () => {
  const buttons = document.querySelectorAll('.btn-magnetic');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
};

// 3D Card Tilt Effect
const cardTilt = () => {
  const cards = document.querySelectorAll('.card-tilt');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
};

// Card Flip Effect
const cardFlip = () => {
  const cards = document.querySelectorAll('.card-swap');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
};

// Animated Counter
const animateCounter = (element, target, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16);
  
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
};

// Initialize counters on scroll
const initCounters = () => {
  const counters = document.querySelectorAll('.counter');
  let initialized = false;
  
  const checkScroll = () => {
    if (initialized) return;
    
    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
        initialized = true;
      }
    });
  };
  
  window.addEventListener('scroll', checkScroll);
  checkScroll();
};

// Toast Notification System
const showToast = (message, type = 'success', duration = 3000) => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">×</button>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// Form Validation with Animation
const validateForm = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        input.style.animation = 'shake 0.5s';
        isValid = false;
      } else {
        input.style.borderColor = '#10b981';
      }
    });
    
    if (isValid) {
      // Submit form
      showToast('Form submitted successfully!', 'success');
      form.reset();
    } else {
      showToast('Please fill all required fields', 'error');
    }
  });
};

// Smooth Scroll for Anchor Links
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Lazy Loading Images
const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
};

// Particle System
const createParticles = (count = 50) => {
  const background = document.querySelector('.animated-background');
  if (!background) return;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particle.style.animationDuration = `${15 + Math.random() * 10}s`;
    background.appendChild(particle);
  }
};

// Mobile Menu Toggle
const mobileMenu = () => {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
};

// Typing Animation
const typingAnimation = (element, text, speed = 100) => {
  let i = 0;
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  type();
};

// Cursor Trail Effect
const cursorTrail = () => {
  const trail = [];
  const trailLength = 20;
  
  document.addEventListener('mousemove', (e) => {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    document.body.appendChild(dot);
    
    trail.push(dot);
    
    if (trail.length > trailLength) {
      const oldDot = trail.shift();
      oldDot.remove();
    }
    
    setTimeout(() => dot.remove(), 500);
  });
};

// Loading Spinner
const showLoader = () => {
  const loader = document.createElement('div');
  loader.className = 'spinner';
  loader.id = 'global-loader';
  document.body.appendChild(loader);
};

const hideLoader = () => {
  const loader = document.getElementById('global-loader');
  if (loader) loader.remove();
};

// Keyboard Navigation Support
const keyboardNav = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
};

// Initialize Product Expandable Sections
const initExpandable = () => {
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const target = document.getElementById(targetId);
      
      if (target) {
        target.style.display = target.style.display === 'none' ? 'flex' : 'none';
        button.textContent = target.style.display === 'none' ? 'View All →' : 'Hide';
      }
    });
  });
};

// Performance Monitoring
const performanceMonitor = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page load time: ${pageLoadTime}ms`);
    });
  }
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initTheme();
  handleNavbarScroll();
  scrollReveal();
  staggeredAnimation();
  magneticButtons();
  cardTilt();
  cardFlip();
  initCounters();
  smoothScroll();
  lazyLoadImages();
  mobileMenu();
  keyboardNav();
  initExpandable();
  performanceMonitor();
  
  // Create animated background
  const background = document.querySelector('.animated-background');
  if (background) {
    createParticles(30);
  }
  
  console.log('✨ BRICKNGO Modern Website Loaded');
});

// Export functions for external use
window.BRICKNGO = {
  showToast,
  themeToggle,
  showLoader,
  hideLoader,
  typingAnimation
};
