import { clearLocalData } from '../../utils/clearData';

export const useClearDataHandler = (setIsRegistered: (value: boolean) => void) => {
  const handleClearData = async () => {
    try {
      await clearLocalData();
      setIsRegistered(false);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return { handleClearData };
}; 