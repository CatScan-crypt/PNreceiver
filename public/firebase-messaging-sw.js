// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

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

// Add notification click event listener
self.addEventListener('notificationclick', (event) => {
  console.log('Notification was clicked!', event);
  
  // Get the notification data and URL to open
  const notificationData = event.notification.data?.FCM_MSG?.data || {};
  const urlToOpen = new URL(notificationData.url || '/', self.location.origin).href;
  
  console.log('Notification data:', notificationData);
  console.log('URL to open:', urlToOpen);
  
  // Close the notification
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's a matching client
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(urlToOpen);
        
        // Compare origin and pathname, ignoring query parameters and hash
        if (clientUrl.origin === targetUrl.origin && 
            clientUrl.pathname === targetUrl.pathname) {
          console.log('Found matching client, focusing:', client.url);
          return client.focus();
        }
      }
      
      // If no matching client is found, open a new window
      console.log('No matching client found, opening new window');
      return clients.openWindow(urlToOpen);
    })
  );
});

