import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log('BACKEND_BASE_URL:', BACKEND_BASE_URL);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('🔍 status:', response.status);
    console.log(
      '🔍 content-type:',
      response.headers.get('content-type')
    );
    const data = await response.json();
    console.log('🔍 data:', data);
    console.log('🗝️トークン', data.token);
    console.log('name', data.name);

    if (response.ok) {
      res.setHeader('Set-Cookie', [
        serialize('token', data.token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
          path: '/',
          sameSite: 'lax',
        }),

        serialize('name', encodeURIComponent(data.name), {
          httpOnly: false,
          maxAge: 60 * 60,
          path: '/',
          sameSite: 'lax',
        }),
      ]);
      res.status(200).json({ message: 'ログイン成功' });
      console.log('✅ログイン成功:', data);
    }
  } catch (error) {
    console.error('❌ログイン失敗:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
