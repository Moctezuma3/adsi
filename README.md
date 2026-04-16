# ADSI Fonti SA — Site web (version finale)

Site vitrine statique de la société **ADSI Fonti SA** (sécurité privée, Suisse romande, depuis 1963).
Technologies : HTML + CSS + JavaScript vanilla — aucune dépendance, aucun build.

---

## ✨ Ce qui est différent de la version `adsi-clean`

| Point                            | `adsi-clean`                          | `adsi-final` ⭐                                |
|----------------------------------|---------------------------------------|------------------------------------------------|
| **Menu (`<nav>`)** dans le HTML | Dupliqué dans les 7 pages             | **Un seul fichier** `partials/nav.html`        |
| **Pied de page (`<footer>`)**   | Dupliqué dans les 7 pages             | **Un seul fichier** `partials/footer.html`     |
| Modifier un lien de menu        | Éditer **7 fichiers** 😩              | Éditer **1 fichier** ✨                        |

👉 Résultat : **une seule source de vérité** pour la navigation et le pied de page.

---

## 📁 Structure du projet

```
adsi-final/
├── index.html                  ← page d'accueil
│
├── pages/                      ← 6 autres pages HTML
│   ├── apropos.html
│   ├── contact.html
│   ├── partenaires.html
│   ├── conseil-audit.html
│   ├── telesurveillance.html
│   └── videosurveillance.html
│
├── partials/                   ⭐ morceaux HTML partagés
│   ├── nav.html                    la barre de navigation
│   └── footer.html                 le pied de page
│
├── styles/                     ← feuilles de styles
│   ├── pages/                      styles spécifiques à chaque page
│   ├── enhance.css                 sliders, transitions partagés
│   └── mobile.css                  media queries responsive
│
├── scripts/                    ← JavaScript vanilla
│   ├── includes.js             ⭐ chargeur des partials (nav/footer)
│   ├── mobile-nav.js               menu hamburger + carrousel logos
│   └── enhance.js                  surbrillance nav + sliders auto
│
├── assets/                     ← images et ressources
│   ├── logo-adsi.png
│   ├── images/
│   ├── bannieres/
│   └── logos-partenaires/
│
├── contenu/                    ← textes de référence
└── README.md                   ← ce fichier
```

---

## 🧠 Comment ça marche ? (simple, niveau débutant)

Dans chaque fichier HTML, là où il y avait avant `<nav>...</nav>`, on a maintenant :

```html
<div data-include="nav"></div>
```

Quand la page charge, le script **`scripts/includes.js`** :
1. Lit le fichier `partials/nav.html`
2. Injecte son contenu **à la place du placeholder**
3. Fait pareil pour le footer
4. Puis démarre les autres scripts (`mobile-nav.js`, `enhance.js`)

C'est l'équivalent "maison" de ce que font les frameworks (React, Astro) — sans installer quoi que ce soit.

---

## 🚀 Comment lancer le site

⚠️ **Important** : `scripts/includes.js` utilise `fetch()` pour charger les partials. Cela ne fonctionne **pas** en ouvrant le fichier par double-clic (`file://`). Il faut un petit serveur local.

### Option recommandée : VS Code + Live Server

1. Ouvrir le dossier `adsi-final/` dans Visual Studio Code
2. Installer l'extension **Live Server** (de Ritwick Dey)
3. Clic droit sur `index.html` → *Open with Live Server*
4. Le site s'ouvre à `http://127.0.0.1:5500/` et se recharge quand tu sauvegardes

### Option alternative : Python / Node

```bash
cd adsi-final
python -m http.server 8000     # si Python installé
# OU
npx serve .                    # si Node installé
```

---

## 🎨 Où modifier quoi ?

| Ce que tu veux changer            | Fichier à éditer                              |
|-----------------------------------|-----------------------------------------------|
| Les liens du menu                 | ⭐ **`partials/nav.html`** (une seule fois !)  |
| Le pied de page                   | ⭐ **`partials/footer.html`**                  |
| Les couleurs, la police           | `styles/pages/home.css` → bloc `:root {}`     |
| Un texte spécifique               | Le `.html` de la page concernée               |
| Le comportement du menu mobile    | `scripts/mobile-nav.js`                       |
| Le responsive mobile              | `styles/mobile.css`                           |
| Ajouter une image                 | Mettre dans `assets/images/` puis `/assets/images/ton-image.png` |

---

## 🎯 Les variables CSS (`:root`)

Tu peux changer toute l'identité visuelle en modifiant **une seule fois** ces variables en haut de chaque fichier CSS :

```css
:root {
  --ink:   #0A0C0F;   /* couleur de fond (noir) */
  --red:   #2A7A9C;   /* couleur accent (bleu) */
  --white: #F5F4F0;   /* couleur du texte */
  --max:   1160px;    /* largeur max du contenu */
  --serif: 'General Sans', sans-serif;
}
```

---

## 🧪 Tests après modification

1. Page s'affiche correctement → ✅
2. **F12 → Console** : aucune erreur rouge
3. **F12 → Network** : aucun **404**, et on voit `nav.html` + `footer.html` se charger
4. Réduire la fenêtre à < 768px → menu hamburger apparaît
5. Cliquer chaque lien du menu → toutes les pages s'affichent

---

## 📚 Pour progresser (débutant)

- [ ] **Git** : fais un commit après chaque modif (filet de sécurité)
- [ ] **F12 → Elements** : voir quel CSS s'applique à un élément
- [ ] **Accessibilité** : tester avec un lecteur d'écran (NVDA gratuit)
- [ ] **Performance** : compresser les images dans `assets/` (TinyPNG)
- [ ] **Prochaine étape** : apprendre **Astro** ou **Eleventy** — un vrai générateur de site statique qui fait tout ça (partials, templates) au build, sans `fetch()` au runtime

---

## 🔧 Récap des améliorations

| | Original | `adsi-clean` | `adsi-final` ⭐ |
|---|---|---|---|
| HTML + CSS mélangés | 37 000 lignes | — | — |
| CSS externe | ❌ | ✅ | ✅ |
| Assets renommés propres | ❌ | ✅ | ✅ |
| Chemins absolus | ❌ | ✅ | ✅ |
| Nav/footer factorisés | ❌ | ❌ | ✅ |
| Une source de vérité pour le menu | ❌ | ❌ | ✅ |

Le projet est maintenant **organisé, maintenable et proche du niveau pro** tout en restant **100% vanilla** (HTML/CSS/JS sans build).
