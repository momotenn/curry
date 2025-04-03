import { NextApiRequest, NextApiResponse } from 'next';

// バックエンドAPIのURLを環境変数や設定で管理する例
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log('BACKEND_BASE_URL:', BACKEND_BASE_URL);

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
    const queryParams = new URLSearchParams(
      req.query as Record<string, string>
    );

    // バックエンド API を呼び出し
    const response = await fetch(
      `${BACKEND_BASE_URL}/items?${queryParams}`,
      {
        headers: {
          Authorization: 'Basic ' + btoa('admin:supersecret'),
        },
      }
    );
    if (!response.ok) {
      // バックエンド側がエラーを返した場合
      const text = await response.text();
      throw new Error(`Failed to fetch: ${response.status} ${text}`);
    }

    // バックエンドからのレスポンスヘッダーを取得 (例: X-Total-Count)
    const totalCount = response.headers.get('X-Total-Count');
    if (totalCount) {
      // Next.js のレスポンスにも同じヘッダーを付与
      res.setHeader('X-Total-Count', totalCount);
    }

    // JSON データを取得
    const data = await response.json();

    console.log('データ:', data);

    // 取得したデータをそのままクライアントに返す
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching items from backend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
