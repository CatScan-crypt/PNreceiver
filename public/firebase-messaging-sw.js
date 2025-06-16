// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics-compat.js');
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..." 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  // Log the notification click
  console.log('Notification was clicked!', event.notification);
  
  // Close the notification
  event.notification.close();
  
  // This ensures the service worker stays alive to process the click
  event.waitUntil(
    // Get all window clients
    clients.matchAll({type: 'window'}).then((clientList) => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          console.log('Focusing existing tab');
          return client.focus();
        }
      }
      // If no matching tab is open, open a new one
      if (clients.openWindow) {
        console.log('Opening new tab');
        return clients.openWindow('/');
      }
    })
  );
  
  // Send a message to all clients (tabs) to log the notification click
  event.waitUntil(
    clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_CLICK',
          notification: event.notification
        });
      });
    })
  );
});

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // logEvent(analytics, 'notification_open');
  // Customize notification here
  const notificationTitle = payload.notification.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification.body || 'Background Message body.',
    icon: payload.notification.icon || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
