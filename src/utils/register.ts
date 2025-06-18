import { requestPermission } from '../firebase';

export const checkRegistrationStatus = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;
    
    // Check if the service worker is active
    if (registration.active) {
      return true;
    }
    
    // If there's a registration but it's not active, wait for it
    await navigator.serviceWorker.ready;
    return true;
  } catch (error) {
    console.error('Error checking registration status:', error);
    return false;
  }
};

export const registerForNotifications = async (): Promise<void> => {
  try {
    await requestPermission();
  } catch (error) {
    console.error('Error registering for notifications:', error);
    throw error;
  }
}; 