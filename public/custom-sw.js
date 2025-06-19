// Import Firebase scripts for messaging
// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  console.log('payload', event);
  event.notification.close();

  if (event.action) {
    // Handle custom actions if any
    console.log('Action clicked:', event.action);
    
  } else {
    // Default click behavior
    const urlToOpen = event.notification.data?.link || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if any window is already open with the target URL
        const existingClient = clientList.find(client => 
          client.url.includes(urlToOpen) && 'focus' in client
        );
        
        if (existingClient) {
          return existingClient.focus();
        }
        
        // If no window is open, open a new one
        return clients.openWindow(urlToOpen);
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification.tag);
  });
  
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Your Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification.body || 'Background Message body.',
    icon: payload.notification.icon || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

