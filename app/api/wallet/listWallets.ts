import { NextApiRequest, NextApiResponse } from 'next';
import { listWallets } from '@/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { cursor } = req.query;
    try {
      const response = await listWallets(cursor as string);
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}