/* Portafolio: animaciones al aparecer, menú activo y botón "volver arriba".
   Sin dependencias. Si el navegador no lo soporta, el sitio se ve igual (sin efectos). */
(function () {
  'use strict';

  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Aparición suave de las secciones */
  var items = document.querySelectorAll(
    'main section .wrap > *:not(.groups):not(.tl):not(.edu), .groups > *, .tl > *, .edu > *'
  );
  if ('IntersectionObserver' in window && !reducir) {
    var visor = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); visor.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) {
      var hermanos = el.parentNode.children;
      var i = Array.prototype.indexOf.call(hermanos, el);
      if (el.parentNode.matches('.groups, .tl, .edu')) { el.style.transitionDelay = (i % 3) * 80 + 'ms'; }
      el.classList.add('reveal');
      visor.observe(el);
    });
  }

  /* 2. Menú activo + 3. Botón volver arriba */
  var nav = document.querySelector('header.top nav');
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('header.top nav a[href^="#"]'));
  var secciones = enlaces.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
                         .filter(Boolean);
  var botonArriba = document.querySelector('.to-top');
  var actual = null, pendiente = false;

  function marcar(id) {
    enlaces.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) {
        a.setAttribute('aria-current', 'location');
        /* centra el enlace activo dentro del menú (útil en celular) */
        var n = nav.getBoundingClientRect(), r = a.getBoundingClientRect();
        nav.scrollTo({ left: nav.scrollLeft + (r.left - n.left) - nav.clientWidth / 2 + r.width / 2,
                       behavior: reducir ? 'auto' : 'smooth' });
      } else { a.removeAttribute('aria-current'); }
    });
  }

  function actualizar() {
    pendiente = false;
    var linea = window.innerHeight * 0.35, id = secciones[0] && secciones[0].id;
    secciones.forEach(function (s) { if (s.getBoundingClientRect().top <= linea) { id = s.id; } });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      id = secciones[secciones.length - 1].id;
    }
    if (id && id !== actual) { actual = id; marcar(id); }
    if (botonArriba) { botonArriba.classList.toggle('show', window.scrollY > 500); }
  }

  function pedir() { if (!pendiente) { pendiente = true; window.requestAnimationFrame(actualizar); } }
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  actualizar();
})();
