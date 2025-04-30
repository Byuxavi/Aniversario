/**
 * Anniversary Date Checker Module
 * 
 * Este módulo maneja la verificación de la fecha de aniversario y calcula
 * el tiempo transcurrido desde esa fecha para mostrar cuántos meses han pasado.
 */
document.addEventListener('DOMContentLoaded', function() {
  initDateChecker();
});

function initDateChecker() {
  // Elementos del DOM
  const dateInput = document.getElementById('anniversary');
  const verifyButton = document.getElementById('verify-date');
  const initialView = document.getElementById('initial-view');
  const successView = document.getElementById('success-view');
  const errorView = document.getElementById('error-view');
  const tryAgainButton = document.getElementById('try-again');
  const startDateSpan = document.getElementById('start-date');
  const monthsCount = document.getElementById('months-count');
  
  // Configuración de la fecha de aniversario (formato: YYYY-MM-DD)
  const correctDate = '2024-08-30'; // Ajusta esta fecha a tu aniversario real
  const formattedDate = formatDate(correctDate);
  
  // Actualizar el contador de meses
  updateMonthsCounter(correctDate);
  
  // Establecer fecha formateada en el mensaje de éxito
  if (startDateSpan) {
      startDateSpan.textContent = formattedDate;
  }
  
  // Verificar si la fecha ya fue validada en esta sesión
  const isVerified = sessionStorage.getItem('dateVerified') === 'true';
  if (isVerified && initialView && successView) {
      hideElement(initialView);
      showElement(successView);
  }
  
  // Event Listeners
  if (verifyButton) {
      verifyButton.addEventListener('click', verifyDate);
  }
  
  if (tryAgainButton) {
      tryAgainButton.addEventListener('click', function() {
          hideElement(errorView);
          showElement(initialView);
          if (dateInput) {
              dateInput.value = '';
              dateInput.focus();
          }
      });
  }
  
  // Permitir que la tecla Enter active la verificación
  if (dateInput) {
      // Validación visual en tiempo real
      dateInput.addEventListener('input', function() {
          if (this.value) {
              this.classList.add('has-value');
              verifyButton.classList.add('ready');
          } else {
              this.classList.remove('has-value');
              verifyButton.classList.remove('ready');
          }
      });
      
      dateInput.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
              event.preventDefault();
              verifyDate();
          }
      });
  }
  
  /**
   * Verifica si la fecha ingresada coincide con la fecha de aniversario
   */
  function verifyDate() {
      const enteredDate = dateInput ? dateInput.value : '';
      
      if (!enteredDate) {
          showMessage('Por favor ingresa una fecha', 'error');
          vibrateInput(dateInput);
          return;
      }
      
      try {
          if (enteredDate === correctDate) {
              // Almacenar verificación en sessionStorage
              sessionStorage.setItem('dateVerified', 'true');
              
              // Ocultar vista de entrada y mostrar vista de éxito
              hideElement(initialView);
              showElement(successView, 'fadeIn');
              
              // Reproducir sonido de éxito si está disponible
              playSound('success-sound');
              
              // Celebrar con confeti
              createConfetti();
          } else {
              // Ocultar vista de entrada y mostrar vista de error
              hideElement(initialView);
              showElement(errorView, 'bounceIn');
              
              // Reproducir sonido de error si está disponible
              playSound('error-sound');
              
              // Vibrar en dispositivos móviles
              if (navigator.vibrate) {
                  navigator.vibrate([100, 50, 100]);
              }
          }
      } catch (error) {
          console.error('Error al verificar la fecha:', error);
          showMessage('Ocurrió un error al procesar la fecha', 'error');
      }
  }
  
  /**
   * Muestra un mensaje temporal dentro del contenedor de entrada
   */
  function showMessage(message, type) {
      // Eliminar cualquier mensaje existente
      const existingMessage = document.querySelector('.message');
      if (existingMessage) {
          existingMessage.remove();
      }
      
      // Crear e insertar nuevo mensaje
      const messageElement = document.createElement('div');
      messageElement.className = `message ${type} fadeIn`;
      messageElement.textContent = message;
      
      const inputContainer = document.querySelector('.input-container');
      if (inputContainer) {
          inputContainer.appendChild(messageElement);
          
          // Auto-eliminar mensaje después de un retraso
          setTimeout(() => {
              messageElement.classList.add('fadeOut');
              setTimeout(() => {
                  messageElement.remove();
              }, 500);
          }, 3000);
      }
  }
  
  /**
   * Actualiza el contador de meses desde la fecha de aniversario
   */
  function updateMonthsCounter(anniversaryDate) {
      if (!monthsCount) return;
      
      const start = new Date(anniversaryDate);
      const today = new Date();
      
      const months = (today.getFullYear() - start.getFullYear()) * 12 + 
                     (today.getMonth() - start.getMonth());
      
      // Animación de conteo
      animateCounter(monthsCount, 0, months, 1500);
      
      // Añadir clase para la insignia de aniversario
      const badge = document.querySelector('.anniversary-badge');
      if (badge) {
          // Añadir clases según la cantidad de meses
          if (months % 12 === 0) {
              badge.classList.add('yearly');
          } else if (months % 3 === 0) {
              badge.classList.add('quarterly');
          } else {
              badge.classList.add('monthly');
          }
      }
  }
  
  /**
   * Anima un contador desde start hasta end
   */
  function animateCounter(element, start, end, duration) {
      if (!element) return;
      
      let startTime = null;
      
      function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const value = Math.floor(progress * (end - start) + start);
          element.textContent = value;
          
          if (progress < 1) {
              window.requestAnimationFrame(animate);
          }
      }
      
      window.requestAnimationFrame(animate);
  }
  
  /**
   * Aplica efecto de vibración a un elemento de entrada
   */
  function vibrateInput(element) {
      if (!element) return;
      
      element.classList.add('shake');
      setTimeout(() => {
          element.classList.remove('shake');
      }, 500);
  }
  
  /**
   * Reproduce un sonido por su ID
   */
  function playSound(soundId) {
      const sound = document.getElementById(soundId);
      if (sound) {
          sound.currentTime = 0;
          sound.play().catch(e => console.log('Reproducción de sonido evitada: ' + e));
      }
  }
  
  /**
   * Efecto de confeti para celebrar el éxito
   */
  function createConfetti() {
      const container = document.querySelector('.hero');
      if (!container) return;
      
      for (let i = 0; i < 100; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          
          // Colores variados
          const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          confetti.style.backgroundColor = randomColor;
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
          confetti.style.animationDelay = Math.random() * 2 + 's';
          
          container.appendChild(confetti);
          
          // Eliminar después de la animación
          setTimeout(() => {
              confetti.remove();
          }, 5000);
      }
  }
  
  /**
   * Formatea la fecha en formato "30 de mayo, 2024"
   */
  function formatDate(dateString) {
      try {
          const date = new Date(dateString);
          
          const options = { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
          };
          
          return date.toLocaleDateString('es-ES', options);
      } catch (error) {
          console.error('Error al formatear la fecha:', error);
          return dateString;
      }
  }
  
  /**
   * Oculta un elemento con una animación opcional
   */
  function hideElement(element) {
      if (!element) return;
      
      element.classList.add('fadeOut');
      setTimeout(() => {
          element.classList.add('hidden');
          element.classList.remove('fadeOut');
      }, 300);
  }
  
  /**
   * Muestra un elemento con una animación opcional
   */
  function showElement(element, animation = 'fadeIn') {
      if (!element) return;
      
      element.classList.remove('hidden');
      element.classList.add(animation);
      setTimeout(() => {
          element.classList.remove(animation);
      }, 500);
  }
  
}
