import { useState } from 'react';
import './App.css';
import ClearDataButton from './components/ClearDataButton';
import RegisterButton from './components/RegisterButton';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-black-900">PNreceiver</h1>
      </div>
      
      <div className="mb-6 flex gap-4">
        <RegisterButton
          key={key}
          onRegisterStateChange={setIsRegistered}
        />

        <ClearDataButton 
          isRegistered={isRegistered}
          onClearDataComplete={() => {
            setIsRegistered(false);
            setKey(prev => prev + 1);
          }}
        />
      </div>
      
    </div>
  )
}

export default App
