/* ======================================================================
   SIPA Tech Solutions — animations (GSAP + ScrollTrigger, auto-hébergés)
   Respecte prefers-reduced-motion.
   =================================================================== */
(function () {
  'use strict';
  if (!window.gsap) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // GSAP gère les apparitions : les .reveal restent visibles par défaut côté CSS
  document.documentElement.classList.add('gsap-ready');
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* 1) Entrée du hero */
  var heroCopy = gsap.utils.toArray('.hero-copy .reveal');
  gsap.from(heroCopy, { opacity: 0, y: 34, duration: .9, ease: 'power3.out', stagger: .1, delay: .1 });
  gsap.from('.browser-front', { opacity: 0, y: 60, rotate: -2, duration: 1.2, ease: 'power3.out', delay: .3 });
  gsap.from('.browser-back', { opacity: 0, y: 80, rotate: 6, duration: 1.2, ease: 'power3.out', delay: .45 });
  gsap.from('.float-chip', { opacity: 0, scale: .8, duration: .7, ease: 'back.out(1.8)', stagger: .15, delay: 1 });

  /* 2) Parallaxe légère des fenêtres du hero */
  gsap.to('.browser-back', { yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.browser-front', { yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* 3) Apparitions au défilement, en cascade par groupe */
  var groups = ['.bento', '.demos', '.stats', '.steps', '.pricing'];
  var grouped = [];
  groups.forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid) return;
    var items = grid.querySelectorAll('.reveal');
    grouped = grouped.concat(Array.prototype.slice.call(items));
    gsap.from(items, { opacity: 0, y: 40, duration: .8, ease: 'power3.out', stagger: .08,
      scrollTrigger: { trigger: grid, start: 'top 85%' } });
  });
  gsap.utils.toArray('.reveal').forEach(function (el) {
    if (heroCopy.indexOf(el) !== -1 || grouped.indexOf(el) !== -1) return;
    gsap.from(el, { opacity: 0, y: 36, duration: .85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
})();
