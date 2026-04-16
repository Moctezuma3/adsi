# Changelog — ADSI Fonti SA

## 2026-04-15 — Restructuration architecture (lots 1 → 3+)

### 🏗 Nouvelle architecture CSS (base + composants + pages)
- `styles/base/variables.css` : source unique de toutes les variables CSS
  (unification des conventions `--white*` / `--w*` qui coexistaient)
- `styles/base/reset.css` : reset universel + règles `body`/`html`/`img`/`a`
- `styles/base/utilities.css` : classes utilitaires (`.container`, `.anim-1..5`, `.c-w*`)
- `styles/components/nav.css` : barre de navigation
- `styles/components/footer.css` : pied de page
- `styles/components/buttons.css` : `.btn-primary`, `.btn-red`, `.btn-secondary`, `.btn-out`
- `styles/animations.css` : tous les `@keyframes` centralisés
- `styles/main.css` : point d'entrée `@import` qui charge tout ce qui précède
- Chaque HTML charge désormais `main.css` **en premier**, puis `pages/<page>.css`

### 🏗 Nouvelle architecture JS (prête, pas encore branchée)
- `scripts/components/` + `scripts/pages/` : dossiers créés
- `scripts/main.js` : loader qui charge automatiquement `scripts/pages/<page>.js`
  en lisant `<body data-page="…">` (squelette, non branché — aucun script page créé)

### 🗂 Renommage des assets (kebab-case, sans espaces)
- `assets/bannieres/PAGE ACCUEIL.jpg` → `home.jpg` (+ 6 autres bannières renommées)
- `assets/images/PAGE A PROPOS/` → `apropos/` (+ 4 autres dossiers renommés)
- ⚠️ `assets/images/PAGE ACCUEIL/` reste à renommer à la main
  (dossier verrouillé par la preview pendant le refactor)

### 🧹 Nettoyage CSS
- `.anim-1` à `.anim-5` supprimés de `home.css` (désormais dans `utilities.css`)
- Blocs `:root` dupliqués retirés des 7 CSS de page (les variables viennent maintenant de `base/variables.css`)
- `home.css` et `contact.css` conservent un `:root` réduit aux seules valeurs qui leur sont propres (`--max: 1160px` pour home, `--w: #F4F6F8` pour contact)
- Règles reset (`*`, `html`, `body`) retirées de `apropos.css` et `partenaires.css`
- Classe `.fade-in` ajoutée dans `utilities.css` ; 6 `style="animation:fadeUp .6s ease both"` inline remplacés par cette classe

### 🗺 À faire dans un lot ultérieur
- Renommer `assets/images/PAGE ACCUEIL/` → `home/` + mettre à jour 5 références dans index.html
- Extraire les 40 blocs `<script>` inline vers `scripts/pages/<page>.js`
- Retirer les `:root` dupliqués dans chaque `styles/pages/<page>.css` (nécessite
  validation visuelle page par page car certaines variables divergent légèrement :
  ex. `--max` = 1160px sur home vs 1200px ailleurs)
- Consolider `mobile.css` + `responsive.css` + `enhance.css` en un seul fichier
  avec media queries groupées par breakpoint
- Extraire les 114 `style=""` inline en classes utilitaires
- Page-by-page : retirer les règles nav/footer/btn dupliquées dans chaque
  `pages/<page>.css` (main.css prend le relais — tester visuellement)

---

## 2026-04-15 — Refactor & audit qualité

### 🔴 Corrections critiques (HTML / accessibilité / SEO)
- Ajout de `<main id="main">` dans les 7 pages (contenu principal structuré)
- Ajout de `<link rel="canonical">` sur chaque page (évite la duplication SEO)
- Attribut `alt` descriptif sur toutes les images hero (fini `alt=""` vides)
- `<meta name="theme-color" content="#0A0C0F">` ajouté
- `<meta viewport>` : ajout de `viewport-fit=cover` pour iPhone avec encoche

### 🟠 Refactor CSS / design system
- Variable CSS `--accent` introduite (#2A7A9C), `--red` conservée comme alias rétrocompat
- Couleur `#2A7A9C` hardcodée remplacée par `var(--accent, ...)` dans tous les fichiers CSS
- Déduplication de `.logo-img` dans `home.css` (5 règles → 2)
- Classe utilitaire `.logo-invert` introduite dans `responsive.css`
- Nettoyage complet des `!important` (~10 900 → 0 dans le CSS) — sauvegardes dans `styles/_backup/`
- Remplacement de `overflow-x: hidden` par `overflow-x: clip` (évite de casser `position: sticky`)

### 🟡 JavaScript propre
- Création de `scripts/tabs.js` : gestion des onglets et accordéons via délégation d'événement
- Suppression des `onclick` inline (32 occurrences dans conseil-audit, telesurveillance, videosurveillance)
- Suppression des `<script>` inline contenant `switchTab()` / `toggleAcc()`
- Remplacement par `data-tab="..."` et `data-acc`

### ✨ Nouveautés responsive / UX
- `styles/responsive.css` : fichier dédié aux corrections UX finales
- Touch targets ≥ 44 × 44 px en mobile (accessibilité tactile)
- Formulaires : `font-size: 16px` min. sur mobile (évite le zoom iOS)
- `-webkit-tap-highlight-color: transparent` + feedback `opacity` au tap
- Espacements fluides via `clamp(min, fluide, max)` sur les sections
- `@media (hover: none)` : désactive le curseur custom sur écran tactile
- `@media (orientation: landscape) and (max-height: 500px)` : hero correct en paysage
- Safe-areas iPhone (`env(safe-area-inset-*)`)
- Styles footer complets ajoutés (étaient absents des autres pages)
- `<img loading="lazy" decoding="async">` sur toutes les images sauf hero (chargées en priorité)

### 🛠 Outillage projet
- Fichier `.gitignore` ajouté
- Fichier `CHANGELOG.md` ajouté

### 📁 Sauvegardes (supprimées le 2026-04-15)
- `styles/_backup/` — supprimé (1.2 MB, CSS pré-cleanup `!important`)
- `styles/mobile.css.backup` — supprimé (56 KB, mobile.css pré-cleanup)
- `scripts/components/` — dossier vide supprimé

### 🗺 À faire plus tard
- Convertir les bannières en WebP + `<picture>` / `srcset`
- Ajouter un JSON-LD `LocalBusiness` (SEO local)
- `<link rel="preload">` sur l'image hero above-the-fold
- Factoriser le CSS commun (30 000 lignes → ~8 000)
- Tester avec NVDA + audit Lighthouse mobile > 90
