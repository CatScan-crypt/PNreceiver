importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBDGSFMkqgFIWnft_x1zsJeIYc4UBqXv2U",
  authDomain: "simple-pn-app.firebaseapp.com",
  projectId: "simple-pn-app",
  storageBucket: "simple-pn-app.firebasestorage.app",
  messagingSenderId: "884393039065",
  appId: "1:884393039065:web:83735c43d61c8b24295ac8",
  measurementId: "G-N9XS4K87F1"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
