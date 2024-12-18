// components/ModeSelection.tsx

'use client';

import React from 'react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'practice' | 'testing') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-4xl font-bold mb-6 text-primary-dark">Select Mode</h2>
      <button
        onClick={() => onSelectMode('practice')}
        className="w-72 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition duration-200 focus:outline-none"
      >
        Practice Mode
      </button>
      <button
        onClick={() => onSelectMode('testing')}
        className="w-72 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition duration-200 focus:outline-none"
      >
        Testing Mode
      </button>
    </div>
  );
};

export default ModeSelection;
