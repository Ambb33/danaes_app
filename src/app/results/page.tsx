"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registering the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Result {
  id: number;
  testType: string;
  score: number;
  timestamp: string;
  questions?: TestQuestion[];
}

interface Mistake {
  operation: string;
  count: number;
}

interface TestQuestion {
  id: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("/api/results");
        setResults(response.data);
        calculateMistakes(response.data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to fetch results");
      }
    };
    fetchResults();
  }, []);

  const calculateMistakes = (results: Result[]) => {
    const mistakeCount: Record<string, number> = {};

    results.forEach((result) => {
      if (result.questions) {
        result.questions.forEach((question) => {
          if (!question.isCorrect) {
            const operation = question.question;
            if (!mistakeCount[operation]) {
              mistakeCount[operation] = 0;
            }
            mistakeCount[operation]++;
          }
        });
      }
    });

    const sortedMistakes = Object.entries(mistakeCount)
      .map(([operation, count]) => ({ operation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setMistakes(sortedMistakes);
  };

  const generateScoreTrendData = (): ChartData<"line"> => {
    const labels = results.map((result) =>
      new Date(result.timestamp).toLocaleDateString()
    );

    const testTypes = Array.from(new Set(results.map((result) => result.testType)));

    const datasets = testTypes.map((testType, index) => {
      const data = results
        .filter((result) => result.testType === testType)
        .map((result) => result.score);

      const colors = ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"];

      return {
        label: `${testType.charAt(0).toUpperCase() + testType.slice(1)} Score Trend`,
        data,
        fill: false,
        borderColor: colors[index % colors.length],
        tension: 0.1,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const totalTests = results.length;
  const testTypeCounts = results.reduce((acc, result) => {
    if (!acc[result.testType]) {
      acc[result.testType] = 0;
    }
    acc[result.testType]++;
    return acc;
  }, {} as Record<string, number>);

  const clearData = async () => {
    const password = prompt("Enter the password to clear all results:");

    if (!password) {
      alert("Password is required to clear data.");
      return;
    }

    try {
      const response = await axios.post("/api/clearData", { password });
      if (response.status === 200) {
        setResults([]);
        setMistakes([]);
        alert("All results have been cleared.");
      } else {
        alert("Failed to clear results.");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        alert("Unauthorized: Incorrect password.");
      } else {
        console.error("Error clearing results:", err);
        setError("Failed to clear results");
      }
    }
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-3xl font-bold mb-4">Results History</h2>
      {error && <p className="text-error">{error}</p>}
      {totalTests > 0 && (
        <>
          <p className="text-lg mb-2">Total Tests: {totalTests}</p>
          <p className="text-lg mb-4">
            Breakdown by Test Type:
            {Object.entries(testTypeCounts).map(([testType, count]) => (
              <span key={testType} className="ml-2">
                {testType.charAt(0).toUpperCase() + testType.slice(1)}: {count}
              </span>
            ))}
          </p>
        </>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-8">
            <Line data={generateScoreTrendData()} />
          </div>

          <h3 className="text-2xl font-bold mb-4">Top 10 Mistakes</h3>
          <ul className="list-disc list-inside">
            {mistakes.map((mistake) => (
              <li key={mistake.operation}>
                {mistake.operation}: {mistake.count}
              </li>
            ))}
          </ul>
        </>
      )}

      {results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        <table className="w-full max-w-lg mx-auto text-left">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Test Type</th>
              <th className="border px-2 py-1">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-t hover:bg-gray-100">
                <td className="border px-2 py-1">
                  <Link href={`/results/${result.id}`}>
                    {new Date(result.timestamp).toLocaleString()}
                  </Link>
                </td>
                <td className="border px-2 py-1">
                  <Link href={`/results/${result.id}`}>
                    {result.testType.charAt(0).toUpperCase() +
                      result.testType.slice(1)}
                  </Link>
                </td>
                <td className="border px-2 py-1">
                  <Link href={`/results/${result.id}`}>{result.score}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={clearData}
        className="mt-4 bg-error text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Clear All Results
      </button>
    </div>
  );
};

export default Results;
