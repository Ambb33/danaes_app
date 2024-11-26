// src/components/MathQuizSeries.tsx

'use client';

import React, { useState, useEffect } from 'react';
import MathQuiz from './MathQuiz'; // Corrected casing

type Operation = 'addition' | 'subtraction' | 'splitsen';

interface Question {
  num1: number;
  num2: number;
}

interface QuestionResult {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface MathQuizSeriesProps {
  operation: Operation;
}

const MathQuizSeries: React.FC<MathQuizSeriesProps> = ({ operation }) => {
  const TOTAL_QUESTIONS = 20;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Function to generate unique questions
  const generateQuestions = () => {
    let possibleQuestions: Question[] = [];

    if (operation === 'addition') {
      for (let a = 0; a <= 5; a++) {
        for (let b = 0; b <= 5 - a; b++) {
          possibleQuestions.push({ num1: a, num2: b });
        }
      }
    } else if (operation === 'subtraction') {
      for (let b = 0; b <= 5; b++) {
        for (let a = b; a <= 5; a++) {
          possibleQuestions.push({ num1: a, num2: b });
        }
      }
    } else if (operation === 'splitsen') {
      for (let a = 0; a <= 5; a++) {
        for (let b = 0; b <= a; b++) {
          possibleQuestions.push({ num1: a, num2: b });
        }
      }
    }

    // Shuffle the array to randomize the order
    possibleQuestions = shuffleArray(possibleQuestions);

    // If there are more questions than TOTAL_QUESTIONS, slice the array
    if (possibleQuestions.length > TOTAL_QUESTIONS) {
      possibleQuestions = possibleQuestions.slice(0, TOTAL_QUESTIONS);
    }

    setQuestions(possibleQuestions);
  };

  // Generate unique questions when the component mounts or operation changes
  useEffect(() => {
    generateQuestions();
    setCurrentQuestionIndex(0);
    setResults([]);
    setShowSummary(false);
  }, [operation]);

  // Function to shuffle an array
  const shuffleArray = (array: Question[]): Question[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswer = (result: QuestionResult) => {
    setResults((prevResults) => [...prevResults, result]);

    if (currentQuestionIndex + 1 >= questions.length) {
      setShowSummary(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Define handleReset function
  const handleReset = () => {
    generateQuestions();
    setCurrentQuestionIndex(0);
    setResults([]);
    setShowSummary(false);
  };

  if (showSummary) {
    const correctAnswers = results.filter((res) => res.isCorrect).length;

    return (
      <div className="text-center p-4">
        <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
        <p className="text-xl mb-4">
          You answered {correctAnswers} out of {questions.length} questions correctly.
        </p>
        {/* Display detailed results */}
        <table className="w-full max-w-lg mx-auto text-left">
          <thead>
            <tr>
              <th className="border px-2 py-1">Question</th>
              <th className="border px-2 py-1">Your Answer</th>
              <th className="border px-2 py-1">Correct Answer</th>
              <th className="border px-2 py-1">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-t">
                <td className="border px-2 py-1">{result.question}</td>
                <td className="border px-2 py-1">{result.userAnswer}</td>
                <td className="border px-2 py-1">{result.correctAnswer}</td>
                <td className="border px-2 py-1">
                  {result.isCorrect ? (
                    <span className="text-success font-semibold">Correct</span>
                  ) : (
                    <span className="text-error font-semibold">Incorrect</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Retake Test Button */}
        <button
          onClick={handleReset}
          className="mt-6 px-4 py-2 bg-primary text-surface rounded font-semibold"
        >
          Retake Test
        </button>
      </div>
    );
  }

  // Ensure this block is outside the if (showSummary) block
  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      {/* Question Counter */}
      <div className="text-xl mb-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      {/* Render MathQuiz Component */}
      <MathQuiz
        key={currentQuestionIndex} // Force re-render for each new question
        operation={operation}
        num1={currentQuestion.num1}
        num2={currentQuestion.num2}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default MathQuizSeries;
