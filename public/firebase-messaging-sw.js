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
  console.log('Notification was clicked!');
  
  // Get the notification data safely
  const notificationData = event.notification.data?.FCM_MSG?.data || {};
  console.log('Notification data:', JSON.parse(JSON.stringify(notificationData)));
  
  // Close the notification
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's an open window and focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
        return Promise.resolve();
      })
  );
});

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  
  // Only show a notification if we have notification data and the app is in the background
  if (!payload.notification) {
    console.log('No notification data in payload');
    return;
  }
  
  // Skip if this is a duplicate message
  if (payload.data?._duplicate) {
    console.log('Skipping duplicate message');
    return;
  }
  
  // Mark as duplicate to prevent double processing
  payload.data = { ...payload.data, _duplicate: true };
  
  // Customize notification
  const notificationTitle = payload.notification.title || 'New notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/logo192.png',
    data: { 
      ...payload.data,
      FCM_MSG: {
        ...payload,
        data: { ...payload.data }
      }
    },
    requireInteraction: true,
    tag: payload.messageId || Date.now().toString() // Use messageId or timestamp as a unique tag
  };

  console.log('Showing notification:', notificationTitle, notificationOptions);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

