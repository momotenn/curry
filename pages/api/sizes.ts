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
    // 利用可能なサイズを昇順で取得
    const result = await pool.query(
      'SELECT * FROM sizes WHERE available = TRUE ORDER BY id ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
