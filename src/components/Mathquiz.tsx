// src/components/MathQuiz.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';

type Operation = 'addition' | 'subtraction' | 'splitsen';

interface MathQuizProps {
  operation: Operation;
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

const MathQuiz: React.FC<MathQuizProps> = ({ operation, onAnswer }) => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const generateNumbers = () => {
    let a = 0;
    let b = 0;
    if (operation === 'addition') {
      a = getRandomNumber(5);
      b = getRandomNumber(5 - a);
    } else if (operation === 'subtraction') {
      b = getRandomNumber(5);
      a = b + getRandomNumber(5 - b);
    } else if (operation === 'splitsen') {
      a = getRandomNumber(5);
      b = getRandomNumber(a);
    }
    setNum1(a);
    setNum2(b);
    setAnswer('');
    setMessage('');

    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    generateNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctAnswer = 0;

    if (operation === 'addition') {
      correctAnswer = num1 + num2;
    } else if (operation === 'subtraction') {
      correctAnswer = num1 - num2;
    } else if (operation === 'splitsen') {
      correctAnswer = num1 - num2;
    }

    const isCorrect = parseInt(answer) === correctAnswer;

    const questionText =
      operation === 'addition'
        ? `${num1} + ${num2}`
        : operation === 'subtraction'
        ? `${num1} - ${num2}`
        : `${num1} splitsen ${num2} + ?`;

    // If onAnswer is provided (Testing Mode), call it
    if (onAnswer) {
      onAnswer({
        question: questionText,
        userAnswer: parseInt(answer),
        correctAnswer,
        isCorrect,
      });
    } else {
      // In Practice Mode, show feedback
      setMessage(isCorrect ? 'Correct! Great job!' : 'Oops! Try again.');
      // Proceed to next question after delay
      setTimeout(() => {
        generateNumbers();
      }, 1000);
    }
  };

  return (
    <div>
      {/* Display the question based on the operation */}
      {operation !== 'splitsen' && (
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-4 flex items-center">
            <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl m-2">
              {num1}
            </div>
            <div className="text-4xl font-bold m-2">
              {operation === 'addition' ? '+' : '–'}
            </div>
            <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl m-2">
              {num2}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              ref={inputRef} // Attach ref here
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              min="-5"
              max="10"
              className="text-center text-4xl w-20 h-20 border-4 border-primary-dark rounded mb-4"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-surface rounded font-semibold"
            >
              Submit Answer
            </button>
          </form>
          {/* Display feedback in Practice Mode */}
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
      )}

      {/* Splitsen mode */}
      {operation === 'splitsen' && (
        <div className="flex flex-col items-center mt-8">
          {/* Triangle representation */}
          <div className="relative flex flex-col items-center">
            {/* Top number */}
            <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl">
              {num1}
            </div>
            {/* Lines connecting to base numbers */}
            <div className="flex items-center -mt-2">
              <div
                className="w-px h-16 bg-primary-dark transform rotate-45 origin-top-left"
                style={{ marginRight: '-1px' }}
              ></div>
              <div
                className="w-px h-16 bg-primary-dark transform -rotate-45 origin-top-right"
                style={{ marginLeft: '-1px' }}
              ></div>
            </div>
            {/* Base numbers */}
            <div className="flex space-x-8 mt-2">
              <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl">
                {num2}
              </div>
              <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl">
                <input
                  ref={inputRef} // Attach ref here
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
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-accent text-surface rounded font-semibold"
          >
            Submit Answer
          </button>
          {/* Display feedback in Practice Mode */}
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
      )}
    </div>
  );
};

export default MathQuiz;
