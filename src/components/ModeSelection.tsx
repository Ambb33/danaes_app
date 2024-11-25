// src/components/ModeSelection.tsx

import React from 'react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'practice' | 'testing') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Select Mode</h2>
      <button
        onClick={() => onSelectMode('practice')}
        className="px-4 py-2 bg-primary text-surface rounded font-semibold m-2"
      >
        Practice
      </button>
      <button
        onClick={() => onSelectMode('testing')}
        className="px-4 py-2 bg-primary text-surface rounded font-semibold m-2"
      >
        Testing
      </button>
    </div>
  );
};

export default ModeSelection;
