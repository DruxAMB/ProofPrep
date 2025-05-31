import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { walletId, publicKey } = req.body;
    try {
      const response = await axios.post(
        `https://api.cdp.coinbase.com/platform/v2/wallets/${walletId}/addresses`,
        { public_key: publicKey },
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