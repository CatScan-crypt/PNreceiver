import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics'; // ✅ Import analytics
import type { MessagePayload } from 'firebase/messaging';
import { logBrowserType } from './redisPOST';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // ✅ Needed for analytics
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app.name);

// ✅ Initialize Firebase Analytics
const analytics = getAnalytics(app); // This enables notification_open tracking
console.log('Firebase analytics initialized:', analytics);

// ✅ Initialize Firebase Messaging
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

      // ✅ Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration, // ✅ Make sure it uses your registered SW
      });

      console.log('FCM Token:', token);

      if (token) {
        try {
          await logBrowserType(token);
        } catch (error) {
          console.error('Error logging browser type:', error);
        }
      }
    } else {
      console.error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error in requestPermission:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
  }

  return null;
};

// ✅ Handle foreground messages
export const onMessageListener = (callback: (payload: MessagePayload) => void) =>
  onMessage(messaging, callback);
