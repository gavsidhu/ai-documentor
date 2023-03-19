import { Database } from '@/types_db';
import { decrypt, encrypt, removeCodeBlockWrappers } from '@/utils/helpers';
import {
  checkIfUserExists,
  checkIfUserPaid,
  getApiKey,
  getSecurityKey
} from '@/utils/supabase-admin';
import { NextApiHandler } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const Document: NextApiHandler = async (req, res) => {
  const { selectedText, email } = req.body;
  try {
    const user = await checkIfUserExists(email);
    if (!user) {
      return res
        .status(400)
        .send(
          'Please create an account at https://www.optibot.io/ to use Optibot'
        );
    }

    const paymentStatus = await checkIfUserPaid(user);

    if (!paymentStatus) {
      return res
        .status(400)
        .send('Please upgrade to a plan at https://www.optibot.io/');
    }

    if (
      user?.email != email ||
      !paymentStatus.payment_status ||
      paymentStatus.payment_status != 'paid'
    ) {
      return res
        .status(400)
        .send(
          'Unauthorized. Please create an account and upgrade to a plan at https://www.optibot.io/'
        );
    }

    const apiKey = await getApiKey(user.id);

    if (!apiKey) {
      return res
        .status(400)
        .send(
          'Please add an OpenAI API key to your account at https://www.optibot.io/account'
        );
    }
    const configuration = new Configuration({
      apiKey: apiKey
    });
    const openai = new OpenAIApi(configuration);

    const key = await getSecurityKey(email);

    if (!key) {
      return res
        .status(400)
        .send(
          'Please create an account at https://www.optibot.io/ to use Optibot'
        );
    }

    const code = decrypt(selectedText, key as string);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful coding assistant that helps document code. You generate inline documentation that can be read by documentation generators.'
        },
        {
          role: 'user',
          content:
            'Can you rewrite the following code with inline documentation using documentation syntax. Return the documented code without any additional text:\n' +
            code
        }
      ]
    });
    const documentedCode = removeCodeBlockWrappers(
      completion.data?.choices[0].message?.content as string
    );
    res.status(200).json({
      content: encrypt(documentedCode, key as string)
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Unexpected error');
  }
};

export default Document;
