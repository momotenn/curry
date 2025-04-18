import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Function to extract token from cookies

  const { itemId, sizeId, toppingIds, quantity } = req.body;

  const token = req.headers.authorization || null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `${token}`;
  }

  //POST

  if (req.method === 'POST') {
    try {
      console.log('🛒 リクエストボディ:', req.body);

      const responce = await fetch(`${BACKEND_BASE_URL}/carts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          itemId,
          sizeId,
          toppingIds,
          quantity,
        }),
      });

      const data = await responce.json();
      res.status(responce.status).json(data);
    } catch (error) {
      console.error('❌ Error fetching carts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  //GET
  if (req.method === 'GET') {
    if (!token) {
      res.status(200).json([]);
      return;
    }
    try {
      const responce = await fetch(`${BACKEND_BASE_URL}/carts`, {
        method: 'GET',
        headers,
      });
      // console.log('📡 APIステータス:', res.status);

      const data = await responce.json();
      res.status(responce.status).json(data);
      console.log('🛒カートの中身:', data);
    } catch (error) {
      console.error('❌ Error fetching carts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    return;
  }
  res.status(405).json({ message: 'Method Not Allowed' });

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).json({
    message: `Method ${req.method} not allowed`,
  });
  return;
}
