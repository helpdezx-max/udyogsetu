import type { NextApiRequest, NextApiResponse } from 'next';
import { candidateAssistant } from '../../../services/ai/candidateAssistant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { userMessage, language } = req.body;
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'userMessage is required.' });
  }

  try {
    const result = await candidateAssistant.askAssistant({
      userMessage,
      language: language || 'en'
    });

    return res.status(200).json({
      success: true,
      answer: result.answer,
      suggestedQuestions: result.suggestedQuestions
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal AI Assistant Error'
    });
  }
}
