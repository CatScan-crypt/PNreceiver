import { useState } from 'react';
import { registerForNotifications } from '../../utils/register';

export const useRegisterHandler = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      await registerForNotifications();
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for notifications:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    isRegistered,
    handleRegister,
    setIsRegistered
  };
}; 