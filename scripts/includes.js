/* ADSI — Inclusion des partials (nav + footer) partagés.
 *
 * Ce script charge /partials/nav.html et /partials/footer.html et les
 * injecte dans la page à l'emplacement des balises :
 *   <div data-include="nav"></div>
 *   <div data-include="footer"></div>
 *
 * Une fois les partials présents dans le DOM, on charge mobile-nav.js et
 * enhance.js (qui s'attendent à trouver le <nav> en place).
 *
 * ⚠️ Nécessite un serveur local (fetch() ne fonctionne pas via file://).
 *    Utiliser Live Server (VS Code) ou `python -m http.server 8000`.
 */
(function () {
  'use strict';

  async function inject(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return;
    try {
      var res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var html = await res.text();
      // On remplace le placeholder par le contenu réel (sans conteneur superflu).
      el.outerHTML = html;
    } catch (err) {
      console.error('[includes] Impossible de charger ' + url, err);
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function boot() {
    await Promise.all([
      inject('[data-include="nav"]', 'partials/nav.html'),
      inject('[data-include="footer"]', 'partials/footer.html'),
    ]);
    // Les partials sont injectés : on charge les scripts qui en dépendent.
    await loadScript('scripts/mobile-nav.js');
    await loadScript('scripts/enhance.js');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
