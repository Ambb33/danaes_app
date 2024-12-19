// pages/api/clearData.ts

import { NextApiRequest, NextApiResponse } from 'next';
import sequelize from '../../utils/database';
import Result from '../../models/Test'; // Import your models here

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
    // Disable foreign key checks if necessary
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Truncate tables - Add all models you want to clear
    await Result.destroy({ where: {}, truncate: true });
    console.log(`Cleared data from table '${Result.getTableName()}'`);

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    res.status(200).json({ message: 'Data cleared successfully.' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
