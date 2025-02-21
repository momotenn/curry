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
    // クエリパラメータからページ番号、表示件数、ソート情報を取得
    const {
      _page = '1',
      _limit = '5',
      _sort = 'price',
      _order = 'asc',
    } = req.query;
    const page = parseInt(_page as string, 10);
    const limit = parseInt(_limit as string, 10);
    const offset = (page - 1) * limit;

    // 安全のためソート可能なカラムは限定
    const validSortColumns = ['id', 'name', 'price'];
    const sortColumn = validSortColumns.includes(_sort as string)
      ? (_sort as string)
      : 'price';
    const order =
      (_order as string).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // 全件数を取得
    const totalResult = await pool.query(
      'SELECT COUNT(*) FROM items'
    );
    const totalCount = parseInt(totalResult.rows[0].count, 10);

    // items テーブルから該当ページ分のデータを取得
    const queryText = `SELECT * FROM items ORDER BY ${sortColumn} ${order} LIMIT $1 OFFSET $2`;
    const itemsResult = await pool.query(queryText, [limit, offset]);

    // ヘッダーに総件数をセット
    res.setHeader('X-Total-Count', totalCount.toString());
    res.status(200).json(itemsResult.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
