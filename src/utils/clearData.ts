export const clearLocalData = async (): Promise<void> => {
  try {
    // Unregister service worker
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
    }

    // Clear any local storage data
    localStorage.clear();
    
    console.log('Local data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}; 