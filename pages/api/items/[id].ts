import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// プールの作成（環境変数 DATABASE_URL に接続情報を設定してください）
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API /api/items/[id] にリクエストが来ました。'); // リクエスト確認

  // GET メソッド以外は拒否
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  // URL パラメータから id を取得
  const { id } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM items WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
