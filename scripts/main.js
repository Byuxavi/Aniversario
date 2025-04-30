// Main JavaScript file that initializes all modules
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  if (document.querySelector('.mobile-menu-toggle')) {
    initMobileMenu();
  }
    
  // Initialize date checker (on home page)
  if (document.getElementById('verify-date')) {
    initDateChecker();
    calculateMonthsTogether();
  }
    
  // Initialize letter gallery (on letters page)
  if (document.querySelector('.month-selector')) {
    initLetterGallery();
  }
    
  // Note: projects-gallery.js now self-initializes on DOMContentLoaded
  // but keeping this here for backward compatibility
  if (document.querySelector('.carousel')) {
    // This will be handled by projects-gallery.js itself now
    // but we'll leave it as a fallback in case the script changes
    if (typeof initProjectsGallery === 'function') {
      initProjectsGallery();
    }
  }
    
  // Note: countdown.js now self-initializes on DOMContentLoaded
  // but keeping this here for backward compatibility
  if (document.getElementById('countdown')) {
    // This will be handled by countdown.js itself now
    // but we'll leave it as a fallback in case the script changes
    if (typeof initCountdown === 'function') {
      initCountdown();
    }
  }
    
  // Initialize floating hearts animation
  initFloatingHearts();
});

// Calculate months together and display it
function calculateMonthsTogether() {
  // Updated to use the correct wedding date: May 30, 2025
  const anniversaryDate = new Date('2025-05-30');
  const today = new Date();
  
  // For now, we're counting down to the wedding
  // After the wedding, this will count months together
  
  // Check if wedding has happened yet
  if (today < anniversaryDate) {
    // Wedding hasn't happened yet, hide the months counter
    const monthsElement = document.getElementById('months-together');
    if (monthsElement) {
      monthsElement.classList.remove('visible');
    }
    return;
  }
  
  // Calculate months since wedding
  let months = (today.getFullYear() - anniversaryDate.getFullYear()) * 12;
  months += today.getMonth() - anniversaryDate.getMonth();
  
  // Adjust if we haven't reached the day of the month yet
  if (today.getDate() < anniversaryDate.getDate()) {
    months--;
  }
  
  // Only show if positive (wedding has occurred)
  if (months >= 0) {
    const monthsCounter = document.getElementById('months-count');
    if (monthsCounter) {
      monthsCounter.textContent = months;
      document.getElementById('months-together').classList.add('visible');
    }
  }
}

// Floating hearts animation
function initFloatingHearts() {
  const heartsContainer = document.querySelector('.floating-hearts');
  if (!heartsContainer) return;
  
  const hearts = document.querySelectorAll('.floating-hearts .heart');
  
  hearts.forEach(heart => {
    // Set random starting position
    const startX = Math.random() * 100;
    heart.style.left = `${startX}%`;
    heart.style.bottom = '-100px';
    heart.style.opacity = '0';
    
    // Set animation with random duration and delay
    const duration = 3 + Math.random() * 4;
    const delay = Math.random() * 5;
    
    // Use modern animation approach
    heart.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
  });
  
  // Recreate hearts periodically to ensure continuous animation
  setInterval(() => {
    hearts.forEach(heart => {
      // Reset position to create continuous flow
      const startX = Math.random() * 100;
      heart.style.left = `${startX}%`;
      
      // Vary size occasionally
      if (Math.random() > 0.7) {
        const size = 30 + Math.random() * 20;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
      }
    });
  }, 10000);
}

// Utility functions
function fadeIn(element, duration = 500) {
  if (!element) return;
  
  element.style.opacity = 0;
  element.style.display = 'block';
  
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.opacity = Math.min(progress / duration, 1);
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

function fadeOut(element, duration = 500, callback) {
  if (!element) return;
  
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.opacity = 1 - Math.min(progress / duration, 1);
    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      element.style.display = 'none';
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  window.requestAnimationFrame(step);
}

// Show an element by toggling classes
function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}

// Hide an element by toggling classes
function hideElement(element) {
  if (element) {
    element.classList.add('hidden');
  }
}