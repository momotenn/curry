import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('✅ Next.js API にリクエストが届いた！');
  // res.status(200).json({ message: 'OK' });

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // idはパスパラメータから取得
    const { id } = req.query;

    // クエリパラメータ（sizeやtoppingId）を使ってURLSearchParamsを作成
    const queryParams = new URLSearchParams();

    if (typeof req.query.size === 'string') {
      queryParams.append('size', req.query.size);
    }

    if (typeof req.query.toppingId === 'string') {
      queryParams.append('toppingId', req.query.toppingId);
    }

    const url = `${BACKEND_BASE_URL}/itemDetail/${id}?${queryParams.toString()}`;
    console.log('🔗 Fetching URL:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + btoa('admin:supersecret'),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ fetch失敗内容:', text);
      throw new Error(`Failed to fetch: ${response.status} ${text}`);
    }

    const data = await response.json();
    console.log('✅ 取得データ:', data);

    res.status(200).json(data);

    console.log('📝データ', data);
  } catch (error) {
    console.error('❌ Error fetching item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
