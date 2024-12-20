import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../utils/database';

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
    const client = await pool.connect();
    try {
      // Disable foreign key checks if necessary
      await client.query('SET session_replication_role = replica;');

      // Truncate tables - Add all tables you want to clear
      await client.query('TRUNCATE TABLE "Test" CASCADE;');
      await client.query('TRUNCATE TABLE "TestQuestion" CASCADE;');
      console.log('Cleared data from tables Test and TestQuestion');

      // Re-enable foreign key checks
      await client.query('SET session_replication_role = DEFAULT;');

      res.status(200).json({ message: 'Data cleared successfully.' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
