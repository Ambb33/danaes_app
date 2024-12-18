'use client';

import React, { useState, useEffect } from 'react';
import Mathquiz from './Mathquiz';
import axios from 'axios';

type Operation = 'addition' | 'subtraction' | 'splitsen' | 'mixed';

interface Question {
  num1: number;
  num2: number;
  operation: 'addition' | 'subtraction' | 'splitsen';
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

  useEffect(() => {
    generateQuestions();
    resetQuiz();
  }, [operation]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setShowSummary(false);
  };

  const generateQuestions = () => {
    const additionQuestions = generateAdditionQuestions();
    const subtractionQuestions = generateSubtractionQuestions();
    const splitsenQuestions = generateSplitsenQuestions();

    let possibleQuestions: Question[] = [];

    if (operation === 'mixed') {
      possibleQuestions = shuffleArray([...additionQuestions, ...subtractionQuestions, ...splitsenQuestions]);
      possibleQuestions = ensureNoRepeatOperations(possibleQuestions);
    } else {
      if (operation === 'addition') possibleQuestions = shuffleArray(additionQuestions);
      if (operation === 'subtraction') possibleQuestions = shuffleArray(subtractionQuestions);
      if (operation === 'splitsen') possibleQuestions = shuffleArray(splitsenQuestions);
    }

    const uniqueQuestions = new Set<string>();
    const finalQuestions = possibleQuestions.filter(question => {
      const key = `${question.num1}-${question.num2}-${question.operation}`;
      if (!uniqueQuestions.has(key)) {
        uniqueQuestions.add(key);
        return true;
      }
      return false;
    });

    setQuestions(finalQuestions.slice(0, TOTAL_QUESTIONS));
  };

  const generateAdditionQuestions = (): Question[] => {
    const questions: Question[] = [];
    for (let a = 0; a <= 6; a++) {
      for (let b = 0; b <= 6 - a; b++) {
        questions.push({ num1: a, num2: b, operation: 'addition' });
      }
    }
    return questions;
  };

  const generateSubtractionQuestions = (): Question[] => {
    const questions: Question[] = [];
    for (let b = 0; b <= 6; b++) {
      for (let a = b; a <= 6; a++) {
        questions.push({ num1: a, num2: b, operation: 'subtraction' });
      }
    }
    return questions;
  };

  const generateSplitsenQuestions = (): Question[] => {
    const questions: Set<string> = new Set();
    const generatedQuestions: Question[] = [];

    while (generatedQuestions.length < TOTAL_QUESTIONS) {
      const num1 = Math.floor(Math.random() * 7);
      const num2 = Math.floor(Math.random() * (7 - num1));
      const questionKey = `${num1}-${num2}`;

      if (!questions.has(questionKey)) {
        questions.add(questionKey);
        generatedQuestions.push({ num1, num2, operation: 'splitsen' });
      }
    }

    return generatedQuestions;
  };

  const shuffleArray = (array: Question[]): Question[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const ensureNoRepeatOperations = (questions: Question[]): Question[] => {
    const result: Question[] = [];
    let lastOperation: 'addition' | 'subtraction' | 'splitsen' | 'mixed' | null = null;

    while (questions.length > 0 && result.length < TOTAL_QUESTIONS) {
      const index = questions.findIndex((q) => q.operation !== lastOperation);
      if (index === -1) {
        result.push(questions.shift()!);
      } else {
        const [question] = questions.splice(index, 1);
        result.push(question);
        lastOperation = question.operation;
      }
    }

    return result;
  };

  const handleAnswer = (result: QuestionResult) => {
    setResults((prevResults) => [...prevResults, result]);
    if (currentQuestionIndex + 1 >= questions.length) {
      setShowSummary(true);
      saveResults([...results, result]);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const saveResults = async (results: QuestionResult[]) => {
    const correctAnswers = results.filter((res) => res.isCorrect).length;
    const testData = {
      testType: operation,
      score: correctAnswers,
      questions: results.map((res) => ({
        question: res.question,
        userAnswer: res.userAnswer,
        correctAnswer: res.correctAnswer,
        isCorrect: res.isCorrect,
      })),
    };

    try {
      await axios.post('/api/results', testData);
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  const handleReset = () => {
    generateQuestions();
    resetQuiz();
  };

  if (showSummary) {
    const correctAnswers = results.filter((res) => res.isCorrect).length;
    return (
      <div className="text-center p-4">
        <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
        <p className="text-xl mb-4">
          You answered {correctAnswers} out of {questions.length} questions correctly.
        </p>
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
        <button
          onClick={handleReset}
          className="mt-6 px-4 py-2 bg-primary text-white rounded font-semibold"
        >
          Retake Test
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="text-xl mb-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>
      <Mathquiz
        key={currentQuestionIndex}
        operation={currentQuestion.operation}
        num1={currentQuestion.num1}
        num2={currentQuestion.num2}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default MathQuizSeries;
