import type { NextApiRequest, NextApiResponse } from 'next';
import { jobDescriptionAssistant } from '../../../services/ai/jobDescriptionAssistant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { trade, companyName, cluster, shiftType, monthlySalaryMin, monthlySalaryMax, busRoute, customNotes } = req.body;

  if (!trade || !companyName) {
    return res.status(400).json({ error: 'Trade and companyName are required.' });
  }

  try {
    const result = await jobDescriptionAssistant.generateJobDescription({
      trade,
      companyName,
      cluster: cluster || 'Chakan MIDC Phase 1',
      shiftType: shiftType || 'Rotational',
      monthlySalaryMin: monthlySalaryMin ? parseInt(monthlySalaryMin, 10) : 18000,
      monthlySalaryMax: monthlySalaryMax ? parseInt(monthlySalaryMax, 10) : 25000,
      busRoute,
      customNotes
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      tokensUsed: result.tokensUsed
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error generating job description'
    });
  }
}
