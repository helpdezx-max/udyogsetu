import { whatsappClient } from '../whatsapp/whatsappClient';

export interface CandidateAlertPreferences {
  userId: string;
  candidatePhone: string;
  preferredTrades: string[];
  preferredClusters: string[];
  minSalary: number;
  alertFrequency: 'immediate' | 'daily_digest' | 'weekly_digest' | 'disabled';
  preferredLanguage?: 'en' | 'mr' | 'hi';
}

export interface CandidateJobPayload {
  id: string;
  title: string;
  company: string;
  trade: string;
  cluster: string;
  monthlySalary: number;
  status: string;
  moderation_status?: string;
  is_verified?: boolean;
}

export class JobAlertEngine {
  private sentAlertKeys = new Set<string>();

  public matchesPreferences(prefs: CandidateAlertPreferences, job: CandidateJobPayload): boolean {
    if (prefs.alertFrequency === 'disabled') return false;

    // Strict Rule: NEVER send alerts for unapproved or suspended vacancies
    if (job.status !== 'active' || job.moderation_status !== 'approved') {
      return false;
    }

    // Salary check
    if (job.monthlySalary < prefs.minSalary) {
      return false;
    }

    // Trade matching
    const jobTradeClean = (job.trade || job.title).toLowerCase();
    const tradeMatches = prefs.preferredTrades.length === 0 || prefs.preferredTrades.some(trade => {
      const tClean = trade.toLowerCase();
      return jobTradeClean.includes(tClean) || tClean.includes(jobTradeClean);
    });

    if (!tradeMatches) return false;

    // Cluster matching
    const jobClusterClean = job.cluster.toLowerCase();
    const clusterMatches = prefs.preferredClusters.length === 0 || prefs.preferredClusters.some(cluster => {
      return jobClusterClean.includes(cluster.toLowerCase());
    });

    return clusterMatches;
  }

  public async dispatchAlertIfEligible(
    prefs: CandidateAlertPreferences,
    job: CandidateJobPayload
  ): Promise<{ sent: boolean; isDuplicate: boolean; messageId?: string }> {
    if (!this.matchesPreferences(prefs, job)) {
      return { sent: false, isDuplicate: false };
    }

    const alertKey = `${prefs.userId}:${job.id}`;
    if (this.sentAlertKeys.has(alertKey)) {
      return { sent: false, isDuplicate: true };
    }

    this.sentAlertKeys.add(alertKey);

    const result = await whatsappClient.sendTemplateMessage({
      recipientPhone: prefs.candidatePhone,
      templateName: 'job_alert_match',
      lang: prefs.preferredLanguage || 'en',
      parameters: {
        jobTitle: job.title,
        companyName: job.company,
        cluster: job.cluster,
        salary: `₹${job.monthlySalary.toLocaleString('en-IN')}`,
        jobUrl: `https://rozzy.in/jobs/${job.id}`
      },
      idempotencyKey: `alert-${alertKey}`,
      userId: prefs.userId
    });

    return {
      sent: result.success,
      isDuplicate: false,
      messageId: result.messageId
    };
  }
}

export const jobAlertEngine = new JobAlertEngine();
