// app/api/initDatabase.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sequelize from '@/utils/database';
import '@/models/Test'; // Import all your models

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Database sync not allowed in production.' });
    }

    await sequelize.sync(); // Ensure database is synced
    res.status(200).json({ message: 'Database synchronized successfully.' });
  } catch (error) {
    console.error('Error synchronizing models:', error);
    res.status(500).json({ error: 'Error synchronizing models' });
  }
}
