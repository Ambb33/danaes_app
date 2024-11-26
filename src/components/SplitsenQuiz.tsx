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

const SplitsenQuiz: React.FC<SplitsenQuizProps> = ({ num1, num2, onAnswer }) => {
  const [currentNum1, setCurrentNum1] = useState<number>(num1 ?? 0);
  const [currentNum2, setCurrentNum2] = useState<number>(num2 ?? 0);
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const generateNumbers = () => {
    let a = num1 ?? 0;
    let b = num2 ?? 0;

    if (num1 === undefined || num2 === undefined) {
      a = getRandomNumber(5);
      b = getRandomNumber(a);
    }

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
    const isCorrect = parseInt(answer) === correctAnswer;

    const questionText = `${currentNum1} splitsen ${currentNum2} + ?`;

    if (onAnswer) {
      onAnswer({
        question: questionText,
        userAnswer: parseInt(answer),
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

  const renderCircles = (count: number, color: string) => {
    return Array.from({ length: count }, (_, index) => (
      <motion.div
        key={index}
        className={`w-8 h-8 ${color} rounded-full m-1`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3 }}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex flex-row justify-center">
        {/* Left side: Triangle representation */}
        <div className="flex flex-col items-center mr-8">
          <div className="relative flex flex-col items-center mb-4">
            {/* Top number */}
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
                onChange={(e) => setAnswer(e.target.value)}
                required
                min="0"
                max="5"
                className="w-full h-full text-center text-4xl bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right side: Visual representation in the same layout */}
        <div className="flex flex-col items-center">
          <div className="relative flex flex-col items-center mb-4">
            <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center bg-gray-200">
              <div className="flex flex-wrap justify-center">
                <AnimatePresence>
                  {renderCircles(currentNum1, 'bg-yellow-500')}
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
            <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center bg-gray-200">
              <div className="flex flex-wrap justify-center">
                <AnimatePresence>
                  {renderCircles(currentNum2, 'bg-blue-500')}
                </AnimatePresence>
              </div>
            </div>
            <div className="w-32 h-32 border-4 border-primary-dark flex items-center justify-center bg-gray-200">
              <div className="flex flex-wrap justify-center">
                <AnimatePresence>
                  {renderCircles(parseInt(answer) || 0, 'bg-green-500')}
                </AnimatePresence>
              </div>
            </div>
          </div>
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
      {!onAnswer && message && (
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
