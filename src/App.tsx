import { useState } from 'react';
import './App.css';
import { requestPermission } from './firebase';
import { TokenTable } from './components/TokenTable';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      await requestPermission();
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for notifications:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-black-900">PNreceiver</h1>
      </div>
      
      <div className="mb-6">
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
              ? 'Registered for Notifications!'
              : 'Register for Notifications'}
        </button>
      </div>
      
      <div className="card">
        <TokenTable />
      </div>
    </div>
  )
}

export default App
