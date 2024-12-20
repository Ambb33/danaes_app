import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  try {
    if (method === 'GET') {
      const test = await prisma.test.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          questions: true,
        },
      });

      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }

      res.status(200).json(test);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
