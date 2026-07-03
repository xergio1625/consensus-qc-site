/* ════════════════════════════════════════════════════
   Consensus QC — main.js
   Lógica mínima: menú móvil, feedback de descarga,
   envío del formulario con Formspree (fetch API),
   smooth-scroll y resaltado de nav activo.
   Sin dependencias externas.
   ════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var HUBSPOT_CONFIG = {
    portalId: 'XXXXXXXX',
    formGuid: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
  };

  function esValorHubspotConfigVacio(valor) {
    return !valor || /^X+(-X+)*$/.test(valor);
  }

  function obtenerCookie(nombre) {
    var prefijo = nombre + '=';
    var partes = document.cookie ? document.cookie.split(';') : [];
    for (var i = 0; i < partes.length; i += 1) {
      var parte = partes[i].trim();
      if (parte.indexOf(prefijo) === 0) {
        return parte.slice(prefijo.length);
      }
    }
    return '';
  }

  function cargarHubSpotTracking() {
    if (esValorHubspotConfigVacio(HUBSPOT_CONFIG.portalId)) {
      return;
    }

    var scriptId = 'hubspot-tracking-loader';
    if (document.getElementById(scriptId)) {
      return;
    }

    var script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = 'https://js.hs-scripts.com/' + HUBSPOT_CONFIG.portalId + '.js';
    document.head.appendChild(script);
  }

  cargarHubSpotTracking();

  /* ── MENÚ HAMBURGUESA (móvil) ─────────────────── */
  var toggle  = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('nav-mobile');
  var navbar = document.querySelector('.navbar');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      mobileNav.setAttribute('aria-hidden', !open);
    });

    // Cerrar menú al hacer clic en un link interno
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ── BOTONES DE DESCARGA — NO DISPONIBLE ───────── */
  document.querySelectorAll('.btn-download').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var original = btn.textContent;
      btn.textContent = '🚫 No disponible por el momento';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.75';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
      }, 3000);
    });
  });

  /* ── FORMULARIO DE CONTACTO (HubSpot CRM) ──────── */
  var form    = document.getElementById('contact-form');
  var btnSend = document.getElementById('btn-submit');
  var success = document.getElementById('form-success');

  function obtenerValorCampo(formulario, selector) {
    var campo = formulario.querySelector(selector);
    return campo ? campo.value.trim() : '';
  }

  function construirPayloadHubSpot(formulario) {
    return {
      fields: [
        { name: 'firstname', value: obtenerValorCampo(formulario, '#firstname') },
        { name: 'lastname', value: obtenerValorCampo(formulario, '#lastname') },
        { name: 'email', value: obtenerValorCampo(formulario, '#email') },
        { name: 'phone', value: obtenerValorCampo(formulario, '#phone') },
        { name: 'company', value: obtenerValorCampo(formulario, '#company') },
        { name: 'jobtitle', value: obtenerValorCampo(formulario, '#jobtitle') },
        { name: 'country', value: obtenerValorCampo(formulario, '#country') },
        { name: 'interest_area', value: obtenerValorCampo(formulario, '#interest_area') },
        { name: 'message', value: obtenerValorCampo(formulario, '#message') }
      ],
      context: {
        hutk: obtenerCookie('hubspotutk'),
        pageUri: window.location.href,
        pageName: document.title
      }
    };
  }

  function hubspotEstaConfigurado() {
    return !esValorHubspotConfigVacio(HUBSPOT_CONFIG.portalId) && !esValorHubspotConfigVacio(HUBSPOT_CONFIG.formGuid);
  }

  function enviarAHubSpot(formulario) {
    var endpoint = 'https://api.hsforms.com/submissions/v3/integration/submit/' + HUBSPOT_CONFIG.portalId + '/' + HUBSPOT_CONFIG.formGuid;
    var payload = construirPayloadHubSpot(formulario);

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }

  var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/xergio.1625@gmail.com';

  function construirPayloadFormulario(formulario) {
    return {
      nombre:        obtenerValorCampo(formulario, '#firstname') + ' ' + obtenerValorCampo(formulario, '#lastname'),
      email:         obtenerValorCampo(formulario, '#email'),
      telefono:      obtenerValorCampo(formulario, '#phone'),
      laboratorio:   obtenerValorCampo(formulario, '#company'),
      cargo:         obtenerValorCampo(formulario, '#jobtitle'),
      pais:          obtenerValorCampo(formulario, '#country'),
      interes:       obtenerValorCampo(formulario, '#interest_area'),
      mensaje:       obtenerValorCampo(formulario, '#message'),
      _subject:      'Nuevo contacto desde Consensus QC Landing',
      _captcha:      'false'
    };
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      btnSend.disabled = true;
      btnSend.textContent = 'Enviando…';

      fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(construirPayloadFormulario(form))
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (success) {
              success.hidden = false;
              success.textContent = '✓ Mensaje enviado. Le responderemos pronto.';
            }
            btnSend.textContent = '✓ Enviado';
          } else {
            return res.json().then(function (json) {
              throw new Error(json.message || 'Error al enviar');
            });
          }
        })
        .catch(function () {
          btnSend.disabled = false;
          btnSend.textContent = 'Enviar solicitud';
          if (success) {
            success.hidden = false;
            success.textContent = 'No fue posible enviar el mensaje. Intente nuevamente.';
          }
        });
    });
  }

  /* ── RESALTADO DE NAV ACTIVO AL HACER SCROLL ──── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar nav a[href^="#"]');

  /* ── NAVBAR STICKY COMPACTA ───────────────────── */
  if (navbar) {
    var updateNavbarState = function () {
      if (window.scrollY > 50) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    };

    updateNavbarState();
    window.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateNavbarState);
    }, { passive: true });
  }

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.removeAttribute('aria-current');
            link.style.background = '';
            link.style.color = '';
          });
          var active = document.querySelector('.navbar nav a[href="#' + entry.target.id + '"]');
          if (active && !active.classList.contains('btn-nav')) {
            active.setAttribute('aria-current', 'page');
            active.style.background = 'rgba(255,255,255,.12)';
            active.style.color = '#fff';
          }
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ── ANIMACIONES DE ENTRADA ────────────────────── */
  var revealTargets = document.querySelectorAll([
    '.section-header',
    '.plan-flow .pf-step',
    '.plan-highlight-grid .ph-item',
    '.eco-grid .eco-card',
    '.eco-convergence',
    '.modules-grid .module-card',
    '.screenshots-grid .screenshot-item',
    '.pricing-grid .pricing-card',
    '.req-grid .req-item',
    '.faq-list .faq-item',
    '.contact-layout .contact-info',
    '.contact-layout .contact-form'
  ].join(', '));

  if (revealTargets.length && 'IntersectionObserver' in window) {
    revealTargets.forEach(function (element, index) {
      element.classList.add('js-reveal');
      element.classList.add('js-reveal-delay-' + ((index % 4) + 1));
      if (element.classList.contains('pf-step') || element.classList.contains('ph-item') || element.classList.contains('eco-card') || element.classList.contains('module-card')) {
        element.classList.add(index % 2 === 0 ? 'slide-left' : 'slide-right');
      }
    });

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });

    revealTargets.forEach(function (element) { revealObserver.observe(element); });
  } else {
    revealTargets.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  /* ── CONTADORES ANIMADOS ───────────────────────── */
  var counters = document.querySelectorAll('[data-count]');

  function animateCounter(element) {
    var target = parseFloat(element.getAttribute('data-count'));
    var decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
    var suffix = element.getAttribute('data-suffix') || '';
    var duration = 1300;
    var start = null;

    element.classList.add('is-counting');

    function tick(timestamp) {
      if (!start) { start = timestamp; }
      var progress = Math.min((timestamp - start) / duration, 1);
      var value = target * (0.18 + progress * 0.82);

      if (progress < 1) {
        if (decimals > 0) {
          element.textContent = value.toFixed(decimals) + suffix;
        } else {
          element.textContent = Math.round(value) + suffix;
        }
        requestAnimationFrame(tick);
      } else {
        if (decimals > 0) {
          element.textContent = target.toFixed(decimals) + suffix;
        } else {
          element.textContent = Math.round(target) + suffix;
        }
      }
    }

    requestAnimationFrame(tick);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });

    counters.forEach(function (counter) { counterObserver.observe(counter); });
  } else {
    counters.forEach(function (counter) {
      var suffix = counter.getAttribute('data-suffix') || '';
      var decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      var target = parseFloat(counter.getAttribute('data-count'));
      counter.textContent = decimals > 0 ? target.toFixed(decimals) + suffix : Math.round(target) + suffix;
    });
  }

  /* ── SCROLL SUAVE PARA TODOS LOS LINKS #hash ──── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
