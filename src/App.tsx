import { useEffect } from 'react'

import './App.css'
import { requestPermission } from './firebase';
import { TokenTable } from './components/TokenTable';

// Function to handle service worker messages
const handleServiceWorkerMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
    console.log('Notification was clicked in any tab!', event.data.notification);
    // You can add additional handling here, like updating UI state
  }
};

function App() {


  useEffect(() => {
    requestPermission();
    
    // Add message event listener for service worker messages
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    
    // Clean up the event listener when the component unmounts
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);
  return (
        <div >
          <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-black-900">PNreceiver</h1>
            </div>
            <div className="card">
              <TokenTable />
            </div>
        </div>
  )
}

export default App
