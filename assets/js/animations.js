/* ======================================================================
   SIPA Tech Solutions — Animations premium (GSAP + ScrollTrigger)
   Auto-hébergé, respecte prefers-reduced-motion.
   =================================================================== */
(function () {
  'use strict';
  if (!window.gsap) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // Signale au CSS que GSAP gère les révélations (les .reveal restent visibles par défaut)
  document.documentElement.classList.add('gsap-ready');

  // Respect de l'accessibilité : pas d'animation si l'utilisateur le demande
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var heroSelectors = ['.hero-eyebrow', '.hero-title', '.hero-tagline', '.hero-cta', '.hero-reassure'];
  var heroEls = heroSelectors.map(function (s) { return document.querySelector(s); }).filter(Boolean);

  /* 1) Entrée du hero (au chargement) */
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 42 });
    var tl = gsap.timeline({ delay: 0.15 });
    tl.to(heroEls, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 });
    var title = document.querySelector('.hero-title');
    if (title) tl.from(title, { scale: 1.05, filter: 'blur(10px)', duration: 1.2, ease: 'power3.out' }, 0.15);
  }

  /* 2) Révélations au défilement pour tous les .reveal (hors hero) */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    if (heroEls.indexOf(el) !== -1) return;
    gsap.from(el, {
      opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  /* 3) Cartes : apparition en cascade avec un léger rebond */
  gsap.utils.toArray('.cards').forEach(function (grid) {
    var cards = grid.querySelectorAll('.card');
    if (!cards.length) return;
    gsap.from(cards, {
      opacity: 0, y: 44, scale: 0.96, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.09,
      scrollTrigger: { trigger: grid, start: 'top 85%' }
    });
  });

  /* 4) Parallaxe de profondeur sur les halos d'ambiance */
  gsap.utils.toArray('.orb').forEach(function (orb, i) {
    gsap.to(orb, {
      yPercent: (i % 2 ? -1 : 1) * 22, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
  });

  /* 5) Titres de section : léger effet de montée + apparition du soulignement doré */
  gsap.utils.toArray('.section-head h2, .section-head .kicker').forEach(function (el) {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

})();
