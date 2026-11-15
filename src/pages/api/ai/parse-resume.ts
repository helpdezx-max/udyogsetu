import type { NextApiRequest, NextApiResponse } from 'next';
import { resumeParser } from '../../../services/ai/resumeParser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { resumeText } = req.body;
  if (!resumeText || typeof resumeText !== 'string') {
    return res.status(400).json({ error: 'resumeText is required.' });
  }

  try {
    const result = await resumeParser.parseResumeText(resumeText);
    return res.status(200).json({
      success: true,
      data: result.data,
      tokensUsed: result.tokensUsed
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error parsing resume'
    });
  }
}
