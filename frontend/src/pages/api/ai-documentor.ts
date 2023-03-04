import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const AiDocumentor: NextApiHandler = async (req, res) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });

  //   // Check if we have a session
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();
  //   console.log(session?.user.id);

  //   if (!session)
  //     return res.status(401).json({
  //       error: 'not_authenticated',
  //       message:
  //         'The user does not have an active session or is not authenticated',
  //     });

  try {
    const { selectedText } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful coding assistant that helps document code.',
        },
        {
          role: 'user',
          content:
            'Can you rewrite the following code with inline documentation:\n' +
            selectedText,
        },
      ],
    });
    return res
      .status(200)
      .json({ content: completion.data?.choices[0].message?.content });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
      message: 'Unexpected error',
    });
  }
};

export default AiDocumentor;
