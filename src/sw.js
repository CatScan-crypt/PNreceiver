import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// This is a placeholder for the precache manifest injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST || []);

// Clean up old caches
cleanupOutdatedCaches();

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBDGSFMkqgFIWnft_x1zsJeIYc4UBqXv2U",
  authDomain: "simple-pn-app.firebaseapp.com",
  projectId: "simple-pn-app",
  storageBucket: "simple-pn-app.firebasestorage.app",
  messagingSenderId: "884393039065",
  appId: "1:884393039065:web:83735c43d61c8b24295ac8",
  measurementId: "G-N9XS4K87F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('[sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Example of caching strategy for other requests
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate()
);
