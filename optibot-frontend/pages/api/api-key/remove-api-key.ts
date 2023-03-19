import { removeApiKey } from '@/utils/supabase-admin';
import { NextApiHandler } from 'next';

const RemoveApiKey: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;

      await removeApiKey(userId);

      res.status(200).json({ message: 'Successfully removed api key' });
    } catch (error) {
      res.status(500).json({
        message: 'Unexpected error',
        error: error
      });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};

export default RemoveApiKey;
