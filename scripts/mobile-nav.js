/* ADSI — Mobile navigation toggle (vanilla, no deps) */
(function () {
  'use strict';

  function init() {
    var ham = document.querySelector('.nav-ham');
    var panel = document.querySelector('.nav-links');
    if (!ham || !panel) return;

    // Neutralise l'onclick inline existant et réinitialise le style inline display.
    ham.onclick = null;
    ham.removeAttribute('onclick');
    panel.style.display = '';

    // Remplace le ☰ texte par 3 barres (la barre du milieu en <span>,
    // les deux autres via ::before/::after pilotés en CSS).
    if (!ham.querySelector('span')) {
      ham.textContent = '';
      var bar = document.createElement('span');
      ham.appendChild(bar);
    }

    ham.setAttribute('aria-label', 'Menu');
    ham.setAttribute('aria-expanded', 'false');
    ham.setAttribute('aria-controls', 'nav-links');
    if (!panel.id) panel.id = 'nav-links';

    function setOpen(open) {
      document.body.classList.toggle('menu-open', open);
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function toggle() { setOpen(!document.body.classList.contains('menu-open')); }
    function close()  { setOpen(false); }

    ham.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    // Fermer en cliquant sur un lien interne
    panel.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.tagName === 'A') close();
    });

    // Escape ferme le menu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Fermer quand on revient en desktop
    var mq = window.matchMedia('(min-width: 769px)');
    var onChange = function (ev) { if (ev.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ------------------------------------------------------------
     Bandeau marques compatibles : dupliquer les logos pour
     obtenir un marquee seamless (desktop + mobile).
     ------------------------------------------------------------ */
  function initBrandsMarquee() {
    var rows = document.querySelectorAll('.brands-row.brands-logos');
    rows.forEach(function (row) {
      if (row.querySelector('.brands-track')) return; // déjà initialisé
      var children = Array.prototype.slice.call(row.children);
      if (children.length === 0) return;

      var track = document.createElement('div');
      track.className = 'brands-track';
      children.forEach(function (c) { track.appendChild(c); });

      // Duplique le contenu pour un loop continu
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      // Append both tracks side by side inside the row
      var wrapper = document.createDocumentFragment();
      // On réutilise `track` pour le 1er, puis on ajoute les clones du contenu dans le même track
      Array.prototype.slice.call(clone.children).forEach(function (c) {
        track.appendChild(c);
      });
      row.appendChild(track);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      initBrandsMarquee();
    });
  } else {
    init();
    initBrandsMarquee();
  }
})();
