// app/api/results.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Test, TestQuestion } from '@/models';
import sequelize from '@/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await sequelize.sync();

    if (req.method === 'POST') {
      const { testType, score, questions } = req.body;

      // Validate input
      if (!testType || score === undefined || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      // Create the Test entry
      const test = await Test.create({ testType, score });

      // Create the associated TestQuestion entries
      const testQuestions = questions.map((q: any) => ({
        testId: test.id,
        question: q.question,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: q.isCorrect,
      }));
      await TestQuestion.bulkCreate(testQuestions);

      res.status(201).json({ message: 'Test results saved successfully', testId: test.id });
    } else if (req.method === 'GET') {
      // Fetch all tests with their questions
      const tests = await Test.findAll({
        order: [['timestamp', 'DESC']],
        include: [{ model: TestQuestion, as: 'questions' }],
      });
      res.status(200).json(tests);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
