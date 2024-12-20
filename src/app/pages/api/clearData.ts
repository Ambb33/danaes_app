import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Environment check to prevent execution in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Retrieve the password from the request body
  const { password } = req.body;
  const serverPassword = process.env.CLEAR_DATA_PASSWORD;

  // Verify that the provided password matches the expected password
  if (!serverPassword || password !== serverPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Start a transaction
    await prisma.$transaction(async (prisma: { testQuestion: { deleteMany: () => any; }; test: { deleteMany: () => any; }; }) => {
      // Delete all entries in the TestQuestion and Test tables
      await prisma.testQuestion.deleteMany();
      await prisma.test.deleteMany();
    });

    console.log('Cleared data from tables Test and TestQuestion');
    res.status(200).json({ message: 'Data cleared successfully.' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
