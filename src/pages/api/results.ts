import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { testType, score, questions } = req.body;

      // Log the received request body for debugging
      console.log('Received request body:', JSON.stringify(req.body, null, 2));

      // Validate input
      if (
        typeof testType !== 'string' ||
        typeof score !== 'number' ||
        !Array.isArray(questions) ||
        questions.some(
          (q) =>
            typeof q.question !== 'string' ||
            typeof q.userAnswer !== 'string' || // Expecting string type here
            typeof q.correctAnswer !== 'string' || // Expecting string type here
            typeof q.isCorrect !== 'boolean'
        )
      ) {
        console.log('Invalid input data:', JSON.stringify(req.body, null, 2)); // Detailed log
        return res.status(400).json({ error: 'Invalid input data' });
      }

      console.log('Valid request body:', JSON.stringify(req.body, null, 2)); // Detailed log

      // Create the test entry in the database
      const test = await prisma.test.create({
        data: {
          testType,
          score,
          questions: {
            create: questions.map((q: {
              question: string;
              userAnswer: string; // Ensure this matches your schema
              correctAnswer: string; // Ensure this matches your schema
              isCorrect: boolean;
            }) => ({
              question: q.question,
              userAnswer: q.userAnswer,
              correctAnswer: q.correctAnswer,
              isCorrect: q.isCorrect,
            })),
          },
        },
      });

      res.status(201).json({ message: 'Test results saved successfully', testId: test.id });
    } else if (req.method === 'GET') {
      const tests = await prisma.test.findMany({
        include: {
          questions: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 10, // Optional: limit results to 10
      });

      res.status(200).json(tests);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
