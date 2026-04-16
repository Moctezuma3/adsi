/* ============================================================
   MAIN.JS — point d'entrée JS (squelette, prêt pour évolution)
   ------------------------------------------------------------
   But : charger dynamiquement un script spécifique à la page
   courante, lu depuis <body data-page="…">.

   Exemple : si <body data-page="contact">, ce script chargera
   automatiquement scripts/pages/contact.js (quand il existera).

   Pour l'instant, la plupart des scripts page vivent encore en
   inline dans chaque HTML. Cette infrastructure est prête pour
   les migrer progressivement, un par un, vers des fichiers
   dédiés dans scripts/pages/.

   USAGE : <script src="/scripts/main.js" defer></script>
   ============================================================ */

(function () {
  const page = document.body?.dataset?.page;
  if (!page) return;

  // Chemin absolu depuis la racine du site
  const scriptPath = `/scripts/pages/${page}.js`;

  // Charge le script s'il existe (404 silencieux si pas encore créé)
  const s = document.createElement('script');
  s.src = scriptPath;
  s.defer = true;
  s.onerror = () => { /* pas de script page dédié — normal pour l'instant */ };
  document.head.appendChild(s);
})();
