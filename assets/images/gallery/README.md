# Galerie d'images

Ce dossier contient les images utilisées dans la galerie du site.

## Structure recommandée

```
assets/images/gallery/
├── avant1.jpg         # Image avant 1
├── apres1.jpg        # Image après 1
├── avant2.jpg        # Image avant 2
├── apres2.jpg        # Image après 2
├── phare-avant.jpg   # Phare avant rénovation
└── phare-apres.jpg   # Phare après rénovation
```

## Recommandations

- Utilisez des images au format JPG ou WebP
- Taille recommandée : 1200x800px minimum
- Poids maximum : 500KB par image
- Nommez les fichiers de manière descriptive
- Pour chaque paire avant/après, utilisez des noms cohérents (ex: `siege-avant1.jpg` et `siege-apres1.jpg`)

## Comment ajouter des images

1. Téléchargez vos images dans ce dossier
2. Mettez à jour la page `content/galerie/_index.md` pour référencer les nouvelles images
3. Redémarrez le serveur Hugo pour voir les changements
