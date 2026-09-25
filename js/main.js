document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSmoothScrollAndMenuClose();
  initContactForm();
  initCookieConsent();
});

/**
 * 1. Efecto sombra de Navbar al hacer scroll
 */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    },
    { passive: true }
  );
}

/**
 * 2. Cierre automático del menú móvil al hacer clic
 */
function initSmoothScrollAndMenuClose() {
  const navLinks = document.querySelectorAll(
    '.navbar-nav .nav-link:not(.dropdown-toggle)'
  );
  const navbarCollapse = document.getElementById('navbarContent');
  const bsCollapse = navbarCollapse
    ? bootstrap.Collapse.getInstance(navbarCollapse) ||
      new bootstrap.Collapse(navbarCollapse, { toggle: false })
    : null;

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });
}

/**
 * 3. Gestión y validación del formulario
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedbackAlert = document.getElementById('formFeedbackAlert');
  const submitBtn = document.getElementById('submitBtn');

  // OPCIONAL: Si configuras Formspree para recibir emails en segundo plano, pega tu enlace aquí:
  const FORMSPREE_ENDPOINT = '';

  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
    });
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const serviceSelect = document.getElementById('serviceInterest');
    const messageInput = document.getElementById('message');
    const privacyCheckbox = document.getElementById('privacyConsent');

    let isFormValid = true;

    if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 3) {
      fullNameInput.classList.add('is-invalid');
      isFormValid = false;
    } else {
      fullNameInput.classList.remove('is-invalid');
      fullNameInput.classList.add('is-valid');
    }

    const phoneRegex = /^(\+34|0034)?[6789]\d{8}$/;
    const cleanPhone = phoneInput.value.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      phoneInput.classList.add('is-invalid');
      isFormValid = false;
    } else {
      phoneInput.classList.remove('is-invalid');
      phoneInput.classList.add('is-valid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('is-invalid');
      isFormValid = false;
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    if (!serviceSelect.value) {
      serviceSelect.classList.add('is-invalid');
      isFormValid = false;
    } else {
      serviceSelect.classList.remove('is-invalid');
      serviceSelect.classList.add('is-valid');
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.classList.add('is-invalid');
      isFormValid = false;
    } else {
      messageInput.classList.remove('is-invalid');
      messageInput.classList.add('is-valid');
    }

    if (!privacyCheckbox.checked) {
      privacyCheckbox.classList.add('is-invalid');
      isFormValid = false;
    } else {
      privacyCheckbox.classList.remove('is-invalid');
      privacyCheckbox.classList.add('is-valid');
    }

    if (!isFormValid) {
      feedbackAlert.className = 'alert alert-danger mt-3 d-block';
      feedbackAlert.innerHTML =
        '<i class="bi bi-exclamation-triangle-fill me-2"></i>Por favor, revisa los campos en rojo antes de enviar.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';

    if (FORMSPREE_ENDPOINT) {
      try {
        const formData = new FormData(form);
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          feedbackAlert.className = 'alert alert-success mt-3 d-block';
          feedbackAlert.innerHTML =
            '<i class="bi bi-check-circle-fill me-2"></i><strong>¡Solicitud enviada con éxito!</strong> Nos pondremos en contacto contigo en breve.';
          form.reset();
          inputs.forEach((input) => input.classList.remove('is-valid'));
        } else {
          throw new Error('Error al enviar');
        }
      } catch (err) {
        feedbackAlert.className = 'alert alert-danger mt-3 d-block';
        feedbackAlert.innerHTML =
          '<i class="bi bi-x-circle-fill me-2"></i>Hubo un error al enviar. Por favor, contáctanos por teléfono o WhatsApp.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Enviar Solicitud';
      }
    } else {
      const whatsappNumber = '34672770643';
      const messageText =
        `*Nueva Consulta Web - Mariona Cervero*\n` +
        `------------------------------------\n` +
        `*Nombre:* ${fullNameInput.value.trim()}\n` +
        `*Teléfono:* ${cleanPhone}\n` +
        `*Email:* ${emailInput.value.trim()}\n` +
        `*Servicio:* ${serviceSelect.value}\n` +
        `*Mensaje:* ${messageInput.value.trim()}\n` +
        `------------------------------------`;

      const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

      setTimeout(() => {
        feedbackAlert.className = 'alert alert-success mt-3 d-block';
        feedbackAlert.innerHTML =
          '<i class="bi bi-check-circle-fill me-2"></i><strong>¡Datos comprobados!</strong> Se abre WhatsApp para enviar tu mensaje.';
        window.open(encodedUrl, '_blank');
        form.reset();
        inputs.forEach((input) => input.classList.remove('is-valid'));
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Enviar Solicitud';
      }, 600);
    }
  });
}

/**
 * 4. Banner de Cookies (LSSI-CE)
 */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('btnAcceptCookies');
  const rejectBtn = document.getElementById('btnRejectCookies');

  if (!banner || !acceptBtn || !rejectBtn) return;

  const consent = localStorage.getItem('cookieConsent_mariona');
  if (!consent) {
    banner.classList.remove('d-none');
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent_mariona', 'accepted');
    banner.classList.add('d-none');
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent_mariona', 'rejected');
    banner.classList.add('d-none');
  });
}
