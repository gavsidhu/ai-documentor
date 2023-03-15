import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/utils/stripe';
import { checkIfUserExists, getSecurityKey } from '@/utils/supabase-admin';
import { getURL } from '@/utils/helpers';

const GetKey: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      const user = await checkIfUserExists(email);
      if (!user) {
        return res.status(400).json({
          message:
            'Please create an account at https://www.optibot.io/ to use Optibot'
        });
      }

      const key = await getSecurityKey(email);
      if (!key) {
        return res.status(400).json({
          message:
            'Please create an account at https://www.optibot.io/ to use Optibot'
        });
      }
      res.status(200).json({ key });
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

export default GetKey;
