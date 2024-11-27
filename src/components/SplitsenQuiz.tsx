'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplitsenQuizProps {
  num1?: number;
  num2?: number;
  onAnswer?: (result: {
    question: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }) => void;
}

const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * (max + 1));
};

const SplitsenQuiz: React.FC<SplitsenQuizProps> = ({
  num1,
  num2,
  onAnswer,
}) => {
  const [currentNum1, setCurrentNum1] = useState<number>(num1 ?? 0);
  const [currentNum2, setCurrentNum2] = useState<number>(num2 ?? 0);
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showVisualization, setShowVisualization] = useState<boolean>(true);
  const [showExtraHelp, setShowExtraHelp] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const generateNumbers = () => {
    let a = num1 ?? 0;
    let b = num2 ?? 0;

    if (num1 === undefined || num2 === undefined) {
      a = getRandomNumber(5);
      b = getRandomNumber(a);
    }

    // Ensure 'a' is between 0 and 5
    a = Math.min(Math.max(a, 0), 5);
    // Ensure 'b' is between 0 and 'a'
    b = Math.min(Math.max(b, 0), a);

    setCurrentNum1(a);
    setCurrentNum2(b);
    setAnswer('');
    setMessage('');

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    generateNumbers();
  }, [num1, num2]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = currentNum1 - currentNum2;
    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === correctAnswer;

    const questionText = `${currentNum1} splitsen ${currentNum2} + ?`;

    if (onAnswer) {
      onAnswer({
        question: questionText,
        userAnswer,
        correctAnswer,
        isCorrect,
      });
    } else {
      setMessage(isCorrect ? 'Correct! Great job!' : 'Oops! Try again.');
      setTimeout(() => {
        generateNumbers();
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string for delete/backspace
    if (value === '') {
      setAnswer('');
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setAnswer(value);
    }
  };

  const renderCircles = (colors: string[]) => {
    const count = colors.length;
    const limitedCount = Math.min(count, 5); // Limit circle count
    return Array.from({ length: limitedCount }, (_, index) => (
      <motion.div
        key={index}
        className={`w-8 h-8 ${
          colors[index]
        } rounded-full m-1`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3 }}
      />
    ));
  };

  // Prepare circle colors for the top right square (visualization)
  const getTopCircleColors = (): string[] => {
    const colors: string[] = [];
    const totalCircles = currentNum1;

    // Initialize all circles as yellow
    for (let i = 0; i < totalCircles; i++) {
      colors.push('bg-yellow-500');
    }

    // Only change colors if there is user input and extra help is on
    if (showExtraHelp && answer !== '') {
      const userAnswer = parseInt(answer) || 0;

      // Change currentNum2 circles to blue
      for (let i = 0; i < currentNum2; i++) {
        if (i < colors.length) {
          colors[i] = 'bg-blue-500';
        }
      }

      // Change userAnswer circles to green starting after currentNum2
      for (let i = currentNum2; i < currentNum2 + userAnswer; i++) {
        if (i < colors.length) {
          colors[i] = 'bg-green-500';
        } else {
          // If userAnswer exceeds available circles, add semi-transparent green circles
          colors.push('bg-green-500 opacity-50');
        }
      }
    }

    return colors;
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {/* Visualization and Extra Help Toggle Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setShowVisualization(!showVisualization)}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
        </button>
        <button
          onClick={() => setShowExtraHelp(!showExtraHelp)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {showExtraHelp ? 'Hide Extra Help' : 'Show Extra Help'}
        </button>
      </div>

      <div className="flex flex-row justify-center">
        {/* Left side: Numerical Value */}
        <div className="flex flex-col items-center mr-8">
          <div className="relative flex flex-col items-center mb-4">
            {/* Top number (numerical value) */}
            <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center text-4xl bg-yellow-300 rounded-md">
              {currentNum1}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div
              className="w-px h-16 bg-primary-dark transform rotate-45 origin-top-left"
              style={{ marginRight: '-1px' }}
            ></div>
            <div
              className="w-px h-16 bg-primary-dark transform -rotate-45 origin-top-right"
              style={{ marginLeft: '-1px' }}
            ></div>
          </div>

          <div className="flex space-x-8 mt-2">
            <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center text-4xl bg-blue-300 rounded-md">
              {currentNum2}
            </div>
            <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center text-4xl bg-green-300 rounded-md">
              <input
                ref={inputRef}
                type="number"
                value={answer}
                onChange={handleInputChange}
                required
                min="0"
                max="5"
                className="w-full h-full text-center text-4xl bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right side: Visualization */}
        <div className="flex flex-col items-center">
          {showVisualization && (
            <>
              <div className="relative flex flex-col items-center mb-4">
                {/* Top visualization (circles) */}
                <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center bg-gray-200 rounded-md">
                  <div className="flex flex-wrap justify-center">
                    <AnimatePresence>
                      {renderCircles(getTopCircleColors())}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div
                  className="w-px h-16 bg-primary-dark transform rotate-45 origin-top-left"
                  style={{ marginRight: '-1px' }}
                ></div>
                <div
                  className="w-px h-16 bg-primary-dark transform -rotate-45 origin-top-right"
                  style={{ marginLeft: '-1px' }}
                ></div>
              </div>

              <div className="flex space-x-8 mt-2">
                {/* Bottom squares: Visualizations of currentNum2 and answer */}
                <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center bg-gray-200 rounded-md">
                  <div className="flex flex-wrap justify-center">
                    <AnimatePresence>
                      {renderCircles(
                        Array(currentNum2).fill('bg-blue-500')
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center bg-gray-200 rounded-md">
                  <div className="flex flex-wrap justify-center">
                    <AnimatePresence>
                      {renderCircles(
                        Array(parseInt(answer) || 0).fill('bg-green-500')
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Submit Answer Button */}
      <div className="mt-4 w-full flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-accent text-surface rounded font-semibold"
        >
          Submit Answer
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 text-2xl text-center font-semibold ${
            message.includes('Correct') ? 'text-success' : 'text-error'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default SplitsenQuiz;
