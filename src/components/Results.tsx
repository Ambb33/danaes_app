'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Result {
  id: number;
  testType: string;
  score: number;
  timestamp: string;
}

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('/api/results');
        // Map results to only include the summary data
        const summaries = response.data.map((result: any) => ({
          id: result.id,
          testType: result.testType,
          score: result.score,
          timestamp: result.timestamp,
        }));
        setResults(summaries);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to fetch results');
      }
    };
    fetchResults();
  }, []);

  const clearData = async () => {
    const password = prompt('Enter the password to clear all results:');

    if (!password) {
      alert('Password is required to clear data.');
      return;
    }

    try {
      const response = await axios.post('/api/clearData', { password });
      if (response.status === 200) {
        setResults([]);
        alert('All results have been cleared.');
      } else {
        alert('Failed to clear results.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        alert('Unauthorized: Incorrect password.');
      } else {
        console.error('Error clearing results:', err);
        setError('Failed to clear results');
      }
    }
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-3xl font-bold mb-4">Results History</h2>
      {error && <p className="text-error">{error}</p>}
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
                    {result.testType.charAt(0).toUpperCase() + result.testType.slice(1)}
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

      {/* Clear All Results Button */}
      <button
        onClick={clearData}
        className="mt-4 bg-error text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Clear All Results
      </button>
    </div>
  );
}
