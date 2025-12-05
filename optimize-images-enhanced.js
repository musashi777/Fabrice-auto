const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const sharp = require('sharp');

// Configuration améliorée
const IMAGES_DIR = path.join(__dirname, 'assets/images');
const OUTPUT_DIR = path.join(__dirname, 'static/images/optimized');
const QUALITY = 80; // Qualité de compression (0-100)

// Tailles pour le responsive images (srcset)
const BREAKPOINTS = [
  { width: 320, suffix: '-xs' },   // Mobile petit
  { width: 640, suffix: '-sm' },   // Mobile
  { width: 768, suffix: '-md' },   // Tablette
  { width: 1024, suffix: '-lg' },  // Desktop
  { width: 1280, suffix: '-xl' },  // Desktop large
  { width: 1920, suffix: '' },     // Original (par défaut)
];

// Créer le dossier de sortie s'il n'existe pas
fs.ensureDirSync(OUTPUT_DIR);

async function optimizeImage(file, breakpoint) {
  const filename = path.basename(file);
  const nameWithoutExt = path.basename(file, path.extname(file));
  const suffix = breakpoint.suffix || '';
  const outputFile = path.join(OUTPUT_DIR, `${nameWithoutExt}${suffix}.webp`);

  // Vérifier si le fichier de sortie existe déjà
  if (fs.existsSync(outputFile)) {
    return { file: outputFile, width: breakpoint.width, exists: true };
  }

  try {
    // Lire et optimiser l'image avec sharp
    const image = sharp(file);
    const metadata = await image.metadata();

    // Ne pas agrandir les images plus petites que la largeur cible
    const targetWidth = Math.min(breakpoint.width, metadata.width);

    await image
      .resize({
        width: targetWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality: QUALITY,
        effort: 6, // Niveau d'optimisation (0-6)
      })
      .toFile(outputFile);

    // Obtenir la taille du fichier
    const afterSize = fs.statSync(outputFile).size / 1024;

    return {
      file: outputFile,
      width: targetWidth,
      sizeKB: afterSize,
      exists: false
    };

  } catch (error) {
    console.error(`  ✗ Erreur lors du traitement de ${filename} (${breakpoint.width}px):`, error.message);
    return null;
  }
}

async function optimizeImages() {
  try {
    // Trouver tous les fichiers image dans le dossier source
    const files = await glob(`${IMAGES_DIR}/**/*.{jpg,jpeg,png}`, { nodir: true });

    console.log(`Traitement de ${files.length} images...`);

    // Statistiques
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let imagesProcessed = 0;

    // Traiter chaque image
    for (const file of files) {
      try {
        const filename = path.basename(file);
        const originalSize = fs.statSync(file).size / 1024;
        totalOriginalSize += originalSize;

        console.log(`\n📸 Traitement de ${filename} (${originalSize.toFixed(2)}KB)...`);

        // Générer toutes les tailles pour le srcset
        const optimizedVersions = [];

        for (const breakpoint of BREAKPOINTS) {
          const result = await optimizeImage(file, breakpoint);
          if (result) {
            optimizedVersions.push(result);
            if (!result.exists) {
              console.log(`  ✓ ${breakpoint.width}px: ${result.sizeKB.toFixed(2)}KB`);
            } else {
              console.log(`  ⏩ ${breakpoint.width}px: déjà optimisé`);
            }
          }
        }

        // Calculer les économies pour la taille par défaut (1920px)
        const defaultVersion = optimizedVersions.find(v => v.width === Math.min(1920, BREAKPOINTS[BREAKPOINTS.length - 1].width));
        if (defaultVersion) {
          totalOptimizedSize += defaultVersion.sizeKB;
          const saved = ((originalSize - defaultVersion.sizeKB) / originalSize * 100).toFixed(2);
          console.log(`  💾 Économie: ${saved}% (${originalSize.toFixed(2)}KB → ${defaultVersion.sizeKB.toFixed(2)}KB)`);
        }

        imagesProcessed++;

        // Générer le code HTML srcset pour référence
        if (optimizedVersions.length > 1) {
          const srcset = optimizedVersions
            .filter(v => v.width <= 1024) // Limiter aux tailles utiles pour srcset
            .map(v => `${path.basename(v.file)} ${v.width}w`)
            .join(', ');

          console.log(`  📐 srcset: ${srcset}`);
        }

      } catch (error) {
        console.error(`  ✗ Erreur lors du traitement de ${file}:`, error.message);
      }
    }

    // Afficher les statistiques finales
    console.log('\n' + '='.repeat(50));
    console.log('📊 STATISTIQUES FINALES');
    console.log('='.repeat(50));
    console.log(`Images traitées: ${imagesProcessed}/${files.length}`);
    console.log(`Taille totale originale: ${totalOriginalSize.toFixed(2)}KB`);
    console.log(`Taille totale optimisée: ${totalOptimizedSize.toFixed(2)}KB`);

    if (totalOriginalSize > 0) {
      const totalSaved = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(2);
      const totalSavedKB = (totalOriginalSize - totalOptimizedSize).toFixed(2);
      console.log(`Économie totale: ${totalSaved}% (${totalSavedKB}KB)`);
    }

    console.log('\n✨ Optimisation terminée !');
    console.log('\n💡 Prochaines étapes:');
    console.log('1. Mettre à jour le shortcode image.html pour utiliser srcset');
    console.log('2. Ajouter width/height explicites pour éviter le CLS');
    console.log('3. Précharger les images LCP critiques');

  } catch (error) {
    console.error('Une erreur est survenue :', error);
    process.exit(1);
  }
}

// Exécuter le script
optimizeImages();
