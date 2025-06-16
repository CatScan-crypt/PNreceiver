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
  
  const notification = event.notification;
  const data = notification.data || {};
  const fcmMsg = data.FCM_MSG || {};

  // Try to find the link in various common places from the FCM payload
  const link = fcmMsg?.data?.link || 
               fcmMsg?.notification?.click_action || 
               data.link;

  console.log('Raw notification data:', data);
  console.log('Extracted link:', link);

  // Close the notification
  notification.close();

  // If a link is found, open it in a new window.
  if (link) {
    const urlToOpen = new URL(link, self.location.origin).href;
    console.log('Attempting to open window:', urlToOpen);
    
    const promiseChain = clients.openWindow(urlToOpen);
    event.waitUntil(promiseChain);
  } else {
    console.log('No link found in notification data. Cannot open a window.');
  }
});

