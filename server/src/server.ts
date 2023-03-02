import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 8080;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(express.json());

app.use(cors());

app.post('/', async (req, res) => {
  const { selectedText } = req.body;
  try {
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
    res
      .status(200)
      .json({ content: completion.data?.choices[0].message?.content });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
