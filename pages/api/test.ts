import { NextApiRequest, NextApiResponse } from 'next';
Response;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('✅ /api/test にリクエストが届いた');
  res.status(200).json({ message: 'ok' });
}
