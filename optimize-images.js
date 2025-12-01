const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const sharp = require('sharp');

// Configuration
const IMAGES_DIR = path.join(__dirname, 'assets/images');
const OUTPUT_DIR = path.join(__dirname, 'static/images/optimized');
const MAX_WIDTH = 1920; // Largeur maximale pour les images
const QUALITY = 80; // Qualité de compression (0-100)

// Créer le dossier de sortie s'il n'existe pas
fs.ensureDirSync(OUTPUT_DIR);

async function optimizeImages() {
  try {
    // Trouver tous les fichiers image dans le dossier source
    const files = await glob(`${IMAGES_DIR}/**/*.{jpg,jpeg,png}`, { nodir: true });
    
    console.log(`Traitement de ${files.length} images...`);
    
    // Traiter chaque image
    for (const file of files) {
      try {
        const filename = path.basename(file);
        const nameWithoutExt = path.basename(file, path.extname(file));
        const outputFile = path.join(OUTPUT_DIR, `${nameWithoutExt}.webp`);
        
        console.log(`Traitement de ${filename}...`);
        
        // Vérifier si le fichier de sortie existe déjà
        if (fs.existsSync(outputFile)) {
          console.log(`  ✓ Déjà optimisé: ${filename}`);
          continue;
        }
        
        // Lire et optimiser l'image avec sharp
        await sharp(file)
          .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true,
          })
          .webp({
            quality: QUALITY,
            effort: 6, // Niveau d'optimisation (0-6)
          })
          .toFile(outputFile);
        
        // Obtenir les tailles avant/après
        const beforeSize = fs.statSync(file).size / 1024;
        const afterSize = fs.statSync(outputFile).size / 1024;
        const saved = ((beforeSize - afterSize) / beforeSize * 100).toFixed(2);
        
        console.log(`  ✓ Optimisé: ${filename} (${beforeSize.toFixed(2)}KB → ${afterSize.toFixed(2)}KB, ${saved}% économisé)`);
        
      } catch (error) {
        console.error(`  ✗ Erreur lors du traitement de ${file}:`, error.message);
      }
    }
    
    console.log('Optimisation terminée !');
    
  } catch (error) {
    console.error('Une erreur est survenue :', error);
    process.exit(1);
  }
}

// Exécuter le script
optimizeImages();
