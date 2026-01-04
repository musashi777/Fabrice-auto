// Stratégies de mise en cache pour le Service Worker

import { CACHE_NAME, cacheableExtensions } from './sw-config';

/**
 * Stratégie de mise en cache : Cache First
 * Vérifie d'abord le cache, puis le réseau si nécessaire
 */
export const cacheFirstStrategy = async (request) => {
  try {
    // Essayer de récupérer depuis le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Si non trouvé dans le cache, faire une requête réseau
    const networkResponse = await fetch(request);
    
    // Vérifier si la réponse est valide
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }

    // Mettre en cache la réponse pour les requêtes suivantes
    if (shouldCacheRequest(request)) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.error('Erreur dans la stratégie cacheFirst:', error);
    
    // En cas d'erreur, on peut retourner une page de secours
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Ressource non disponible hors ligne', {
      status: 503,
      statusText: 'Hors ligne',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
};

/**
 * Vérifie si une requête doit être mise en cache
 */
function shouldCacheRequest(request) {
  const url = new URL(request.url);
  
  // Ne pas mettre en cache les requêtes non-GET
  if (request.method !== 'GET') {
    return false;
  }
  
  // Vérifier si l'URL correspond à une extension mise en cache
  const isCacheable = cacheableExtensions.some(ext => {
    return url.pathname.endsWith(ext) || 
           (ext === '/' && url.pathname.endsWith('.html')) ||
           (ext === '/' && !url.pathname.includes('.'));
  });
  
  return isCacheable;
}

/**
 * Met à jour le cache avec une nouvelle version des ressources
 */
export const updateCache = async (request, response) => {
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    return cache.put(request, response);
  }
  return Promise.resolve();
};

/**
 * Nettoie le cache en supprimant les anciennes versions
 */
export const cleanupCache = async () => {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        console.log('Suppression de l\'ancien cache :', cacheName);
        return caches.delete(cacheName);
      }
      return Promise.resolve();
    })
  );
};
