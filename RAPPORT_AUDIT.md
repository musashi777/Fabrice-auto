# Rapport d'Audit Technique et Recommandations - Fabrice Auto

## 1. Vue d'ensemble
Le site est statique, généré avec Hugo. Il est propre, fonctionnel et bien structuré pour une activité artisanale locale. Cependant, des optimisations majeures sont nécessaires sur la performance (images) et le SEO technique pour garantir une bonne visibilité et expérience utilisateur.

## 2. Fonctionnalités et Points Forts
*   **Structure claire** : Navigation intuitive (Accueil, Profil, Services, Articles, Contact).
*   **Design responsive** : Le site s'adapte bien aux mobiles (vérifié via le code CSS et structure).
*   **Contenu localisé** : Bonne mise en avant de la zone d'intervention (Marseille).
*   **Interactivité** : Liens directs vers WhatsApp et téléphone ("Click-to-Call").
*   **Blog** : Section "Articles" présente, excellent pour le SEO à long terme.

## 3. Points Faibles et Problèmes Identifiés

### A. Performance (Critique 🔴)
*   **Poids des images** : C'est le problème principal.
    *   Exemple : `service-renovation-phares.png` fait **6.4 Mo**.
    *   Exemple : `hero-accueil.png` fait **5.6 Mo**.
    *   *Impact* : Temps de chargement très long sur mobile, pénalité SEO Google.
*   **Formats d'images** : Utilisation de PNG pour des photos (le JPEG ou WebP est bien plus léger).

### B. SEO Technique (Moyen 🟠)
*   **Structure Hn (Titres)** : Présence de **deux balises `<h1>`** sur la page Services (une dans le template, une dans le contenu Markdown).
    *   *Règle* : Une seule balise `<h1>` unique par page.
*   **Sitemap XML** : Les URLs sont générées en `http://localhost:1313/`.
    *   *Impact* : Google ne pourra pas indexer le site correctement si cela reste ainsi en production.
*   **Description Meta** : Présentes et bien remplies, c'est un bon point.

### C. Qualité du Code (Bonne 🟢)
*   Structure Hugo standard respectée.
*   CSS et JS propres et minifiés.
*   Formulaire de contact : Bien structuré, mais nécessite un backend (Netlify Forms, Formspree) pour fonctionner réellement en production (actuellement simulation JS).

---

## 4. Plan d'Améliorations et Optimisations

### Étape 1 : Optimisation des Images (Priorité Absolue)
*   **Action** : Convertir toutes les images PNG volumineuses (`assets/images/`) en format **WebP** ou **JPG compressé**.
*   **Cible** : Réduire le poids moyen d'une image de 6 Mo à < 200 Ko.
*   **Code** : Utiliser le "Image Processing" de Hugo dans les templates pour redimensionner automatiquement.

### Étape 2 : Correction de la Structure HTML
*   **Action** : Modifier les fichiers Markdown (`content/services.md`, etc.) pour ne pas utiliser `# Titre` (H1) dans le corps du texte, mais `## Titre` (H2), car le titre de la page est déjà le H1.
*   **Fichier** : `layouts/_default/single.html` ou les fichiers `.md`.

### Étape 3 : Configuration de Production
*   **Action** : Mettre à jour `hugo.toml`.
    *   Changer `baseURL` pour l'URL finale (ex: `https://fabrice-auto-marseille.fr`).
    *   Activer la minification HTML si ce n'est pas fait par défaut.

### Étape 4 : Amélioration Accessibilité & UX
*   **Action** : Ajouter des attributs `width` et `height` explicites aux images pour éviter le "Layout Shift" (décalage du contenu au chargement).
*   **Formulaire** : S'assurer que le formulaire pointe vers un service de traitement réel.

## 5. Exemple de modification de code proposée

**Pour corriger les titres doubles (H1) :**
Dans les fichiers Markdown (`content/**/*.md`), remplacer le premier `# Titre` par le Frontmatter `title` ou descendre les niveaux de titres.

*Avant (Problème)* :
```markdown
---
title: "Services"
---
# Mes services (Ceci crée un 2ème H1)
```

*Après (Correction)* :
```markdown
---
title: "Services"
---
## Mes services
```

---
**Prêt à appliquer ces corrections ?** Je peux commencer par l'optimisation des images et la correction des titres dès maintenant.
