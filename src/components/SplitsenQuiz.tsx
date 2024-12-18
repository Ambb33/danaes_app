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
  const [previousQuestions, setPreviousQuestions] = useState<Array<{ a: number; b: number }>>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const generateUniqueNumbers = () => {
    let a: number = 0;
    let b: number = 0;
    let unique = false;

    while (!unique) {
      a = num1 ?? getRandomNumber(6);
      b = num2 ?? getRandomNumber(a);

      a = Math.min(Math.max(a, 0), 6);
      b = Math.min(Math.max(b, 0), a);

      unique = !previousQuestions.some((q) => q.a === a && q.b === b);
    }

    setCurrentNum1(a);
    setCurrentNum2(b);
    setAnswer('');
    setMessage('');

    setPreviousQuestions((prev) => {
      const updatedQuestions = [...prev, { a, b }];
      if (updatedQuestions.length > 20) {
        updatedQuestions.shift();
      }
      return updatedQuestions;
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    generateUniqueNumbers();
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
      setMessage(
        isCorrect
          ? 'Correct! Great job!'
          : `Oops! The correct answer was ${correctAnswer}. Try again.`
      );
      setTimeout(() => {
        generateUniqueNumbers();
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setAnswer('');
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 6) {
      setAnswer(value);
    }
  };

  const renderCircles = (colors: string[]) => {
    const count = colors.length;
    const limitedCount = Math.min(count, 6);
    return Array.from({ length: limitedCount }, (_, index) => (
      <motion.div
        key={index}
        className={`w-8 h-8 ${colors[index]} rounded-full m-1`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
      />
    ));
  };

  const getTopCircleColors = (): string[] => {
    const colors: string[] = [];
    const totalCircles = currentNum1;

    for (let i = 0; i < totalCircles; i++) {
      colors.push('bg-error');
    }

    if (showExtraHelp && answer !== '') {
      const userAnswer = parseInt(answer) || 0;

      for (let i = 0; i < currentNum2; i++) {
        if (i < colors.length) {
          colors[i] = 'bg-primary-dark';
        }
      }

      for (let i = currentNum2; i < currentNum2 + userAnswer; i++) {
        if (i < colors.length) {
          colors[i] = 'bg-secondary';
        } else {
          colors.push('bg-secondary opacity-50');
        }
      }
    }

    return colors;
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setShowVisualization(!showVisualization)}
          className="px-4 py-2 bg-primary-light text-surface rounded"
        >
          {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
        </button>
        <button
          onClick={() => setShowExtraHelp(!showExtraHelp)}
          className="px-4 py-2 bg-accent text-surface rounded"
        >
          {showExtraHelp ? 'Hide Extra Help' : 'Show Extra Help'}
        </button>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-col items-center mr-8">
          <div className="relative flex flex-col items-center mb-4">
            <div className="w-32 h-32 border-4 border-primary-dark bg-primary-light flex items-center justify-center text-4xl rounded-md">
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
            <div className="w-32 h-32 border-4 border-primary-dark bg-secondary-light flex items-center justify-center text-4xl rounded-md">
              {currentNum2}
            </div>
            <div className="w-32 h-32 border-4 border-primary-dark bg-accent flex items-center justify-center text-4xl rounded-md">
              <form onSubmit={handleSubmit} className="w-full h-full">
                <input
                  ref={inputRef}
                  type="number"
                  value={answer}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="6"
                  className="w-full h-full text-center text-4xl bg-transparent outline-none"
                />
              </form>
            </div>
          </div>
        </div>

        {showVisualization && (
          <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center mb-4">
              <div className="w-32 h-32 border-4 border-primary-dark bg-surface flex items-center justify-center rounded-md">
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
              <div className="w-32 h-32 border-4 border-primary-dark bg-surface flex items-center justify-center rounded-md">
                <div className="flex flex-wrap justify-center">
                  <AnimatePresence>
                    {renderCircles(Array(currentNum2).fill('bg-primary-dark'))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="w-32 h-32 border-4 border-primary-dark bg-surface flex items-center justify-center rounded-md">
                <div className="flex flex-wrap justify-center">
                  <AnimatePresence>
                    {renderCircles(Array(parseInt(answer) || 0).fill('bg-secondary'))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>   

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
