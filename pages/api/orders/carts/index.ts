import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization || null;

  const backendUrl = `${BACKEND_BASE_URL}/orders/carts${
    req.query.cartId ? `/${req.query.cartId}` : ''
  }`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
    },
    body:
      req.method === 'POST' ? JSON.stringify(req.body) : undefined,

    credentials: 'include',
  };

  const responce = await fetch(backendUrl, init);
  const cartData = await responce.json();

  res.status(200).json({
    cartData,
  });
}
