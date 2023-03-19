import { addApiKey } from '@/utils/supabase-admin';
import { NextApiHandler } from 'next';

const AddApiKey: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { apiKey, userId } = req.body;

      await addApiKey(apiKey, userId);

      res.status(200).json({ message: 'Successfully added api key' });
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

export default AddApiKey;
