import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { MessagePayload } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBDGSFMkqgFIWnft_x1zsJeIYc4UBqXv2U",
  authDomain: "simple-pn-app.firebaseapp.com",
  projectId: "simple-pn-app",
  storageBucket: "simple-pn-app.firebasestorage.app",
  messagingSenderId: "884393039065",
  appId: "1:884393039065:web:83735c43d61c8b24295ac8",
  measurementId: "G-N9XS4K87F1"
};

console.log('Firebase config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app.name);

// Initialize Firebase Messaging
const messaging = getMessaging(app);
console.log('Firebase messaging initialized:', messaging);

export const requestPermission = async () => {
  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);

    if (permission === 'granted') {
      console.log('Registering service worker for FCM...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service worker registered:', registration);
      console.log('Getting FCM token...');
      const token = await getToken(messaging, {
        vapidKey: 'BIdZ61VNPIeuYs0mJBa5pd8kAjxGX0_MHBnnFRm9UAqhFIbal3205U5SOxahq7rLtvu8pr56VTlnL-snDuJbqzk',
        serviceWorkerRegistration: registration,
      });
      console.log('FCM token:', token);
      return token;
    } else {
      console.error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error in requestPermission:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }
  return null;
};

export const onMessageListener = (callback: (payload: MessagePayload) => void) => onMessage(messaging, callback);
