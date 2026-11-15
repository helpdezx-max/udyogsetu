import { aiClient } from './aiClient';

export interface CandidateMatchingProfile {
  candidateTrade: string;
  candidateSkills: string[];
  candidateCluster: string;
  candidateSalaryExpectation: number;
  candidateEducation: string;
}

export interface JobMatchingProfile {
  jobTrade: string;
  requiredSkills: string[];
  cluster: string;
  offeredSalaryMin: number;
  minEducation: string;
}

export interface MatchEvaluationResult {
  score: number;
  isAdvisoryOnly: boolean;
  explanation: string;
  breakdown: {
    tradeMatch: boolean;
    clusterMatch: boolean;
    salaryCompatible: boolean;
    educationCompatible: boolean;
  };
  missingRequirements: string[];
}

export const jobMatcher = {
  async calculateMatch(candidate: CandidateMatchingProfile, job: JobMatchingProfile): Promise<MatchEvaluationResult> {
    const tradeMatch = candidate.candidateTrade.toLowerCase().includes(job.jobTrade.toLowerCase()) ||
      job.jobTrade.toLowerCase().includes(candidate.candidateTrade.toLowerCase());

    const clusterMatch = candidate.candidateCluster.toLowerCase().includes(job.cluster.toLowerCase()) ||
      job.cluster.toLowerCase().includes(candidate.candidateCluster.toLowerCase());

    const salaryCompatible = job.offeredSalaryMin >= candidate.candidateSalaryExpectation * 0.9;
    const educationCompatible = true;

    let score = 30; // base score
    if (tradeMatch) score += 35;
    if (clusterMatch) score += 20;
    if (salaryCompatible) score += 15;
    score = Math.min(100, score);

    const reasons: string[] = [];
    if (tradeMatch) reasons.push(`Matches your trade specialization (${job.jobTrade})`);
    if (clusterMatch) reasons.push(`Located directly in your target manufacturing cluster (${job.cluster})`);
    if (salaryCompatible) reasons.push(`Meets or exceeds your target in-hand monthly salary requirement`);

    const missing: string[] = [];
    if (!clusterMatch) missing.push(`Location is in ${job.cluster} (may require company bus route)`);
    if (!salaryCompatible) missing.push(`Offered salary is slightly below your expected range`);

    const explanation = `${score}% Match Compatibility: ${reasons.join(', ')}.`;

    return {
      score,
      isAdvisoryOnly: true, // Core safeguard: Advisory only, human makes final decision
      explanation,
      breakdown: {
        tradeMatch,
        clusterMatch,
        salaryCompatible,
        educationCompatible
      },
      missingRequirements: missing
    };
  }
};
