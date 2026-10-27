/**
 * Lógica interactiva para la página de inicio de sesión
 * Sin librerías ni herramientas externas (Vanilla JavaScript puro)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');
  const submitBtn = document.getElementById('submit-btn');
  const statusMessage = document.getElementById('status-message');
  const loginCard = document.querySelector('.login-card');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const forgotLink = document.getElementById('forgot-link');

  /**
   * 1. Alternar visibilidad de la contraseña
   */
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      // Alternar iconos
      eyeIcon.classList.toggle('hidden', isPassword);
      eyeOffIcon.classList.toggle('hidden', !isPassword);

      // Actualizar accesibilidad
      const label = isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
      togglePasswordBtn.setAttribute('aria-label', label);
      togglePasswordBtn.setAttribute('title', label);
    });
  }

  /**
   * 2. Limpieza de errores en tiempo real al escribir
   */
  emailInput.addEventListener('input', () => {
    clearFieldError(emailInput, emailError);
    hideStatusMessage();
  });

  passwordInput.addEventListener('input', () => {
    clearFieldError(passwordInput, passwordError);
    hideStatusMessage();
  });

  /**
   * Función auxiliar para enviar eventos a Google Analytics 4 (GA4)
   * Importante: Por políticas de privacidad de Google, nunca se deben enviar
   * contraseñas ni datos identificables directos (PII) sin procesar.
   */
  function trackAnalyticsEvent(eventName, eventParams = {}) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
      console.log(`[Google Analytics] Evento enviado: "${eventName}"`, eventParams);
    } else {
      console.warn('[Google Analytics] La función gtag() no está disponible.');
    }
  }

  /**
   * 3. Manejo del envío del formulario y clic en el botón
   */
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      // Registra el clic directo en el botón de inicio de sesión
      trackAnalyticsEvent('click_boton_login', {
        button_id: 'submit-btn',
        button_text: 'Iniciar Sesión'
      });
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Evento de intento de inicio de sesión
    trackAnalyticsEvent('login_attempt', {
      form_id: 'login-form'
    });

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    // Si hay errores, sacudir la tarjeta y enfocar el primer campo con error
    if (!isEmailValid || !isPasswordValid) {
      trackAnalyticsEvent('login_validation_failed', {
        error_field: !isEmailValid ? 'email' : 'password'
      });

      triggerShakeAnimation();
      if (!isEmailValid) {
        emailInput.focus();
      } else {
        passwordInput.focus();
      }
      return;
    }

    // Si todo es válido, simular petición de autenticación
    simulateLogin();
  });

  /**
   * Validar correo electrónico
   */
  function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      showFieldError(emailInput, emailError, 'Por favor, ingresa tu correo electrónico.');
      return false;
    }

    if (!emailRegex.test(value)) {
      showFieldError(emailInput, emailError, 'Ingresa un formato de correo válido.');
      return false;
    }

    clearFieldError(emailInput, emailError);
    return true;
  }

  /**
   * Validar contraseña
   */
  function validatePassword() {
    const value = passwordInput.value;

    if (!value) {
      showFieldError(passwordInput, passwordError, 'Por favor, ingresa tu contraseña.');
      return false;
    }

    if (value.length < 6) {
      showFieldError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    clearFieldError(passwordInput, passwordError);
    return true;
  }

  /**
   * Mostrar error en campo
   */
  function showFieldError(input, errorElement, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
    errorElement.textContent = message;
  }

  /**
   * Limpiar error en campo
   */
  function clearFieldError(input, errorElement) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
    errorElement.textContent = '';
  }

  /**
   * Mostrar mensaje global (alerta)
   */
  function showStatusMessage(message, type = 'error') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message visible ${type}`;
  }

  /**
   * Ocultar mensaje global
   */
  function hideStatusMessage() {
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
  }

  /**
   * Animación de sacudida
   */
  function triggerShakeAnimation() {
    loginCard.classList.remove('shake-animation');
    // Forzar reflujo para reiniciar la animación
    void loginCard.offsetWidth;
    loginCard.classList.add('shake-animation');
  }

  /**
   * Simular proceso de inicio de sesión con estado de carga
   */
  function simulateLogin() {
    // Activar estado de carga en el botón
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;
    hideStatusMessage();

    // Simular retraso de red (1.2 segundos)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      emailInput.disabled = false;
      passwordInput.disabled = false;

      // Registrar evento estándar 'login' en Google Analytics 4
      const rememberMe = document.getElementById('remember-me')?.checked || false;
      trackAnalyticsEvent('login', {
        method: 'Email and Password',
        remember_me: rememberMe
      });

      // Mensaje de éxito
      showStatusMessage(`¡Bienvenido de nuevo! Sesión iniciada con éxito.`, 'success');

      // Opcional: limpiar contraseña por seguridad
      passwordInput.value = '';
    }, 1200);
  }

  /**
   * Enlace de ayuda "¿Olvidaste tu contraseña?"
   */
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      trackAnalyticsEvent('click_recuperar_password', {
        link_text: '¿Olvidaste tu contraseña?'
      });
      showStatusMessage('Se ha enviado un enlace de recuperación a tu bandeja de entrada si la cuenta existe.', 'success');
    });
  }
});
