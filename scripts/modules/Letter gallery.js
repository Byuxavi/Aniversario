// Letter gallery functionality
function initLetterGallery() {
  // Elements
  const monthButtons = document.querySelectorAll('.month-button');
  const letterContent = document.querySelector('.letter-content');
  const prevButton = document.getElementById('prev-letter');
  const nextButton = document.getElementById('next-letter');
  const currentLetterIndicator = document.querySelector('.current-letter');
  const totalLettersIndicator = document.querySelector('.total-letters');
  
  // State
  let letters = [];
  let currentMonth = 1;
  const totalMonths = monthButtons.length;
  
  // Update letter indicators
  function updateLetterIndicators() {
    if (currentLetterIndicator) {
      currentLetterIndicator.textContent = currentMonth;
    }
    if (totalLettersIndicator) {
      totalLettersIndicator.textContent = totalMonths;
    }
  }
  
  // Update navigation buttons state
  function updateNavButtons() {
    if (prevButton) {
      prevButton.disabled = currentMonth <= 1;
    }
    if (nextButton) {
      nextButton.disabled = currentMonth >= totalMonths;
    }
  }
  
  // Format a date string to localized format (e.g., "30 de mayo, 2024")
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString; // Fallback to original string if parsing fails
    }
  }
  
  // Initialize previous and next button functionality
  function initNavigationButtons() {
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        if (currentMonth > 1) {
          navigateToMonth(currentMonth - 1);
        }
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        if (currentMonth < totalMonths) {
          navigateToMonth(currentMonth + 1);
        }
      });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      // Only respond to keyboard if we're on the letters page
      if (!document.querySelector('.letters-page')) return;
      
      if (e.key === 'ArrowLeft' && currentMonth > 1) {
        navigateToMonth(currentMonth - 1);
      } else if (e.key === 'ArrowRight' && currentMonth < totalMonths) {
        navigateToMonth(currentMonth + 1);
      }
    });
  }
  
  // Navigate to specific month
  function navigateToMonth(monthNumber) {
    // Update state
    currentMonth = monthNumber;
    
    // Update UI
    monthButtons.forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.getAttribute('data-month')) === monthNumber) {
        btn.classList.add('active');
        // Scroll button into view on mobile
        if (window.innerWidth < 768) {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    });
    
    // Find the letter for this month
    const selectedLetter = letters.find(letter => letter.month === monthNumber);
    
    if (selectedLetter) {
      displayLetter(selectedLetter);
    } else {
      displayEmptyLetter(monthNumber);
    }
    
    // Update navigation state
    updateNavButtons();
    updateLetterIndicators();
  }
  
  // Utility function for fading in an element
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
  
  // Utility function for fading out an element
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
  
  // Animate letters with a typewriter effect
  function typewriterEffect(element, text, speed = 25) {
    let i = 0;
    element.textContent = '';
    
    // Skip animation for small screens or if preference is set
    if (window.innerWidth < 768 || localStorage.getItem('disableAnimations') === 'true') {
      element.textContent = text;
      return Promise.resolve();
    }
    
    return new Promise(resolve => {
      function addChar() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(addChar, speed);
        } else {
          resolve();
        }
      }
      addChar();
    });
  }
  
 // Reemplaza la función displayLetter en tu archivo Letter gallery.js
function displayLetter(letter) {
  const letterTitle = document.querySelector('.letter-title');
  const letterDate = document.querySelector('.letter-date');
  const letterBody = document.querySelector('.letter-body');
  const letterSignature = document.querySelector('.letter-signature');
  const photoSection = document.getElementById('month-photo');
  
  // Create fade out effect
  fadeOut(letterContent, 300, () => {
    // Update letter content
    if (letterTitle) letterTitle.textContent = letter.title;
    if (letterDate) letterDate.textContent = formatDate(letter.date);
    
    // Clear existing content
    if (letterBody) letterBody.innerHTML = '';
    
    // Add new paragraphs
    if (letterBody && letter.content) {
      const fragments = [];
      
      letter.content.forEach((paragraph, index) => {
        const p = document.createElement('p');
        letterBody.appendChild(p);
        fragments.push({ element: p, text: paragraph });
      });
      
      // Set signature
      if (letterSignature && letter.signature) {
        letterSignature.textContent = letter.signature;
      }
      
      // Update photo section - MODIFICADO PARA MÚLTIPLES FOTOS
      if (letter.memories) {
        // Crear o actualizar el contenedor de la galería
        let photoGallery = document.querySelector('.photo-gallery');
        if (!photoGallery) {
          // Si no existe el contenedor de la galería, crearlo
          photoGallery = document.createElement('div');
          photoGallery.className = 'photo-gallery';
          
          // Reemplazar el placeholder con la galería
          const photoContainer = document.querySelector('.letter-memories');
          if (photoContainer) {
            // Mantener el título
            const title = photoContainer.querySelector('h3');
            photoContainer.innerHTML = '';
            if (title) photoContainer.appendChild(title);
            photoContainer.appendChild(photoGallery);
          }
        } else {
          // Limpiar la galería existente
          photoGallery.innerHTML = '';
        }
        
        // Si hay fotos en formato antiguo (solo photoUrl), convertir al nuevo formato
        if (letter.memories.photoUrl) {
          letter.memories.photos = [{
            photoUrl: letter.memories.photoUrl,
            caption: letter.memories.caption || 'Recuerdo especial'
          }];
        }
        
        // Si no hay fotos, mostrar mensaje
        if (!letter.memories.photos || letter.memories.photos.length === 0) {
          const emptyMessage = document.createElement('div');
          emptyMessage.className = 'photo-placeholder';
          emptyMessage.innerHTML = '<div class="photo-message">Los recuerdos se están creando</div>';
          photoGallery.appendChild(emptyMessage);
        } else {
          // Añadir cada foto a la galería
          letter.memories.photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            
            if (photo.photoUrl) {
              photoElement.style.backgroundImage = `url('${photo.photoUrl}')`;
              photoElement.classList.add('has-photo');
              
              // Añadir leyenda si existe
              if (photo.caption) {
                const captionElement = document.createElement('div');
                captionElement.className = 'photo-caption';
                captionElement.textContent = photo.caption;
                photoElement.appendChild(captionElement);
              }
            } else {
              photoElement.innerHTML = '<div class="photo-message">Foto próximamente</div>';
            }
            
            photoGallery.appendChild(photoElement);
          });
        }
      }
      
      // Create fade in effect
      fadeIn(letterContent, 300);
      
      // Apply typewriter effect sequentially
      let promise = Promise.resolve();
      fragments.forEach(fragment => {
        promise = promise.then(() => typewriterEffect(fragment.element, fragment.text));
      });
    }
  });
}

// Reemplaza la función displayEmptyLetter
function displayEmptyLetter(month) {
  const letterTitle = document.querySelector('.letter-title');
  const letterDate = document.querySelector('.letter-date');
  const letterBody = document.querySelector('.letter-body');
  const letterSignature = document.querySelector('.letter-signature');
  
  // Create fade out effect
  fadeOut(letterContent, 300, () => {
    // Update letter content for future month
    if (letterTitle) letterTitle.textContent = `Mes ${month} - Próximamente`;
    if (letterDate) letterDate.textContent = 'Fecha Futura';
    
    // Clear existing content
    if (letterBody) letterBody.innerHTML = '';
    
    // Add placeholder message
    if (letterBody) {
      const p = document.createElement('p');
      p.textContent = 'Esta carta de amor estará disponible pronto. Nuestra historia continúa desarrollándose...';
      letterBody.appendChild(p);
      
      const p2 = document.createElement('p');
      p2.textContent = '¡Regresa el mes próximo para descubrir nueva inspiración y palabras de amor!';
      letterBody.appendChild(p2);
    }
    
    // Update signature
    if (letterSignature) {
      letterSignature.textContent = 'Con amor y anticipación';
    }
    
    // Actualizar sección de fotos para meses futuros
    let photoGallery = document.querySelector('.photo-gallery');
    if (!photoGallery) {
      photoGallery = document.createElement('div');
      photoGallery.className = 'photo-gallery';
      
      const photoContainer = document.querySelector('.letter-memories');
      if (photoContainer) {
        const title = photoContainer.querySelector('h3');
        photoContainer.innerHTML = '';
        if (title) photoContainer.appendChild(title);
        photoContainer.appendChild(photoGallery);
      }
    } else {
      photoGallery.innerHTML = '';
    }
    
    // Añadir placeholder para meses futuros
    const emptyPhoto = document.createElement('div');
    emptyPhoto.className = 'photo-placeholder';
    emptyPhoto.innerHTML = '<div class="photo-message">Los recuerdos se están creando</div>';
    photoGallery.appendChild(emptyPhoto);
    
    // Create fade in effect
    fadeIn(letterContent, 300);
  });
}
  
  // Display placeholder for future letters
  function displayEmptyLetter(month) {
    const letterTitle = document.querySelector('.letter-title');
    const letterDate = document.querySelector('.letter-date');
    const letterBody = document.querySelector('.letter-body');
    const letterSignature = document.querySelector('.letter-signature');
    const monthPhoto = document.getElementById('month-photo');
    
    // Create fade out effect
    fadeOut(letterContent, 300, () => {
      // Update letter content for future month
      if (letterTitle) letterTitle.textContent = `Mes ${month} - Próximamente`;
      if (letterDate) letterDate.textContent = 'Fecha Futura';
      
      // Clear existing content
      if (letterBody) letterBody.innerHTML = '';
      
      // Add placeholder message
      if (letterBody) {
        const p = document.createElement('p');
        p.textContent = 'Esta carta de amor estará disponible pronto. Nuestra historia continúa desarrollándose...';
        letterBody.appendChild(p);
        
        const p2 = document.createElement('p');
        p2.textContent = '¡Regresa el mes próximo para descubrir nueva inspiración y palabras de amor!';
        letterBody.appendChild(p2);
      }
      
      // Update signature
      if (letterSignature) {
        letterSignature.textContent = 'Con amor y anticipación';
      }
      
      // Reset photo placeholder
      if (monthPhoto) {
        monthPhoto.style.backgroundImage = '';
        monthPhoto.classList.remove('has-photo');
        
        const photoMessage = monthPhoto.querySelector('.photo-message');
        if (photoMessage) {
          photoMessage.textContent = 'Los recuerdos se están creando';
        }
      }
      
      // Create fade in effect
      fadeIn(letterContent, 300);
    });
  }
  
  // Main initialization
  function init() {
    // Initialize navigation buttons
    initNavigationButtons();
    
    // Initial indicators update
    updateLetterIndicators();
    updateNavButtons();
    
    // Define sample letters in case fetch fails
    const SAMPLE_LETTERS = [
      {
        "month": 1,
        "date": "2024-05-30",
        "title": "Mi Carta de Amor para Ti",
        "content": [
          "Amor de mi vida, hace apenas un mes nuestras almas se cruzaron, y desde el momento en que escuché tu voz, supe que eras tú. Todavía me asombra que en solo una semana, decidieras hacerme parte de tu vida, y desde entonces, cada día ha sido un regalo para mí.",
          "Contigo he descubierto emociones más intensas que cualquier cosa que haya experimentado antes. Gracias por la bendición de tu fe, tu sabiduría, tus poderes mágicos y tu corazón.",
          "Estoy tan emocionado/a por los muchos aniversarios que nos esperan. ¡Te amo más de lo que las palabras pueden expresar!"
        ],
        "signature": "Tuyo/a por siempre",
        "memories": {
          "photoUrl": "images/memories/month1.jpg",
          "caption": "Nuestro primer mes juntos"
        }
      },
      {
        "month": 2,
        "date": "2024-06-30",
        "title": "Dos Meses de Maravillas",
        "content": [
          "Mi amor, han pasado dos meses desde que nuestros corazones se encontraron, y cada día se siente como un hermoso sueño del que nunca quiero despertar.",
          "Atesoro cada risa que hemos compartido, cada conversación que ha profundizado nuestra conexión, e incluso los desafíos que nos han hecho más fuertes juntos.",
          "Has traído tanta alegría y significado a mi vida. No puedo esperar para ver lo que nos depara el futuro mientras continuamos este increíble viaje."
        ],
        "signature": "Con todo mi corazón",
        "memories": {
          "photoUrl": "images/memories/month2.jpg",
          "caption": "Nuestra primera cita especial"
        }
      },
      {
        "month": 3,
        "date": "2024-07-30",
        "title": "Tres Meses de Amor",
        "content": [
          "Tres mágicos meses contigo, mi amor. Cada día me enamoro más profundamente de tu hermosa alma, tu bondad y la forma en que haces que todo sea mejor solo por ser tú.",
          "Me asombra cuánto hemos crecido juntos en este corto tiempo. Nuestro vínculo se fortalece con cada día que pasa, y agradezco a Dios por traerte a mi vida.",
          "Eres mi bendición, mi alegría y mi futuro. Te amo infinitamente."
        ],
        "signature": "Eternamente tuyo/a",
        "memories": {
          "photoUrl": "images/memories/month3.jpg",
          "caption": "Nuestro primer viaje juntos"
        }
      }
    ];
    
    // Fetch letters data from JSON
    fetch('data/letters.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Letters data loaded successfully');
        letters = data;
      })
      .catch(error => {
        console.error('Could not load letters data:', error);
        // Fallback to sample data if fetch fails
        console.log('Using sample letter data instead');
        letters = SAMPLE_LETTERS;
      })
      .finally(() => {
        // Set up event listeners for month buttons
        monthButtons.forEach(button => {
          button.addEventListener('click', function() {
            const monthNumber = parseInt(this.getAttribute('data-month'));
            navigateToMonth(monthNumber);
          });
        });
        
        // Display the first letter by default
        navigateToMonth(1);
      });
  }
  
  // Start the gallery
  init();
}