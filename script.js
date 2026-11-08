/* ======================================================================
   SIPA Tech Solutions — interactions (refonte v2)
   =================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var WA_NUMBER = '237655282559';
  var header = document.getElementById('header');
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  var waFloat = document.querySelector('.wa-float');
  var mobileCta = document.querySelector('.mobile-cta');

  /* En-tête, barre de progression, bouton WhatsApp flottant */
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (waFloat) waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
    if (mobileCta) mobileCta.classList.toggle('show', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  menuToggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Lien actif dans la navigation selon la section visible */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var s = document.querySelector(l.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }

  /* Apparition au défilement — GSAP prend le relais s'il est chargé (animations.js) */
  var revealEls = document.querySelectorAll('.reveal');
  if (!window.gsap) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* Compteurs animés */
  var counters = document.querySelectorAll('[data-count]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10) || 0;
        var start = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / 1200, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }

  /* Boutons des formules : pré-remplissent le formulaire */
  document.querySelectorAll('[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var msg = document.getElementById('message');
      if (msg && !msg.value) msg.value = 'Je suis intéressé(e) par la formule ' + btn.dataset.plan + '. ';
    });
  });

  /* FAQ : une seule réponse ouverte à la fois */
  var faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Formulaire de devis -> message WhatsApp pré-rempli */
  var form = document.getElementById('contactForm');
  if (form) {
    var success = document.getElementById('formSuccess');
    var fsName = document.getElementById('fsName');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      form.querySelectorAll('[required]').forEach(function (f) {
        var ok = f.value.trim() !== '';
        f.closest('.field').classList.toggle('invalid', !ok);
        if (!ok && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var lines = [
        'Bonjour SIPA Tech Solutions, je souhaite un devis :',
        'Nom : ' + name,
        'WhatsApp / Tél : ' + form.phone.value.trim(),
        email ? 'Email : ' + email : '',
        'Type de projet : ' + form.type.value,
        'Projet : ' + form.message.value.trim()
      ].filter(Boolean);
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      fsName.textContent = name.split(' ')[0];
      success.hidden = false;
      form.reset();
    });
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('invalid');
    });
    form.querySelector('.fs-again').addEventListener('click', function () {
      success.hidden = true;
      form.querySelector('#name').focus();
    });
  }

  /* Année */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
