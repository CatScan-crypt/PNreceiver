import { useEffect } from 'react';
import { requestPermission, onMessageListener } from '../firebase';

export const NotificationHandler = () => {
  useEffect(() => {
    console.log('Initializing NotificationHandler...');

    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker is not supported');
      return;
    }

    const initializeFirebase = async () => {
      try {
        const token = await requestPermission();
        if (token) {
          console.log('Successfully registered with FCM:', token);
        } else {
          console.error('Failed to get FCM token');
        }
      } catch (error) {
        console.error('Error during requestPermission:', error);
      }
    };

    initializeFirebase();

    const unsubscribe = onMessageListener((payload) => {
      console.log('Received message:', payload);
    });

    navigator.serviceWorker.ready.then(registration => {
      console.log('Service Worker registration:', {
        scope: registration.scope,
        active: !!registration.active
      });
    }).catch(error => {
      console.error('Error getting service worker registration:', error);
    });

    return () => {
      console.log('Cleaning up message listener...');
      unsubscribe();
    };
  }, []);

  return null;
};
