// pages/api/results/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import Result from '../../../models/Test';
import TestQuestion from '../../../models/TestQuestion'; // Import the TestQuestion model
import sequelize from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await sequelize.sync();

    if (method === 'GET') {
      const result = await Result.findOne({
        where: { id },
        include: [{ model: TestQuestion, as: 'questions' }],
      });

      if (!result) {
        return res.status(404).json({ error: 'Test not found' });
      }

      res.status(200).json(result);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
