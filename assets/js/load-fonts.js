// Chargement asynchrone des polices Google
function loadGoogleFonts() {
  // Créer un élément de lien pour les polices
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  link.media = 'print';
  link.onload = function() {
    // Une fois chargées, basculer vers l'affichage à l'écran
    this.media = 'all';
  };
  
  // Ajouter le lien au document
  document.head.appendChild(link);
}

// Démarrer le chargement des polices
document.addEventListener('DOMContentLoaded', loadGoogleFonts);
