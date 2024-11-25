// app/page.tsx

'use client';

import React, { useState } from 'react';
import ModeSelection from '../components/ModeSelection';
import MathQuiz from '../components/Mathquiz';
import MathQuizSeries from '../components/MathQuizSeries';
import HomeButton from '../components/HomeButton';

type Operation = 'addition' | 'subtraction' | 'splitsen';

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<'practice' | 'testing' | null>(null);
  const [operation, setOperation] = useState<Operation>('addition');

  const handleModeSelect = (mode: 'practice' | 'testing') => {
    setSelectedMode(mode);
  };

  const handleOperationChange = (op: Operation) => {
    setOperation(op);
  };

  // Function to reset to home (Mode Selection screen)
  const handleReset = () => {
    setSelectedMode(null);
  };

  // Function to render operation selection buttons
  const renderOperationSelection = () => (
    <div className="mb-4 flex justify-center">
      {(['addition', 'subtraction', 'splitsen'] as Operation[]).map((op) => (
        <button
          key={op}
          onClick={() => handleOperationChange(op)}
          className={`px-4 py-2 rounded font-semibold m-1 ${
            operation === op
              ? 'bg-primary text-surface'
              : 'bg-secondary-light text-primary-dark'
          }`}
        >
          {op === 'addition' && '+'}
          {op === 'subtraction' && '–'}
          {op === 'splitsen' && 'Splitsen'}
        </button>
      ))}
    </div>
  );

  // Conditional rendering based on selected mode
  const renderContent = () => {
    if (!selectedMode) {
      // Mode not selected yet
      return <ModeSelection onSelectMode={handleModeSelect} />;
    } else if (selectedMode === 'practice') {
      // Practice Mode
      return (
        <>
          {/* Include Home Button */}
          <HomeButton onClick={handleReset} />
          {renderOperationSelection()}
          <MathQuiz operation={operation} />
        </>
      );
    } else {
      // Testing Mode
      return (
        <>
          {/* Include Home Button */}
          <HomeButton onClick={handleReset} />
          {renderOperationSelection()}
          <MathQuizSeries operation={operation} />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-5xl font-bold mb-8 text-primary-dark">Math Practice Up to 5</h1>
      {renderContent()}
    </div>
  );
}
