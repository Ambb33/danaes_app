import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { testType, score, questions } = req.body;

      if (!testType || score === undefined || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const test = await prisma.test.create({
        data: {
          testType,
          score,
          questions: {
            create: questions.map((q: any) => ({
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
        take: 10,  // Optional: limit results to 10
      });
      res.status(200).json(tests);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
