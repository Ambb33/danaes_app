import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  try {
    if (method === 'GET') {
      const client = await pool.connect();
      try {
        const result = await client.query(
          `SELECT t.*, array_agg(row_to_json(q.*)) AS questions 
           FROM Test t
           LEFT JOIN TestQuestion q ON t.id = q.testId
           WHERE t.id = $1
           GROUP BY t.id`,
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Test not found' });
        }

        res.status(200).json(result.rows[0]);
      } finally {
        client.release();
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
