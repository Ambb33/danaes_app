'use client';

import React, { useState, useEffect, useRef } from 'react';
import SplitsenQuiz from './SplitsenQuiz';

type Operation = 'addition' | 'subtraction' | 'splitsen';

interface MathQuizProps {
  operation: Operation;
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

const MathQuiz: React.FC<MathQuizProps> = ({ operation, num1, num2, onAnswer }) => {
  const [currentNum1, setCurrentNum1] = useState<number>(num1 ?? 0);
  const [currentNum2, setCurrentNum2] = useState<number>(num2 ?? 0);
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const generateNumbers = () => {
    let a = num1 ?? 0;
    let b = num2 ?? 0;

    if (num1 === undefined || num2 === undefined) {
      if (operation === 'addition') {
        a = getRandomNumber(5);
        b = getRandomNumber(5 - a);
      } else if (operation === 'subtraction') {
        b = getRandomNumber(5);
        a = b + getRandomNumber(5 - b);
      }
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
    if (operation !== 'splitsen') {
      generateNumbers();
    }
  }, [num1, num2, operation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctAnswer = 0;

    if (operation === 'addition') {
      correctAnswer = currentNum1 + currentNum2;
    } else if (operation === 'subtraction') {
      correctAnswer = currentNum1 - currentNum2;
    }

    const isCorrect = parseInt(answer) === correctAnswer;

    const questionText =
      operation === 'addition'
        ? `${currentNum1} + ${currentNum2}`
        : `${currentNum1} - ${currentNum2}`;

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

  if (operation === 'splitsen') {
    return <SplitsenQuiz num1={num1} num2={num2} onAnswer={onAnswer} />;
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="text-2xl mb-4 flex items-center">
          <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl m-2">
            {currentNum1}
          </div>
          <div className="text-4xl font-bold m-2">
            {operation === 'addition' ? '+' : '–'}
          </div>
          <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl m-2">
            {currentNum2}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            ref={inputRef}
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
    </div>
  );
};

export default MathQuiz;
