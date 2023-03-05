import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { removeCodeBlockWrappers } from './utils/helpers';

dotenv.config();

const PORT = 8080;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(express.json());


app.use(cors());

app.post('/refactor', async (req, res) => {
  const { selectedText } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful coding assistant that helps refactor code. Only return code back with no explanations',
        },
        {
          role: 'user',
          content:
            `Refactor the following code to make it more readable, efficient and maintainable. Return the refactored code without any additional text:
            ${selectedText}`
        },
      ],
    });
    res
      .status(200)
      .json({ content: removeCodeBlockWrappers(completion.data?.choices[0].message?.content as string) });
  } catch (error) {
    console.log(error);
  }
});

app.post('/document', async (req, res) => {
  const { selectedText } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful coding assistant that helps document code. You generate inline documentation that can be read by documentation generators.',
        },
        {
          role: 'user',
          content:
            'Can you rewrite the following code with inline documentation using documentation syntax. Return the documented code without any additional text:\n' +
            selectedText,
        },
      ],
    });
    res
      .status(200)
      .json({ content: removeCodeBlockWrappers(completion.data?.choices[0].message?.content as string) });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
