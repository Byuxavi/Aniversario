// Countdown functionality
function initCountdown() {
  // Updated events data with correct wedding date (May 30, 2025)
  const EVENTS = {
    "wedding": {
      "date": "2025-05-30",
      "message": "Every second brings us closer to forever ❤️",
      "location": "Paris, France"
    },
    "anniversary": {
      "date": "2026-05-30", // First anniversary will be a year after wedding
      "message": "Counting down to one year of love ❤️",
      "location": "Rome, Italy"
    },
    "special": {
      "date": "2025-07-15",
      "message": "Our special day is approaching ❤️",
      "location": "Barcelona, Spain"
    }
  };

  // Try to fetch events from JSON file, fallback to our predefined events if it fails
  fetch('data/events.json')
    .then(response => response.json())
    .catch(error => {
      console.warn('Could not load events data:', error);
      return EVENTS; // Use our predefined events if fetch fails
    })
    .then(events => {
      // If events data is missing critical properties, use our defaults
      if (!events || !events.wedding || !events.wedding.date) {
        console.warn('Events data is invalid, using default data');
        events = EVENTS;
      }
      
      setupCountdown(events);
    });

  function setupCountdown(events) {
    const eventButtons = document.querySelectorAll('.event-btn');
    let currentEvent = 'wedding'; // Default event
    let countdown;
    
    // Set up event listeners for event buttons
    eventButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button state
        eventButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Get selected event
        currentEvent = this.getAttribute('data-event');
        
        // Update countdown
        startCountdown(events[currentEvent]);
        
        // Update message
        updateCountdownMessage(events[currentEvent]);
        
        // Update location
        updateLocation(events[currentEvent]);
      });
    });
    
    // Start default countdown (wedding)
    startCountdown(events[currentEvent]);
    updateCountdownMessage(events[currentEvent]);
    updateLocation(events[currentEvent]);
    
    function startCountdown(event) {
      // Clear any existing countdown
      if (countdown) {
        clearInterval(countdown);
      }
      
      // Parse target date with timezone safety
      const targetDate = new Date(event.date + 'T00:00:00').getTime();
      
      // Update countdown immediately
      updateCountdown(targetDate, event);
      
      // Set interval to update countdown every second
      countdown = setInterval(() => {
        updateCountdown(targetDate, event);
      }, 1000);
    }
    
    function updateCountdown(targetDate, event) {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      // Calculate time components
      const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));
      
      // Update DOM with leading zeros for better appearance
      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
      
      // Check if countdown is over
      if (distance < 0) {
        clearInterval(countdown);
        
        // Show celebration message
        const messageEl = document.querySelector('.countdown-message p');
        messageEl.textContent = `The ${currentEvent} day has arrived! ❤️`;
        
        // Trigger confetti animation (if available)
        if (typeof showCelebration === 'function') {
          showCelebration();
        }
      }
    }
    
    function updateCountdownMessage(event) {
      const messageEl = document.querySelector('.countdown-message p');
      messageEl.textContent = event.message || 'Counting down with love ❤️';
    }
    
    function updateLocation(event) {
      const locationEl = document.getElementById('event-location');
      if (locationEl) {
        locationEl.textContent = event.location || 'Our special place';
      }
    }
  }
}

// Initialize countdown when DOM is ready
document.addEventListener('DOMContentLoaded', initCountdown);

// Helper function for celebration effect (called when countdown reaches zero)
function showCelebration() {
  // Add a class to trigger animation
  document.body.classList.add('celebrating');
  
  // Create and animate heart confetti
  for (let i = 0; i < 50; i++) {
    createConfettiHeart();
  }
  
  function createConfettiHeart() {
    const heart = document.createElement('div');
    heart.className = 'confetti-heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
    heart.style.opacity = Math.random() * 0.7 + 0.3;
    document.body.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
      heart.remove();
    }, 5000);
  }
}