import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization || null;

  const userInfo = await fetch(
    `${BACKEND_BASE_URL}/orders/users/me`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      credentials: 'include',
    }
  );

  const userData = await userInfo.json();

  res.status(200).json({
    userData,
  });
}
