/* ADSI — Tabs & Accordions
 * ---------------------------------------------------------------------------
 * Remplace les anciens `onclick="switchTab(...)"` et `onclick="toggleAcc(...)"`
 * par une délégation d'événement propre. Le HTML annonce son intention via
 * les attributs `data-tab="KEY"` et `data-acc` ; ce script écoute sur le
 * document et réagit.
 *
 * Avantages : pas de JS dans le HTML, facile à maintenir, ajoute/retire des
 * onglets sans toucher au JS, compatible Content Security Policy.
 * ---------------------------------------------------------------------------
 */
(function () {
  'use strict';

  /* ── TABS ───────────────────────────────────────────────────────────── */
  function handleTabClick(btn) {
    var target = btn.getAttribute('data-tab');
    if (!target) return;

    // Désactive tous les boutons et panneaux
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    document.querySelectorAll('.panel').forEach(function (p) {
      p.classList.remove('active');
    });

    // Active le bouton cliqué et son panneau associé (#p-KEY)
    btn.classList.add('active');
    var panel = document.getElementById('p-' + target);
    if (panel) panel.classList.add('active');

    // Scroll doux vers la zone des onglets
    var strip = document.querySelector('.tabs-strip');
    if (strip) {
      window.scrollTo({ top: strip.offsetTop - 60, behavior: 'smooth' });
    }
  }

  /* ── ACCORDIONS ─────────────────────────────────────────────────────── */
  function handleAccordionClick(btn) {
    var body = btn.nextElementSibling;
    if (!body) return;

    var isOpen = btn.classList.contains('open');

    // Ferme tous les accordéons
    document.querySelectorAll('.acc-btn').forEach(function (b) {
      b.classList.remove('open');
    });
    document.querySelectorAll('.acc-body').forEach(function (b) {
      b.classList.remove('open');
    });

    // Rouvre celui cliqué s'il n'était pas déjà ouvert
    if (!isOpen) {
      btn.classList.add('open');
      body.classList.add('open');
    }
  }

  /* ── DÉLÉGATION D'ÉVÉNEMENTS ────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var tabBtn = e.target.closest('.tab-btn');
    if (tabBtn) {
      handleTabClick(tabBtn);
      return;
    }

    var accBtn = e.target.closest('.acc-btn');
    if (accBtn) {
      handleAccordionClick(accBtn);
    }
  });
})();
