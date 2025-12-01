// Importer la configuration du service worker
importScripts('/js/sw-config.js');

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation en cours...');
  
  // Sauter l'étape d'attente pour s'activer immédiatement
  self.skipWaiting();
  
  // Mettre en cache les ressources critiques
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des ressources critiques');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Erreur lors de la mise en cache initiale :', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation en cours...');
  
  // Prendre le contrôle immédiatement sur toutes les pages
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      cleanupOldCaches(),
      
      // Prendre le contrôle sur tous les clients
      self.clients.claim()
    ])
    .then(() => {
      console.log('Service Worker: Activé et prêt à gérer les requêtes');
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et les requêtes vers des domaines externes
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }
  
  // Gérer les requêtes d'API différemment si nécessaire
  if (url.pathname.startsWith('/api/')) {
    // Stratégie réseau d'abord pour les API
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Stratégie cache d'abord pour les autres ressources
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Stratégie : Réseau d'abord, puis cache
async function networkFirstStrategy(request) {
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
}

// Gestion des messages (pour la mise à jour du cache depuis l'interface utilisateur)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('Nettoyage du cache demandé depuis l\'interface utilisateur');
    cleanupOldCaches();
  }
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('Synchronisation en arrière-plan déclenchée');
    // Implémenter la logique de synchronisation ici
  }
});
