import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { walletId } = req.query;
    try {
      const response = await axios.get(
        `https://api.cdp.coinbase.com/platform/v2/wallets/${walletId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CDP_API_KEY_SECRET}`,
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}