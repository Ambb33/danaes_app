'use client';

import React, { useState } from 'react';
import ModeSelection from '../components/ModeSelection';
import MathQuiz from '../components/MathQuiz';
import MathQuizSeries from '../components/MathQuizSeries';

type Operation = 'addition' | 'subtraction' | 'splitsen' | 'mixed';

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<'practice' | 'testing' | null>(null);
  const [operation, setOperation] = useState<Operation>('addition');

  const handleModeSelect = (mode: 'practice' | 'testing') => {
    setSelectedMode(mode);
  };

  const handleOperationChange = (op: Operation) => {
    setOperation(op);
  };

  const handleReset = () => {
    setSelectedMode(null);
  };

  const renderOperationSelection = () => (
    <div className="mb-6 flex justify-center flex-wrap">
      {(['addition', 'subtraction', 'splitsen', 'mixed'] as Operation[]).map((op) => (
        <button
          key={op}
          onClick={() => handleOperationChange(op)}
          className={`px-6 py-3 rounded-lg font-semibold m-2 transition duration-200 focus:outline-none ${
            operation === op
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-secondary-light text-primary-dark hover:bg-secondary hover:text-white'
          }`}
        >
          {op === 'addition' && '+'}
          {op === 'subtraction' && '–'}
          {op === 'splitsen' && 'Splitsen'}
          {op === 'mixed' && 'Mixed'}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!selectedMode) {
      return <ModeSelection onSelectMode={handleModeSelect} />;
    } else {
      return (
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleReset}
            className="mb-4 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition duration-200 focus:outline-none"
          >
            Back to Modes
          </button>
          {renderOperationSelection()}
          {selectedMode === 'practice' ? (
            <MathQuiz operation={operation} />
          ) : (
            <MathQuizSeries operation={operation} />
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background pt-8">
      <h1 className="text-5xl font-bold mb-8 text-primary-dark">Math Practice</h1>
      {renderContent()}
    </div>
  );
}
