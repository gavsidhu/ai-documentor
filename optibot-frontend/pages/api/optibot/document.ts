import { Database } from '@/types_db';
import { decrypt, encrypt, removeCodeBlockWrappers } from '@/utils/helpers';
import {
  checkIfUserExists,
  checkIfUserIsSubscribed
} from '@/utils/supabase-admin';
import { NextApiHandler } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const Document: NextApiHandler = async (req, res) => {
  const { selectedText, email } = req.body;
  try {
    const user = await checkIfUserExists(email);
    if (!user) {
      return res.status(400).json({
        message:
          'Please create an account at https://www.optibot.io/ to use Optibot'
      });
    }

    const subscription = await checkIfUserIsSubscribed(user);

    if (!subscription) {
      return res.status(400).json({
        message:
          'Please subscribe to a plan at https://www.optibot.io/ use Optibot'
      });
    }

    if (user?.email != email || subscription.status != 'active') {
      return res.status(400).json({
        message: 'Unauthorized.'
      });
    }

    const code = decrypt(selectedText);

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
    console.log(documentedCode);
    res.status(200).json({
      content: encrypt(documentedCode)
    });
  } catch (error) {
    res.status(500).json({
      msg: 'unexpected error'
    });
  }
};

export default Document;
