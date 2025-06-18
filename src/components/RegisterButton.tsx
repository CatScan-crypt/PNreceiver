import type { FC } from 'react';
import { useRegisterHandler } from './handlers/useRegisterHandler';
import { useEffect, useState } from 'react';
import { checkNotificationRegistration } from '../firebase';

interface RegisterButtonProps {
  onRegisterStateChange: (isRegistered: boolean) => void;
}

const RegisterButton: FC<RegisterButtonProps> = ({ onRegisterStateChange }) => {
  const { isRegistering, isRegistered, handleRegister, setIsRegistered } = useRegisterHandler();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      console.log('Checking registration status...');
      const isRegistered = await checkNotificationRegistration();
      console.log('Registration status:', isRegistered);
      setIsRegistered(isRegistered);
      onRegisterStateChange(isRegistered);
      setIsInitialCheck(false);
    };
    checkRegistration();
  }, [onRegisterStateChange, setIsRegistered]);

  useEffect(() => {
    if (!isInitialCheck) {
      onRegisterStateChange(isRegistered);
    }
  }, [isRegistered, onRegisterStateChange, isInitialCheck]);

  if (isInitialCheck) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md text-white font-medium bg-gray-400 cursor-wait"
      >
        Checking Registration...
      </button>
    );
  }

  return (
    <button
      onClick={handleRegister}
      disabled={isRegistering || isRegistered}
      className={`px-4 py-2 rounded-md text-white font-medium ${
        isRegistering 
          ? 'bg-gray-400 cursor-not-allowed' 
          : isRegistered 
            ? 'bg-green-500 cursor-default'
            : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isRegistering 
        ? 'Registering...' 
        : isRegistered 
          ? 'Registered'
          : 'Register for Notifications'}
    </button>
  );
};

export default RegisterButton; 