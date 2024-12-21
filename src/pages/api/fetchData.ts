// pages/api/fetchData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '@/app/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
