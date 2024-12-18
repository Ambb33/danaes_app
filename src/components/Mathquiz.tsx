'use client';

import React, { useState, useEffect, useRef } from 'react';
import SplitsenQuiz from './SplitsenQuiz';

type Operation = 'addition' | 'subtraction' | 'splitsen' | 'mixed';

interface MathquizProps {
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

const getRandomOperation = (): 'addition' | 'subtraction' => {
  return Math.random() < 0.5 ? 'addition' : 'subtraction';
};

const Mathquiz: React.FC<MathquizProps> = ({
  operation,
  num1,
  num2,
  onAnswer,
}) => {
  const [currentNum1, setCurrentNum1] = useState<number>(num1 ?? 0);
  const [currentNum2, setCurrentNum2] = useState<number>(num2 ?? 0);
  const [currentOperation, setCurrentOperation] = useState<
    'addition' | 'subtraction'
  >(operation === 'mixed' ? getRandomOperation() : operation as 'addition' | 'subtraction');
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const generateNumbers = (): void => {
    let a = num1 ?? 0;
    let b = num2 ?? 0;
    let op: 'addition' | 'subtraction' = currentOperation;

    if (operation === 'splitsen') {
      // Handle splitsen separately
      return;
    }

    if (operation === 'mixed') {
      op = getRandomOperation();
      setCurrentOperation(op);
    }

    if (num1 === undefined || num2 === undefined || operation === 'mixed') {
      if (op === 'addition') {
        a = getRandomNumber(6);
        b = getRandomNumber(6 - a);
      } else if (op === 'subtraction') {
        b = getRandomNumber(6);
        a = b + getRandomNumber(6 - b);
      }
    }

    setCurrentNum1(a);
    setCurrentNum2(b);
    setAnswer('');
    setMessage('');
    setShowNextButton(false);

    // Focus the input field after rendering
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (operation !== 'splitsen') {
      generateNumbers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    let correctAnswer = 0;

    if (currentOperation === 'addition') {
      correctAnswer = currentNum1 + currentNum2;
    } else if (currentOperation === 'subtraction') {
      correctAnswer = currentNum1 - currentNum2;
    }

    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === correctAnswer;

    const questionText =
      currentOperation === 'addition'
        ? `${currentNum1} + ${currentNum2}`
        : `${currentNum1} - ${currentNum2}`;

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
          : `Oops! The correct answer was ${correctAnswer}.`
      );
      setShowNextButton(true);

      // Focus the Next Question button after rendering
      setTimeout(() => {
        nextButtonRef.current?.focus();
      }, 0);
    }
  };

  const handleNextQuestion = (): void => {
    generateNumbers();
    setMessage('');
  };

  if (operation === 'splitsen') {
    return <SplitsenQuiz num1={num1} num2={num2} onAnswer={onAnswer} />;
  }

  return (
    <div className="flex flex-col items-center">
      {/* Math Problem and Input */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl m-2">
          {currentNum1}
        </div>
        <div className="text-4xl font-bold m-2">
          {currentOperation === 'addition' ? '+' : '–'}
        </div>
        <div className="w-20 h-20 border-4 border-primary-dark flex items-center justify-center text-4xl m-2">
          {currentNum2}
        </div>
        <div className="text-4xl font-bold m-2">=</div>

        {!showNextButton && (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              min="-6"
              max="12"
              className="text-center text-4xl w-20 h-20 border-4 border-primary-dark rounded"
            />
          </form>
        )}

        {showNextButton && (
          <div className="text-4xl w-20 h-20 flex items-center justify-center m-2">
            {answer}
          </div>
        )}
      </div>

      {/* Submit or Next Button */}
      <div className="flex flex-col items-center">
        {!showNextButton ? (
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-accent text-surface rounded font-semibold"
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextQuestion}
            ref={nextButtonRef}
            className="px-4 py-2 bg-primary text-surface rounded font-semibold"
          >
            Next Question
          </button>
        )}
      </div>

      {/* Message Display */}
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

export default Mathquiz;
