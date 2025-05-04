import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const responce = await fetch(
        `${BACKEND_BASE_URL}/public_carts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        }
      );

      const data = await responce.json();
      res.status(responce.status).json(data);
      // console.log('📡 APIステータス:', responce.status);
      // console.log('📡 APIレスポンス:', data);
    } catch (error) {
      console.error('❌ Error fetching carts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const responce = await fetch(
        `${BACKEND_BASE_URL}/public_carts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await responce.json();
      res.status(responce.status).json(data);
      console.log('📡 APIステータス:', res.status);
      console.log('📡 APIレスポンス:', data);
    } catch (error) {
      console.error('❌ Error fetching carts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
}
