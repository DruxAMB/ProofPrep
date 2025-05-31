import { NextApiRequest, NextApiResponse } from 'next';
import { createWallet } from '@/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { networkId } = req.body;
    try {
      const response = await createWallet(networkId);
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}