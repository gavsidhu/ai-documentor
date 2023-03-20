import {
  decrypt,
  encrypt,
  filterWordsFromFirstLine,
  removeCodeBlockWrappers
} from '@/utils/helpers';
import {
  checkIfUserExists,
  checkIfUserIsSubscribed,
  checkIfUserPaid,
  getApiKey,
  getSecurityKey
} from '@/utils/supabase-admin';
import { NextApiHandler } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import {
  applyMiddlewareCustom,
  getRateLimitMiddlewares
} from '@/utils/applyRateLimit';
import { programmingLanguages } from '@/constant/programminglanguages';

const middlewares = getRateLimitMiddlewares({ limit: 10 }).map(
  applyMiddlewareCustom
);

const Refactor: NextApiHandler = async (req, res) => {
  try {
    for (const middleware of middlewares) {
      await middleware(req, res);
    }
  } catch {
    return res
      .status(429)
      .json({ message: 'Too Many Requests. Please try again later' });
  }
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
            'You are a helpful coding assistant that helps refactor and optimize code. Only return code back with no explanations. Leave any inline documentation as is.'
        },
        {
          role: 'user',
          content: `Refactor and optimize the following code to make it more efficient and readable. Leave any inline documentation as is:
            ${code}`
        }
      ]
    });
    let refactoredCode = removeCodeBlockWrappers(
      completion.data?.choices[0].message?.content as string
    );
    refactoredCode = filterWordsFromFirstLine(
      refactoredCode,
      programmingLanguages
    );
    res.status(200).json({
      content: encrypt(refactoredCode, key as string)
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Unexpected error');
  }
};

export default Refactor;
