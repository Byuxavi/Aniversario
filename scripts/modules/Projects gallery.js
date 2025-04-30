// Carousel functionality for goals page
function initProjectsGallery() {
  // Ensure we're on the correct page with carousel elements
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  const slides = document.querySelectorAll('.carousel-slide');
  const prevButton = document.getElementById('prev-slide');
  const nextButton = document.getElementById('next-slide');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  
  if (!slides.length || !prevButton || !nextButton) return;
  
  let currentSlide = 0;
  const slideCount = slides.length;
  
  // Initialize carousel
  updateCarousel();
  
  // Set up controls
  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateCarousel();
  });
  
  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateCarousel();
  });
  
  // Set up indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });
  
  // Auto-play carousel
  let carouselInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateCarousel();
  }, 5000);
  
  // Pause auto-play on hover or focus
  carousel.addEventListener('mouseenter', pauseCarousel);
  carousel.addEventListener('focusin', pauseCarousel);
  
  carousel.addEventListener('mouseleave', resumeCarousel);
  carousel.addEventListener('focusout', (e) => {
    // Only resume if focus is moving outside the carousel
    if (!carousel.contains(e.relatedTarget)) {
      resumeCarousel();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only handle keys if we're focused within the carousel
    if (carousel.contains(document.activeElement)) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
      }
    }
  });
  
  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    pauseCarousel();
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resumeCarousel();
  }, { passive: true });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      currentSlide = (currentSlide + 1) % slideCount;
      updateCarousel();
    } else if (touchEndX > touchStartX + 50) {
      // Swipe right
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateCarousel();
    }
  }
  
  function updateCarousel() {
    // Update slides
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-selected', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-selected', 'false');
      }
    });
    
    // Announce slide change for screen readers
    const liveRegion = document.querySelector('.carousel-live-region') || createLiveRegion();
    liveRegion.textContent = `Showing slide ${currentSlide + 1} of ${slideCount}`;
  }
  
  function createLiveRegion() {
    const region = document.createElement('div');
    region.className = 'carousel-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    region.style.clip = 'rect(0 0 0 0)';
    carousel.appendChild(region);
    return region;
  }
  
  function pauseCarousel() {
    clearInterval(carouselInterval);
  }
  
  function resumeCarousel() {
    clearInterval(carouselInterval); // Clear any existing interval first
    carouselInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slideCount;
      updateCarousel();
    }, 5000);
  }
}

// Initialize the carousel when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initProjectsGallery);