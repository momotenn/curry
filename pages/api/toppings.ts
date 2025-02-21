import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET メソッド以外は拒否
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM toppings ORDER BY id ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching toppings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
