import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/utils/stripe';
import { checkIfUserExists } from '@/utils/supabase-admin';
import { getURL } from '@/utils/helpers';

const GetKey: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;
    const user = await checkIfUserExists(email);
    if (!user) {
      return res.status(400).json({
        message:
          'Please create an account at https://www.optibot.io/ to use Optibot'
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default GetKey;
