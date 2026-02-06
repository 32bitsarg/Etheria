importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compatibility.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compatibility.js');

const firebaseConfig = {
    apiKey: "AIzaSyBd9FfMPyN1FTI7cg-5ZTcRBKk5EOLTZvQ",
    authDomain: "etheria-6edc3.firebaseapp.com",
    projectId: "etheria-6edc3",
    storageBucket: "etheria-6edc3.firebasestorage.app",
    messagingSenderId: "276916166642",
    appId: "1:276916166642:web:ddd637573ea648e26b556b",
    measurementId: "G-W2CF57JT40"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background handler
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Background message received ', payload);

    // We can customize the notification here if needed, 
    // but the push listener below also handles it.
});

const CACHE_NAME = 'etheria-v1-assets';
const STATIC_ASSETS = [
    '/assets/ico.webp',
    '/assets/logo.webp',
    '/assets/hud/cityicon.webp',
    '/assets/hud/worldicon.webp',
    '/assets/islands/villages.webp',
    '/manifest.json'
];

// Instalar y pre-cachear activos base
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Listener para mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Estrategia de Fetch
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 1. Solo cachear GET
    if (request.method !== 'GET') return;

    // 2. Activos de Juego (Imágenes, Fuentes, Sonidos)
    // Usamos Cache-First for assets
    if (
        url.pathname.startsWith('/assets/') ||
        url.pathname.startsWith('/_next/static/') ||
        url.origin.includes('fonts.gstatic.com') ||
        url.origin.includes('fonts.googleapis.com')
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200) {
                        return networkResponse;
                    }
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return networkResponse;
                });
            })
        );
        return;
    }

    // 3. Todo lo demás (HTML, API)
    // Network-First (queremos siempre lo último del servidor)
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// Manejo de Notificaciones Push
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();

    // Solo mostrar si la app NO está en primer plano
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                const isForeground = clientList.some(client => client.focused);

                if (isForeground) {
                    // La app está abierta, no mostramos push (podríamos enviar un mensaje al cliente para un toast)
                    return;
                }

                // Mostrar la notificación
                return self.registration.showNotification(data.title || 'Etheria: Conquest', {
                    body: data.body || 'Novedades en el reino',
                    icon: '/assets/pwa/icon-192.png',
                    badge: '/assets/pwa/icon-192.png',
                    data: data.url || '/',
                    tag: 'etheria-push' // Evita duplicados
                });
            })
    );
});

// Al hacer clic en la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Si ya está abierta, enfocarla
                for (const client of clientList) {
                    if (client.url === event.notification.data && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Si no, abrir nueva pestaña
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data);
                }
            })
    );
});
