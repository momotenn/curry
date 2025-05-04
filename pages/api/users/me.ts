import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization || null;

  //いらないかも
  //   if (req.method === 'GET') {
  //     try {
  //       const response = await fetch(`${BACKEND_BASE_URL}/users/me`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           ...(token && { Authorization: token }),
  //         },
  //         credentials: 'include',
  //       });

  //       if (!response.ok) {
  //         res
  //           .status(response.status)
  //           .json({ message: 'Failed to fetch user' });
  //         return;
  //       }

  //       const data = await response.json();
  //       console.log('📡 APIレスポンス:', data);
  //       res.status(200).json(data);
  //     } catch (error) {
  //       console.error('❌ Error fetching user:', error);
  //       res.status(500).json({ message: 'Internal Server Error' });
  //     }
  //   }
}
