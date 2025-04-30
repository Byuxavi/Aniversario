// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  menuToggle?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('active');
      document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
  });
}

// Floating hearts animation
function createFloatingHearts() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return;

  for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'absolute';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.bottom = '-10%';
      heart.style.fontSize = `${Math.random() * 20 + 10}px`;
      heart.style.opacity = '0.7';
      heart.style.animation = `floatUp ${Math.random() * 10 + 15}s linear infinite`;
      heart.style.animationDelay = `${i * 2}s`;
      container.appendChild(heart);
  }
}

// Calculate months together
function calculateMonthsTogether() {
  const anniversaryDate = new Date('2024-05-30');
  const today = new Date();
  const months = (today.getFullYear() - anniversaryDate.getFullYear()) * 12 + 
                (today.getMonth() - anniversaryDate.getMonth());
  
  const monthsCount = document.getElementById('months-count');
  if (monthsCount) {
      monthsCount.textContent = months > 0 ? months : 0;
  }
}

// Date verification functionality
function initDateChecker() {
  const dateInput = document.getElementById('anniversary');
  const verifyButton = document.getElementById('verify-date');
  const initialView = document.getElementById('initial-view');
  const successView = document.getElementById('success-view');
  const errorView = document.getElementById('error-view');
  const tryAgainButton = document.getElementById('try-again');
  const startDateSpan = document.getElementById('start-date');

  // Set your actual anniversary date here (format: YYYY-MM-DD)
  const correctDate = '2024-05-30';

  // Check if date was already verified in this session
  const isVerified = sessionStorage.getItem('dateVerified') === 'true';
  if (isVerified && initialView && successView) {
      initialView.classList.add('hidden');
      successView.classList.remove('hidden');
  }

  // Format and set the date in the success message
  if (startDateSpan) {
      startDateSpan.textContent = formatDate(correctDate);
  }

  // Verify date button click handler
  verifyButton?.addEventListener('click', verifyDate);

  // Try again button click handler
  tryAgainButton?.addEventListener('click', () => {
      errorView?.classList.add('hidden');
      initialView?.classList.remove('hidden');
      if (dateInput) {
          dateInput.value = '';
      }
  });

  // Enter key handler
  dateInput?.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault();
          verifyDate();
      }
  });

  function verifyDate() {
      const enteredDate = dateInput?.value || '';

      if (!enteredDate) {
          showMessage('Por favor ingresa una fecha');
          return;
      }

      if (enteredDate === correctDate) {
          // Store verification in session storage
          sessionStorage.setItem('dateVerified', 'true');

          // Show success view
          initialView?.classList.add('hidden');
          successView?.classList.remove('hidden');
      } else {
          // Show error view
          initialView?.classList.add('hidden');
          errorView?.classList.remove('hidden');
      }
  }

  function showMessage(message) {
      const container = document.querySelector('.input-container');
      const existingMessage = container?.querySelector('.error-message');
      
      if (existingMessage) {
          existingMessage.remove();
      }

      const messageElement = document.createElement('p');
      messageElement.className = 'error-message animate-fade-in';
      messageElement.style.color = '#dc2626';
      messageElement.style.fontSize = '0.875rem';
      messageElement.style.marginTop = '0.5rem';
      messageElement.textContent = message;

      container?.appendChild(messageElement);

      setTimeout(() => {
          messageElement.remove();
      }, 3000);
  }
}

// Format date helper function
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  createFloatingHearts();
  calculateMonthsTogether();
  initDateChecker();
});