import type { FC } from 'react';
import { useClearDataHandler } from './handlers/useClearDataHandler';

interface ClearDataButtonProps {
  isRegistered: boolean;
  onClearDataComplete: () => void;
}

const ClearDataButton: FC<ClearDataButtonProps> = ({ isRegistered, onClearDataComplete }) => {
  const { handleClearData } = useClearDataHandler(onClearDataComplete);

  return (
    <button
      onClick={handleClearData}
      disabled={!isRegistered}
      className={`px-4 py-2 rounded-md text-white font-medium ${
        !isRegistered
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      Clear Local Data
    </button>
  );
};

export default ClearDataButton; 