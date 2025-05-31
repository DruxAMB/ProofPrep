import { NextApiRequest, NextApiResponse } from 'next';
import { getWalletBalances } from '@/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { walletId } = req.query;
    try {
      const response = await getWalletBalances(walletId as string);
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}