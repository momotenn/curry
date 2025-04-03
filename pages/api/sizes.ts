import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    const response = await fetch(`${BACKEND_BASE_URL}/sizes`, {
      headers: {
        Authorization: 'Basic ' + btoa('admin:supersecret'),
      },
    });

    const sizes = await response.json();
    res.status(200).json(sizes);
    console.log('📝サイズ', sizes);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
