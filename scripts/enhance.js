/* ============================================================
   ADSI — Enhance layer (vanilla JS, no deps)
   - Nav active (URL → .is-active)
   - Autoplay sliders mobile (services + values)
   - Pagination dots pour les sliders autoplay
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Nav active ---------- */
  function initNavActive() {
    var page = document.body.getAttribute('data-page');
    if (!page) {
      // Auto-détection par nom de fichier si data-page absent
      var path = (location.pathname.split('/').pop() || '').toLowerCase();
      var map = {
        'adsi_homepage_design.html': 'home',
        'adsi_telesurveilance_v2.html': 'telesurveillance',
        'adsi_videosurveillance.html': 'videosurveillance',
        'adsi_conseil_audit.html': 'conseil',
        'adsi_partenaires.html': 'partenaires',
        'adsi_apropos.html': 'apropos',
        'adsi_contact.html': 'contact'
      };
      page = map[path] || '';
    }
    if (!page) return;

    var pageToHref = {
      home: 'adsi_homepage_design.html',
      telesurveillance: 'adsi_telesurveilance_v2.html',
      videosurveillance: 'adsi_videosurveillance.html',
      conseil: 'adsi_conseil_audit.html',
      partenaires: 'adsi_partenaires.html',
      apropos: 'adsi_apropos.html',
      contact: 'adsi_contact.html'
    };
    var targetHref = pageToHref[page];
    if (!targetHref) return;

    var links = document.querySelectorAll('.nav-links a, nav a');
    links.forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].split('?')[0];
      if (!href) return;
      if (href === targetHref || href.endsWith('/' + targetHref)) {
        a.classList.add('is-active');
      }
    });
  }

  /* ---------- 2. Autoplay sliders mobile ---------- */
  // Sections à autoplay: services (4s), values/val (4s). Réalisations (cases-grid)
  // PAS d'autoplay selon la décision produit : swipe manuel uniquement.
  var AUTOPLAY_SELECTORS = [
    '.services-grid',
    '.values-grid',
    '.value-grid',
    '.val-grid'
  ];
  var AUTOPLAY_INTERVAL = 4000;
  var PAUSE_AFTER_INTERACT = 6000;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function initAutoplaySlider(el) {
    if (el.dataset.autoplayInit === '1') return;
    el.dataset.autoplayInit = '1';
    el.classList.add('is-autoplay');

    var items = Array.prototype.filter.call(el.children, function (c) {
      return c.nodeType === 1;
    });
    if (items.length < 2) return;

    // Crée container de dots
    var dots = document.createElement('div');
    dots.className = 'slider-dots';
    dots.setAttribute('aria-hidden', 'true');
    items.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Aller à la carte ' + (i + 1));
      if (i === 0) b.classList.add('is-current');
      b.addEventListener('click', function () {
        scrollToIndex(i);
        pauseTemporarily();
      });
      dots.appendChild(b);
    });
    el.parentNode.insertBefore(dots, el.nextSibling);

    var currentIndex = 0;
    var timer = null;
    var pausedUntil = 0;

    function scrollToIndex(i) {
      var target = items[i];
      if (!target) return;
      var left = target.offsetLeft - el.offsetLeft - 18;
      el.scrollTo({ left: left, behavior: 'smooth' });
      currentIndex = i;
      updateDots();
    }

    function updateDots() {
      var dotBtns = dots.querySelectorAll('button');
      dotBtns.forEach(function (b, i) {
        b.classList.toggle('is-current', i === currentIndex);
      });
    }

    function advance() {
      if (!isMobile()) return;
      if (Date.now() < pausedUntil) return;
      if (document.hidden) return;
      var next = (currentIndex + 1) % items.length;
      scrollToIndex(next);
    }

    function start() {
      stop();
      if (!isMobile()) return;
      timer = setInterval(advance, AUTOPLAY_INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function pauseTemporarily() {
      pausedUntil = Date.now() + PAUSE_AFTER_INTERACT;
    }

    // Détecte l'index actuel au scroll manuel
    var scrollTimeout;
    el.addEventListener('scroll', function () {
      pauseTemporarily();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var closest = 0;
        var minDist = Infinity;
        var scrollLeft = el.scrollLeft;
        items.forEach(function (item, i) {
          var dist = Math.abs(item.offsetLeft - el.offsetLeft - 18 - scrollLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        if (closest !== currentIndex) {
          currentIndex = closest;
          updateDots();
        }
      }, 120);
    }, { passive: true });

    // Pause au toucher
    ['touchstart', 'pointerdown'].forEach(function (evt) {
      el.addEventListener(evt, pauseTemporarily, { passive: true });
    });

    // Pause si section pas visible
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.3 });
      io.observe(el);
    } else {
      start();
    }

    // Réagit au resize (desktop -> pas d'autoplay)
    var mq = window.matchMedia('(max-width: 768px)');
    var onChange = function () {
      if (isMobile()) start(); else stop();
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);

    // Pause quand onglet caché
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (isMobile()) start();
    });
  }

  function initAllSliders() {
    AUTOPLAY_SELECTORS.forEach(function (sel) {
      var nodes = document.querySelectorAll(sel);
      nodes.forEach(initAutoplaySlider);
    });
  }

  /* ---------- 3. Tabs → Accordéon mobile (Télé/Vidéo/Conseil) ---------- */
  function initTabsAsAccordionMobile() {
    if (!isMobile()) return;

    var strips = document.querySelectorAll('.tabs-strip');
    strips.forEach(function (strip) {
      if (strip.dataset.accInit === '1') return;
      strip.dataset.accInit = '1';

      var buttons = strip.querySelectorAll('.tab-btn');
      if (!buttons.length) return;

      // Masque la barre tabs sticky
      strip.style.display = 'none';

      // Container pour les accordéons
      var accWrap = document.createElement('div');
      accWrap.className = 'tabs-acc-wrap';

      // Trouver un parent commun proche pour insérer les accordéons
      var contentWrap = document.querySelector('.content-wrap');
      if (!contentWrap) return;

      buttons.forEach(function (btn, i) {
        var onclickAttr = btn.getAttribute('onclick') || '';
        var match = onclickAttr.match(/switchTab\(['"]([^'"]+)['"]/);
        if (!match) return;
        var slug = match[1];
        var panel = document.getElementById('p-' + slug);
        if (!panel) return;

        // Wrapper accordéon
        var item = document.createElement('div');
        item.className = 'acc-mobile-item';
        item.dataset.tabSlug = slug;

        var head = document.createElement('button');
        head.type = 'button';
        head.className = 'acc-mobile-head';
        head.innerHTML = btn.innerHTML;
        head.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');

        var body = document.createElement('div');
        body.className = 'acc-mobile-body';

        // Déplacer le contenu du panel dans body
        while (panel.firstChild) body.appendChild(panel.firstChild);

        item.appendChild(head);
        item.appendChild(body);
        accWrap.appendChild(item);

        // Masquer le panel original (il est maintenant vide)
        panel.style.display = 'none';

        if (i === 0) item.classList.add('is-open');

        head.addEventListener('click', function () {
          var open = item.classList.toggle('is-open');
          head.setAttribute('aria-expanded', open ? 'true' : 'false');
          if (open) {
            // Scroll doux vers l'accordéon ouvert
            setTimeout(function () {
              item.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 250);
          }
        });

        // Gestion clavier (Enter/Space)
        head.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            head.click();
          }
        });
      });

      // Insérer accWrap au tout début du content-wrap
      contentWrap.insertBefore(accWrap, contentWrap.firstChild);
    });
  }

  /* ---------- 4. Listes longues → toggle "Voir plus" mobile ---------- */
  var COLLAPSIBLE_LIST_SELECTORS = [
    '.m-list',
    '.methods',
    '.methods-list',
    '.insight-list',
    '.acc-methods',
    '.timeline',
    '.exp-list',
    '.offer-list'
  ];
  var VISIBLE_ITEMS_DEFAULT = 4;

  function initCollapsibleLists() {
    if (!isMobile()) return;

    COLLAPSIBLE_LIST_SELECTORS.forEach(function (sel) {
      var lists = document.querySelectorAll(sel);
      lists.forEach(function (list) {
        if (list.dataset.collapseInit === '1') return;
        var items = Array.prototype.filter.call(list.children, function (c) {
          return c.nodeType === 1;
        });
        if (items.length <= VISIBLE_ITEMS_DEFAULT + 1) return;
        list.dataset.collapseInit = '1';

        // Masquer les items au-delà du seuil
        for (var i = VISIBLE_ITEMS_DEFAULT; i < items.length; i++) {
          items[i].classList.add('is-hidden-mobile');
        }

        // Créer le bouton toggle
        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'list-toggle-mobile';
        var hiddenCount = items.length - VISIBLE_ITEMS_DEFAULT;
        toggle.innerHTML = 'Voir ' + hiddenCount + ' élément' + (hiddenCount > 1 ? 's' : '') + ' de plus';

        var expanded = false;
        toggle.addEventListener('click', function () {
          expanded = !expanded;
          items.forEach(function (it, idx) {
            if (idx >= VISIBLE_ITEMS_DEFAULT) {
              it.classList.toggle('is-hidden-mobile', !expanded);
            }
          });
          toggle.innerHTML = expanded
            ? 'Masquer'
            : 'Voir ' + hiddenCount + ' élément' + (hiddenCount > 1 ? 's' : '') + ' de plus';
        });

        list.parentNode.insertBefore(toggle, list.nextSibling);
      });
    });
  }

  /* ---------- 5. Ready ---------- */
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  ready(function () {
    initNavActive();
    initAllSliders();
    initTabsAsAccordionMobile();
    initCollapsibleLists();
  });
})();
