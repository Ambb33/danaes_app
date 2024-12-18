'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Result {
  id: number;
  testType: string;
  score: number;
  timestamp: string;
  questions?: TestQuestion[];
}

interface TestQuestion {
  id: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

const ResultPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No ID provided');
      return;
    }

    const fetchResult = async () => {
      try {
        const response = await axios.get(`/api/results/${id}`);
        setResult(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching result:', err);
          setError('Failed to fetch result');
        }
      }
    };

    fetchResult();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Result Details</h1>
      <p>ID: {result.id}</p>
      <p>Test Type: {result.testType}</p>
      <p>Score: {result.score}</p>
      <p>Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
      <h2>Questions</h2>
      <ul>
        {result.questions?.map((question) => (
          <li key={question.id}>
            {question.question} - Your Answer: {question.userAnswer} - Correct Answer: {question.correctAnswer} - {question.isCorrect ? 'Correct' : 'Incorrect'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultPage;
