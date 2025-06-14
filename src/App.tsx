import { useEffect } from 'react'

import './App.css'
import { requestPermission } from './firebase';
import { TokenTable } from './components/TokenTable';

function App() {


  useEffect(() => {
    requestPermission();
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
