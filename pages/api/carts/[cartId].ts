import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `${token}`;
  }

  const { cartId } = req.query;

  if (!cartId || Array.isArray(cartId)) {
    res.status(400).json({ message: 'Invalid cart ID' });
    return;
  }
  if (req.method === 'DELETE') {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/carts/${cartId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        res
          .status(response.status)
          .json({ message: 'Failed to delete cart' });
        return;
      }
      const data = await response.json();
      console.log('📡 APIレスポンス:', data);
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error deleting cart:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
