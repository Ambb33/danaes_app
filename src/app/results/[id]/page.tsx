// src/app/results/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface TestQuestion {
  id: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface Result {
  id: number;
  testType: string;
  score: number;
  timestamp: string;
  questions: TestQuestion[];
}

export default function TestDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const response = await axios.get(`/api/results/${id}`);
        setResult(response.data);
      } catch (err) {
        console.error('Error fetching test result:', err);
        setError('Failed to fetch test result');
      }
    };
    fetchResult();
  }, [id]);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-error">{error}</p>
        <Link href="/results">
          <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors">
            Back to Results
          </button>
        </Link>
      </div>
    );
  }

  if (!result) {
    return <p>Loading test details...</p>;
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-3xl font-bold mb-4">
        {result.testType.charAt(0).toUpperCase() + result.testType.slice(1)} Test Details
      </h2>
      <p className="text-lg mb-2">
        Taken on {new Date(result.timestamp).toLocaleString()}
      </p>
      <p className="text-lg mb-4">
        Score: {result.score} out of {result.questions.length}
      </p>
      <table className="w-full max-w-lg mx-auto text-left table-auto">
        <thead>
          <tr>
            <th className="border px-2 py-1">Question</th>
            <th className="border px-2 py-1">Your Answer</th>
            <th className="border px-2 py-1">Correct Answer</th>
            <th className="border px-2 py-1">Result</th>
          </tr>
        </thead>
        <tbody>
          {result.questions.map((q) => (
            <tr key={q.id}>
              <td className="border px-2 py-1">{q.question}</td>
              <td className="border px-2 py-1">{q.userAnswer}</td>
              <td className="border px-2 py-1">{q.correctAnswer}</td>
              <td className="border px-2 py-1">
                {q.isCorrect ? (
                  <span className="text-success font-semibold">Correct</span>
                ) : (
                  <span className="text-error font-semibold">Incorrect</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <Link href="/results">
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors">
            Back to Results
          </button>
        </Link>
      </div>
    </div>
  );
}
