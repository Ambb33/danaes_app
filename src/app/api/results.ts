import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/utils/database';
import { TestAttributes } from '@/models/Test';
import { TestQuestionAttributes } from '@/models/TestQuestion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { testType, score, questions } = req.body;

      if (!testType || score === undefined || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const testResult = await client.query(
          'INSERT INTO "Test" (testType, score) VALUES ($1, $2) RETURNING id',
          [testType, score]
        );
        const testId = testResult.rows[0].id;

        const testQuestions = questions.map((q: TestQuestionAttributes) => [
          testId,
          q.question,
          q.userAnswer,
          q.correctAnswer,
          q.isCorrect,
        ]);

        const queryText =
          'INSERT INTO "TestQuestion" (testId, question, userAnswer, correctAnswer, isCorrect) VALUES ($1, $2, $3, $4, $5)';
        await Promise.all(testQuestions.map((q) => client.query(queryText, q)));

        await client.query('COMMIT');
        res.status(201).json({ message: 'Test results saved successfully', testId });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } finally {
        client.release();
      }
    } else if (req.method === 'GET') {
      const client = await pool.connect();
      try {
        const testsResult = await client.query(
          'SELECT * FROM "Test" ORDER BY timestamp DESC'
        );
        res.status(200).json(testsResult.rows);
      } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } finally {
        client.release();
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
