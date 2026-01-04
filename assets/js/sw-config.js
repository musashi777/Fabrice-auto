// Configuration pour le Service Worker
export const CACHE_NAME = 'fabrice-auto-cache-v1';

// Version du cache - incrémenter pour forcer la mise à jour
export const CACHE_VERSION = 'v1.0.0';

// Fichiers à mettre en cache lors de l'installation
export const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/custom-fixes.css',
  '/css/messages.css',
  '/js/load-fonts.js',
  '/js/register-sw.js',
  // Les images optimisées seront ajoutées dynamiquement
];

// Extensions de fichiers à mettre en cache (pour le cache dynamique)
export const cacheableExtensions = [
  '.js',
  '.css',
  '.webp',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.json',
  '.html',
  '/', // Pour les routes
  'manifest.json'
];

// Chemins à toujours mettre en cache (regex)
export const alwaysCachePaths = [
  /\/$/, // Page d'accueil
  /\.(css|js|woff2?|ttf|eot)$/i, // Fichiers statiques
  /\/(images|img)\/.+\.(webp|png|jpg|jpeg|gif|svg)$/i, // Images
];

// Chemins à ne jamais mettre en cache
export const neverCachePaths = [
  /\/api\//, // API endpoints
  /\/admin\//, // Panneau d'administration
  /\/wp-json\//, // API WordPress (si pertinent)
  /\/graphql/, // Endpoints GraphQL
  /\/sockjs/,
  /\/ws/,
  /\/socket.io/
];

// Stratégie de mise en cache : Réseau d'abord, puis cache
export const networkFirstStrategy = async (request) => {
  try {
    // Essayer d'abord de récupérer depuis le réseau
    const networkResponse = await fetch(request);
    
    // Si la réponse est valide, la mettre en cache et la retourner
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // En cas d'échec, essayer de récupérer depuis le cache
    console.log('Récupération depuis le cache après échec réseau :', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Ressource non disponible hors ligne', { status: 503 });
  }
};

// Vérifie si une requête doit être mise en cache
// (Cette fonction est utilisée par les stratégies de cache)
export const shouldCacheRequest = (request) => {
  const url = new URL(request.url);
  
  // Ne pas mettre en cache les requêtes non-GET
  if (request.method !== 'GET') {
    return false;
  }
  
  // Vérifier les chemins à ne jamais mettre en cache
  if (neverCachePaths.some(regex => regex.test(url.pathname))) {
    return false;
  }
  
  // Vérifier les chemins à toujours mettre en cache
  if (alwaysCachePaths.some(regex => regex.test(url.pathname))) {
    return true;
  }
  
  // Vérifier les extensions de fichiers
  return cacheableExtensions.some(ext => 
    url.pathname.endsWith(ext) || 
    (ext === '/' && (url.pathname.endsWith('.html') || !url.pathname.includes('.')))
  );
};

// Nettoyage des anciens caches
export const cleanupOldCaches = async () => {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        console.log(`Service Worker: Suppression de l'ancien cache : ${cacheName}`);
        return caches.delete(cacheName);
      }
      return Promise.resolve();
    })
  );
};

// Fonction utilitaire pour mettre à jour le cache
export const updateCache = async (request, response) => {
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    return cache.put(request, response);
  }
  return Promise.resolve();
};
